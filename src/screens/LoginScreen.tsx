import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { loginScreenStyles } from '../styles/index'
import { Button } from '../components/Button';
import { usePlayer } from '../contexts/PlayerContext.tsx';

const auth = getAuth();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { displayName, saveDisplayName } = usePlayer();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Debes introducir email y contraseña');
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

    } catch (e: any) {
      Alert.alert('Error al iniciar sesión', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert('Debes introducir email y contraseña');
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      
    } catch (e: any) {
      Alert.alert('Error al registrar', e.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <KeyboardAvoidingView
      style={loginScreenStyles.container}
      behavior={Platform.select({ ios: 'padding', android: 'padding' })}
    >
      <View style={loginScreenStyles.box}>
        {/* Logo del pingüino */}
        <Image
          source={require('../../assets/penguin.png')} // tu asset local
          style={loginScreenStyles.logo}
          resizeMode="contain"
        />

        <Text style={loginScreenStyles.title}>Penguin Game</Text>

        {/* Inputs */}
        <TextInput
          style={loginScreenStyles.input}
          placeholder="Email"
          placeholderTextColor="#CCCCCC"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={loginScreenStyles.input}
          placeholder="Password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={isLoading ? 'Cargando…' : 'Iniciar sesión'}
          onPress={handleLogin}
          disabled={isLoading}
          style={loginScreenStyles.primaryBtn}
          textStyle={loginScreenStyles.primaryBtnText}
        />

        <View style={loginScreenStyles.row}>
          <Button
            title={isLoading ? 'Cargando…' : 'Registrarse'}
            onPress={handleRegister}
            disabled={isLoading}
            variant="outline"
            textStyle={loginScreenStyles.loginBtnText}
            style={loginScreenStyles.loginBtn}

          />
          {/* <Button
            title="Forgot password?"
            onPress={() => { console.log("on forgot") }}
            variant="outline"
            textStyle={loginScreenStyles.loginBtnText}
            style={loginScreenStyles.loginBtn}
          /> */}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
