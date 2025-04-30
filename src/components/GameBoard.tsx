import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import type { Player, TargetAction } from '../types/GameTypes';
import CardView from './CardView';


type GameBoardProps = {
  players: Player[];
  onDeckPress: () => void;
  selectingTargetForAction: TargetAction | null;
  onSelectPlayerTarget: (playerId: string) => void;
};

type Position = 'top' | 'bottom' | 'left' | 'right';

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  onDeckPress,
  selectingTargetForAction,
  onSelectPlayerTarget,
}) => {
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectingTargetForAction) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      blinkAnim.stopAnimation();
      blinkAnim.setValue(0);
    }
  }, [selectingTargetForAction]);

  

  const getBlinkBackground = () => {
    return blinkAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ffffff', '#34deeb'],
    });
  };

  const getPositionStyle = (position: Position) => {
    return styles[position];
  };

  const renderPlayer = (player: Player, position: Position) => {
    const isSelectable = !!selectingTargetForAction;
    const Wrapper = isSelectable ? TouchableOpacity : View;

    return (
      <View
        key={player.id}
        style={[styles.playerContainer, getPositionStyle(position)]}
      >
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.health}>❤️ {player.health}</Text>

        <Wrapper onPress={() => isSelectable && onSelectPlayerTarget(player.id)}>
          {isSelectable ? (
            <Animated.View
              style={{
                borderRadius: 6,
                overflow: 'hidden',
                backgroundColor: getBlinkBackground(),
              }}
            >
              <CardView
                value={player.defense.value}
                suit={player.defense.suit}
              />
            </Animated.View>
          ) : (
            <CardView
              value={player.defense.value}
              suit={player.defense.suit}
            />
          )}
          {player.savedCard && (
            <View style={styles.hiddenCard}>
              <Text style={styles.hiddenCardSymbol}>🂠</Text>
            </View>
          )}

        </Wrapper>
      </View>
    );
  };

  return (
    <View style={styles.board}>
      {/* Top */}
      {players[0] && renderPlayer(players[0], 'top')}

      <View style={styles.middleRow}>
        {players[2] && renderPlayer(players[2], 'left')}

        <TouchableOpacity style={styles.center} onPress={onDeckPress}>
          <Text style={styles.deck}>🂠</Text>
        </TouchableOpacity>

        {players[3] && renderPlayer(players[3], 'right')}
      </View>

      {players[1] && renderPlayer(players[1], 'bottom')}
    </View>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  board: {
    flex: 1,
  },
  playerContainer: {
    alignItems: 'center',
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  middleRow: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  health: {
    marginBottom: 4,
  },
  hiddenCard: {
    width: 50,
    height: 70,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#ccc',
  },
  hiddenCardSymbol: {
    fontSize: 24,
  },
  
});
