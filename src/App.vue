<script setup lang="ts">
import { ref } from 'vue'
import { swellStops } from './data/stops'
const swellCards = ref(swellStops)
</script>

<template>
  <div class="division-row">
    <div class="card-row">
      <div class="card" v-for="card in swellCards" :key="card.id">
        <div class="card-body">
          <h5 class="card-title">{{ card.stopName }}</h5>
          <p class="card-text" v-if="card.footagePitch">{{ card.footagePitch }}</p>
          <p class="card-text" v-if="card.soloVoice">{{ card.soloVoice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.division-row {
  width: 100;
  padding: 1rem;
}
.card-row {
  display: flex;
  justify-content: space-between;
}

.card {
  flex-direction: column;
  justify-content: center;
  border: 1px solid #000;
  background-color: cornsilk;
  color: #000;
  padding: 10px;
  width: 100px;
}
</style>
