<script setup lang="ts">
import { ref, computed, reactive, watchEffect, watch } from 'vue'
import { pedalInfo, swellInfo, greatInfo } from './data/stops'
import menuSVG from '@/assets/menu-icon.svg'

const numOfPedalStops = ref(pedalInfo.length)
const numOfSwellStops = ref(swellInfo.length)
const numOfGreatStops = ref(greatInfo.length)
const PEDAL_URL_PARAM_KEY = 'pedal'
const SWELL_URL_PARAM_KEY = 'swell'
const GREAT_URL_PARAM_KEY = 'great'
// TODO: check if can just use html native select with `multiple` attribute then use v-bind
// https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_select_multiple

// TODO: properly Type the params type
const DEFAULT_PEDAL_STATE = '0'.repeat(numOfPedalStops.value)
const DEFAULT_SWELL_STATE = '0'.repeat(numOfSwellStops.value)
const DEFAULT_GREAT_STATE = '0'.repeat(numOfGreatStops.value)

const url = reactive({
  base: window.location.origin + window.location.pathname,
  params: new Map([
    [PEDAL_URL_PARAM_KEY, DEFAULT_PEDAL_STATE],
    [SWELL_URL_PARAM_KEY, DEFAULT_SWELL_STATE],
    [GREAT_URL_PARAM_KEY, DEFAULT_GREAT_STATE]
  ])
})

const urlCurrent = computed(() => {
  const newURL =
    `${url.base}?` +
    Array.from(url.params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  return newURL
})
watchEffect(() => {
  window.history.replaceState({}, '', urlCurrent.value)
})
const copyURL = () => window.navigator.clipboard.writeText(urlCurrent.value)
// computed not used as inputText should be updatable by user
// as an alternative way to load a URL (for mobile users)
// watch function used so that it is updated on urlCurrent change
const inputText = ref(urlCurrent.value)
watch(urlCurrent, (newURL) => (inputText.value = newURL))

parseURLQueryParams(window.location.search)
function parseURLQueryParams(urlQueryStr: string) {
  const binaryRegex = (n: number) => new RegExp(`^[01]{${n}}$`)
  const isBinaryOfCorrectLen = (s: string, len: number) => {
    return binaryRegex(len).test(s)
  }

  const urlParams = new URLSearchParams(urlQueryStr)
  const urlPedalState = urlParams.get(PEDAL_URL_PARAM_KEY)
  const urlSwellState = urlParams.get(SWELL_URL_PARAM_KEY)
  const urlGreatState = urlParams.get(GREAT_URL_PARAM_KEY)

  if (urlPedalState && isBinaryOfCorrectLen(urlPedalState, numOfPedalStops.value)) {
    url.params.set('pedal', urlPedalState)
  }
  if (urlSwellState && isBinaryOfCorrectLen(urlSwellState, numOfSwellStops.value)) {
    url.params.set('swell', urlSwellState)
  }
  if (urlGreatState && isBinaryOfCorrectLen(urlGreatState, numOfGreatStops.value)) {
    url.params.set('great', urlGreatState)
  }
}

const toastText = ref(
  'Hi! use this page to\n(1) easily generate copyable registration text for your organ [for e-storage perhaps]\n(2) easily visualize and share organ stops'
)
const isControlOpen = ref(true)
const toggleControlOpen = () => (isControlOpen.value = !isControlOpen.value)

const flipBit = (s: string, index: number) => {
  return s.slice(0, index) + (s[index] === '1' ? '0' : '1') + s.slice(index + 1)
}

const togglePedalSelected = (index: number) => {
  const urlState = url.params.get(PEDAL_URL_PARAM_KEY)!
  const newURLState = flipBit(urlState, index)
  url.params.set(PEDAL_URL_PARAM_KEY, newURLState)
}

const toggleSwellSelected = (index: number) => {
  const urlState = url.params.get(SWELL_URL_PARAM_KEY)!
  const newURLState = flipBit(urlState, index)
  url.params.set(SWELL_URL_PARAM_KEY, newURLState)
}

const toggleGreatSelected = (index: number) => {
  const urlState = url.params.get(GREAT_URL_PARAM_KEY)!
  const newURLState = flipBit(urlState, index)
  url.params.set(GREAT_URL_PARAM_KEY, newURLState)
}
const pedalInstrumentsUsed = computed(() => {
  const instumentsUsed = pedalInfo
    .filter((stop, i) => url.params.get(PEDAL_URL_PARAM_KEY)![i] === '1')
    .map((s) => `${s.stopName}${s.footagePitch ? `-${s.footagePitch.slice(0, -1)}` : ''}`)
    .join(', ')
  return `pedal: (${instumentsUsed})`
})

const swellInstrumentsUsed = computed(() => {
  const isSoloOrganToggled = url.params.get(SWELL_URL_PARAM_KEY)![18] === '1'
  const instumentsUsed = swellInfo
    .filter((stop, i) => url.params.get(SWELL_URL_PARAM_KEY)![i] === '1')
    .map(
      (s) =>
        `${isSoloOrganToggled && s.soloVoice ? s.soloVoice : s.stopName}${
          s.footagePitch ? `-${s.footagePitch.slice(0, -1)}` : ''
        }`
    )
    .join(', ')
  return `swell: (${instumentsUsed})`
})

const greatInstrumentsUsed = computed(() => {
  const isAlternateInstrumentToggled = url.params.get(GREAT_URL_PARAM_KEY)![13] === '1'
  const instumentsUsed = greatInfo
    .filter((stop, i) => url.params.get(GREAT_URL_PARAM_KEY)![i] === '1')
    .map(
      (s) =>
        `${isAlternateInstrumentToggled && s.soloVoice ? s.soloVoice : s.stopName}${
          s.footagePitch ? `-${s.footagePitch.slice(0, -1)}` : ''
        }`
    )
    .join(', ')
  return `great: (${instumentsUsed})`
})

const instrumentsUsed = computed(() => {
  return `${pedalInstrumentsUsed.value}\n${swellInstrumentsUsed.value}\n${greatInstrumentsUsed.value}`
})

const resetStops = () => {
  url.params.set(PEDAL_URL_PARAM_KEY, DEFAULT_PEDAL_STATE)
  url.params.set(SWELL_URL_PARAM_KEY, DEFAULT_SWELL_STATE)
  url.params.set(GREAT_URL_PARAM_KEY, DEFAULT_GREAT_STATE)
}
const copyRegistration = () => {
  window.navigator.clipboard.writeText(instrumentsUsed.value)
}

// TODO: fix so that when wrong input is parsed it explains which param is wrong
const loadInputQueryParam = () => {
  const inputQueryParam = inputText.value.split('?')[1]
  parseURLQueryParams(inputQueryParam)
}
</script>

<template>
  <div class="main">
    <!--  -->
    <div class="toast">{{ toastText }}</div>
    <!--  -->
    <div>
      <button class="menuButton" @click="() => toggleControlOpen()">
        <img :src="menuSVG" alt="Menu Icon" style="width: 2rem; height: 2rem" />
      </button>
      <div class="controls" v-if="isControlOpen">
        <input type="text" v-model="inputText" />
        <div class="button-row">
          <button @click="loadInputQueryParam">Load</button>
          <button @click="resetStops">Reset</button>
          <button @click="copyURL">Copy URL</button>
          <button @click="copyRegistration">Copy Registration</button>
        </div>
        <textarea :value="instrumentsUsed" readonly rows="3"></textarea>
      </div>
    </div>
    <!--  -->
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
            :class="{ 'card-selected': url.params.get(PEDAL_URL_PARAM_KEY)?.[index] === '1' }"
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
            :class="{ 'card-selected': url.params.get(SWELL_URL_PARAM_KEY)?.[index] === '1' }"
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
            :class="{ 'card-selected': url.params.get(GREAT_URL_PARAM_KEY)?.[index] === '1' }"
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
.toast {
  white-space: pre-wrap;
  padding: 1rem 1rem;
  border: 1px solid #000;
  background: rgb(30, 30, 30);
  margin-bottom: 1rem;
  inset: 1rem;
}

.main {
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: rgb(42, 42, 42);
  color: #fcfbfb;
  padding: 1rem;
}

.menuButton {
  border-radius: 3px;
  border: none;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}
.controls {
  background-color: #fff;
  border-radius: 1rem;
  color: #111;
  padding: 3rem 2rem;
  margin-bottom: 1rem;
}

.controls input {
  width: 50%;
}

.button-row {
  display: flex;
  gap: 10px;
  padding: 0.5rem 1rem 2rem 0rem;
}

textarea {
  white-space: pre-wrap;
  height: fit-content;
  width: 50%;
  padding: 2rem 1.5rem;
}

.division {
  width: 100vw;
  background-color: #e9e8e8;
  border-radius: 1rem;
  margin-bottom: 1rem;
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
