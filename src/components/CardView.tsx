import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cardViewStyles } from '../styles/index'

type Suit = 'SPADES' | 'HEARTS' | 'DIAMONDS' | 'CLUBS';

type CardViewProps = {
  value: string | number;
  suit: Suit;
  backgroundColor?: string;
};

const suitSymbols: Record<Suit, string> = {
  SPADES: '♠',
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
};

const suitColors: Record<Suit, string> = {
  SPADES: '#000',
  CLUBS: '#000',
  HEARTS: '#e53935',
  DIAMONDS: '#e53935',
};

const formatCardValue = (value: string | number): string => {
  const map: Record<number, string> = {
    1: 'A',
    11: 'J',
    12: 'Q',
    13: 'K',
  };

  const numeric = typeof value === 'string' ? parseInt(value) : value;
  return map[numeric] ?? String(value);
};


const CardView: React.FC<CardViewProps> = ({ value, suit, backgroundColor = '#fff' }) => {
  //console.log('🃏 Render Card:', suit, value);

  return (
    <View style={[cardViewStyles.card, { backgroundColor }]}>
      <Text style={[cardViewStyles.text, { color: suitColors[suit] }]}>
        {suitSymbols[suit]} {formatCardValue(value)}
      </Text>
    </View>
  );
};

export default CardView;
