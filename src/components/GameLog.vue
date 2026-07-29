<template>
  <div class="log-container">
    <div class="log-header">
      <div class="header-title-box">
        <span class="title-icon">📜</span>
        <span class="title">BATTLE LOG</span>
      </div>
      <span class="count">{{ gameState.logs.length }} events recorded</span>
    </div>

    <div class="log-list">
      <div 
        v-for="log in gameState.logs" 
        :key="log.id" 
        class="log-item"
        :class="log.type"
      >
        <span class="time">{{ log.time }}</span>
        <span class="text">{{ log.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameState } from '../engine/cardEngine.js';
</script>

<style scoped>
.log-container {
  width: 100%;
  margin: 12px 0 0 0;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.9);
  padding: 10px 18px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-bottom: none;
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 1.1rem;
}

.title {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  color: #fbbf24;
  letter-spacing: 1.2px;
}

.count {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 600;
}

.log-list {
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  max-height: 220px;
  overflow-y: auto;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
}

.log-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  gap: 12px;
  line-height: 1.5;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.4);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
}

.time {
  color: #64748b;
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 600;
}

.text {
  color: #f1f5f9;
}

.log-item.action {
  border-left-color: #38bdf8;
}
.log-item.action .text {
  color: #38bdf8;
  font-weight: 600;
}

.log-item.special {
  border-left-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}
.log-item.special .text {
  color: #fbbf24;
  font-weight: 700;
}

.log-item.system {
  border-left-color: #34d399;
  background: rgba(52, 211, 153, 0.1);
}
.log-item.system .text {
  color: #34d399;
  font-weight: 700;
}

.log-item.warning {
  border-left-color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}
.log-item.warning .text {
  color: #f87171;
  font-weight: 700;
}
</style>
