<template>
  <div class="table-container">
    <!-- Casino Felt Table Background -->
    <div class="felt-surface">
      
      <!-- Top Area: AI Opponent Hand -->
      <div class="opponent-section">
        <div class="opponent-badge">
          <span>🤖 AI OPPONENT ({{ gameState.players.ai.hand.length }} CARDS)</span>
        </div>
        <div class="hand-row opponent-hand">
          <CardView 
            v-for="(card, index) in gameState.players.ai.hand" 
            :key="`ai-${index}`" 
            :faceDown="true" 
          />
        </div>
      </div>

      <!-- Center Area: Stock Deck, Discard Pile & Active Suit -->
      <div class="center-play-area">
        
        <!-- Stock Deck -->
        <div class="deck-pile" @click="handleDrawClick">
          <div class="deck-stack">
            <CardView 
              v-if="gameState.stockDeck.length > 0" 
              :faceDown="true" 
            />
            <div v-else class="empty-stock">
              <span>DECK EMPTY</span>
            </div>
          </div>
          <div class="pile-count-badge">
            <span class="count-val">{{ gameState.stockDeck.length }}</span> CARDS LEFT
          </div>
        </div>

        <!-- Discard Pile (Played Cards) -->
        <div class="discard-pile">
          <div class="pile-label">TOP CARD</div>
          <div class="card-stack" v-if="topDiscardCard">
            <CardView :card="topDiscardCard" />
          </div>
          <div v-else class="empty-discard">
            <span>NO CARD</span>
          </div>
        </div>

        <!-- Active Suit & Special Status Indicator -->
        <div class="active-status-box" :class="{ 'has-queen-change': gameState.bannerMessage.includes('Queen') }">
          <div class="status-title">ACTIVE SUIT</div>
          <div class="active-suit-display" :class="{ 'red-suit': ['♦', '♥'].includes(gameState.activeSuit) }">
            <span class="suit-icon">{{ gameState.activeSuit || '?' }}</span>
            <span class="suit-name-label">{{ activeSuitName }}</span>
          </div>
          <div v-if="gameState.mustCover8" class="cover-8-alert">
            ⚡ MUST COVER 8!
          </div>
        </div>

      </div>

      <!-- Action Control Area -->
      <div class="action-banner-area">
        <div v-if="isHumanTurn" class="player-turn-controls">
          <button 
            class="action-btn draw-btn" 
            @click="humanDrawCard"
            :disabled="gameState.gameStatus !== 'PLAYING'"
          >
            <Download class="btn-icon" />
            <span>DRAW CARD</span>
          </button>
        </div>
        <div v-else-if="gameState.activePlayer === 'ai'" class="ai-thinking-banner">
          <span class="spinner">⏳</span> AI is deciding its move...
        </div>
      </div>

      <!-- Bottom Area: Human Player Hand -->
      <div class="player-section">
        <div class="player-badge">
          <span>YOUR HAND ({{ gameState.players.human.hand.length }} CARDS)</span>
        </div>
        
        <div class="hand-row player-hand">
          <CardView 
            v-for="(card, index) in gameState.players.human.hand" 
            :key="card.id || index" 
            :card="card" 
            :playable="isHumanTurn && isCardPlayable(card)" 
            @click="playHumanCard(index)"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { gameState, isCardPlayable, playHumanCard, humanDrawCard } from '../engine/cardEngine.js';
import CardView from './CardView.vue';
import { Download } from 'lucide-vue-next';

const isHumanTurn = computed(() => gameState.activePlayer === 'human' && gameState.gameStatus === 'PLAYING');

const topDiscardCard = computed(() => {
  if (gameState.discardPile.length === 0) return null;
  return gameState.discardPile[gameState.discardPile.length - 1];
});

const activeSuitName = computed(() => {
  const map = { '♠': 'SPADES', '♣': 'CLUBS', '♦': 'DIAMONDS', '♥': 'HEARTS' };
  return map[gameState.activeSuit] || '';
});

function handleDrawClick() {
  if (isHumanTurn.value) {
    humanDrawCard();
  }
}
</script>

<style scoped>
.table-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px 24px;
}

.felt-surface {
  background: radial-gradient(circle at center, #14532d 0%, #064e3b 60%, #022c22 100%);
  border: 10px solid #78350f;
  border-radius: 28px;
  box-shadow: 
    inset 0 0 40px rgba(0, 0, 0, 0.6),
    0 12px 32px rgba(0, 0, 0, 0.5);
  padding: 20px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.opponent-section, .player-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.opponent-badge, .player-badge {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #a7f3d0;
  background: rgba(6, 78, 59, 0.7);
  padding: 3px 12px;
  border-radius: 12px;
  border: 1px solid rgba(167, 243, 208, 0.2);
  letter-spacing: 1px;
}

.hand-row {
  display: flex;
  justify-content: center;
  gap: -25px; /* Overlapping cards effect */
  padding: 8px;
  flex-wrap: wrap;
  max-width: 100%;
}

.opponent-hand .card-wrapper {
  margin-left: -35px;
}
.opponent-hand .card-wrapper:first-child {
  margin-left: 0;
}

.player-hand {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.center-play-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin: 16px 0;
}

.deck-pile {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.deck-pile:hover {
  transform: scale(1.03);
}

.empty-stock, .empty-discard {
  width: 90px;
  height: 130px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 700;
}

@media (min-width: 768px) {
  .empty-stock, .empty-discard {
    width: 105px;
    height: 152px;
  }
}

.pile-count-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #38bdf8;
  margin-top: 6px;
  background: rgba(15, 23, 42, 0.8);
  padding: 2px 8px;
  border-radius: 10px;
}

.count-val {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 800;
}

.discard-pile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pile-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.active-status-box {
  background: rgba(15, 23, 42, 0.9);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 14px;
  padding: 10px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.active-status-box.has-queen-change {
  border-color: #fbbf24;
  box-shadow: 0 0 25px rgba(251, 191, 36, 0.7);
  animation: glowPulse 1.2s infinite alternate;
}

@keyframes glowPulse {
  from { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); }
  to { transform: scale(1.06); box-shadow: 0 0 30px rgba(251, 191, 36, 0.8); }
}

.status-title {
  font-size: 0.65rem;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 1px;
}

.active-suit-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2px;
}

.suit-icon {
  font-size: 2.6rem;
  line-height: 1;
  color: #f8fafc;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));
}

.active-suit-display.red-suit .suit-icon {
  color: #ef4444;
}

.suit-name-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  color: #cbd5e1;
  letter-spacing: 1px;
  margin-top: 2px;
}

.cover-8-alert {
  font-size: 0.65rem;
  font-weight: 800;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 6px;
  animation: flash 1s infinite alternate;
}

@keyframes flash {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

.action-banner-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 50px;
}

.player-turn-controls {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #fff;
  border: 1px solid #38bdf8;
  padding: 8px 18px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.action-btn:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.ai-thinking-banner {
  font-size: 0.85rem;
  font-weight: 600;
  color: #38bdf8;
}

@media (max-width: 640px) {
  .center-play-area {
    gap: 12px;
  }
  .felt-surface {
    padding: 12px;
    border-width: 6px;
  }
  .left-hint-popup {
    top: 10px;
    left: 10px;
    transform: none;
    max-width: 180px;
    padding: 8px 12px;
  }
  .hint-text {
    font-size: 0.78rem;
  }
}
</style>
