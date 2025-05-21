// App
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlayerProvider, usePlayer } from './src/contexts/PlayerContext';
import LoginScreen from './src/screens/LoginScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import CreateGameScreen from './src/screens/CreateGameScreen';
import GameScreen from './src/screens/GameScreen';
import RulesScreen from './src/screens/RulesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
//import HistoryScreen from './src/screens/HistoryScreen';


type AuthStackParamList = {
  Login: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} >
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

type AppStackParamList = {
  Lobby: undefined;
  CreateGame: undefined;
  Game: { gameId: string };
  Rules: undefined;
  PlayerSettings: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();

function AppStackScreen() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Lobby" component={LobbyScreen} />
      <AppStack.Screen name="CreateGame" component={CreateGameScreen} />
      <AppStack.Screen name="Game" component={GameScreen} />
      <AppStack.Screen name="Rules" component={RulesScreen} />
      <AppStack.Screen name="PlayerSettings" component={SettingsScreen} />
    </AppStack.Navigator>
  );
}

function RootNavigator() {
  const { localPlayerId } = usePlayer();
  return localPlayerId ? <AppStackScreen /> : <AuthStackScreen />;
}

export default function App() {

  return (
    <PlayerProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PlayerProvider>
  );
}
