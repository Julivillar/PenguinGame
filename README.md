# PenguinGame
My project for the end of course

# 🎴 Reglas del Juego: El Pingüino (Español)

## Preparación

- Se utiliza la baraja francesa o "de poker", aunque se puede jugar con la española.
- Participan entre 2 y 4 jugadores.
- Cada jugador recibe una carta, que funcionará como su defensa (o escudo/shield).
- Se genera un número aleatorio entre 18 y 26 para cada jugador, representando sus puntos de vida iniciales.
- Si se está jugando con una baraja física, se sacan 2 cartas. Si la suma no alcanza 18, se descarta la carta más baja y se extrae otra, repitiendo hasta alcanzar al menos 18.
- La partida dura alrededor de 5 minutos, dependiendo de la suerte y la estrategia de los jugadores.

## Cómo jugar

- Es un juego por turnos, “todos contra todos”.
- El objetivo es ser el último jugador que conserve puntos de vida.

### Inicio de partida

- Comienza el jugador con menos puntos de vida.
  - En caso de empate:
    - Empieza el jugador con menor defensa.
    - Si persiste el empate, comienza el jugador de mayor edad.

### Turno del jugador

En su turno, cada jugador roba una carta sin verla y debe elegir una de las siguientes acciones:

1. Cambiar su propia defensa o la de otro jugador.
2. Atacar a otro jugador.
3. Guardar la carta para el siguiente turno.

### Resolución de acciones

#### 1. Cambiar defensa

- Se revela la carta robada.
- La defensa anterior se descarta en el mazo de descartes.
- La nueva carta se coloca como defensa.

#### 2. Atacar

- Se revela la carta robada.
- Si el valor de la carta no supera la defensa del rival, el ataque falla y termina el turno.
- Si el valor de la carta supera o iguala la defensa del rival:
  - **Daño recibido** = Ataque - Defensa.
  - Se descuenta el daño de los puntos de vida del jugador atacado.
  - El jugador atacado roba una nueva carta y la coloca como su nueva defensa.

#### 3. Guardar carta

- Se coloca la carta robada boca abajo, sin revelarla.
- En el siguiente turno, el jugador debe robar otra carta y **atacar obligatoriamente**.
- Se revelan ambas cartas y se suman sus valores para calcular el ataque.
- El ataque se resuelve igual que un ataque normal.

### Consideraciones adicionales

- Si el mazo se agota, se barajan las cartas de la pila de descartes y se forma un nuevo mazo para continuar el juego.

---
# 🎴 Game Rules: The Penguin (English)

## Setup

- The game uses a standard 52-card French deck (poker deck), but it can also be played with a Spanish deck.
- 2 to 4 players can participate.
- Each player draws a card, which becomes their **defense card** (or shield).
- Each player starts with a random number of health points between 18 and 26.
- If using a physical deck, players draw two cards and sum their values. If the total is less than 18, the lower card is discarded and a new one is drawn until the minimum is reached.
- A game lasts around 5 minutes, depending on luck and strategy.

## How to Play

- This is a turn-based, free-for-all game.
- The goal is to be the **last player with health points remaining**.

### Starting the Game

- The player with the fewest health points goes first.
  - In case of a tie:
    - The player with the lower defense starts.
    - If still tied, the oldest player starts.

### Player Turn

Each turn, a player draws a card face-down and must choose one of the following actions:

1. Switch their own shield or another player’s shield.
2. Attack another player.
3. Keep the card for the next turn.

### Action Resolution

#### 1. Switch Shield

- The drawn card is revealed.
- The previous shield is discarded to the discard pile.
- The new card replaces the previous shield.

#### 2. Attack

- The drawn card is revealed.
- If the attack card’s value is less than the opponent’s shield, the attack fails and the turn ends.
- If the attack card’s value is equal to or greater than the shield:
  - **Damage dealt** = Attack value - Defense value.
  - The target player loses that amount of health.
  - The attacked player draws a new card to become their new defense.

#### 3. Keep the Card

- The drawn card is placed face-down, unrevealed.
- On the following turn, the player must draw a second card and **perform a mandatory attack**.
- Both cards are revealed and their values are added to calculate the attack value.
- The attack is resolved as a normal attack.

### Additional Considerations

- If the deck runs out, shuffle the discard pile to form a new deck and continue the game.
