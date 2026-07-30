import { reactive, ref } from 'vue';
import { create36Deck, shuffleDeck, getCardPoints } from '../types/game.js';
import { sounds } from '../utils/audio.js';
import confetti from 'canvas-confetti';

export const gameState = reactive({
  roundNumber: 1,
  gameStatus: 'IDLE', // 'IDLE', 'PLAYING', 'ROUND_END', 'GAME_OVER'
  activePlayer: 'human', // 'human' | 'ai'
  lastWinner: null, // 'human' | 'ai' | null
  
  // Players
  players: {
    human: { name: 'Player (You)', score: 0, hand: [], roundScore: 0 },
    ai: { name: 'AI Opponent', score: 0, hand: [], roundScore: 0 }
  },

  // Table Piles
  stockDeck: [],
  discardPile: [],
  activeSuit: null, // '♠', '♣', '♦', '♥'
  
  // Special states
  mustCover8: false,
  pendingQueenCard: null,
  showSuitPicker: false,
  showNameModal: false,
  
  // Game Over & Round Summary
  matchWinner: null,
  matchLoser: null,
  roundEndDetails: null,
  
  // Action Logs
  logs: [],
  bannerMessage: ''
});

export function savePlayerName(name) {
  const trimmed = (name || '').trim();
  const validRegex = /^[a-zA-Z0-9 _-]+$/;
  if (!trimmed || trimmed.length > 20 || !validRegex.test(trimmed)) {
    return false;
  }
  gameState.players.human.name = trimmed;
  try {
    localStorage.setItem('101_player_name', trimmed);
  } catch (e) {}
  gameState.showNameModal = false;
  
  // Start first round of the match once name is submitted
  startRound();
  return true;
}

export function logEvent(text, type = 'info') {
  gameState.logs.unshift({
    id: Date.now() + Math.random(),
    text,
    type,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
  if (gameState.logs.length > 50) gameState.logs.pop();
}

export function setBanner(msg, duration = 3000) {
  gameState.bannerMessage = msg;
  if (duration > 0) {
    setTimeout(() => {
      if (gameState.bannerMessage === msg) {
        gameState.bannerMessage = '';
      }
    }, duration);
  }
}

// Recycle discard pile when stock is empty (WITHOUT reshuffling!)
export function recycleStockDeck() {
  if (gameState.discardPile.length <= 1) return false;
  
  const topCard = gameState.discardPile.pop();
  // Take all cards below topCard, flip them back into stock WITHOUT reshuffling
  const recycled = gameState.discardPile.splice(0, gameState.discardPile.length);
  gameState.stockDeck = recycled;
  gameState.discardPile.push(topCard);
  
  logEvent('Stock deck exhausted! Discard pile flipped back into stock (without reshuffling).', 'warning');
  setBanner('♻️ Stock deck recycled (unshuffled)!', 2500);
  return true;
}

export function drawCardForPlayer(playerKey) {
  if (gameState.stockDeck.length === 0) {
    const success = recycleStockDeck();
    if (!success) {
      logEvent('No cards remaining in stock deck or discard pile!', 'warning');
      return null;
    }
  }
  
  const card = gameState.stockDeck.pop();
  gameState.players[playerKey].hand.push(card);
  sounds.drawCard();
  return card;
}

export function initGame() {
  gameState.roundNumber = 1;
  gameState.players.human.score = 0;
  gameState.players.ai.score = 0;
  gameState.lastWinner = null;
  gameState.matchWinner = null;
  gameState.matchLoser = null;
  gameState.logs = [];
  
  try {
    const savedName = localStorage.getItem('101_player_name');
    if (savedName && savedName.trim()) {
      gameState.players.human.name = savedName.trim();
    }
  } catch (e) {}

  // Prompt for player name every time a new game starts!
  gameState.showNameModal = true;
}

export function startRound() {
  gameState.gameStatus = 'PLAYING';
  gameState.players.human.hand = [];
  gameState.players.ai.hand = [];
  gameState.players.human.roundScore = 0;
  gameState.players.ai.roundScore = 0;
  gameState.discardPile = [];
  gameState.mustCover8 = false;
  gameState.pendingQueenCard = null;
  gameState.showSuitPicker = false;
  
  // 1. Create and shuffle 36 deck
  const deck = shuffleDeck(create36Deck());
  gameState.stockDeck = deck;
  logEvent(`🔀 Fresh 36-card deck reshuffled for Round ${gameState.roundNumber}`, 'system');
  
  // 2. Determine starter
  if (gameState.roundNumber === 1 || !gameState.lastWinner) {
    gameState.activePlayer = Math.random() < 0.5 ? 'human' : 'ai';
  } else {
    gameState.activePlayer = gameState.lastWinner;
  }
  
  const starterName = gameState.players[gameState.activePlayer].name;
  logEvent(`--- Round ${gameState.roundNumber} Started ---`, 'system');
  logEvent(`${starterName} wins starting turn and goes first.`, 'info');
  
  // 3. Deal 5 cards each
  for (let i = 0; i < 5; i++) {
    drawCardForPlayer('human');
    drawCardForPlayer('ai');
  }
  
  // 4. Starting player plays their 5th dealt card BLINDLY onto the table
  const starterKey = gameState.activePlayer;
  const opponentKey = starterKey === 'human' ? 'ai' : 'human';
  const starterHand = gameState.players[starterKey].hand;
  const blindCard = starterHand.pop(); // 5th card played blindly
  
  gameState.discardPile.push(blindCard);
  gameState.activeSuit = blindCard.suit;
  
  logEvent(
    `${starterName} plays 5th dealt card blindly to open table: [${blindCard.suit} ${blindCard.rank}]`,
    'action'
  );

  // Evaluate opening blind card effects
  if (blindCard.rank === '8') {
    gameState.mustCover8 = true;
    logEvent(`🌀 Opening 8! ${starterName} must cover the opening 8 card!`, 'warning');
    setBanner(`Round ${gameState.roundNumber}: ${starterName} plays blind [8] & must cover it!`, 3500);
    if (starterKey === 'ai') setTimeout(processAiTurn, 1200);
  } else if (blindCard.rank === '6') {
    sounds.specialAction();
    logEvent(`⚡ Opening 6! Opponent draws 1 card & skips turn.`, 'special');
    setBanner(`Round ${gameState.roundNumber}: Opening 6! Opponent draws 1 & skips!`, 3500);
    drawCardForPlayer(opponentKey);
    if (starterKey === 'ai') setTimeout(processAiTurn, 1200);
  } else if (blindCard.rank === '7') {
    sounds.specialAction();
    logEvent(`🔥 Opening 7! Opponent draws 2 cards & skips turn.`, 'special');
    setBanner(`Round ${gameState.roundNumber}: Opening 7! Opponent draws 2 & skips!`, 3500);
    drawCardForPlayer(opponentKey);
    drawCardForPlayer(opponentKey);
    if (starterKey === 'ai') setTimeout(processAiTurn, 1200);
  } else if (blindCard.rank === 'K' && blindCard.suit === '♠') {
    sounds.specialAction();
    logEvent(`👑♠ Opening King of Spades! Opponent draws 4 cards & skips turn.`, 'special');
    setBanner(`Round ${gameState.roundNumber}: Opening King of Spades! Opponent draws 4 & skips!`, 3500);
    for (let i = 0; i < 4; i++) drawCardForPlayer(opponentKey);
    if (starterKey === 'ai') setTimeout(processAiTurn, 1200);
  } else if (blindCard.rank === 'A') {
    sounds.specialAction();
    logEvent(`🚫 Opening Ace! Opponent skips turn.`, 'special');
    setBanner(`Round ${gameState.roundNumber}: Opening Ace! Opponent skips turn!`, 3500);
    if (starterKey === 'ai') setTimeout(processAiTurn, 1200);
  } else if (blindCard.rank === 'Q') {
    // Queen opening card: Active suit set, turn passes to opponent
    logEvent(`👑 Opening Queen! Active suit set to ${blindCard.suit}. Turn passes to opponent.`, 'special');
    setBanner(`Round ${gameState.roundNumber}: Opening Queen [${blindCard.suit}]. Turn to ${gameState.players[opponentKey].name}`, 3500);
    switchTurn(opponentKey);
  } else {
    // Simple (non-special) card: Turn immediately passes to opponent!
    logEvent(`Simple card [${blindCard.suit} ${blindCard.rank}] opened. Turn passes to opponent.`, 'info');
    setBanner(`Round ${gameState.roundNumber}: Opening card [${blindCard.suit} ${blindCard.rank}]. Turn to ${gameState.players[opponentKey].name}`, 3500);
    switchTurn(opponentKey);
  }
}

export function isCardPlayable(card) {
  if (gameState.gameStatus !== 'PLAYING') return false;
  
  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  if (!topCard) return true;

  // 8 Must cover rule: Next card must match active suit, rank 8, or ANY Queen (wild)!
  if (gameState.mustCover8) {
    return card.suit === gameState.activeSuit || card.rank === '8' || card.rank === 'Q';
  }

  // Queen is always wild
  if (card.rank === 'Q') return true;

  // Match by suit or rank
  return card.suit === gameState.activeSuit || card.rank === topCard.rank;
}

export function playHumanCard(cardIndex) {
  if (gameState.activePlayer !== 'human' || gameState.gameStatus !== 'PLAYING') return;
  
  const player = gameState.players.human;
  const card = player.hand[cardIndex];
  
  if (!isCardPlayable(card)) {
    setBanner('❌ Invalid card play! Must match active suit, rank, or play a Queen.', 2000);
    return;
  }

  // Remove card from hand
  player.hand.splice(cardIndex, 1);
  executeCardPlay('human', card);
}

export function executeCardPlay(playerKey, card) {
  const opponentKey = playerKey === 'human' ? 'ai' : 'human';
  const playerName = gameState.players[playerKey].name;
  const opponentName = gameState.players[opponentKey].name;

  gameState.discardPile.push(card);
  gameState.activeSuit = card.suit;
  sounds.playCard();

  logEvent(`${playerName} plays [${card.suit} ${card.rank}]`, 'action');

  // Clear mustCover8 flag if this move covered an 8
  if (gameState.mustCover8) {
    gameState.mustCover8 = false;
  }

  // Check Round Win condition (Hand empty!)
  if (gameState.players[playerKey].hand.length === 0) {
    handleRoundEnd(playerKey, card);
    return;
  }

  // Handle Special Cards
  if (card.rank === 'Q') {
    sounds.queenWild();
    if (playerKey === 'human') {
      gameState.pendingQueenCard = card;
      gameState.showSuitPicker = true;
      setBanner('👑 Queen played! Select new active suit.', 0);
      return; // Turn waits for suit selection modal
    } else {
      // AI chooses best suit from remaining hand
      const chosenSuit = chooseBestAiSuit();
      gameState.activeSuit = chosenSuit;
      logEvent(`AI selects active suit: ${chosenSuit}`, 'special');
      setBanner(`👑 AI played Queen! New active suit is ${chosenSuit}`, 3000);
      // AI played Queen; turn passes to opponent
      switchTurn(opponentKey);
      return;
    }
  }

  if (card.rank === '6') {
    sounds.specialAction();
    logEvent(`⚡ 6 Played! ${opponentName} draws 1 card & skips turn.`, 'special');
    setBanner(`⚡ 6 Played! ${opponentName} draws 1 & skips turn!`, 3000);
    drawCardForPlayer(opponentKey);
    // Active player keeps turn (opponent skipped)!
    checkTurnAfterSpecial(playerKey);
    return;
  }

  if (card.rank === '7') {
    sounds.specialAction();
    logEvent(`🔥 7 Played! ${opponentName} draws 2 cards & skips turn.`, 'special');
    setBanner(`🔥 7 Played! ${opponentName} draws 2 & skips turn!`, 3000);
    drawCardForPlayer(opponentKey);
    drawCardForPlayer(opponentKey);
    checkTurnAfterSpecial(playerKey);
    return;
  }

  if (card.rank === 'K' && card.suit === '♠') {
    sounds.specialAction();
    logEvent(`👑♠ King of Spades Played! ${opponentName} draws 4 cards & skips turn.`, 'special');
    setBanner(`👑♠ King of Spades! ${opponentName} draws 4 & skips turn!`, 3000);
    for (let i = 0; i < 4; i++) {
      drawCardForPlayer(opponentKey);
    }
    checkTurnAfterSpecial(playerKey);
    return;
  }

  if (card.rank === 'A') {
    sounds.specialAction();
    logEvent(`🚫 Ace Played! ${opponentName} skips turn.`, 'special');
    setBanner(`🚫 Ace Played! ${opponentName} skips turn!`, 3000);
    checkTurnAfterSpecial(playerKey);
    return;
  }

  if (card.rank === '8') {
    sounds.specialAction();
    gameState.mustCover8 = true;
    logEvent(`🌀 8 Played! ${playerName} must cover immediately with same suit/rank.`, 'special');
    setBanner(`🌀 8 Played! Cover with same suit/rank!`, 3000);
    // Player keeps turn to cover the 8!
    checkTurnAfterSpecial(playerKey);
    return;
  }

  // Normal card: turn passes to opponent
  switchTurn(opponentKey);
}

export function selectQueenSuit(suitSymbol) {
  gameState.activeSuit = suitSymbol;
  gameState.showSuitPicker = false;
  gameState.pendingQueenCard = null;

  logEvent(`You selected active suit: ${suitSymbol}`, 'special');
  setBanner(`Active suit set to ${suitSymbol}`, 2500);

  // Turn passes to opponent after Queen suit selection
  switchTurn('ai');
}

function checkTurnAfterSpecial(currentPlayerKey) {
  // If player still has turn (e.g. 8 cover or opponent skip)
  if (gameState.activePlayer === 'human') {
    // Check if human has playable card to cover 8 or make next move
    const hasPlayable = gameState.players.human.hand.some(isCardPlayable);
    if (gameState.mustCover8 && !hasPlayable) {
      logEvent('You have no card to cover 8. Draw a card!', 'warning');
    }
  } else {
    // AI turn continues or AI processes move
    setTimeout(processAiTurn, 1000);
  }
}

export function switchTurn(nextPlayerKey) {
  gameState.activePlayer = nextPlayerKey;
  if (nextPlayerKey === 'ai' && gameState.gameStatus === 'PLAYING') {
    setTimeout(processAiTurn, 1000);
  }
}

export function humanDrawCard() {
  if (gameState.activePlayer !== 'human' || gameState.gameStatus !== 'PLAYING') return;

  const drawn = drawCardForPlayer('human');
  if (!drawn) return;

  logEvent(`You drew [${drawn.suit} ${drawn.rank}] from stock deck.`, 'info');

  if (isCardPlayable(drawn)) {
    setBanner(`You drew [${drawn.suit} ${drawn.rank}]. You can play it now!`, 3000);
  } else {
    if (gameState.mustCover8) {
      // Must keep drawing until an 8-covering card is found!
      setBanner(`You drew [${drawn.suit} ${drawn.rank}] (cannot cover 8). Draw again!`, 3000);
      logEvent('Drawn card cannot cover 8. Must keep drawing!', 'warning');
    } else {
      setBanner(`You drew [${drawn.suit} ${drawn.rank}] (unplayable). Turn passed to AI.`, 3000);
      switchTurn('ai');
    }
  }
}

// AI Strategy Logic
export function processAiTurn() {
  if (gameState.gameStatus !== 'PLAYING' || gameState.activePlayer !== 'ai') return;

  const aiHand = gameState.players.ai.hand;
  const playableIndices = [];

  for (let i = 0; i < aiHand.length; i++) {
    if (isCardPlayable(aiHand[i])) {
      playableIndices.push(i);
    }
  }

  if (playableIndices.length > 0) {
    // AI Decision Priority: Special Cards > Matching Rank/Suit > Queens
    let chosenIndex = playableIndices[0];
    
    // Pick highest value or special card
    for (const idx of playableIndices) {
      const card = aiHand[idx];
      if (card.rank === 'K' && card.suit === '♠') { chosenIndex = idx; break; }
      if (['7', '6', 'A', '8'].includes(card.rank)) { chosenIndex = idx; break; }
    }

    const card = aiHand.splice(chosenIndex, 1)[0];
    executeCardPlay('ai', card);
  } else {
    // AI has no playable card in hand
    if (gameState.mustCover8) {
      logEvent('AI must cover 8! Drawing cards from stock deck until a covering card is found...', 'warning');
      let foundCover = false;
      let safetyCounter = 0;
      
      while (!foundCover && safetyCounter < 36) {
        safetyCounter++;
        const drawn = drawCardForPlayer('ai');
        if (!drawn) break;
        
        logEvent(`AI drew [${drawn.suit} ${drawn.rank}] to cover 8...`, 'info');
        if (isCardPlayable(drawn)) {
          foundCover = true;
          logEvent(`AI found covering card [${drawn.suit} ${drawn.rank}] and plays it!`, 'action');
          const idx = aiHand.indexOf(drawn);
          if (idx !== -1) aiHand.splice(idx, 1);
          executeCardPlay('ai', drawn);
          return;
        }
      }
    } else {
      // Normal draw
      logEvent('AI has no playable card and draws from stock deck...', 'info');
      const drawn = drawCardForPlayer('ai');

      if (drawn && isCardPlayable(drawn)) {
        logEvent(`AI drew [${drawn.suit} ${drawn.rank}] and plays it!`, 'action');
        const idx = aiHand.indexOf(drawn);
        if (idx !== -1) aiHand.splice(idx, 1);
        executeCardPlay('ai', drawn);
      } else {
        logEvent('AI drew an unplayable card and passes turn.', 'info');
        switchTurn('human');
      }
    }
  }
}

function chooseBestAiSuit() {
  const aiHand = gameState.players.ai.hand;
  const counts = { '♠': 0, '♣': 0, '♦': 0, '♥': 0 };
  for (const c of aiHand) {
    if (counts[c.suit] !== undefined) counts[c.suit]++;
  }
  let bestSuit = '♠';
  let maxCount = -1;
  for (const suit in counts) {
    if (counts[suit] > maxCount) {
      maxCount = counts[suit];
      bestSuit = suit;
    }
  }
  return bestSuit;
}

// Hand Scoring & Round End
export function handleRoundEnd(winnerKey, winningCard) {
  gameState.gameStatus = 'ROUND_END';
  gameState.lastWinner = winnerKey;
  
  const loserKey = winnerKey === 'human' ? 'ai' : 'human';
  const winnerName = gameState.players[winnerKey].name;
  const loserName = gameState.players[loserKey].name;

  // 1. If winning card is a special draw card (6, 7, K♠), opponent MUST draw penalty cards BEFORE hand scoring!
  if (winningCard) {
    let forcedDraws = 0;
    if (winningCard.rank === '6') forcedDraws = 1;
    else if (winningCard.rank === '7') forcedDraws = 2;
    else if (winningCard.rank === 'K' && winningCard.suit === '♠') forcedDraws = 4;

    if (forcedDraws > 0) {
      logEvent(`💥 Round ended on special card [${winningCard.suit} ${winningCard.rank}]! ${loserName} must draw ${forcedDraws} card(s) from stock before scoring!`, 'warning');
      for (let i = 0; i < forcedDraws; i++) {
        drawCardForPlayer(loserKey);
      }
    }
  }

  // 2. Calculate loser hand points (after drawing forced penalty cards)
  const loserHand = gameState.players[loserKey].hand;
  let penaltyPoints = 0;
  for (const card of loserHand) {
    penaltyPoints += card.points;
  }

  gameState.players[loserKey].roundScore = penaltyPoints;
  gameState.players[loserKey].score += penaltyPoints;

  // 2. Check Winner Last Card Bonus
  let winnerBonus = 0;
  if (winningCard && winningCard.rank === 'Q') {
    if (winningCard.suit === '♠') {
      winnerBonus = -40; // Queen of Spades finish: -40 pts bonus!
      logEvent(`🌟 AMAZING! ${winnerName} finished round with Queen of Spades! (-40 Score Bonus!)`, 'special');
    } else {
      winnerBonus = -20; // Any Queen finish: -20 pts bonus!
      logEvent(`🌟 GREAT MOVE! ${winnerName} finished round with a Queen! (-20 Score Bonus!)`, 'special');
    }
  }

  gameState.players[winnerKey].roundScore = winnerBonus;
  gameState.players[winnerKey].score += winnerBonus;

  // Store snapshot for user double-check verification modal
  gameState.roundEndDetails = {
    humanHand: gameState.players.human.hand.map(c => ({ ...c })),
    aiHand: gameState.players.ai.hand.map(c => ({ ...c })),
    winningCard: winningCard ? { ...winningCard } : null,
    winnerBonus: winnerBonus
  };

  logEvent(`🎉 Round ${gameState.roundNumber} Ended! ${winnerName} wins the round!`, 'system');
  logEvent(`${loserName} gets +${penaltyPoints} penalty points from hand cards.`, 'info');

  if (winnerKey === 'human') {
    sounds.roundWin();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  } else {
    sounds.roundLose();
  }

  // 3. Check 101 Score Resets or Loss Conditions for both players
  check101RuleForPlayer('human');
  check101RuleForPlayer('ai');

  // 4. Check Match Over condition (> 101 points)
  if (gameState.players.human.score > 101 || gameState.players.ai.score > 101) {
    gameState.gameStatus = 'GAME_OVER';
    if (gameState.players.human.score > 101 && gameState.players.ai.score > 101) {
      // Both over 101, lower score wins
      if (gameState.players.human.score < gameState.players.ai.score) {
        gameState.matchWinner = 'human';
        gameState.matchLoser = 'ai';
      } else {
        gameState.matchWinner = 'ai';
        gameState.matchLoser = 'human';
      }
    } else if (gameState.players.human.score > 101) {
      gameState.matchWinner = 'ai';
      gameState.matchLoser = 'human';
    } else {
      gameState.matchWinner = 'human';
      gameState.matchLoser = 'ai';
    }

    const matchWinName = gameState.players[gameState.matchWinner].name;
    const matchLoseName = gameState.players[gameState.matchLoser].name;

    logEvent(`🏆 MATCH OVER! ${matchLoseName} exceeded 101 points. ${matchWinName} WINS THE MATCH!`, 'system');
    setBanner(`🏆 MATCH OVER! ${matchWinName} WINS!`, 0);
  }
}

function check101RuleForPlayer(playerKey) {
  const p = gameState.players[playerKey];
  if (p.score === 101) {
    sounds.scoreReset();
    p.score = 0;
    logEvent(`✨ MAGICAL 101! ${p.name} reached EXACTLY 101 points! Score reset to 0!`, 'special');
    setBanner(`✨ MAGICAL 101! ${p.name}'s score reset to 0!`, 4000);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
  }
}

export function nextRound() {
  gameState.roundNumber++;
  startRound();
}
