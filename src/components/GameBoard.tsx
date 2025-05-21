import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import type { Player, TargetAction } from '../types/GameTypes';
import CardView from './CardView';
import { gameBoardStyles as styles } from '../styles/index'


import { useNavigation } from '@react-navigation/native';
import {
  getFirestore,
  doc,
  onSnapshot,
} from '@react-native-firebase/firestore';

import { usePlayer } from '../contexts/PlayerContext';

type GameBoardProps = {
  players: Player[];
  onDeckPress: () => void;
  selectingTargetForAction: TargetAction | null;
  onSelectPlayerTarget: (playerId: string) => void;
  gameId: string;
};

type Position = 'top' | 'bottom' | 'left' | 'right';

const GameBoard: React.FC<GameBoardProps & { currentPlayerId: string | null }> = ({
  players,
  onDeckPress,
  selectingTargetForAction,
  onSelectPlayerTarget,
  gameId,
  currentPlayerId,
}) => {
  const navigation = useNavigation();
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const boardBackgroundColor = '#5f8a8a';
  const textColor = '#ffffff';

  // blink for the active player’s name
  const nameBlinkAnim = useRef(new Animated.Value(0)).current;
  const nameColor = nameBlinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f7db4d', textColor],
  });
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(nameBlinkAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(nameBlinkAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
      ])
    ).start();
  }, [currentPlayerId]);


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
  /*
  ToDo: implement a warning before leaving 
  const handleBackToLobby = () => {
    let status;
    const db = getFirestore();
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(
      gameRef,
      snap => {
        const data = snap.data();
        if (!data) return;
        status = data.status;
      },
      error => {
        console.error('Error loading game:', error);
        Alert.alert('Error', 'No se pudo cargar la partida.');
      }
    );


    if (status === 'playing') {
      Alert.alert(
        'Warning',
        'The game has already started; you cannot rejoin!',
        [{ text: 'OK' }]
      );
    } else {
      navigation.replace('Lobby');
    }
    return unsubscribe;
  }; */

  const renderPlayer = (player: Player, position: Position) => {
    const isRightSide = position === 'right';

    const isSelectable = !!selectingTargetForAction;
    const isEliminated = player.health <= 0;
    const Wrapper = isSelectable ? TouchableOpacity : View;

    return (
      <View
        key={player.id}
        style={[
          styles.playerContainer,
          getPositionStyle(position),
          isEliminated && { opacity: 0 },
        ]}
      >
        {!isEliminated && (
          <>
            <View>

              {player.id === currentPlayerId ? (
                <Animated.Text style={[styles.name, { color: nameColor }]}>
                  {player.name}
                </Animated.Text>
              ) : (
                <Text style={[styles.name, { color: textColor }]}>
                  {player.name}
                </Text>
              )}
              <Text style={[styles.health, { color: textColor }]}>
                ❤️ {player.health} 🛡️ {player.defense.value}
              </Text>
            </View>


            <View
              style={{
                flexDirection: isRightSide ? 'row-reverse' : 'row',
                alignItems: 'center',
              }}
            >
              {player.savedCard && (
                <View style={styles.hiddenCard}>
                  <Text style={styles.hiddenCardSymbol}>🂠</Text>
                </View>
              )}

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
                      key={`${player.id}-${player.defense.code}`}
                      value={player.defense.value}
                      suit={player.defense.suit}
                    />
                  </Animated.View>
                ) : (
                  <CardView
                    key={`${player.id}-${player.defense.code}`}
                    value={player.defense.value}
                    suit={player.defense.suit}
                  />
                )}
              </Wrapper>
            </View>


          </>
        )}
      </View>
    );
  };


  return (
    <View style={[styles.board, { backgroundColor: boardBackgroundColor }]}>

      {/* Top */}
      {players[0] && renderPlayer(players[0], 'top')}

      <View style={styles.middleRow}>
        { /* LEFT slot: player #3 or blank */}
        {players[2]
          ? renderPlayer(players[2], 'left')
          : <View style={styles.left} />}

        { /* DECK in absolute center */}
        <TouchableOpacity style={styles.center} onPress={onDeckPress}>
          <Text style={styles.deck}>🂠</Text>
        </TouchableOpacity>

        { /* RIGHT slot: player #4 or blank */}
        {players[3]
          ? renderPlayer(players[3], 'right')
          : <View style={styles.right} />}
      </View>

      {players[1] && renderPlayer(players[1], 'bottom')}
    </View>
  );
};

export default GameBoard;
