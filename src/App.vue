<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { pedalInfo, swellInfo, greatInfo } from './data/stops'

// TODO: check if can just use html native select with `multiple` attribute then use v-bind
// https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_select_multiple

onMounted(() => {
  console.log('mounted')
  toastText.value = 'new toast value'
})

const toastText = ref("i'm a toast")
const isControlOpen = ref(true)
const toggleControlOpen = () => (isControlOpen.value = !isControlOpen.value)

const urlParams = new URLSearchParams(window.location.search)
console.log('urlParams', urlParams)
for (const [key, value] of urlParams) {
  console.log(key, value)
}
const setURLParam = (key: string, value: string) => {
  const newURL = new URL(window.location.href)
  newURL.searchParams.set(key, value)
  window.history.replaceState({}, '', newURL)
}
const getURLParam = (key: string, expectedLen: number) => {
  const urlState = urlParams.get(key)
  if (urlState == null) {
    throw new Error(key + ': URL param is null')
  }
  if (urlState.length !== expectedLen) {
    throw new Error(key + ': URL param is not the correct length of ' + expectedLen)
  }
  return urlState
}

const numOfPedalStops = ref(pedalInfo.length)
const PEDAL_URL_PARAM_KEY = 'pedal'
const pedalURLState = getURLParam(PEDAL_URL_PARAM_KEY, numOfPedalStops.value)
const pedalStopsSelected = ref(pedalURLState.split('').map((x) => x === '1'))
const togglePedalSelected = (index: number) => {
  pedalStopsSelected.value[index] = !pedalStopsSelected.value[index]
  const newURLState = pedalStopsSelected.value.map((x) => (x ? '1' : '0')).join('')
  setURLParam(PEDAL_URL_PARAM_KEY, newURLState)
}

const numOfSwellStops = ref(swellInfo.length)
const SWELL_URL_PARAM_KEY = 'swell'
const swellURLState = getURLParam(SWELL_URL_PARAM_KEY, numOfSwellStops.value)
const swellStopsSelected = ref(swellURLState.split('').map((x) => x === '1'))
const toggleSwellSelected = (index: number) => {
  swellStopsSelected.value[index] = !swellStopsSelected.value[index]
  const newURLState = swellStopsSelected.value.map((x) => (x ? '1' : '0')).join('')
  setURLParam(SWELL_URL_PARAM_KEY, newURLState)
}

const numOfGreatStops = ref(greatInfo.length)
const GREAT_URL_PARAM_KEY = 'great'
const greatURLState = getURLParam(GREAT_URL_PARAM_KEY, numOfGreatStops.value)
const greatStopsSelected = ref(greatURLState.split('').map((x) => x === '1'))
const toggleGreatSelected = (index: number) => {
  greatStopsSelected.value[index] = !greatStopsSelected.value[index]
  const newURLState = greatStopsSelected.value.map((x) => (x ? '1' : '0')).join('')
  setURLParam(GREAT_URL_PARAM_KEY, newURLState)
}

// use a computerRef
// const instrumentsUsed = computed(() => )
// change format of displayed stop
const swellInstrumentsUsed = computed(() => {
  return swellInfo
    .filter((stop, i) => swellStopsSelected.value[i])
    .map((s) => `${s.stopName}-${s.footagePitch}`)
})
</script>

<template>
  <div class="main">
    <div class="toast">{{ toastText }}, {{ swellInstrumentsUsed }}</div>
    <div class="controls">
      <button @click="() => toggleControlOpen()">toggle</button>
      <div v-if="isControlOpen">
        <input type="text" :value="toastText" readonly />
      </div>
    </div>
    <div>
      <div class="division">
        <h2>
          pedal <span>({{ numOfPedalStops }})</span>
        </h2>
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
        <h2>
          swell <span>({{ numOfSwellStops }})</span>
        </h2>
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
      <div class="division">
        <h2>
          great <span>({{ numOfGreatStops }})</span>
        </h2>
        <div class="card-row">
          <div
            class="card"
            v-for="(stop, index) in greatInfo"
            :key="stop.id"
            :class="{ 'card-selected': greatStopsSelected[index] }"
            @click="() => toggleGreatSelected(index)"
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
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #111;
  color: #fff;
  padding: 1rem;
}

.division {
  width: 100vw;
  background-color: rgba(209, 209, 209, 0.711);
  padding: 2rem 0;
  color: #111111;
  padding: 3rem 0rem 3rem 1rem;
}
.division h2 {
  font-size: 1.5rem;
  padding: 0 0.5rem;
}

.division h2 span {
  font-size: 1rem;
  font-weight: 400;
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
  min-height: 1.5rem;
  font-size: 0.75rem;
}

.card-footer {
  height: 1.5rem;
}

.card-selected {
  background-color: green;
  color: #fff;
}
</style>
