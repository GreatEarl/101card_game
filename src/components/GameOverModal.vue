<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-card">
      
      <!-- MATCH OVER SUMMARY -->
      <template v-if="gameState.gameStatus === 'GAME_OVER'">
        <div class="trophy-icon">{{ isMatchHumanWinner ? '🏆' : '💀' }}</div>
        <h2 class="title" :class="{ 'is-win': isMatchHumanWinner }">
          {{ isMatchHumanWinner ? 'MATCH VICTORY!' : 'MATCH DEFEAT!' }}
        </h2>
        <p class="subtitle">
          {{ isMatchHumanWinner ? 'Congratulations! You defeated the AI!' : 'Match ended as a player exceeded 101 points.' }}
        </p>

        <div class="final-scores">
          <div class="score-box" :class="{ 'winner': gameState.matchWinner === 'human' }">
            <span class="p-name">{{ gameState.players.human.name }}</span>
            <span class="p-score">{{ gameState.players.human.score }} pts</span>
          </div>
          <div class="score-box" :class="{ 'winner': gameState.matchWinner === 'ai' }">
            <span class="p-name">{{ gameState.players.ai.name }}</span>
            <span class="p-score">{{ gameState.players.ai.score }} pts</span>
          </div>
        </div>

        <button class="primary-btn" @click="initGame">PLAY NEW MATCH</button>
      </template>

      <!-- ROUND END SUMMARY & CARDS BREAKDOWN -->
      <template v-else-if="gameState.gameStatus === 'ROUND_END'">
        <div class="round-icon">🂡</div>
        <h2 class="title" :class="{ 'is-win': gameState.lastWinner === 'human' }">
          {{ gameState.lastWinner === 'human' ? `${gameState.players.human.name} WON THE ROUND!` : `${gameState.players.ai.name} WON THE ROUND!` }}
        </h2>

        <!-- Finishing Bonus & Forced Draw Callouts -->
        <div v-if="forcedDrawNotice" class="forced-draw-banner">
          {{ forcedDrawNotice }}
        </div>
        <div v-if="roundEndDetails?.winnerBonus < 0" class="bonus-banner">
          🌟 LAST CARD QUEEN BONUS: <strong>{{ roundEndDetails.winnerBonus }} PTS</strong> TO WINNER!
        </div>
        
        <!-- Detailed Remaining Cards Inspection Breakdown -->
        <div class="cards-breakdown-section">
          <div class="breakdown-title">📋 END OF ROUND HAND CARDS BREAKDOWN</div>
          
          <!-- Human Hand Inspection -->
          <div class="player-breakdown-box">
            <div class="box-header">
              <span class="p-label">👤 {{ gameState.players.human.name }}</span>
              <span class="pts-badge" :class="{ 'zero-pts': humanPenaltySum === 0 }">
                +{{ humanPenaltySum }} pts
              </span>
            </div>
            <div v-if="roundEndDetails?.humanHand?.length > 0" class="card-pills-list">
              <div 
                v-for="(card, i) in roundEndDetails.humanHand" 
                :key="i"
                class="card-pill"
                :class="{ 'is-red': ['♦', '♥'].includes(card.suit) }"
              >
                <span class="pill-card-rank">{{ card.suit }}{{ card.rank }}</span>
                <span class="pill-card-pts">({{ card.points }} pts)</span>
              </div>
            </div>
            <div v-else class="empty-hand-tag">
              ✨ 0 Cards Left (Winner!)
            </div>
          </div>

          <!-- AI Hand Inspection -->
          <div class="player-breakdown-box">
            <div class="box-header">
              <span class="p-label">🤖 {{ gameState.players.ai.name }}</span>
              <span class="pts-badge" :class="{ 'zero-pts': aiPenaltySum === 0 }">
                +{{ aiPenaltySum }} pts
              </span>
            </div>
            <div v-if="roundEndDetails?.aiHand?.length > 0" class="card-pills-list">
              <div 
                v-for="(card, i) in roundEndDetails.aiHand" 
                :key="i"
                class="card-pill"
                :class="{ 'is-red': ['♦', '♥'].includes(card.suit) }"
              >
                <span class="pill-card-rank">{{ card.suit }}{{ card.rank }}</span>
                <span class="pill-card-pts">({{ card.points }} pts)</span>
              </div>
            </div>
            <div v-else class="empty-hand-tag">
              ✨ 0 Cards Left (Winner!)
            </div>
          </div>
        </div>

        <div class="round-scores-footer">
          <span>Total Match Score:</span>
          <strong>{{ gameState.players.human.name }}: {{ gameState.players.human.score }} | {{ gameState.players.ai.name }}: {{ gameState.players.ai.score }}</strong>
        </div>

        <button class="primary-btn" @click="nextRound">START ROUND {{ gameState.roundNumber + 1 }}</button>
      </template>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { gameState, nextRound, initGame } from '../engine/cardEngine.js';

const showModal = computed(() => ['ROUND_END', 'GAME_OVER'].includes(gameState.gameStatus));
const isMatchHumanWinner = computed(() => gameState.matchWinner === 'human');
const roundEndDetails = computed(() => gameState.roundEndDetails);

const humanPenaltySum = computed(() => {
  if (!roundEndDetails.value?.humanHand) return 0;
  return roundEndDetails.value.humanHand.reduce((sum, c) => sum + c.points, 0);
});

const aiPenaltySum = computed(() => {
  if (!roundEndDetails.value?.aiHand) return 0;
  return roundEndDetails.value.aiHand.reduce((sum, c) => sum + c.points, 0);
});

const forcedDrawNotice = computed(() => {
  const card = roundEndDetails.value?.winningCard;
  if (!card) return null;
  if (card.rank === '6') return '💥 Round ended on 6! Opponent drew 1 penalty card before scoring!';
  if (card.rank === '7') return '💥 Round ended on 7! Opponent drew 2 penalty cards before scoring!';
  if (card.rank === 'K' && card.suit === '♠') return '💥 Round ended on King of Spades! Opponent drew 4 penalty cards before scoring!';
  return null;
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 220;
  padding: 16px;
  animation: fadeIn 0.25s ease-out;
}

.modal-card {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 2px solid #fbbf24;
  border-radius: 24px;
  padding: 24px 28px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  max-height: 90vh;
  overflow-y: auto;
}

.trophy-icon, .round-icon {
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 4px;
}

.title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #ef4444;
  margin: 0;
}

.title.is-win {
  color: #10b981;
}

.subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 6px 0 16px 0;
}

.forced-draw-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid #f87171;
  color: #f87171;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  margin: 8px 0 6px 0;
}

.bonus-banner {
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid #fbbf24;
  color: #fbbf24;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  margin: 8px 0 12px 0;
}

.cards-breakdown-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;
  text-align: left;
}

.breakdown-title {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.8px;
}

.player-breakdown-box {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 12px;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.p-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.pts-badge {
  font-size: 0.75rem;
  font-weight: 800;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  padding: 2px 8px;
  border-radius: 6px;
}

.pts-badge.zero-pts {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.card-pills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-pill {
  background: #ffffff;
  color: #0f172a;
  border-radius: 6px;
  padding: 4px 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.card-pill.is-red {
  color: #dc2626;
}

.pill-card-pts {
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.75;
}

.empty-hand-tag {
  font-size: 0.8rem;
  color: #10b981;
  font-weight: 700;
}

.final-scores {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.score-box {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-box.winner {
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.p-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
}

.p-score {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin-top: 4px;
}

.round-scores-footer {
  font-size: 0.85rem;
  color: #cbd5e1;
  background: rgba(30, 41, 59, 0.6);
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-btn {
  width: 100%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  transform: translateY(-2px);
}
</style>
