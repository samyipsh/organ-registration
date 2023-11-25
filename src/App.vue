<script setup lang="ts">
import { ref } from 'vue'
import { swellInfo } from './data/stops'
const swellStops = ref(swellInfo)
</script>

<template>
  <div class="division">
    <div class="card-row">
      <div class="card" v-for="stop in swellStops" :key="stop.id">
        <div class="card-body">
          <h5 class="card-title">{{ stop.stopName }}</h5>
          <p class="card-text" v-if="stop.footagePitch">{{ stop.footagePitch }}</p>
          <p class="card-text" v-if="stop.soloVoice">{{ stop.soloVoice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.division {
  height: 16rem;
  width: 100vw;
  background-color: rgba(209, 209, 209, 0.711);
  padding: 2rem 0;
}
.card-row {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #000;
}

.card {
  flex-shrink: 0;
  flex-grow: 0;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #000;
  background-color: cornsilk;
  color: #000;
  padding: 10px;
  width: 100px;
  margin-right: 0.125rem;
}
</style>
