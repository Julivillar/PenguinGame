import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePlayer } from '../contexts/PlayerContext';
// @ts-ignore: TS2349 — firebase module is callable at runtime
import { createGame, fetchOpenGames, GameListItem, joinGame } from '../firebase/games';
import { signOut, getAuth } from '@react-native-firebase/auth';
import { lobbyScreenStyles } from '../styles/index'
import { Button } from '../components/Button';
import Spinner from 'react-native-loading-spinner-overlay';

type AppStackParamList = {
  Lobby: undefined;
  Game: { gameId: string };
  CreateGame: undefined;
  Settings: undefined;
  Rules: undefined;
};

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'Lobby'>;

const LobbyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { localPlayerId, displayName } = usePlayer();
  const [loadingGame, setLoadingGame] = useState(false);

  const [games, setGames] = useState<GameListItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = fetchOpenGames((list: React.SetStateAction<GameListItem[]>) => {
      setGames(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleNewGame = () => {
    navigation.navigate('CreateGame');
  };

  const handleJoin = async (gameId: string) => {
    if (!localPlayerId) {
      console.warn('No localPlayerId, cannot join');
      return;
    }
    setLoadingGame(true);

    try {
      console.log('Joining game:', gameId);
      const localPlayer = { id: localPlayerId, name: displayName, age: Math.floor(Math.random() * (26 - 18 + 1)) + 18 }
      await joinGame(gameId, localPlayer);
      console.log('joinGame resolved, navigating to Game');
      setLoadingGame(false);
      navigation.navigate('Game', { gameId });
    } catch (e: any) {
      console.error('Error in handleJoin:', e);
      Alert.alert('Error', e.message || 'Could not join game');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth()).then(() => console.log('User signed out!'));

    } catch (e: any) {
      console.error('Error signing out:', e);
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  const handleRule = () => {
    navigation.navigate('Rules');
  };

  const handleSetting = () => {
    navigation.navigate('PlayerSettings');
  };

  return (
    <SafeAreaView style={lobbyScreenStyles.container}>
      <Text style={lobbyScreenStyles.title}>Penguin Game</Text>

      <View style={lobbyScreenStyles.buttonsContainer}>

        <Button
          title="Nueva partida"
          onPress={handleNewGame}
          style={lobbyScreenStyles.button}
          textStyle={lobbyScreenStyles.buttonText}
        />

        <Button
          title="Reglas del juego"
          onPress={handleRule}
          style={lobbyScreenStyles.button}
          textStyle={lobbyScreenStyles.buttonText}
        />

        <Button
          title="Ajustes"
          onPress={handleSetting}
          style={lobbyScreenStyles.button}
          textStyle={lobbyScreenStyles.buttonText}
        />

        <Button
          title="Cerrar sesión"
          onPress={handleSignOut}
          style={lobbyScreenStyles.button}
          textStyle={lobbyScreenStyles.buttonText}
        />

        {/* —— Display Name Entry —— */}

      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7DA9C6" />
      ) : games.length === 0 ? (
        <Text style={lobbyScreenStyles.emptyText}>No hay partidas disponibles</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (

            < Button
              title={`${item.alias} room from ${item.hostName} (${item.id.slice(0, 6)})`}
              onPress={() => handleJoin(item.id)}
              style={lobbyScreenStyles.gameItem}
              textStyle={lobbyScreenStyles.gameText}
            />
          )}
        />
      )}
    </SafeAreaView>

  );
};

export default LobbyScreen;

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