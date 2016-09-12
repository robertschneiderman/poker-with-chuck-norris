Texas hold 'em (also known as Texas holdem, hold 'em, and holdem) is a variation of the card game of poker. Two cards, known as the hole cards or hold cards, are dealt face down to each player, and then five community cards are dealt face up in three stages. The stages consist of a series of three cards ("the flop"), later an additional single card ("the turn" or "fourth street") and a final card ("the river" or "fifth street"). Each player seeks the best five card poker hand from the combination of the community cards and their own hole cards. If a player's best five card poker hand consists only of the five community cards and none of the player's hole cards, it is called "playing the board". Players have betting options to check, call, raise or fold. Rounds of betting take place before the flop is dealt, and after each subsequent deal (https://en.wikipedia.org/wiki/Texas_hold_%27em).

![wireframes](https://github.com/robertschneiderman/texas-holdem-poker/images.png)


### Functionality & MVP  

With this Texas Holdem simulator, users will be able to:

- [ ] Get dealt cards from a virtual dealer
- [ ] Bet chips based on the perceived value of their hand
- [ ] Use other poker actions such as call, check, and raise

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and game logic,
- `Easel.js` with `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be three scripts involved in this project:

I will use velocity.js for animations and the greedy make change method in my logic.


### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `Easel.js` installed.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 3 scripts outlined above.  Learn the basics of `Easel.js`.  Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `Easel.js` to render an object to the `Canvas` element

**Day 2**: Begin on the game's coding logic. There will be a lot of math algorythms in the project. Get started on coding those out.

**Day 3**: Create a graphical interface that looks nice and inviting. The game itself should be more than just operate, but should also look professional.

**Day 4**: Make sure that everything in the site operated the way you want. Some bonus features include making the AI logic better, and multiplayer.