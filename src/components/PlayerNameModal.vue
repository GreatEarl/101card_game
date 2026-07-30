<template>
  <div v-if="gameState.showNameModal" class="modal-overlay">
    <div class="modal-card">
      <div class="header-icon">🂡</div>
      <h2 class="modal-title">WELCOME TO CARD GAME 101</h2>
      <p class="modal-subtitle">Enter your name to begin the match:</p>

      <form @submit.prevent="handleSubmit" class="name-form">
        <div class="input-wrapper" :class="{ 'has-error': errorMessage }">
          <input 
            v-model="inputName"
            type="text"
            class="name-input"
            placeholder="Enter player name..."
            maxlength="20"
            autofocus
            @input="validateInput"
          />
          <span class="char-count">{{ inputName.length }} / 20</span>
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        <p v-else class="hint-msg">Allowed: letters, numbers, spaces, '-' and '_' (Max 20 chars)</p>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="!isValid"
        >
          START PLAYING
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { gameState, savePlayerName } from '../engine/cardEngine.js';

const inputName = ref('');
const errorMessage = ref('');

function loadInitialName() {
  const existing = gameState.players.human.name;
  const saved = localStorage.getItem('101_player_name');
  if (existing && existing !== 'Player (You)') {
    inputName.value = existing;
  } else if (saved && saved.trim()) {
    inputName.value = saved.trim();
  } else {
    inputName.value = 'Player 1';
  }
  validateInput();
}

onMounted(() => {
  loadInitialName();
});

watch(() => gameState.showNameModal, (isOpen) => {
  if (isOpen) {
    loadInitialName();
  }
});

const isValid = computed(() => {
  const trimmed = inputName.value.trim();
  if (!trimmed || trimmed.length > 20) return false;
  const validRegex = /^[a-zA-Z0-9 _-]+$/;
  return validRegex.test(trimmed);
});

function validateInput() {
  const val = inputName.value;
  if (!val.trim()) {
    errorMessage.value = 'Player name cannot be empty.';
    return;
  }
  if (val.length > 20) {
    errorMessage.value = 'Name cannot exceed 20 characters.';
    return;
  }
  const validRegex = /^[a-zA-Z0-9 _-]+$/;
  if (!validRegex.test(val)) {
    errorMessage.value = 'Only letters, numbers, spaces, "-" and "_" allowed.';
    return;
  }
  errorMessage.value = '';
}

function handleSubmit() {
  validateInput();
  if (!isValid.value) return;
  const success = savePlayerName(inputName.value);
  if (!success) {
    errorMessage.value = 'Invalid name format.';
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 250;
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
  border-radius: 24px;
  padding: 32px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(251, 191, 36, 0.2);
}

.header-icon {
  font-size: 3.5rem;
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

.modal-subtitle {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 8px 0 24px 0;
}

.name-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.name-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 14px 70px 14px 16px;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  outline: none;
  transition: all 0.2s ease;
}

.name-input:focus {
  border-color: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
}

.input-wrapper.has-error .name-input {
  border-color: #ef4444;
}

.char-count {
  position: absolute;
  right: 14px;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 700;
  pointer-events: none;
}

.error-msg {
  font-size: 0.8rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0;
  text-align: left;
}

.hint-msg {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  text-align: left;
}

.submit-btn {
  margin-top: 8px;
  width: 100%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
