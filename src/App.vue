<script setup lang="ts">
import { ref } from 'vue'
import { swellInfo } from './data/stops'

const numOfSwellStops = ref(swellInfo.length)

const urlParams = new URLSearchParams(window.location.search)
console.log('urlParams', urlParams)
for (const [key, value] of urlParams) {
  console.log(key, value)
}
const swellURLState = urlParams.get('swell')
if (swellURLState == null) {
  throw new Error('swell URL param is null')
}
if (swellURLState.length !== numOfSwellStops.value) {
  throw new Error('swell URL param is not the correct length')
}
const swellStopsSelected = ref(swellURLState.split('').map((x) => x === '1'))
const toggleSwellSelected = (index: number) => {
  swellStopsSelected.value[index] = !swellStopsSelected.value[index]
  const newURLState = swellStopsSelected.value.map((x) => (x ? '1' : '0')).join('')
  const newURL = new URL(window.location.href)
  newURL.searchParams.set('swell', newURLState)
  window.history.replaceState({}, '', newURL)
}
</script>

<template>
  <div class="division">
    <h2>swell ({{ numOfSwellStops }})</h2>
    <div class="card-row">
      <div
        class="card"
        v-for="(stop, index) in swellInfo"
        :key="stop.id"
        :class="{ 'card-selected': swellStopsSelected[index] }"
        @click="() => toggleSwellSelected(index)"
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
  padding: 3rem 0rem 3rem 1rem;
}

.card-row {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 1rem 0;
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
