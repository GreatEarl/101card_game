<template>
  <header class="navbar">
    <div class="brand">
      <div class="logo-icon">🂡</div>
      <div class="brand-text">
        <h1 class="title">101 <span class="badge">CASINO DELUXE</span></h1>
        <p class="subtitle">Vue 3 Single Player Strategy Card Game</p>
      </div>
    </div>

    <div class="status-center">
      <div class="round-badge">
        <span class="label">ROUND</span>
        <span class="value">{{ gameState.roundNumber }}</span>
      </div>
    </div>

    <div class="nav-actions">
      <button 
        class="nav-btn sound-btn" 
        :class="{ 'muted': !soundEnabled }"
        @click="toggleAudio"
        title="Toggle Audio Sound Effects"
      >
        <Volume2 v-if="soundEnabled" class="icon" />
        <VolumeX v-else class="icon" />
        <span class="btn-label">{{ soundEnabled ? 'Sound On' : 'Muted' }}</span>
      </button>

      <button 
        class="nav-btn rules-btn" 
        @click="emit('open-rules')"
        title="View 101 Card Game Rules"
      >
        <BookOpen class="icon" />
        <span class="btn-label">Rules</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { gameState } from '../engine/cardEngine.js';
import { sounds } from '../utils/audio.js';
import { Volume2, VolumeX, BookOpen } from 'lucide-vue-next';

const emit = defineEmits(['open-rules']);
const soundEnabled = ref(sounds.enabled);

function toggleAudio() {
  soundEnabled.value = sounds.toggleSound();
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2.2rem;
  line-height: 1;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 8px rgba(251, 191, 36, 0.4));
}

.title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.round-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
}

.round-badge .label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 1px;
}

.round-badge .value {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}

.nav-actions {
  display: flex;
  gap: 10px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(51, 65, 85, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-1px);
}

.nav-btn.muted {
  opacity: 0.6;
}

.icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 640px) {
  .subtitle, .btn-label {
    display: none;
  }
}
</style>
