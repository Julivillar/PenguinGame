import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.text, { color: suitColors[suit] }]}>
        {suitSymbols[suit]} {formatCardValue(value)}
      </Text>
    </View>
  );
};

export default CardView;

const styles = StyleSheet.create({
  card: {
    width: 70,          // antes 50
    height: 100,        // antes 70
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  text: {
    fontSize: 18,       // ajusta el tamaño si se ve pequeño
    fontWeight: 'bold',
  },
});

