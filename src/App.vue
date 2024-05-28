<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { pedalInfo, swellInfo, greatInfo } from './data/stops'
import menuSVG from '@/assets/menu-icon.svg'
import { Base64Conversion } from './utils/binaryConversion'

// TODO: remove ref; not required since this is constant and will not change from start to end of app
// ie reactivity is not required
const numOfPedalStops = pedalInfo.length
const numOfSwellStops = swellInfo.length
const numOfGreatStops = greatInfo.length
console.log("numOfStops (pedal, swell, great): ", numOfPedalStops, numOfSwellStops, numOfGreatStops)

// const PEDAL_URL_PARAM_KEY = 'pedal'
// const SWELL_URL_PARAM_KEY = 'swell'
// const GREAT_URL_PARAM_KEY = 'great'
const OPTIONS_URL_PARAM_KEY = "options"
const REGISTRATIONS_URL_PARAM_KEY = "registrations"
// TODO: check if can just use html native select with `multiple` attribute then use v-bind
// https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_select_multiple

const DEFAULT_PEDAL_STATE = '0'.repeat(numOfPedalStops)
const DEFAULT_SWELL_STATE = '0'.repeat(numOfSwellStops)
const DEFAULT_GREAT_STATE = '0'.repeat(numOfGreatStops)
const DEFAULT_STOPS_STATE_BASE2 = DEFAULT_PEDAL_STATE + DEFAULT_SWELL_STATE + DEFAULT_GREAT_STATE
const DEFAULT_STOPS_STATE_BASE64 = Base64Conversion.encode(DEFAULT_STOPS_STATE_BASE2)
console.log(DEFAULT_STOPS_STATE_BASE64, DEFAULT_STOPS_STATE_BASE64.length)

const URL_BASE = window.location.origin + window.location.pathname

type RegistrationState = {
  // TODO: add remarks
  // decimal of binary string (3 options: name, diff, all) 
  // 0 is default (logical defaults will apply)
  name: string;
  view_option: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  stops: string; // binary string (pedal, swell, great stops concatenated) without padding
  remarks: string;
}

const curRegistration = ref(0)

// TODO: rename url to 'globalState'
type UrlState = {
  options: Map<string, boolean>;
  registrations: Array<RegistrationState>;
  // params: Map<string, string>;
}
const url: UrlState = reactive({
  options: new Map<string, boolean>([
    ["visualize_next", true]
  ]),
  registrations: [{ name: "", view_option: 0, stops: DEFAULT_STOPS_STATE_BASE2, remarks: "" }], // array of stop objects
})


const registrationStr = (registration: RegistrationState): string => {
  return `${registration.name}:${registration.view_option}:${registration.stops}:${registration.remarks}`
}
const urlCurrent = computed(() => {
  const newURL =
    `${URL_BASE}?` +
    `options=` + Array(url.options.values())
      .map((v) => v ? '1' : '0')
      .join('') +
    `&` +
    `registrations=` + url.registrations
      .map(registrationStr)
      .join('~')
  return newURL
})
watch(urlCurrent, () => {
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
  if (urlQueryStr === "" || urlQueryStr === "?") return
  // console.log("urlQueryStr: ", urlQueryStr)
  // ?options=...&registrations= r1 ~ r2 ~ r3 ...
  const binaryRegex = (n: number) => new RegExp(`^[01]{${n}}$`)
  const isBinaryOfCorrectLen = (s: string, len: number) => {
    return binaryRegex(len).test(s)
  }

  const urlParams = new URLSearchParams(urlQueryStr)
  // const optionsParams = urlParams.get(OPTIONS_URL_PARAM_KEY)
  const r = urlParams.get(REGISTRATIONS_URL_PARAM_KEY)
  console.log(r)
  const urlRegistrations = r?.split("~")
  console.log(urlRegistrations)

  // if (url.registrations[0]) url.registrations[0] =  
  const newRegistrationsState: Array<RegistrationState> = []
  for (const registration of urlRegistrations ?? []) {
    const [name, view_option, stops, remarks] = registration.split(":")
    console.log("name", name, "view_option", view_option, "stops", stops, "remarks", remarks)
    const newRegistration: RegistrationState = {
      name,
      view_option: parseInt(view_option) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      stops,
      remarks
    }
    newRegistrationsState.push(newRegistration)
  }
  url.registrations = newRegistrationsState
}

const toastText = ref(
  'Hi! use this page to\n(1) easily generate copyable registration text for your organ [for e-storage perhaps]\n(2) easily visualize and share organ stops'
)
const isControlOpen = ref(true)
const toggleControlOpen = () => (isControlOpen.value = !isControlOpen.value)

const flipBit = (s: string, index: number) => {
  return s.slice(0, index) + (s[index] === '1' ? '0' : '1') + s.slice(index + 1)
}

const offset = (division: "pedal" | "swell" | "great") => {
  return division === "pedal" ? 0
    : division === "swell" ? numOfPedalStops
      : numOfPedalStops + numOfSwellStops
}
const toggleDivision = (index: number, division: "pedal" | "swell" | "great") => {
  console.assert(url.registrations.length > curRegistration.value, "registration not found")
  const urlState = url.registrations[curRegistration.value].stops
  const newURLState = flipBit(urlState, offset(division) + index)
  url.registrations[curRegistration.value].stops = newURLState
}

const pedalInstrumentsUsed = computed(() => {
  const instumentsUsed = pedalInfo
    .filter((_, i) => url.registrations[curRegistration.value].stops[offset("pedal") + i] === '1')
    .map((s) => `${s.stopName}${s.footagePitch ? `-${s.footagePitch.slice(0, -1)}` : ''}`)
    .join(', ')
  return `pedal: (${instumentsUsed})`
})

const swellInstrumentsUsed = computed(() => {
  const ALTERNATE_INSTR_IDX = 18
  const isSoloOrganToggled = url.registrations[curRegistration.value].stops[offset("swell") + ALTERNATE_INSTR_IDX] === '1'
  const instumentsUsed = swellInfo
    .filter((_, i) => url.registrations[curRegistration.value].stops[offset("swell") + i] === '1')
    .map(
      (s) =>
        `${isSoloOrganToggled && s.soloVoice ? s.soloVoice : s.stopName}${s.footagePitch ? `-${s.footagePitch.slice(0, -1)}` : ''
        }`
    )
    .join(', ')
  return `swell: (${instumentsUsed})`
})

const greatInstrumentsUsed = computed(() => {
  const ALTERNATE_INSTR_IDX = 13
  const isAlternateInstrumentToggled = url.registrations[curRegistration.value].stops[offset("great") + ALTERNATE_INSTR_IDX] === '1'
  const instumentsUsed = greatInfo
    .filter((_, i) => url.registrations[curRegistration.value].stops[offset("great") + i] === '1')
    .map(
      (s) =>
        `${isAlternateInstrumentToggled && s.soloVoice ? s.soloVoice : s.stopName}${s.footagePitch ? `-${s.footagePitch.slice(0, -1)}` : ''
        }`
    )
    .join(', ')
  return `great: (${instumentsUsed})`
})

const instrumentsUsed = computed(() => {
  return `${pedalInstrumentsUsed.value}\n${swellInstrumentsUsed.value}\n${greatInstrumentsUsed.value}`
})

const resetStops = () => {
  url.registrations[curRegistration.value].stops = DEFAULT_STOPS_STATE_BASE2
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
        <div class="stops-pagination">
          <a v-for="r_idx in (url.registrations.length)" :key="r_idx" @click="() => curRegistration = r_idx - 1"
            :class="{ active: curRegistration === r_idx - 1, empty: url.registrations[r_idx - 1].stops === DEFAULT_STOPS_STATE_BASE2 }">
            {{ r_idx }}
          </a>
        </div>
        <div class="stop-details">
          <div>
            <label for="sname">Registration name:</label><br>
            <!-- TODO: not sure why v-model= doesnt work... it should work for nested properties in Vue 3 and works for view_options below-->
            <input :value="url.registrations[curRegistration].name"
              @input="(event) => { url.registrations[curRegistration].name = (event.target as HTMLInputElement)?.value }"
              type="text" id="regname" name="regname">
          </div>
          <div class="remarks">
            <label for="remarks">Remarks:</label><br>
            <!-- <input :value="url.registrations[curRegistration].remarks"
              @input="(event) => { url.registrations[curRegistration].remarks = (event.target as HTMLInputElement)?.value }"
              type="text" id="remarks" name="regname"> -->
            <input v-model="url.registrations[curRegistration].remarks" type="text" id="remarks" name="regname">
          </div>
          <div>
            <label for="voptions">View options:</label><br>
            <select v-model="url.registrations[curRegistration].view_option" type="text" id="voptions" name="voptions">
              <option value="0">DEFAULT</option> <!-- default 000-->
              <option value="7">ALL INFO</option> <!-- 111 -->
              <option value="1">stops_details only</option> <!-- 001 -->
              <option value="2">different_stops only </option> <!-- 010 -->
              <option value="3">different_stops & stop_details</option> <!-- 011 -->
              <option value="4">registration_name only</option> <!-- 100 -->
              <option value="5">registration_name & stop_details</option> <!-- 101 -->
              <option value="6">registration_name & difference</option> <!-- 110 -->
            </select>
          </div>
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
          <div class="card" v-for="(stop, index) in pedalInfo" :key="stop.id"
            :class="{ 'card-selected': url.registrations[curRegistration].stops[offset('pedal') + index] === '1' }"
            @click="() => toggleDivision(index, 'pedal')">
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
          <div class="card" v-for="(stop, index) in swellInfo" :key="stop.id"
            :class="{ 'card-selected': url.registrations[curRegistration].stops[offset('swell') + index] === '1' }"
            @click="() => toggleDivision(index, 'swell')">
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
          <div class="card" v-for="(stop, index) in greatInfo" :key="stop.id"
            :class="{ 'card-selected': url.registrations[curRegistration].stops[offset('great') + index] === '1' }"
            @click="() => toggleDivision(index, 'great')">
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
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #fff;
  border-radius: 1rem;
  color: #111;
  padding: 3rem 2rem;
  margin-bottom: 1rem;
}

.controls input {
  width: 50%;
}

.stops-pagination {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.stops-pagination a {
  color: black;
  padding: 8px 1rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
}

.stops-pagination a.active {
  background-color: #0e4ec653;
  border: 1px solid #dddddd72;
}

.stops-pagination a:hover {
  background-color: #ddd;
}

.stop-details {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 0.5rem 0;
  width: 50%
}

.remarks {
  display: block;
  flex-grow: 1;
}

.stop-details input {
  width: 100%;
}

textarea {
  white-space: pre-wrap;
  height: fit-content;
  width: 50%;
  padding: 2rem 1.5rem;
}

/* Apply these styles when the viewport is 600px or less */
@media (max-width: 900px) {

  .controls input,
  textarea {
    width: 100%;
  }
}

.button-row {
  display: flex;
  gap: 10px;
  padding: 0.5rem 1rem 2rem 0rem;
}

.division {
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
  text-overflow: ellipsis;
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
