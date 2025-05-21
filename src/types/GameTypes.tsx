import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface Card  {
  code: string;
  value: number;
  suit: 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS';
};

export type Player = {
  id: string;
  name: string;
  health: number;
  defense: Card;
  savedCard?: Card | null;
  age: number;
};

export type GameStatus = 'waiting' | 'started' | 'finished';

export interface Game {
  hostId: string;
  alias: string;
  status: GameStatus;
  players: Player[];
  turnIndex: number;
  deckId: string;
  maxPlayers: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  lastActionAt: FirebaseFirestoreTypes.Timestamp;
}

export type TargetAction = 'CHANGE_DEFENSE' | 'ATTACK';

