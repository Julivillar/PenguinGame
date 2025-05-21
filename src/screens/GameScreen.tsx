// src/screens/
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, Modal, Alert, TouchableOpacity, Animated, Easing, StyleSheet
} from 'react-native';
import GameBoard from '../components/GameBoard';
import CardView from '../components/CardView';
import { usePlayer } from '../contexts/PlayerContext';
import type { Player, Card, TargetAction } from '../types/GameTypes';
import { startGame } from '../firebase/games'
import { gameScreenStyles } from '../styles/index'
import {
  getFirestore,
  doc,
  onSnapshot,
} from '@react-native-firebase/firestore';

import {
  changeDefense,
  attackPlayer,
  guardCard,
} from '../firebase/games';

import { Button } from '../components/Button';

type GameScreenProps = {
  route: { params: { gameId: string, isHost?: boolean, displayName?: string } };
};

const GameScreen: React.FC<GameScreenProps> = ({ route }) => {

  const { gameId, isHost } = route.params;
  const { localPlayerId } = usePlayer();

  const [lastActionMsg, setLastActionMsg] = useState<string>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [deckId, setDeckId] = useState<string>('');
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [status, setStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectingTargetForAction, setSelectingTargetForAction] = useState<TargetAction | null>(null);
  const [attackCard, setAttackCard] = useState<Card[] | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  // Subscribe to the live game document
  useEffect(() => {
    const db = getFirestore();
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(
      gameRef,
      snap => {
        const data = snap.data();
        if (!data) return;
        setPlayers(data.players);
        setDeckId(data.deckId);
        setTurnIndex(data.turnIndex);
        setStatus(data.status);
        setLastActionMsg(data.lastActionMsg)
      },
      error => {
        console.error('Error cargando la partida:', error);
        Alert.alert('Error', 'No se pudo cargar la partida.');
      }
    );
    return unsubscribe;
  }, [gameId]);

  // Determine current player and turn
  const currentTurnPlayer = players[turnIndex];
  const isMyTurn = currentTurnPlayer?.id === localPlayerId;
  const mustAttack = isMyTurn && !!currentTurnPlayer?.savedCard;

  // Check for victory
  useEffect(() => {
    if (status === 'waiting') return;
    const alive = players?.filter(p => p.health > 0);
    if (alive.length === 1) {
      setWinner(alive[0]);

    }
  }, [players]);

  // Handlers that call your Firebase logic
  const handleDeckPress = () => {
    if (status === 'waiting') return;
    if (isMyTurn) setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleChangeDefense = () => {
    setModalVisible(false);
    setSelectingTargetForAction('CHANGE_DEFENSE');
  };

  const handleAttack = () => {
    setModalVisible(false);
    setSelectingTargetForAction('ATTACK');
  };

  const handleGuardCard = () => {
    setModalVisible(false);
    guardCard(gameId, localPlayerId!);
    setSelectingTargetForAction(null);
  };

  const handleSelectPlayerTarget = (targetId: string) => {
    setModalVisible(false);
    if (selectingTargetForAction === 'CHANGE_DEFENSE' && isMyTurn) {
      changeDefense(gameId, targetId!);
    } else if (selectingTargetForAction === 'ATTACK' && isMyTurn) {
      attackPlayer(gameId, targetId);
      
    }
    setSelectingTargetForAction(null);

  };

  const handleStart = async () => {
    try {
      await startGame(gameId);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (lastActionMsg != '' || lastActionMsg != null) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }, 2500);
    }
  }, [lastActionMsg]);

  // Render
  return (
    <View style={{ flex: 1 }}>
      {status=='waiting' && (
        <View style={gameScreenStyles.victoryContainer}>
          <Text style={gameScreenStyles.victoryText}>
            Id de la sala: {gameId}
          </Text>

        </View>
      )}
      
      {lastActionMsg != null && (
        <Animated.View
          style={[
            animStyles.turnMessageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={animStyles.turnMessageText}>
            {lastActionMsg}
          </Text>
        </Animated.View>
      )}
      {currentTurnPlayer && (
        <View style={gameScreenStyles.turnMessageContainer}>
          <Text style={gameScreenStyles.turnMessageText}>
            Turno de {currentTurnPlayer.name}
          </Text>
        </View>
      )}

      <GameBoard
        players={players}
        onDeckPress={handleDeckPress}
        selectingTargetForAction={selectingTargetForAction}
        onSelectPlayerTarget={handleSelectPlayerTarget}
        gameId={gameId}
        currentPlayerId={currentTurnPlayer?.id ?? null}
      />
      <View>
        {isHost && status === 'waiting' && (
          <TouchableOpacity style={[gameScreenStyles.btn, gameScreenStyles.primaryBtn]} onPress={handleStart} disabled={status !== 'waiting' || players.length < 2}>
            <Text style={gameScreenStyles.btnText}>Empezar</Text>
          </TouchableOpacity>

        )}
      </View>
      {winner && (
        <View style={gameScreenStyles.victoryContainer}>
          <Text style={gameScreenStyles.victoryText}>
            🏆 {winner.name} ha ganado la partida
          </Text>

        </View>
      )}

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={gameScreenStyles.modalOverlay}>
          <View style={gameScreenStyles.modalContent}>
            <Text style={gameScreenStyles.modalTitle}>
              {mustAttack
                ? 'Debes atacar con tu carta guardada'
                : '¿Qué quieres hacer?'}
            </Text>
            {mustAttack ? (
              <Button
                title={'Atacar (obligatorio)'}
                onPress={handleAttack}
                style={[gameScreenStyles.btn, gameScreenStyles.primaryBtn]}
                textStyle={gameScreenStyles.btnText}
              />

            ) : (
              <View style={gameScreenStyles.actionBtnsContainer}>
                <Button
                  title={'Cambiar defensa'}
                  onPress={handleChangeDefense}
                  style={[gameScreenStyles.btn, gameScreenStyles.primaryBtn]}
                  textStyle={gameScreenStyles.btnText}
                />

                <Button
                  title={'Atacar'}
                  onPress={handleAttack}
                  style={[gameScreenStyles.btn, gameScreenStyles.primaryBtn]}
                  textStyle={gameScreenStyles.btnText}
                />

                <Button
                  title={'Guardar carta'}
                  onPress={handleGuardCard}
                  style={[gameScreenStyles.btn, gameScreenStyles.primaryBtn]}
                  textStyle={gameScreenStyles.btnText}
                />

                <Button
                  title={'Cancelar'}
                  onPress={closeModal}
                  style={[gameScreenStyles.btn, gameScreenStyles.cancelBtn]}
                  textStyle={[gameScreenStyles.btnText, { color: 'white' }]}
                />

              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 
      ToDo: Implement showing the card
      {attackCard && (
        <View style={gameScreenStyles.attackCardContainer}>
          <Text style={gameScreenStyles.attackCardLabel}>Carta de ataque:</Text>
          {attackCard.map((card, i) => (
            <React.Fragment key={i}>
              <CardView value={card.value} suit={card.suit} />
              {i < attackCard.length - 1 && <Text style={gameScreenStyles.plusSign}>+</Text>}
            </React.Fragment>
          ))}
        </View>
      )} */}
    </View>
  );
};

export default GameScreen;
const animStyles = StyleSheet.create({
  turnMessageContainer: {
    position: 'absolute',
    top: '65%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    zIndex: 10,
  },
  turnMessageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})