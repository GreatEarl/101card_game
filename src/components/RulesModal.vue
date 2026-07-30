<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-header">
        <h2>♠️ CARD GAME 101 RULES</h2>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="rules-body">
        
        <section class="rule-section">
          <h3>🎯 Objective & Score 101</h3>
          <p>
            Accumulate as few points as possible across rounds.
          </p>
          <ul>
            <li><strong>Exact 101 Reset:</strong> If your total score reaches <strong>exactly 101</strong>, your score resets to <strong>0</strong>!</li>
            <li><strong>Over 101 Loss:</strong> Exceeding <strong>101 points (&gt; 101)</strong> results in an immediate match loss.</li>
          </ul>
        </section>

        <section class="rule-section">
          <h3>🃏 Deck & Round Setup</h3>
          <ul>
            <li>Played with a <strong>36-card deck</strong> (Ranks 6 through Ace).</li>
            <li><strong>5 Cards Dealt:</strong> Each player gets 5 cards per round.</li>
            <li><strong>Blind Opening Move:</strong> The starting player automatically plays their <strong>5th dealt card face-down</strong> onto the table to open the discard pile.</li>
            <li><strong>Round 1 starter</strong> is random. Subsequent rounds are started by the <strong>winner of the previous round</strong>.</li>
            <li><strong>Stock Deck Recycling:</strong> When stock empties, played discard cards are flipped face-down <em>without reshuffling</em>.</li>
          </ul>
        </section>

        <section class="rule-section">
          <h3>⚡ Special Action Cards</h3>
          <div class="cards-table">
            <div class="table-row">
              <span class="card-tag">6</span>
              <span class="effect">Opponent draws 1 card &amp; skips turn.</span>
            </div>
            <div class="table-row">
              <span class="card-tag">7</span>
              <span class="effect">Opponent draws 2 cards &amp; skips turn.</span>
            </div>
            <div class="table-row">
              <span class="card-tag">8</span>
              <span class="effect">Must be covered immediately by same suit, rank 8, or ANY Queen! If played blindly as 1st card or as the last card in hand, player must cover it (drawing from stock if needed) before turn ends/round ends.</span>
            </div>
            <div class="table-row">
              <span class="card-tag">Queen</span>
              <span class="effect">Wild card: Can cover ANY card (including 8). Selects new active suit. Opponent can override by playing another Queen!</span>
            </div>
            <div class="table-row">
              <span class="card-tag">K ♠</span>
              <span class="effect">King of Spades: Opponent draws 4 cards &amp; skips turn.</span>
            </div>
            <div class="table-row">
              <span class="card-tag">Ace</span>
              <span class="effect">Opponent skips turn.</span>
            </div>
          </div>
        </section>

        <section class="rule-section">
          <h3>📊 Round End Scoring & Finishing Bonuses</h3>
          <p>When a player plays their last card, the round ends. The other player scores penalty points for cards left in hand:</p>
          <ul>
            <li><strong>6 – 10:</strong> Face Value (6 to 10 points)</li>
            <li><strong>Jack:</strong> 2 points | <strong>Queen:</strong> 3 points | <strong>King:</strong> 4 points | <strong>Ace:</strong> 11 points</li>
          </ul>
          <div class="bonus-box">
            🌟 <strong>Winner Finishing Bonuses (Last Card Thrown):</strong>
            <ul>
              <li>Finish round with any <strong>Queen</strong> ➔ <strong>-20 points bonus</strong></li>
              <li>Finish round with <strong>Queen of Spades (Q♠)</strong> ➔ <strong>-40 points bonus</strong></li>
            </ul>
          </div>
        </section>

      </div>

      <div class="modal-footer">
        <button class="got-it-btn" @click="close">GOT IT, LET'S PLAY!</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
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
  z-index: 210;
  padding: 16px;
  animation: fadeIn 0.25s ease-out;
}

.modal-card {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  max-width: 580px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.modal-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: #fbbf24;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}

.rules-body {
  overflow-y: auto;
  padding: 16px 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 0.88rem;
  color: #cbd5e1;
  line-height: 1.5;
}

.rule-section h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  color: #38bdf8;
  margin: 0 0 6px 0;
}

.rule-section ul {
  margin: 4px 0;
  padding-left: 20px;
}

.cards-table {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(15, 23, 42, 0.6);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.table-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-tag {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 0.75rem;
  background: #fbbf24;
  color: #000;
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 65px;
  text-align: center;
}

.bonus-box {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 10px;
  border-radius: 10px;
  margin-top: 8px;
  color: #fde68a;
}

.modal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.got-it-btn {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.got-it-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
}
</style>
