import React from 'react';
import { View, ScrollView, Text, } from 'react-native';
import { ruleScreenStyles as styles } from '../styles/index';

import { BackButton } from '../components/BackButton';

const RulesScreen: React.FC = () => (
    <View style={styles.container}>
        {/* <BackButton textContent={'back'} /> */}
        <ScrollView contentContainerStyle={styles.content}>
            {/* Spanish Rules */}
            <Text style={styles.title}>🎴 Reglas del Juego: El Pingüino</Text>

            <Text style={styles.sectionTitle}>Preparación</Text>
            <Text style={styles.text}>• Se utiliza la baraja francesa o "de poker", aunque se puede jugar con la española.</Text>
            <Text style={styles.text}>• Participan entre 2 y 4 jugadores.</Text>
            <Text style={styles.text}>• Cada jugador recibe una carta, que funcionará como su defensa (o escudo/shield).</Text>
            <Text style={styles.text}>• Se genera un número aleatorio entre 18 y 26 para cada jugador, representando sus puntos de vida iniciales.</Text>
            <Text style={styles.text}>• Si se está jugando con una baraja física, se sacan 2 cartas. Si la suma no alcanza 18, se descarta la carta más baja y se extrae otra, repitiendo hasta alcanzar al menos 18.</Text>
            <Text style={styles.text}>• La partida dura alrededor de 5 minutos, dependiendo de la suerte y la estrategia de los jugadores.</Text>

            <Text style={styles.sectionTitle}>Cómo jugar</Text>
            <Text style={styles.text}>• Es un juego por turnos, “todos contra todos”.</Text>
            <Text style={styles.text}>• El objetivo es ser el último jugador que conserve puntos de vida.</Text>

            <Text style={styles.subTitle}>Inicio de partida</Text>
            <Text style={styles.text}>1. Comienza el jugador con menos puntos de vida.</Text>
            <Text style={styles.text}>   • En caso de empate:</Text>
            <Text style={styles.text}>     – Empieza el jugador con menor defensa.</Text>
            <Text style={styles.text}>     – Si persiste el empate, comienza el jugador de mayor edad.</Text>

            <Text style={styles.subTitle}>Turno del jugador</Text>
            <Text style={styles.text}>En su turno, cada jugador roba una carta sin verla y debe elegir una de las siguientes acciones:</Text>
            <Text style={styles.text}>1. Cambiar su propia defensa o la de otro jugador.</Text>
            <Text style={styles.text}>2. Atacar a otro jugador.</Text>
            <Text style={styles.text}>3. Guardar la carta para el siguiente turno.</Text>

            <Text style={styles.subTitle}>Resolución de acciones</Text>
            <Text style={styles.text}>1. <Text style={styles.bold}>Cambiar defensa</Text></Text>
            <Text style={styles.text}>   • Se revela la carta robada.</Text>
            <Text style={styles.text}>   • La defensa anterior se descarta en el mazo de descartes.</Text>
            <Text style={styles.text}>   • La nueva carta se coloca como defensa.</Text>

            <Text style={styles.text}>2. <Text style={styles.bold}>Atacar</Text></Text>
            <Text style={styles.text}>   • Se revela la carta robada.</Text>
            <Text style={styles.text}>   • Si el valor de la carta no supera la defensa del rival, el ataque falla y termina el turno.</Text>
            <Text style={styles.text}>   • Si el valor de la carta supera o iguala la defensa del rival:</Text>
            <Text style={styles.text}>     – <Text style={styles.bold}>Daño recibido</Text> = Ataque - Defensa.</Text>
            <Text style={styles.text}>     – Se descuenta el daño de los puntos de vida del jugador atacado.</Text>
            <Text style={styles.text}>     – El jugador atacado roba una nueva carta y la coloca como su nueva defensa.</Text>

            <Text style={styles.text}>3. <Text style={styles.bold}>Guardar carta</Text></Text>
            <Text style={styles.text}>   • Se coloca la carta robada boca abajo, sin revelarla.</Text>
            <Text style={styles.text}>   • En el siguiente turno, el jugador debe robar otra carta y <Text style={styles.bold}>atacar obligatoriamente</Text>.</Text>
            <Text style={styles.text}>   • Se revelan ambas cartas y se suman sus valores para calcular el ataque.</Text>
            <Text style={styles.text}>   • El ataque se resuelve igual que un ataque normal.</Text>

            <Text style={styles.sectionTitle}>Consideraciones adicionales</Text>
            <Text style={styles.text}>• Si el mazo se agota, se barajan las cartas de la pila de descartes y se forma un nuevo mazo para continuar el juego.</Text>

            <View style={styles.divider} />

            {/* English Rules */}
            <Text style={styles.title}>🎴 Game Rules: The Penguin</Text>

            <Text style={styles.sectionTitle}>Setup</Text>
            <Text style={styles.text}>• The game uses a standard 52-card French deck (poker deck), but it can also be played with a Spanish deck.</Text>
            <Text style={styles.text}>• 2 to 4 players can participate.</Text>
            <Text style={styles.text}>• Each player draws a card, which becomes their <Text style={styles.bold}>defense card</Text> (or shield).</Text>
            <Text style={styles.text}>• Each player starts with a random number of health points between 18 and 26.</Text>
            <Text style={styles.text}>• If using a physical deck, players draw two cards and sum their values. If the total is less than 18, the lower card is discarded and a new one is drawn until the minimum is reached.</Text>
            <Text style={styles.text}>• A game lasts around 5 minutes, depending on luck and strategy.</Text>

            <Text style={styles.sectionTitle}>How to Play</Text>
            <Text style={styles.text}>• This is a turn-based, free-for-all game.</Text>
            <Text style={styles.text}>• The goal is to be the <Text style={styles.bold}>last player with health points remaining</Text>.</Text>

            <Text style={styles.subTitle}>Starting the Game</Text>
            <Text style={styles.text}>1. The player with the fewest health points goes first.</Text>
            <Text style={styles.text}>   • In case of a tie:</Text>
            <Text style={styles.text}>     – The player with the lower defense starts.</Text>
            <Text style={styles.text}>     – If still tied, the oldest player starts.</Text>

            <Text style={styles.subTitle}>Player Turn</Text>
            <Text style={styles.text}>Each turn, a player draws a card face-down and must choose one of the following actions:</Text>
            <Text style={styles.text}>1. Switch their own shield or another player’s shield.</Text>
            <Text style={styles.text}>2. Attack another player.</Text>
            <Text style={styles.text}>3. Keep the card for the next turn.</Text>

            <Text style={styles.subTitle}>Action Resolution</Text>
            <Text style={styles.text}>1. <Text style={styles.bold}>Switch Shield</Text></Text>
            <Text style={styles.text}>   • The drawn card is revealed.</Text>
            <Text style={styles.text}>   • The previous shield is discarded to the discard pile.</Text>
            <Text style={styles.text}>   • The new card replaces the previous shield.</Text>

            <Text style={styles.text}>2. <Text style={styles.bold}>Attack</Text></Text>
            <Text style={styles.text}>   • The drawn card is revealed.</Text>
            <Text style={styles.text}>   • If the attack card’s value is less than the opponent’s shield, the attack fails and the turn ends.</Text>
            <Text style={styles.text}>   • If the attack card’s value is equal to or greater than the shield:</Text>
            <Text style={styles.text}>     – <Text style={styles.bold}>Damage dealt</Text> = Attack value - Defense value.</Text>
            <Text style={styles.text}>     – The target player loses that amount of health.</Text>
            <Text style={styles.text}>     – The attacked player draws a new card to become their new defense.</Text>

            <Text style={styles.text}>3. <Text style={styles.bold}>Keep the Card</Text></Text>
            <Text style={styles.text}>   • The drawn card is placed face-down, unrevealed.</Text>
            <Text style={styles.text}>   • On the following turn, the player must draw a second card and <Text style={styles.bold}>perform a mandatory attack</Text>.</Text>
            <Text style={styles.text}>   • Both cards are revealed and their values are added to calculate the attack value.</Text>
            <Text style={styles.text}>   • The attack is resolved as a normal attack.</Text>

            <Text style={styles.sectionTitle}>Additional Considerations</Text>
            <Text style={styles.text}>• If the deck runs out, shuffle the discard pile to form a new deck and continue the game.</Text>
        </ScrollView>
    </View>
);

export default RulesScreen;

