import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { usePlayer } from '../contexts/PlayerContext';
import { createGame } from '../firebase/games';
import { createGameScreenStyles } from '../styles/index'
import { Button } from '../components/Button';
import Spinner from 'react-native-loading-spinner-overlay';

// Define params for navigation
type RootStackParamList = {
  CreateGame: undefined;
  Game: { gameId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateGame'>;

const CreateGameScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { localPlayerId, displayName } = usePlayer();

  const [playerCount, setPlayerCount] = useState<number>(2);
  const [roomAlias, setRoomAlias] = useState<string>('');
  const [loadingGame, setLoadingGame] = useState(false);

  const handleStart = async () => {
    if (!localPlayerId) return;
    setLoadingGame(true);
    try {
      // pass exactly what createGame expects:
      const gameId = await createGame(
        {
          id: localPlayerId, name: displayName || 'Host',
          age: Math.floor(Math.random() * (26 - 18 + 1)) + 18
        },
        roomAlias,
        playerCount
      );
      //console.log('Created game with ID:', gameId);
      const isHost = true;
      setLoadingGame(false);
      navigation.replace('Game', { gameId, isHost, displayName });
    } catch (e: any) {
      console.error('Failed to create game:', e);
      Alert.alert('Error', e.message || 'Could not create game');
    }
  };


  return (
    <SafeAreaView style={createGameScreenStyles.container}>
      <Spinner
        visible={loadingGame}
        textContent="Starting game..."
        textStyle={styles.spinnerText}
      />
      <Text style={createGameScreenStyles.title}>Crear partida</Text>

      <View style={createGameScreenStyles.section}>
        <Text style={createGameScreenStyles.label}>Número de jugadores</Text>
        <View style={createGameScreenStyles.stepperContainer}>
          <TouchableOpacity
            style={createGameScreenStyles.stepButton}
            onPress={() => setPlayerCount(count => Math.max(2, count - 1))}
          >
            <Text style={createGameScreenStyles.stepText}>-</Text>
          </TouchableOpacity>
          <Text style={createGameScreenStyles.countText}>{playerCount}</Text>
          <TouchableOpacity
            style={createGameScreenStyles.stepButton}
            onPress={() => setPlayerCount(count => Math.min(4, count + 1))}
          >
            <Text style={createGameScreenStyles.stepText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={createGameScreenStyles.section}>
        <Text style={createGameScreenStyles.label}>Nombre de la sala</Text>
        <TextInput
          style={createGameScreenStyles.input}
          placeholder="Introduce un nombre para la sala"
          value={roomAlias}
          onChangeText={setRoomAlias}
        />
      </View>

      <Button
        title="Empezar"
        onPress={handleStart}
        style={createGameScreenStyles.startButton}
        textStyle={createGameScreenStyles.startText}
      />
    </SafeAreaView>
  );
};

export default CreateGameScreen;

const styles = StyleSheet.create({
  spinnerText: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});