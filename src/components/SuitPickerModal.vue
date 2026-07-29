<template>
  <div v-if="gameState.showSuitPicker" class="modal-overlay">
    <div class="modal-card">
      <div class="crown-icon">👑</div>
      <h2 class="modal-title">QUEEN PLAYED!</h2>
      <p class="modal-desc">Choose the new active suit for the table:</p>

      <div class="suits-grid">
        <button 
          v-for="suit in suits" 
          :key="suit.symbol"
          class="suit-btn"
          :class="{ 'is-red': suit.color === 'red' }"
          @click="selectSuit(suit.symbol)"
        >
          <span class="suit-icon">{{ suit.symbol }}</span>
          <span class="suit-name">{{ suit.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameState, selectQueenSuit } from '../engine/cardEngine.js';
import { SUITS } from '../types/game.js';

const suits = Object.values(SUITS);

function selectSuit(symbol) {
  selectQueenSuit(symbol);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 2px solid #fbbf24;
  border-radius: 20px;
  padding: 28px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(251, 191, 36, 0.2);
}

.crown-icon {
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 8px;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fbbf24;
  margin: 0;
}

.modal-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 6px 0 20px 0;
}

.suits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.suit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suit-btn:hover {
  background: rgba(51, 65, 85, 1);
  border-color: #fbbf24;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.suit-icon {
  font-size: 2.2rem;
  line-height: 1;
  color: #fff;
}

.suit-btn.is-red .suit-icon {
  color: #ef4444;
}

.suit-name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #cbd5e1;
  margin-top: 4px;
}
</style>
