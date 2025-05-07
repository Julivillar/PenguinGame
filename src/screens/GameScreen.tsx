import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    Button,
    StyleSheet,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import GameBoard from '../components/GameBoard';
import { drawCard } from '../services/deckApi';
import type { Player, Card, TargetAction } from '../types/GameTypes';
import { usePlayer } from '../contexts/PlayerContext';
import CardView from '../components/CardView';
import { cardValueToNumber } from '../utils/cardUtils';

const GameScreen: React.FC = () => {
    const deckId = '4ot1z6b3aqgx';
    const { localPlayerId } = usePlayer();
    const [players, setPlayers] = useState<Player[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectingTargetForAction, setSelectingTargetForAction] = useState<TargetAction | null>(null);
    const [attackCard, setAttackCard] = useState<Card[] | null>(null);
    const [winner, setWinner] = useState<Player | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const devMode = true; // Cambia a false cuando uses Firebase


    const localPlayer = players.find(p => p.id === localPlayerId);
    //const isMyTurn = localPlayer?.isTurn;
    const isMyTurn = true;
    //const mustAttack = isMyTurn && !!localPlayer?.savedCard;

    const currentTurnPlayer = players.find(p => p.isTurn);
    const mustAttack = devMode
        ? !!currentTurnPlayer?.savedCard
        : currentTurnPlayer?.id === localPlayerId && !!currentTurnPlayer?.savedCard;


    const initPlayers = async (deckId: string) => {
        if (winner != null) setWinner(null);
        const basePlayers = [
            { id: '1', name: 'Julian', age: 28 },
            { id: '2', name: 'Malu', age: 28 },
            { id: '3', name: 'Ana', age: 24 },
            { id: '4', name: 'Adrian', age: 31 },
        ];

        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${basePlayers.length}`);
        const data = await response.json();
        const drawnCards = data.cards;

        const initializedPlayers = basePlayers.map((p, i) => {
            const rawCard = drawnCards[i];
            const numericValue = cardValueToNumber(rawCard.value);

            return {
                ...p,
                health: Math.floor(Math.random() * (26 - 18 + 1)) + 18,
                //health: 1,
                defense: {
                    code: rawCard.code,
                    suit: rawCard.suit,
                    value: numericValue,
                },
                savedCard: undefined,
                isTurn: i == 0,
            };
        });
        //console.log("Jugadores inicializados:", initializedPlayers);

        setPlayers(initializedPlayers);
    };

    const advanceTurn = () => {
        setPlayers(prevPlayers => {
            const currentIndex = prevPlayers.findIndex(p => p.isTurn);
            let nextIndex = currentIndex;
            const totalPlayers = prevPlayers.length;
            let attempts = 0;

            do {
                nextIndex = (nextIndex + 1) % totalPlayers;
                attempts++;
            } while (prevPlayers[nextIndex].health <= 0 && attempts < totalPlayers);

            return prevPlayers.map((p, i) => ({
                ...p,
                isTurn: i === nextIndex,
            }));
        });
    };


    const handleDeckPress = () => {
        if (isMyTurn) {
            setModalVisible(true);
        }
    };

    const closeModal = () => setModalVisible(false);

    const handleChangeDefense = async () => {
        setModalVisible(false);
        setSelectingTargetForAction('CHANGE_DEFENSE');
    };

    const handleAttack = () => {
        setModalVisible(false);
        setSelectingTargetForAction('ATTACK');
    };

    const handleGuardCard = async () => {
        setModalVisible(false);
        try {
            const [newCard] = await drawCard(deckId);
            if (!newCard) throw new Error('No se pudo robar carta');

            const numericValue = cardValueToNumber(newCard.value);

            const updatedPlayers = players.map(p =>
                /* p.id === localPlayerId */
                p.isTurn
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
            Alert.alert('Carta guardada', 'Se usará en tu próximo turno.');
        } catch (error) {
            Alert.alert('Error', String(error));
        } finally {
            setTimeout(() => {
                advanceTurn();
            }, 500);
        }
    };

    const handleSelectPlayerTarget = async (targetId: string) => {
        try {
            if (selectingTargetForAction === 'CHANGE_DEFENSE') {
                const [newCard] = await drawCard(deckId);
                if (!newCard) throw new Error('No se pudo robar carta');

                const numericValue = cardValueToNumber(newCard.value);

                const updatedPlayers = players.map(p => {
                    if (p.id === targetId) {
                        return {
                            ...p,
                            defense: {
                                code: newCard.code,
                                suit: newCard.suit,
                                value: cardValueToNumber(newCard.value),
                            },
                        };
                    }
                    return p;
                });
                console.log("🆕 Defensa para", targetId, newCard.code);
                console.log("Antes:", players.find(p => p.id === targetId)?.defense);
                console.log("Después:", updatedPlayers.find(p => p.id === targetId)?.defense);

                setPlayers(updatedPlayers);

            }

            if (selectingTargetForAction === 'ATTACK') {
                const target = players.find(p => p.id === targetId);
                const attacker = players.find(p => p.isTurn);

                if (!target || !attacker) throw new Error('Jugador no encontrado');

                const [newCard] = await drawCard(deckId);
                if (!newCard) throw new Error('No se pudo robar carta de ataque');

                const newValue = cardValueToNumber(newCard.value);

                let totalAttack = newValue;
                let hasSaved = false;

                if (attacker.savedCard) {
                    totalAttack += attacker.savedCard.value;
                    hasSaved = true;
                }

                setAttackCard(
                    hasSaved
                        ? [attacker.savedCard!, { code: newCard.code, suit: newCard.suit, value: newValue }]
                        : [{ code: newCard.code, suit: newCard.suit, value: newValue }]
                );

                const defenseValue = target.defense.value;

                if (totalAttack < defenseValue) {
                    Alert.alert(
                        'Ataque fallido',
                        `Tu ataque (${totalAttack}) no supera la defensa (${defenseValue}).`
                    );

                    // ❗️Descartar la carta guardada igualmente
                    const updatedPlayers = players.map(p =>
                        p.isTurn
                            ? { ...p, savedCard: undefined }
                            : p
                    );

                    setPlayers(updatedPlayers);
                } else {
                    const damage = totalAttack - defenseValue;

                    const [newDefenseCard] = await drawCard(deckId);
                    if (!newDefenseCard) throw new Error('No se pudo robar nueva defensa');

                    const newDefenseValue = cardValueToNumber(newDefenseCard.value);

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

                        if (p.isTurn) {
                            return {
                                ...p,
                                savedCard: undefined,
                            };
                        }

                        return p;
                    });

                    Alert.alert('¡Ataque exitoso!', `Ataque total: ${totalAttack}\nDaño infligido: ${damage}`);
                    setPlayers(updatedPlayers);
                }

                setTimeout(() => {
                    setAttackCard(null);
                }, 3000);
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

    useEffect(() => {
        if (!players.some(p => p.isTurn) && players.length > 0) {
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
    }, [players]);


    /* useEffect(() => {
        if (players.length === 0) {
          initPlayers(deckId);
        }
      }, [players, deckId]);
       */
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            initPlayers(deckId).then(() => setInitialized(true));
        }
    }, [initialized, deckId]);


    useEffect(() => {
        if (currentTurnPlayer) {
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
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
            ]).start();

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
        const alive = players.filter(p => p.health > 0);
        if (alive.length === 1) {
            setWinner(alive[0]);
        }
    }, [players]);

    return (
        <View style={{ flex: 1 }}>
            {currentTurnPlayer && (
                <Animated.View
                    style={[
                        styles.turnMessageContainer,
                        /* {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }, */
                    ]}
                >
                    <Text style={styles.turnMessageText}>
                        Turno de {currentTurnPlayer.name}
                    </Text>
                </Animated.View>
            )}



            <GameBoard
                players={players}
                onDeckPress={handleDeckPress}
                selectingTargetForAction={selectingTargetForAction}
                onSelectPlayerTarget={handleSelectPlayerTarget}
            />
            {winner && (
                <View style={styles.victoryContainer}>
                    <Text style={styles.victoryText}>🏆 {winner.name} ha ganado la partida</Text>
                    <Button title="Reiniciar partida" onPress={() => initPlayers(deckId)} />
                </View>
            )}

            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                            {mustAttack ? 'Debes atacar con tu carta guardada' : '¿Qué quieres hacer?'}
                        </Text>
                        {mustAttack ? (
                            <Button title="Atacar (obligatorio)" onPress={handleAttack} />
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
    }, victoryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    victoryText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4caf50',
        marginBottom: 10,
    },

});