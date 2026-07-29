<template>
  <div 
    class="card-wrapper" 
    :class="{ 
      'is-playable': playable && !faceDown, 
      'is-facedown': faceDown,
      'is-red': card && card.suitColor === 'red',
      'is-black': card && card.suitColor === 'black'
    }"
    @click="handleClick"
  >
    <div class="card-inner" v-if="!faceDown && card">
      <!-- Top Left Corner -->
      <div class="card-corner top-left">
        <span class="card-rank">{{ card.rank }}</span>
        <span class="card-suit-mini">{{ card.suit }}</span>
      </div>

      <!-- Center Body -->
      <div class="card-center">
        <span class="card-suit-large">{{ card.suit }}</span>
        <div v-if="card.isSpecial" class="special-badge">
          {{ card.rank === 'Q' ? 'WILD' : card.rank === 'K' && card.suit === '♠' ? '+4 DRAW' : card.rank }}
        </div>
      </div>

      <!-- Bottom Right Corner -->
      <div class="card-corner bottom-right">
        <span class="card-rank">{{ card.rank }}</span>
        <span class="card-suit-mini">{{ card.suit }}</span>
      </div>

      <!-- Playable glow overlay -->
      <div v-if="playable" class="playable-ring"></div>
    </div>

    <!-- Card Back -->
    <div class="card-back" v-else>
      <div class="back-pattern">
        <div class="inner-shield">🂠</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: { type: Object, default: null },
  faceDown: { type: Boolean, default: false },
  playable: { type: Boolean, default: false }
});

const emit = defineEmits(['click']);

function handleClick() {
  if (props.playable && !props.faceDown) {
    emit('click');
  }
}
</script>

<style scoped>
.card-wrapper {
  width: 90px;
  height: 130px;
  border-radius: 10px;
  position: relative;
  user-select: none;
  transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.22s ease;
  perspective: 1000px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .card-wrapper {
    width: 105px;
    height: 152px;
    border-radius: 12px;
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #ffffff, #f4f5f7);
  border: 1px solid #d1d5db;
  border-radius: inherit;
  padding: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), inset 0 0 2px rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.is-red .card-rank,
.is-red .card-suit-mini,
.is-red .card-suit-large {
  color: #dc2626;
}

.is-black .card-rank,
.is-black .card-suit-mini,
.is-black .card-suit-large {
  color: #111827;
}

.card-corner {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.top-left {
  align-self: flex-start;
}

.bottom-right {
  align-self: flex-end;
  transform: rotate(180deg);
}

.card-rank {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: -0.5px;
}

.card-suit-mini {
  font-size: 0.95rem;
  margin-top: 1px;
}

.card-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card-suit-large {
  font-size: 2.5rem;
  opacity: 0.95;
}

.special-badge {
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fbbf24, #d97706);
  color: #000;
  padding: 2px 5px;
  border-radius: 4px;
  margin-top: 2px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Card Back Design */
.card-back {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 2px solid #38bdf8;
  padding: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.back-pattern {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 8px;
  background-image: radial-gradient(#38bdf8 15%, transparent 16%), radial-gradient(#38bdf8 15%, transparent 16%);
  background-size: 12px 12px;
  background-position: 0 0, 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-shield {
  font-size: 2.2rem;
  color: #38bdf8;
  opacity: 0.8;
}

/* Playable Card Highlights & Animations */
.is-playable {
  cursor: pointer;
}

.is-playable:hover {
  transform: translateY(-16px) scale(1.05);
  box-shadow: 0 12px 24px rgba(56, 189, 248, 0.4), 0 0 15px rgba(251, 191, 36, 0.6);
  z-index: 20;
}

.playable-ring {
  position: absolute;
  inset: 0;
  border: 2px solid #fbbf24;
  border-radius: inherit;
  pointer-events: none;
  animation: pulse-ring 1.8s infinite ease-in-out;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(251, 191, 36, 0); }
  100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
}
</style>
