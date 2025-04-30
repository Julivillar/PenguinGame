export type Card = {
    code: string; // Código tipo "AS", "2H", "10C", etc.
    value: number; // Valor numérico 1-13
    suit: 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS'; // Palo
  };
  
  export type Player = {
    id: string; // UID de Firebase o identificador único
    name: string;
    health: number; // Puntos de vida
    defense: Card; // Carta de defensa actual
    savedCard?: Card; // Carta guardada (opcional)
    age: number; // Edad del jugador
    isTurn: boolean; // Es su turno
  };
  
  export type Game = {
    id: string; // ID de la partida en Firestore
    deckId: string; // ID de la baraja de la API
    players: Player[];
    currentTurnPlayerId: string; // ID del jugador en turno
    discardPile: Card[]; // (opcional, por UI)
    started: boolean;
    winnerId?: string; // ID del ganador (opcional)
  };

  export type TargetAction = 'CHANGE_DEFENSE' | 'ATTACK';

  