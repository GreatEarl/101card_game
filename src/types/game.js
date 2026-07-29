// Card Game 101 Constants & Data Helpers

export const SUITS = {
  SPADES: { symbol: '♠', name: 'Spades', color: 'black', id: 'S' },
  CLUBS: { symbol: '♣', name: 'Clubs', color: 'black', id: 'C' },
  DIAMONDS: { symbol: '♦', name: 'Diamonds', color: 'red', id: 'D' },
  HEARTS: { symbol: '♥', name: 'Hearts', color: 'red', id: 'H' }
};

export const RANKS = {
  '6': { label: '6', value: 6 },
  '7': { label: '7', value: 7 },
  '8': { label: '8', value: 8 },
  '9': { label: '9', value: 0 },
  '10': { label: '10', value: 10 },
  'J': { label: 'J', name: 'Jack', value: 2 },
  'Q': { label: 'Q', name: 'Queen', value: 3 },
  'K': { label: 'K', name: 'King', value: 4 },
  'A': { label: 'A', name: 'Ace', value: 11 }
};

export const SPECIAL_CARDS = {
  '6': 'Opponent draws 1 card and skips turn',
  '7': 'Opponent draws 2 cards and skips turn',
  '8': 'Must be covered immediately by same rank or suit',
  'Q': 'Wild Card: Change/Choose active suit',
  'K_S': 'King of Spades: Opponent draws 4 cards and skips turn',
  'A': 'Opponent skips turn'
};

export function getCardPoints(rank) {
  return RANKS[rank] ? RANKS[rank].value : 0;
}

export function create36Deck() {
  const deck = [];
  const suitsList = Object.values(SUITS);
  const ranksList = Object.keys(RANKS);

  for (const suit of suitsList) {
    for (const rank of ranksList) {
      deck.push({
        id: `${suit.id}-${rank}-${Math.random().toString(36).substr(2, 5)}`,
        suit: suit.symbol,
        suitName: suit.name,
        suitColor: suit.color,
        suitId: suit.id,
        rank: rank,
        points: getCardPoints(rank),
        isSpecial: ['6', '7', '8', 'Q', 'A'].includes(rank) || (rank === 'K' && suit.symbol === '♠')
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
