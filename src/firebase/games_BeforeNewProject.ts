// src/firebase/games.ts
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import firestore, {
  serverTimestamp,
  FirebaseFirestoreTypes,
  getDoc,
  runTransaction
} from '@react-native-firebase/firestore';

import { drawCard, createDeck } from '../services/deckApi.ts';
import { cardValueToNumber } from '../utils/cardUtils.ts';


// --- Tipos ---
export interface Player {
  id: string;
  name: string;
  health: number;
  defense: { code: string; suit?: string; value: number };
  savedCard?: { code: string; suit?: string; value: number };
  isTurn?: boolean;
}
export interface Game {
  hostId: string;
  alias?: string;
  maxPlayers?: number;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  turnIndex: number;
  deckId: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
}

export interface GameListItem {
  id: string;
  hostName: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
}

// Referencia a la colección "games"
// @ts-ignore: TS2349 — firebase module is callable at runtime
const gamesCollection = firestore().collection('games');
// --- Funciones ---

/**
 * Crea un nuevo juego:
 * 1. Crea un nuevo deck.
 * 2. Roba la carta inicial de defensa.
 * 3. Asigna vida aleatoria (18–26).
 * 4. Guarda el documento en Firestore.
 */
export async function createGame(localPlayer: {
  id: string;
  name: string;
}, alias: string, maxPlayers: number): Promise<string> {
  const gameId = uuidv4();

  // 1. Crear y barajar un nuevo mazo
  const deckRes = await createDeck();
  const deckId = deckRes.deck_id;

  // 2. Robar carta de defensa inicial
  const cards = await drawCard(deckId, 1);
  const initialDefense = cards[0].code;

  // 3. Vida aleatoria
  const initialHealth = Math.floor(Math.random() * 9) + 18;

  // 5. Guardar en Firestore
  /* await gamesCollection.doc(gameId).set(gameData as any); */
  await gamesCollection.doc(gameId).set({
    hostId: localPlayer.id,
    alias,
    maxPlayers,
    status: 'waiting',
    players: [
      {
        id: localPlayer.id,
        name: localPlayer.name || 'Host',
        health: initialHealth,
        defense: initialDefense,
      },
    ],
    turnIndex: 0,
    deckId,
    createdAt: serverTimestamp(),
  });

  return gameId;
}

/**
 * Se subscribe en tiempo real a las partidas con status "waiting".
 * Llama a callback con un array de GameListItem ordenado por creación.
 */
export function fetchOpenGames(
  callback: (games: GameListItem[]) => void
): () => void {
  return gamesCollection
    .where('status', '==', 'waiting')
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      (querySnap: any[]) => {
        // querySnap should never be null; guard just in case
        if (!querySnap) {
          console.warn('Received null snapshot for gamesCollection');
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
 * Une al jugador a una partida en estado "waiting":
 * 1. Roba carta de defensa.
 * 2. Asigna vida aleatoria.
 * 3. Añade al array players en una transacción.
 */
export async function joinGame(
  gameId: string,
  localPlayer: { id: string; name: string }
): Promise<void> {
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  const gameRef = firestore().collection('games').doc(gameId);

  // 1️⃣ Pre‐check outside the transaction
  const snap = await getDoc(gameRef);
  if (!snap.exists) {
    console.error('Partida no encontrada', gameId);
  }
  const data = snap.data() as Game;
  if (data.status !== 'waiting') {
    console.error('Partida ya en curso', gameId);
  }

  // Draw the new defense card
  const cards = await drawCard(data.deckId, 1);
  const ts = serverTimestamp()
  const newPlayer: Player = {
    id: localPlayer.id,
    name: localPlayer.name || 'Guest',
    health: Math.floor(Math.random() * 9) + 18,
    defense: cards[0].code,
  };

  const updatedPlayers = [...data.players, newPlayer];
  console.log("just before runTransaction");
  console.log(updatedPlayers);

  // 2️⃣ Transaction only does the update
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  return firestore().runTransaction(async (tx: FirebaseFirestoreTypes.Transaction) => {
    const postSnapshot = await tx.get(gameRef);
    tx.update(gameRef, { players: updatedPlayers });
  });
}


/* export async function changeDefense(gameId: string, playerId: string) {  }
export async function attackPlayer(gameId: string, attackerId: string, targetId: string) {  }
export async function guardCard(gameId: string, playerId: string) {  }
export async function advanceTurn(gameId: string) {
  // transaction that shifts the `isTurn` flag to the next index
} */

/**
 * Swap defense card:
 * - Draw one card for the target (default to yourself if no targetId)
 * - Replace their defense with the new one
 */
export async function changeDefense(
  gameId: string,
  playerId: string,
  targetId?: string
): Promise<void> {
  const gameRef = gamesCollection.doc(gameId);
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async (tx: FirebaseFirestoreTypes.Transaction) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists) return Promise.reject(new Error('Game not found'));
    const data = snap.data() as Game;
    if (data.status !== 'playing' && data.status !== 'waiting') {
      return Promise.reject(new Error('Cannot change defense now'));
    }

    // Determine whose defense to replace
    const swapWithId = targetId ?? playerId;
    const players = data.players.map(p => ({ ...p }));
    const idxPlayer = players.findIndex(p => p.id === playerId);
  
    const idxSwapTarget = players.findIndex(p => p.id === swapWithId);
    if (idxPlayer < 0 || idxSwapTarget < 0) {
      return Promise.reject(new Error('Player(s) not in game'));
    }

    // Reveal new card for the swap player (always draw for the swap target)
    const deckId = data.deckId;
    const cards = await drawCard(deckId, 1);
    const newDefCard = cards[0].code;

    // Apply the swap: if you target yourself, it's just a redraw; otherwise exchange
    players[idxSwapTarget].defense = newDefCard;

    tx.update(gameRef, {
      players
    });
  });
}

/**
 * 2️⃣ attackPlayer:
 * Perform an attack from attackerId to targetId using drawn card.
 * - Draw a card for attacker
 * - Compare value vs target defense
 * - If fail, just discard attack card.
 * - If success, deal damage = attack - defense:
 *     * subtract health
 *     * draw a new defense for the target
 * - Always end by advancing turn.
 */
export async function attackPlayer(
  gameId: string,
  attackerId: string,
  targetId: string
): Promise<void> {
  const gameRef = gamesCollection.doc(gameId);
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async (tx: FirebaseFirestoreTypes.Transaction) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists) return Promise.reject(new Error('Game not found'));
    const data = snap.data() as Game;
    if (data.status !== 'playing' && data.status !== 'waiting') {
      return Promise.reject(new Error('Cannot attack now'));
    }

    const players = data.players.map(p => ({ ...p }));
    const idxAttacker = players.findIndex(p => p.id === attackerId);
    const idxTarget = players.findIndex(p => p.id === targetId);
    if (idxAttacker < 0 || idxTarget < 0) return Promise.reject(new Error('Players not found'));

    // 1. Draw attack card
    const cards = await drawCard(data.deckId, 1);
    const attackCode = cards[0].code;
    const attackValue = cardValueToNumber(cards[0].value);
    const defenseValue = players[idxTarget].defense.value;

    let newPlayers = players;

    if (attackValue >= defenseValue) {
      // Hit! compute damage
      const damage = attackValue - defenseValue;
      newPlayers[idxTarget].health = newPlayers[idxTarget].health - damage;

      // draw new defense for target
      const newDefCards = await drawCard(data.deckId, 1);
      newPlayers[idxTarget].defense = newDefCards[0].value;
    }
    // 2. Update game state
    tx.update(gameRef, {
      players: newPlayers
    });
  });

  // 3. Advance turn after transaction
  await advanceTurn(gameId);
}

/**
 * 3️⃣ guardCard:
 * Draw a card and store it in the player's `savedCard` field
 * for use on next turn.
 */
export async function guardCard(
  gameId: string,
  playerId: string
): Promise<void> {
  const gameRef = gamesCollection.doc(gameId);
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async (tx: FirebaseFirestoreTypes.Transaction) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists) return Promise.reject(new Error('Game not found'));
    const data = snap.data() as Game;

    const players = data.players.map(p => ({ ...p }));
    const idx = players.findIndex(p => p.id === playerId);
    if (idx < 0) return Promise.reject(new Error('Player not in game'));

    // Draw and store
    const cards = await drawCard(data.deckId, 1);
    players[idx].savedCard = cards[0].code;

    tx.update(gameRef, {
      players
    });
  });

  // Advance turn so next player plays
  await advanceTurn(gameId);
}

/**
 * 4️⃣ advanceTurn:
 * Move turnIndex to the next alive player in the players array.
 * If only one alive remains, set status to 'finished'.
 */
export async function advanceTurn(gameId: string): Promise<void> {
  const gameRef = gamesCollection.doc(gameId);
  // @ts-ignore: TS2349 — firebase module is callable at runtime
  await firestore().runTransaction(async (tx: FirebaseFirestoreTypes.Transaction) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists) return Promise.reject(new Error('Game not found'));
    const data = snap.data() as Game;

    // Filter alive players
    const alive = data.players.filter(p => p.health > 0);
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

    tx.update(gameRef, { turnIndex: next, status: 'playing' });
  });
}

