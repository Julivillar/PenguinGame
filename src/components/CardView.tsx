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

const CardView: React.FC<CardViewProps> = ({ value, suit, backgroundColor = '#fff' }) => {
  console.log('🃏 Render Card:', suit, value);

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.text, { color: suitColors[suit] }]}>
        {suitSymbols[suit]} {value}
      </Text>
    </View>
  );
};

export default CardView;

const styles = StyleSheet.create({
  card: {
    width: 50,
    height: 70,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
