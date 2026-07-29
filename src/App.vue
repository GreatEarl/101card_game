<template>
  <div class="app-root">
    <Navbar @open-rules="showRulesModal = true" />

    <main class="main-layout">
      <!-- Left Main Column: Playing Table & Battle Log -->
      <div class="game-column">
        <PlayingTable />
        <GameLog />
      </div>

      <!-- Right Sidebar Column: ScoreBoard Always Visible -->
      <div class="sidebar-column">
        <ScoreBoard />
      </div>
    </main>

    <!-- Modals -->
    <PlayerNameModal />
    <SuitPickerModal />
    <RulesModal :show="showRulesModal" @close="showRulesModal = false" />
    <GameOverModal />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { initGame } from './engine/cardEngine.js';
import Navbar from './components/Navbar.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import PlayingTable from './components/PlayingTable.vue';
import GameLog from './components/GameLog.vue';
import SuitPickerModal from './components/SuitPickerModal.vue';
import RulesModal from './components/RulesModal.vue';
import GameOverModal from './components/GameOverModal.vue';
import PlayerNameModal from './components/PlayerNameModal.vue';

const showRulesModal = ref(false);

onMounted(() => {
  initGame();
});
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 50%, #090d16 100%);
}

.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 16px;
}

@media (min-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr 320px;
  }
}

.game-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
}
</style>
