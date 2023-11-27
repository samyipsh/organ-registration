export type Division = 'great' | 'swell' | 'pedal'
type stopInfo = {
  stopName: string
  id: number
  footagePitch?: string
  soloVoice?: string
}
export const swellInfo: stopInfo[] = [
  { stopName: 'LIEBLICH GEDACKT', footagePitch: "8'", soloVoice: 'clarinet', id: 1 },
  { stopName: 'GEDACKT', footagePitch: "8'", soloVoice: 'cor anglais', id: 2 },
  { stopName: 'VIOLA POMPOSA', footagePitch: "8'", soloVoice: 'orch. fl', id: 3 },
  { stopName: 'VIOLA CELESTE', footagePitch: "8'", id: 4 },
  { stopName: 'OCTAVE GEIGEN', footagePitch: "8'", id: 5 },
  { stopName: 'TRAVERSE FLUTE', footagePitch: "8'", id: 6 },
  { stopName: 'NASARD', footagePitch: "8'", id: 7 },
  { stopName: 'PICCOLO', footagePitch: "8'", id: 8 },
  { stopName: 'TIERCE', footagePitch: "8'", id: 9 },
  { stopName: 'FOURNITURE', footagePitch: "4'", id: 10 },
  { stopName: 'WALDHORN', footagePitch: "4'", id: 11 },
  { stopName: 'FRENCH TRUMPET', footagePitch: "4'", id: 12 },
  { stopName: 'OBOE', footagePitch: "4'", id: 13 },
  { stopName: 'TREMULANT', id: 14 },
  { stopName: 'CELESTA', id: 15 },
  { stopName: 'HARPSICHORD', id: 16 },
  { stopName: 'SWELL UNISON OFF', id: 17 },
  { stopName: 'MIDI ON SWELL', id: 18 },
  { stopName: 'SOLO ORGAN VOICES', id: 19 }
]

export const pedalInfo: stopInfo[] = [
  { stopName: 'CONTRE VIOLONE', footagePitch: "32'", id: 1 },
  { stopName: 'DIAPASON', footagePitch: "16'", id: 2 },
  { stopName: 'BOURDON', footagePitch: "16'", id: 3 },
  { stopName: 'LEIBLICH GEDACKT', footagePitch: "16'", id: 4 },
  { stopName: 'OCTAVE', footagePitch: "8'", id: 5 },
  { stopName: 'FLUTE', footagePitch: "8'", id: 6 },
  { stopName: 'CHORAL BASS', footagePitch: "4'", id: 7 },
  { stopName: 'MIXTURE', footagePitch: 'III', id: 8 },
  { stopName: 'POSAUNE', footagePitch: "16'", id: 9 },
  { stopName: 'TROMBA', footagePitch: "8'", id: 10 },
  { stopName: 'GREAT TO PEDAL', id: 11 },
  { stopName: 'SWELL TO PEDAL', id: 12 },
  { stopName: 'MIDI ON PEDAL', id: 13 }
]
