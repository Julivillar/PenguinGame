import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import { usePlayer } from '../contexts/PlayerContext';
/* import { firebaseAuth } from '../firebase/firebase'; */
import auth from '@react-native-firebase/auth';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/Button';
import { lobbyScreenStyles, SettingsScreenStyles as styles } from '../styles/index';
import Spinner from 'react-native-loading-spinner-overlay';

const SettingsScreen: React.FC = () => {
    const { displayName, saveDisplayName } = usePlayer();
    const [nameInput, setNameInput] = useState(displayName ?? '');

    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [loading, setLoading] = useState(false);
    const {firebaseAuth} = usePlayer();
    
    useEffect(() => {
        setNameInput(displayName ?? '');
    }, [displayName]);

    const onSaveName = async () => {
        setLoading(true);
        const trimmed = nameInput.trim();
        if (!trimmed) {
            Alert.alert('Error', 'El nombre no puede estar vacío.');
            return;
        }
        try {
            await saveDisplayName(trimmed);
            setLoading(false);
            Alert.alert('Success', 'Nombre actualizado correctamente.');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'No se pudo actualizar el nombre.');
        }
    };

    const onChangePassword = async () => {
        const user = firebaseAuth.currentUser;
        if (!user || !user.email) {
            Alert.alert('Error', 'No user logged in.');
            return;
        }
        if (!currentPwd || !newPwd || !confirmPwd) {
            Alert.alert('Error', 'Por favor, informa todos los campos.');
            return;
        }
        if (newPwd !== confirmPwd) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }
        try {
            // Reauthenticate
            const credential = auth.EmailAuthProvider.credential(
                user.email,
                currentPwd
            );
            await user.reauthenticateWithCredential(credential);
            // Update password
            await user.updatePassword(newPwd);
            Alert.alert('Success', 'Contraseña actualizada.');
            setCurrentPwd('');
            setNewPwd('');
            setConfirmPwd('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar la contraseña.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* <BackButton textContent={'Back'} /> */}
                {/* Change Display Name */}
                <Text style={styles.sectionTitle}>Cambiar nombre</Text>
                <View style={styles.row}>
                    <Spinner
                        visible={loading}
                        textContent="Guardando..."
                        textStyle={loaderStyles.spinnerText}
                    />
                    <TextInput
                        style={styles.input}
                        value={nameInput}
                        onChangeText={setNameInput}
                        placeholder="Nombre"
                    />
                    {/* <Button
                        title="Save"
                        onPress={onSaveName}
                        style={lobbyScreenStyles.saveButton}
                        textStyle={lobbyScreenStyles.saveButtonText}
                    /> */}
                    <TouchableOpacity style={styles.button2} onPress={onSaveName}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>

                {/* Change Password */}
                <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña actual"
                        value={currentPwd}
                        onChangeText={setCurrentPwd}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva contraseña"
                        value={newPwd}
                        onChangeText={setNewPwd}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirma la nueva contraseña"
                        value={confirmPwd}
                        onChangeText={setConfirmPwd}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={onChangePassword}>
                        <Text style={styles.buttonText}>Cambiar contraseña</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
const loaderStyles = StyleSheet.create({
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