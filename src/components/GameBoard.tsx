import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Player } from '../types/GameTypes';
import CardView from './CardView';

type GameBoardProps = {
  players: Player[];
  onDeckPress: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ players, onDeckPress }) => {
  const renderPlayer = (player: Player) => (
    <View key={player.id} style={styles.playerContainer}>
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.health}>❤️ {player.health}</Text>
      <CardView value={player.defense.value} suit={player.defense.suit} />
    </View>
  );

  return (
    <View style={styles.board}>
      {/* Jugador Top */}
      {players[0] && (
        <View style={styles.top}>{renderPlayer(players[0])}</View>
      )}

      <View style={styles.middleRow}>
        {/* Jugador Left */}
        {players[2] && (
          <View style={styles.left}>{renderPlayer(players[2])}</View>
        )}

        {/* Centro (mazo) */}
        <TouchableOpacity style={styles.center} onPress={onDeckPress}>
          <Text style={styles.deck}>🂠</Text>
        </TouchableOpacity>

        {/* Jugador Right */}
        {players[3] && (
          <View style={styles.right}>{renderPlayer(players[3])}</View>
        )}
      </View>

      {/* Jugador Bottom */}
      {players[1] && (
        <View style={styles.bottom}>{renderPlayer(players[1])}</View>
      )}
    </View>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
    board: {
      flex: 1,
    },
    top: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end', // acercamos al centro
    },
    middleRow: {
      flex: 2, // zona central más grande
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end', // empuja hacia el centro
      paddingRight: 10,
    },
    center: {
      width: 70,
      height: 100,
      borderRadius: 10,
      backgroundColor: '#795548',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deck: {
      fontSize: 30,
      color: '#fff',
    },
    right: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center', // empuja hacia el centro
      paddingLeft: 10,
    },
    bottom: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start', // acercamos al centro
    },
    playerContainer: {
      alignItems: 'center',
    },
    name: {
      fontWeight: 'bold',
      marginBottom: 2,
    },
    health: {
      marginBottom: 4,
    },
  });
  