import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GameScreen from './src/screens/GameScreen';
import CardView from './src/components/CardView';
import { PlayerProvider } from './src/contexts/PlayerContext';

export default function App() {
  return (
    <PlayerProvider>
      <GameScreen />
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
