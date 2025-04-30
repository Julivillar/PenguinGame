import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { View, Modal, Button, Text, Alert } from 'react-native';
import GameBoard from '../components/GameBoard';
import type { Card, Player } from '../types/GameTypes';
import { drawCard } from '../services/deckApi';
import { usePlayer } from '../contexts/PlayerContext';
import type { TargetAction } from '../types/GameTypes';
import CardView from '../components/CardView';



const GameScreen: React.FC = () => {
    const { localPlayerId } = usePlayer();
    const deckId = '4ot1z6b3aqgx';

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
            name: 'Ju4',
            health: 19,
            defense: { code: '3C', value: 3, suit: 'CLUBS' },
            age: 28,
            isTurn: false,
        },
    ]);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectingTargetForAction, setSelectingTargetForAction] = useState<TargetAction | null>(null);
    const [attackCard, setAttackCard] = useState<Card[] | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const currentTurnPlayer = players.find(p => p.isTurn);


    const localPlayer = players.find(p => p.id === localPlayerId);
    const isMyTurn = localPlayer?.isTurn;

    const handleDeckPress = () => {
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

    const handleSelectPlayerTarget = async (targetId: string) => {
        try {
            const valueMap: Record<string, number> = {
                JACK: 11,
                QUEEN: 12,
                KING: 13,
                ACE: 1,
            };

            if (selectingTargetForAction === 'CHANGE_DEFENSE') {
                const [newCard] = await drawCard(deckId);
                if (!newCard) throw new Error('No se pudo robar carta');

                const numericValue = valueMap[newCard.value] ?? parseInt(newCard.value);

                const updatedPlayers = players.map(p =>
                    p.id === targetId
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
            }

            if (selectingTargetForAction === 'ATTACK') {
                const target = players.find(p => p.id === targetId);
                const attacker = players.find(p => p.id === localPlayerId);
                if (!target || !attacker) throw new Error('Jugador no encontrado');

                const [newCard] = await drawCard(deckId);
                if (!newCard) throw new Error('No se pudo robar carta de ataque');

                const valueMap: Record<string, number> = {
                    JACK: 11,
                    QUEEN: 12,
                    KING: 13,
                    ACE: 1,
                };

                const newValue = valueMap[newCard.value] ?? parseInt(newCard.value);

                let totalAttack = newValue;
                let hasSaved = false;

                if (attacker.savedCard) {
                    totalAttack += attacker.savedCard.value;
                    hasSaved = true;
                }

                setAttackCard(hasSaved ? [attacker.savedCard!, {
                    code: newCard.code,
                    suit: newCard.suit,
                    value: newValue,
                }] : [{
                    code: newCard.code,
                    suit: newCard.suit,
                    value: newValue,
                }]);


                const defenseValue = target.defense.value;

                if (totalAttack < defenseValue) {
                    Alert.alert(
                        'Ataque fallido',
                        `Tu ataque (${totalAttack}) no supera la defensa (${defenseValue}).`
                    );
                } else {
                    const damage = totalAttack - defenseValue;

                    const [newDefenseCard] = await drawCard(deckId);
                    if (!newDefenseCard) throw new Error('No se pudo robar nueva defensa');

                    const newDefenseValue = valueMap[newDefenseCard.value] ?? parseInt(newDefenseCard.value);

                    const updatedPlayers = players.map(p => {
                        if (p.id === targetId) {
                            return {
                                ...p,
                                health: Math.max(0, p.health - damage),
                                defense: {
                                    code: newDefenseCard.code,
                                    suit: newDefenseCard.suit,
                                    value: newDefenseValue,
                                },
                            };
                        }
                        if (p.id === localPlayerId) {
                            return {
                                ...p,
                                savedCard: undefined, // se elimina la carta guardada tras el ataque
                            };
                        }
                        return p;
                    });

                    Alert.alert(
                        '¡Ataque exitoso!',
                        `Ataque total: ${totalAttack}\nDaño infligido: ${damage}`
                    );

                    setPlayers(updatedPlayers);
                }

                setTimeout(() => {
                    setAttackCard(null);
                }, 3000);

                setSelectingTargetForAction(null);
            }


        } catch (error) {
            Alert.alert('Error', String(error));
        } finally {
            setSelectingTargetForAction(null);
            setTimeout(() => {
                advanceTurn();
            }, 500);

        }
    };

    const handleGuardCard = async () => {
        setModalVisible(false);
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
                        savedCard: {
                            code: newCard.code,
                            suit: newCard.suit,
                            value: numericValue,
                        },
                    }
                    : p
            );

            setPlayers(updatedPlayers);
            Alert.alert('Carta guardada', 'La carta se ha guardado para tu próximo turno.');
        } catch (error) {
            Alert.alert('Error', String(error));
        }
    };

    const advanceTurn = () => {
        const currentIndex = players.findIndex(p => p.isTurn);
        const nextIndex = (currentIndex + 1) % players.length;

        const updated = players.map((p, i) => ({
            ...p,
            isTurn: i === nextIndex,
        }));

        setPlayers(updated);
    };

    useEffect(() => {
        if (currentTurnPlayer) {
            fadeAnim.setValue(0);
            slideAnim.setValue(20); // empieza más abajo

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
            ]).start();

            // Desvanecer después de 2.5 segundos
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }, 2500);
        }
    }, [currentTurnPlayer]);

    useEffect(() => {
        if (!players.some(p => p.isTurn)) {
            const sorted = [...players].sort((a, b) => {
                if (a.health !== b.health) return a.health - b.health;
                if (a.defense.value !== b.defense.value) return a.defense.value - b.defense.value;
                return b.age - a.age;
            });

            const firstPlayerId = sorted[0].id;

            const updated = players.map(p => ({
                ...p,
                isTurn: p.id === firstPlayerId,
            }));

            setPlayers(updated);
        }
    }, []);


    const hasSavedCard = !!localPlayer?.savedCard;

    return (
        <View style={{ flex: 1 }}>
            {players.find(p => p.isTurn) && (
                <Animated.View
                    style={[
                        styles.turnMessageContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Text style={styles.turnMessageText}>
                        Turno de {currentTurnPlayer?.name}
                    </Text>
                </Animated.View>


            )}

            <GameBoard
                players={players}
                onDeckPress={handleDeckPress}
                selectingTargetForAction={selectingTargetForAction}
                onSelectPlayerTarget={handleSelectPlayerTarget}
            />
            {attackCard && (
                <View style={{ alignItems: 'center', marginVertical: 10, flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', marginRight: 8 }}>Carta de ataque:</Text>
                    {attackCard.map((card, index) => (
                        <React.Fragment key={index}>
                            <CardView value={card.value} suit={card.suit} />
                            {index < attackCard.length - 1 && (
                                <Text style={{ fontSize: 20, marginHorizontal: 4 }}>+</Text>
                            )}
                        </React.Fragment>
                    ))}
                </View>
            )}

            {/* Modal con acciones */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        {hasSavedCard ? (
                            <>
                                <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
                                    Tienes una carta guardada. Debes atacar.
                                </Text>
                                <Button title="Atacar (obligatorio)" onPress={handleAttack} />
                            </>
                        ) : (
                            <>
                                <Button title="Cambiar Defensa" onPress={handleChangeDefense} />
                                <Button title="Atacar" onPress={handleAttack} />
                                <Button title="Guardar Carta" onPress={handleGuardCard} />
                            </>
                        )}
                        <Button title="Cancelar" color="red" onPress={closeModal} />

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default GameScreen;
const styles = StyleSheet.create({
    turnMessageContainer: {
        position: 'absolute',
        top: '35%',
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
    },
});
