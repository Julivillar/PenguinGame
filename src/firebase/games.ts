import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import firestore, {
  serverTimestamp,
  FirebaseFirestoreTypes,
  getDoc,
} from '@react-native-firebase/firestore';

import { drawCard, createDeck } from '../services/deckApi';
import { cardValueToNumber } from '../utils/cardUtils';
import type { Game, Player, Card } from '../types/GameTypes';
import { Alert } from 'react-native';


export interface GameListItem {
  id: string;
  hostName: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  alias: string;
}
// @ts-ignore: TS2349 — firebase module is callable at runtime

// Referencia a la colección "games"
const gamesCol = firestore().collection('games');
/**
 * Crea una nueva partida con el jugador host especificado.
 * - Genera un UUID para la partida
 * - Crea un nuevo mazo
 * - Asigna al host una carta de defensa inicial y salud aleatoria
 * - Almacena todo en Firestore en un batch atómico
 * @returns ID de la nueva partida
 */
export async function createGame(
  localPlayer: { id: string; name: string; age: number },
  alias: string,
  maxPlayers: number
): Promise<string> {
  // 0. Set entry document id
  const gameId = uuidv4();
  // 1. Create a new deck
  const deck = await createDeck();
  const deckId = deck.deck_id;

  // 2. Draw the host's initial defense card
  const initialCard = await drawCard(deckId, 1);
  const cardValue: number = cardValueToNumber(initialCard[0].value);
  const defense: Card = { code: initialCard[0].code, value: cardValue, suit: initialCard[0].suit };
  // 3. Assign random health between 18 and 26
  const health =
    Math.floor(Math.random() * (26 - 18 + 1)) + 18;

  // 4. Build the Player object
  const hostPlayer: Player = {
    id: localPlayer.id,
    name: localPlayer.name,
    age: localPlayer.age,
    health,
    defense,
  };

  // 5. Prepare a batched write
  const gameRef = gamesCol.doc(gameId);
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  const batch = firestore().batch();

  batch.set(gameRef, {
    hostId: localPlayer.id,
    alias,
    status: 'waiting',
    players: [hostPlayer],
    turnIndex: 0,
    deckId,
    maxPlayers,
    createdAt: serverTimestamp(),
    lastActionMsg: null
  });

  // 6. Commit and return the new gameId
  await batch.commit();
  return gameRef.id;
}


/**
 * Se subscribe en tiempo real a las partidas con status "waiting".
 * Llama a callback con un array de GameListItem ordenado por creación.
 */
export function fetchOpenGames(
  callback: (games: GameListItem[]) => void
): () => void {
  return gamesCol
    .where('status', '==', 'waiting')
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      (querySnap: any[]) => {
        // querySnap should never be null; guard just in case
        if (!querySnap) {
          console.warn('Received null snapshot for gamesCol');
          callback([]);
          return;
        }
        const list: GameListItem[] = [];
        querySnap.forEach((doc) => {
          const data = doc.data() as Game;
          list.push({
            id: doc.id,
            hostName: data.players[0]?.name ?? 'Host',
            createdAt: data?.createdAt,
            alias: data.alias,
          });
        });
        callback(list);
      },
      (error: any) => {
        console.error('Error listening to open games:', error);
        callback([]);
      }
    );
}

/**
 * Permite a un nuevo jugador unirse a una partida en estado 'waiting'.
 * - Verifica estado y capacidad
 * - Asigna carta de defensa y salud aleatoria
 * - Actualiza array de jugadores en transacción
 */
export async function joinGame(
  gameId: string,
  playerInfo: { id: string; name: string; age: number }
): Promise<void> {
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  return await firestore().runTransaction(async tx => {
    const gameRef = gamesCol.doc(gameId);
    const snap = await tx.get(gameRef);
    if (!snap.exists) {
      throw new Error('Game not found');
    }

    const game = snap.data() as Game;
    if (game.status !== 'waiting') {
      throw new Error('No se puede entrar a una partida empezada');
    }
    if (game.players.length >= game.maxPlayers) {
      throw new Error('La sala está llena');
    }

    // Robar la carta inicial de defensa del nuevo jugador
    const card = await drawCard(game.deckId, 1);
    const defense: Card = {
      code: card[0].code,
      suit: card[0].suit,
      value: cardValueToNumber(card[0].value),
    };

    // Salud aleatoria
    const health = Math.floor(Math.random() * (26 - 18 + 1)) + 18;

    const newPlayer: Player = {
      id: playerInfo.id,
      name: playerInfo.name,
      age: playerInfo.age || 999,
      health,
      defense,
    };

    // Actualizar el array de jugadores
    const updatedPlayers = [...game.players, newPlayer];
    //console.log("updatedPlayers");
    //console.log(updatedPlayers);

    tx.update(gameRef, { players: updatedPlayers });
  });
}

/**
 * Inicia la partida: calcula quién arranca según reglas y cambia el estado a 'started'.
 */
export async function startGame(
  gameId: string
): Promise<void> {
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async tx => {
    const gameRef = gamesCol.doc(gameId);
    const snap = await tx.get(gameRef);
    if (!snap.exists) throw new Error('No se encuentra la partida');
    const game = snap.data() as Game;
    if (game.status !== 'waiting') throw new Error('La partida ya ha empezado o ha terminado');
    if (game.players.length < 2) throw new Error('Debe haber al menos 2 jugadores para empezar');

    // Determinar el primer jugador: menor salud, luego menor defensa, luego mayor edad
    const sorted = [...game.players].sort((a, b) => {
      if (a.health !== b.health) return a.health - b.health;
      if (a.defense.value !== b.defense.value) return a.defense.value - b.defense.value;
      return b.age - a.age;
    });
    const firstId = sorted[0].id;
    const firstIndex = game.players.findIndex(p => p.id === firstId);
    const lastAction = serverTimestamp();
    tx.update(gameRef, { status: 'started', turnIndex: firstIndex, lastAction });
  });
}

/**
 * Cambia el shield (defense) de un jugador objetivo usando la carta robada por el jugador actual.
 * Después, avanza el turno utilizando la función advanceTurn transaccional.
 */
export async function changeDefense(
  gameId: string,
  targetPlayerId: string
): Promise<void> {
  let changeDefResultMsg;

  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async tx => {
    const gameRef = gamesCol.doc(gameId);
    const snap = await tx.get(gameRef);
    if (!snap.exists) throw new Error('Partida no encontrada');
    const game = snap.data() as Game;
    if (game.status !== 'started') throw new Error('Partida no empezada');
    const { players, deckId, turnIndex } = game;

    // Robar carta para cambio de defensa
    const draw = await drawCard(deckId, 1);
    const raw = draw[0];
    const newDefense: Card = {
      code: raw.code,
      suit: raw.suit,
      value: cardValueToNumber(raw.value),
    };
    const attackerName = players[game.turnIndex].name;
    let targetIdName = players.find((p: { id: string; }) => p.id === targetPlayerId);
    targetIdName = targetIdName.name;
    
    changeDefResultMsg = attackerName === targetIdName? `!${attackerName} se ha cambiado la defensa!` : `!${attackerName} cambió la defensa de ${targetIdName}!`
    // Actualizar el array de jugadores
    const updatedPlayers = players.map((p: { id: string; }) =>
      p.id === targetPlayerId
        ? { ...p, defense: newDefense }
        : p
    );

    // Avanzar al siguiente turno

    tx.update(gameRef, {
      players: updatedPlayers,
      lastAction: serverTimestamp(),
      lastActionMsg: changeDefResultMsg,
    });
  });
  advanceTurn(gameId);
}

/**
 * Reserva una carta (savedCard) para el siguiente turno del jugador actual.
 * - Verifica que sea el turno correcto
 * - Roba una carta y la guarda en savedCard
 * - Avanza el turno al siguiente jugador vivo
 */
export async function guardCard(
  gameId: string,
  playerId: string
): Promise<void> {
  // 1ª transacción: guardar la carta robada
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async (tx) => {
    const gameRef = gamesCol.doc(gameId);
    const snap = await tx.get(gameRef);
    if (!snap.exists) throw new Error('Partida no encontrada');
    const game = snap.data() as Game;
    if (game.status !== 'started') throw new Error('La partida no ha empezado');


    //old
    const players = game.players.map((p: any) => ({ ...p }));
    const idx = players.findIndex((p: { id: string; }) => p.id === playerId);
    if (idx < 0) return Promise.reject(new Error('No se encuentra el jugador seleccionado'));

    // Robar 1 carta y asignarla a savedCard
    const [cards] = await drawCard(game.deckId, 1);

    const savedCard: Card = {
      code: cards.code,
      suit: cards.suit,
      value: cardValueToNumber(cards.value),
    };
    // Obtener el mensaje del turno
    let targetIdName = players.find((p: { id: string; }) => p.id === playerId);
    targetIdName = targetIdName.name;
    const lastActionMsg = `${targetIdName} ha guardado la carta!`
    //players[idx].savedCard = savedCard;
    // Actualizar array de jugadores con savedCard
    tx.update(gameRef, {
      players: players.map((p: { id: string; }) =>
        p.id === playerId ? { ...p, savedCard } : p
      ), lastAction: serverTimestamp(), lastActionMsg
    });

  });

  // 2ª transacción: avanzar el turno (circular, solo vivos)
  await advanceTurn(gameId);
}
/**
 * Realiza un ataque al jugador objetivo, incluyendo savedCard si existe. Pendiente de implementar.
 */
export async function attackPlayer(
  gameId: string,
  targetPlayerId: string
): Promise<void> {
  //console.log("attacking targetId", targetPlayerId);
  let attackResultMsg;
  // 1ª transacción: leer estado, resolver ataque y actualizar jugadores
  try {
    // @ts-ignore: TS2349 — firebase module is callable at runtime
    await firestore().runTransaction(async (tx) => {
      const gameRef = gamesCol.doc(gameId);
      const snap = await tx.get(gameRef);
      if (!snap.exists) throw new Error('Partida no encontrada');
      const game = snap.data() as Game;

      // Solo en partida iniciada
      if (game.status !== 'started') {
        throw new Error('La partida no ha empezado');
      }

      // Copia profunda de jugadores para no mutar el original
      const players = game.players.map((p: any) => ({ ...p }));

      // Identificar atacante y objetivo
      const attackerName = players[game.turnIndex].name;
      const attacker = players[game.turnIndex];
      const targetIdx = players.findIndex((p: { id: string; }) => p.id === targetPlayerId);
      let targetIdName = players.find((p: { id: string; }) => p.id === targetPlayerId);
      targetIdName = targetIdName.name;
      if (targetIdx < 0) {
        throw new Error('No se encuentra el objetivo');
      }
      const target = players[targetIdx];
      //console.log("attacker ", attacker);
      //console.log("targetIdx ", targetIdx);
      //console.log("target ", target);


      // --- Preparar cartas de ataque ---
      // Si el atacante guardó carta en turno anterior, la usamos + nueva
      let attackCards: Card[] = [];
      if (attacker.savedCard) {
        // Carta previamente guardada
        attackCards.push(attacker.savedCard);
        // Robar 1 carta nueva
        const [apiCard] = await drawCard(game.deckId, 1);
        //console.log("savedCard turn attack");
        //console.log(apiCard);

        attackCards.push({
          code: apiCard.code,
          suit: apiCard.suit,
          value: cardValueToNumber(apiCard.value),
        });
      } else {
        // Turno normal: solo 1 carta nueva
        const [apiCard] = await drawCard(game.deckId, 1);
        //console.log("not savedcard turn");
        //console.log(apiCard);

        attackCards.push({
          code: apiCard.code,
          suit: apiCard.suit,
          value: cardValueToNumber(apiCard.value),
        });
      }

      // Calcular valor total de ataque
      const attackValue = attackCards.reduce((sum, c) => sum + c.value as number, 0);
      //console.log(attackValue, "attack value");

      // Obtener valor de defensa (asegura número)
      const defVal = typeof target.defense.value === 'number'
        ? (target.defense.value as number)
        : cardValueToNumber(target.defense.value as string);
      //console.log(defVal, "defval");
      //console.log("defval");
      //console.log(defVal);

      // --- Resolver ataque ---
      if (attackValue < defVal) {
        // Fallido: no hay daño
        // Solo se limpia savedCard del atacante
        players[game.turnIndex] = {
          ...attacker,
          savedCard: null,
        };
        //console.log("ataque fallido");
        attackResultMsg = `!${attackerName} atacó a ${targetIdName} y falló!`
        /* Alert.alert(
          'Ataque fallido',
          `Tu ataque (${attackValue}) no supera la defensa (${defVal}).`
        ); */
      } else {
        //console.log("calculando daño");

        // Exitoso: daño = ataque - defensa
        const damage = attackValue - defVal;
        const newHealth = target.health - damage;
        //console.log("damage ", damage);
        //console.log("newHealth ", newHealth);

        // Actualizar salud del objetivo
        players[targetIdx].health = newHealth;

        // El objetivo roba nueva carta de defensa
        const [newDefApi] = await drawCard(game.deckId, 1);
        //console.log("nueva carta def");
        //console.log(newDefApi);

        players[targetIdx].defense = {
          code: newDefApi.code,
          suit: newDefApi.suit,
          value: cardValueToNumber(newDefApi.value),
        };

        // Limpiar savedCard del atacante
        players[game.turnIndex] = {
          ...attacker,
          savedCard: null,
        };

        attackResultMsg = `${attackerName} atacó a ${targetIdName} y le ha hecho ${damage} de daño!`

        /* Alert.alert('¡Ataque exitoso!', `Ataque total: ${attackValue}\nDaño infligido: ${damage}`); */
      }
      
      tx.update(gameRef, { players, lastAction: serverTimestamp(), lastActionMsg: attackResultMsg });
      

    });
  } catch (error) {
    console.log("transaction failed: ", error);

  }
  // @ts-ignore: TS2349 — firebase module es callable at runtime


  // 2ª transacción: avanzar turno circular, saltando jugadores eliminados
  await advanceTurn(gameId);
  
}

/**
 * Función transaccional que avanza el turno al siguiente jugador vivo.
 * - Filtra players con health > 0
 * - Si queda uno o menos, marca status 'finished'
 * - Calcula índice circular del siguiente turno
 */
export async function advanceTurn(gameId: string): Promise<void> {
  const gameRef = gamesCol.doc(gameId);
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async (tx: FirebaseFirestoreTypes.Transaction) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists) return Promise.reject(new Error('Game not found'));
    const data = snap.data() as Game;

    // Filter alive players
    const alive = data.players.filter((p: { health: number; }) => p.health > 0);
    
    if (alive.length <= 1) {
      // Game over
      tx.update(gameRef, { status: 'finished' });
      return;
    }

    // Compute next index (circular)
    let next = data.turnIndex + 1;
    const n = data.players.length;
    // skip dead players
    while (data.players[next % n].health <= 0) {
      next++;
    }
    next = next % n;

    tx.update(gameRef, { turnIndex: next });
  });
}