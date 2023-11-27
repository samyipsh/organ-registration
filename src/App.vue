<script setup lang="ts">
import { ref } from 'vue'
import { pedalInfo, swellInfo } from './data/stops'

const urlParams = new URLSearchParams(window.location.search)
console.log('urlParams', urlParams)
for (const [key, value] of urlParams) {
  console.log(key, value)
}

const numOfPedalStops = ref(pedalInfo.length)
const pedalURLState = urlParams.get('pedal')
if (pedalURLState == null) {
  throw new Error('pedal URL param is null')
}
if (pedalURLState.length !== numOfPedalStops.value) {
  throw new Error('pedal URL param is not the correct length')
}
const pedalStopsSelected = ref(pedalURLState.split('').map((x) => x === '1'))
const togglePedalSelected = (index: number) => {
  pedalStopsSelected.value[index] = !pedalStopsSelected.value[index]
  const newURLState = pedalStopsSelected.value.map((x) => (x ? '1' : '0')).join('')
  const newURL = new URL(window.location.href)
  newURL.searchParams.set('pedal', newURLState)
  window.history.replaceState({}, '', newURL)
}

const numOfSwellStops = ref(swellInfo.length)
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
  <div>
    <div class="division">
      <h2>pedal ({{ numOfPedalStops }})</h2>
      <div class="card-row">
        <div
          class="card"
          v-for="(stop, index) in pedalInfo"
          :key="stop.id"
          :class="{ 'card-selected': pedalStopsSelected[index] }"
          @click="() => togglePedalSelected(index)"
        >
          <div class="card-body">
            <p class="card-top" v-if="stop.soloVoice">{{ stop.soloVoice }}</p>
            <h5 class="card-title">{{ stop.stopName }}</h5>
            <p class="card-footer">{{ stop?.footagePitch }}</p>
          </div>
        </div>
      </div>
    </div>
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
            <p class="card-top" v-if="stop.soloVoice">{{ stop.soloVoice }}</p>
            <h5 class="card-title">{{ stop.stopName }}</h5>
            <p class="card-footer">{{ stop?.footagePitch }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.division {
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
  width: 6rem;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #000;
  background-color: cornsilk;
  color: #111;
  padding: 1rem 0;
  margin-right: 0.125rem;
  border-radius: 0 0 25% 25%;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
  height: 100%;
  min-height: 5rem;
}

.card-title {
  font-weight: 700;
  padding: 0 0.5rem;
  width: 100%;
}

.card-top {
  justify-self: flex-start;
  flex-grow: 1;
  height: 1.5rem;
}

.card-footer {
  height: 1.5rem;
}

.card-selected {
  background-color: green;
  color: #fff;
}
</style>
