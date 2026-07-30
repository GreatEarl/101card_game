<template>
  <aside class="sidebar-scoreboard">
    <div class="sidebar-header">
      <span class="sidebar-title">📊 SCOREBOARD</span>
      <span class="target-badge">GOAL: 101 PTS</span>
    </div>

    <!-- Players Scores Column -->
    <div class="players-scores-list">
      <!-- Human Score Card -->
      <div class="player-score-card" :class="{ 'is-active': gameState.activePlayer === 'human' }">
        <div class="card-top">
          <div class="p-identity">
            <span class="p-avatar">👤</span>
            <div>
              <div class="p-name-row">
                <span class="p-name">{{ gameState.players.human.name }}</span>
                <button class="edit-name-btn" @click="gameState.showNameModal = true" title="Change player name">✏️</button>
              </div>
              <div class="p-cards">{{ gameState.players.human.hand.length }} cards in hand</div>
            </div>
          </div>
          <div class="p-score-num">{{ gameState.players.human.score }} <span class="max-pt">/ 101</span></div>
        </div>

        <div class="score-progress">
          <div 
            class="fill-bar" 
            :style="{ width: `${Math.min(100, (gameState.players.human.score / 101) * 100)}%` }"
            :class="{ 'warning': gameState.players.human.score > 80, 'exact-101': gameState.players.human.score === 101 }"
          ></div>
        </div>

        <div v-if="gameState.players.human.roundScore !== 0" class="round-penalty">
          Round {{ gameState.roundNumber }} Score: 
          <span :class="gameState.players.human.roundScore < 0 ? 'bonus-pts' : 'penalty-pts'">
            {{ gameState.players.human.roundScore > 0 ? '+' : '' }}{{ gameState.players.human.roundScore }} pts
          </span>
        </div>
      </div>

      <!-- AI Score Card -->
      <div class="player-score-card" :class="{ 'is-active': gameState.activePlayer === 'ai' }">
        <div class="card-top">
          <div class="p-identity">
            <span class="p-avatar">🤖</span>
            <div>
              <div class="p-name">{{ gameState.players.ai.name }}</div>
              <div class="p-cards">{{ gameState.players.ai.hand.length }} cards in hand</div>
            </div>
          </div>
          <div class="p-score-num">{{ gameState.players.ai.score }} <span class="max-pt">/ 101</span></div>
        </div>

        <div class="score-progress">
          <div 
            class="fill-bar" 
            :style="{ width: `${Math.min(100, (gameState.players.ai.score / 101) * 100)}%` }"
            :class="{ 'warning': gameState.players.ai.score > 80, 'exact-101': gameState.players.ai.score === 101 }"
          ></div>
        </div>

        <div v-if="gameState.players.ai.roundScore !== 0" class="round-penalty">
          Round {{ gameState.roundNumber }} Score: 
          <span :class="gameState.players.ai.roundScore < 0 ? 'bonus-pts' : 'penalty-pts'">
            {{ gameState.players.ai.roundScore > 0 ? '+' : '' }}{{ gameState.players.ai.roundScore }} pts
          </span>
        </div>
      </div>
    </div>

    <!-- Rules Reference Reminder -->
    <div class="rules-quick-ref">
      <div class="ref-title">⚡ QUICK 101 RULES</div>
      <div class="ref-item">🎯 Hit <strong>exact 101</strong> ➔ Score resets to 0!</div>
      <div class="ref-item">⚠️ Exceed <strong>&gt; 101</strong> ➔ Match Loss!</div>
      <div class="ref-item">🃏 <strong>Card 9</strong> ➔ 0 points in hand.</div>
      <div class="ref-item">🌀 <strong>Card 8</strong> ➔ Draw until covered.</div>
      <div class="ref-item">🌟 <strong>Queen Last Card</strong> ➔ -20 / -40 pts bonus.</div>
    </div>

    <!-- Dynamic Hint Popup (Below Quick 101 Rules on Right Side) -->
    <div v-if="gameState.bannerMessage" class="sidebar-hint-card">
      <div class="hint-card-header">
        <span>💡 GAME HINT</span>
      </div>
      <div class="hint-card-body">
        {{ gameState.bannerMessage }}
      </div>
    </div>

    <!-- Visitor Hits Counter Badge -->
    <div class="hits-counter-container">
      <img 
        src="https://hits.seeyoufarm.dev/api/count/incr/badge.svg?url=https%3A%2F%2Fgreatearl.github.io%2F101card_game&count_bg=%230EA5E9&title_bg=%230F172A&icon=&title=visits&edge_flat=false" 
        alt="Visits Counter" 
        class="hits-badge-img"
      />
    </div>
  </aside>
</template>

<script setup>
import { gameState } from '../engine/cardEngine.js';
</script>

<style scoped>
.sidebar-scoreboard {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  width: 100%;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.sidebar-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  color: #fbbf24;
  letter-spacing: 1px;
}

.target-badge {
  font-size: 0.65rem;
  font-weight: 800;
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.players-scores-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-score-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

.player-score-card.is-active {
  border-color: #fbbf24;
  background: rgba(30, 41, 59, 0.95);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.25);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-identity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.p-avatar {
  font-size: 1.3rem;
}

.p-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.p-name {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
}

.edit-name-btn {
  background: none;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  padding: 0;
}

.edit-name-btn:hover {
  opacity: 1;
}

.p-cards {
  font-size: 0.7rem;
  color: #94a3b8;
}

.p-score-num {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: #fff;
}

.max-pt {
  font-size: 0.75rem;
  color: #64748b;
}

.score-progress {
  width: 100%;
  height: 6px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}

.fill-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.fill-bar.warning {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.fill-bar.exact-101 {
  background: linear-gradient(90deg, #38bdf8, #818cf8);
}

.round-penalty {
  font-size: 0.75rem;
  color: #cbd5e1;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.penalty-pts {
  color: #ef4444;
  font-weight: 700;
}

.bonus-pts {
  color: #10b981;
  font-weight: 700;
}

.sidebar-hint-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.25);
  animation: hintSlideIn 0.3s ease-out;
}

@keyframes hintSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.hint-card-header {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.hint-card-body {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.4;
}

.rules-quick-ref {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ref-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.5px;
}

.ref-item {
  font-size: 0.73rem;
  color: #94a3b8;
  line-height: 1.3;
}

.hits-counter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.hits-badge-img {
  height: 20px;
  border-radius: 4px;
}
</style>
