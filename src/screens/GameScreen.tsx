import React, { useState } from 'react';
import { View, Modal, Button, Text, Alert } from 'react-native';
import GameBoard from '../components/GameBoard';
import type { Player } from '../types/GameTypes';
import { drawCard } from '../services/deckApi';
import { usePlayer } from '../contexts/PlayerContext';

const GameScreen: React.FC = () => {
    const { localPlayerId } = usePlayer();
    const [isModalVisible, setModalVisible] = useState(false);
    const [players, setPlayers] = useState<Player[]>([
        {
            id: '1',
            name: 'Jugador 1',
            health: 22,
            defense: { code: '5H', value: 5, suit: 'HEARTS' },
            age: 25,
            isTurn: true,
        },
        {
            id: '2',
            name: 'Jugador 2',
            health: 20,
            defense: { code: '9S', value: 9, suit: 'SPADES' },
            age: 22,
            isTurn: false,
        },
        {
            id: '3',
            name: 'Jugador 3',
            health: 19,
            defense: { code: '3C', value: 3, suit: 'CLUBS' },
            age: 28,
            isTurn: false,
        },
        {
            id: '4',
            name: 'Jugad4',
            health: 24,
            defense: { code: '3C', value: 3, suit: 'CLUBS' },
            age: 28,
            isTurn: false,
        },
    ]);

    const deckId = '4ot1z6b3aqgx';

    const localPlayer = players.find(p => p.id === localPlayerId);
    const isMyTurn = localPlayer?.isTurn;

    const handleDeckPress = () => {
        if (isMyTurn) setModalVisible(true);
    };

    const closeModal = () => setModalVisible(false);

    const handleChangeDefense = async () => {
        try {
            const [newCard] = await drawCard(deckId);

            if (!newCard) throw new Error('No se pudo robar carta');

            const valueMap: Record<string, number> = {
                JACK: 11,
                QUEEN: 12,
                KING: 13,
                ACE: 1,
            };

            const numericValue = valueMap[newCard.value] ?? parseInt(newCard.value);

            const updatedPlayers = players.map(p =>
                p.id === localPlayerId
                    ? {
                        ...p,
                        defense: {
                            code: newCard.code,
                            suit: newCard.suit,
                            value: numericValue,
                        },
                    }
                    : p
            );

            setPlayers(updatedPlayers);
        } catch (error) {
            Alert.alert('Error al cambiar defensa', String(error));
        } finally {
            closeModal();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <GameBoard players={players} onDeckPress={handleDeckPress} />

            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>¿Qué quieres hacer?</Text>
                        <Button title="Cambiar Defensa" onPress={handleChangeDefense} />
                        <Button title="Atacar" onPress={closeModal} />
                        <Button title="Guardar Carta" onPress={closeModal} />
                        <Button title="Cancelar" color="red" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default GameScreen;
