<script setup lang="ts">
import { ref } from 'vue'
import { swellInfo } from './data/stops'
// import { useRouter } from 'vue-router'

// const swellStops = ref(
//   swellInfo.map((stop) => ({ ...stop, isSelected: Math.random() < 0.5 ? false : true }))
// )
const numOfSwellStops = ref(swellInfo.length)
const swellStopsSelected = ref(Array.from({ length: numOfSwellStops.value }, () => false))

// type Selectable = { isSelected: boolean }
// const toggleSelected = <T extends Selectable>(stop: T) => (stop.isSelected = !stop.isSelected)
</script>

<template>
  <div class="division">
    <h1>Swell ({{ numOfSwellStops }})</h1>
    <div class="card-row">
      <div
        class="card"
        v-for="(stop, index) in swellInfo"
        :key="stop.id"
        :class="{ 'card-selected': swellStopsSelected[index] }"
        @click="() => (swellStopsSelected[index] = !swellStopsSelected[index])"
      >
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
  color: #111111;
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

.card-selected {
  background-color: green;
  color: #fff;
}
</style>
