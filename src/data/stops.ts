// maybe wrap the info in a class to group together access and modification methods with data?

export type Division = 'great' | 'swell' | 'pedal'
type stopInfo = {
  stopName: string
  id: number
  footagePitch?: string
  soloVoice?: string
}
export const swellInfo: stopInfo[] = [
  { stopName: 'LIEBLICH GEDACKT', footagePitch: "8'", id: 1 },
  { stopName: 'GEDACKT', footagePitch: "8'", id: 2 },
  { stopName: 'VIOLA POMPOSA', footagePitch: "8'", id: 3 },
  { stopName: 'VIOLA CELESTE', footagePitch: "8'", id: 4 },
  { stopName: 'OCTAVE GEIGEN', footagePitch: "8'", id: 5 },
  { stopName: 'TRAVERSE FLUTE', footagePitch: "8'", soloVoice: 'ORCH. FL.', id: 6 },
  { stopName: 'NASARD', footagePitch: "8'", soloVoice: 'CLARINET', id: 7 },
  { stopName: 'PICCOLO', footagePitch: "8'", id: 8, soloVoice: 'FR HORN' },
  { stopName: 'TIERCE', footagePitch: "8'", soloVoice: 'COR ANGLAIS', id: 9 },
  { stopName: 'FOURNITURE', footagePitch: "4'", id: 10 },
  { stopName: 'WALDHORN', footagePitch: "4'", id: 11 },
  { stopName: 'FRENCH TRUMPET', footagePitch: "4'", id: 12 },
  { stopName: 'OBOE', footagePitch: "4'", id: 13 },
  { stopName: 'TREMULANT', id: 14 },
  { stopName: 'CELESTA', id: 15 },
  { stopName: 'HARPSICH.', id: 16 },
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

export const greatInfo: stopInfo[] = [
  { stopName: 'DIAPASON', footagePitch: "32'", soloVoice: 'PRINZIPAL', id: 1 },
  { stopName: 'HARMONIC FLUTE', footagePitch: "16'", soloVoice: 'MET. GEDACKT', id: 2 },
  { stopName: 'FLUTE CELESTE II', footagePitch: "16'", id: 3 },
  { stopName: 'OCTAVE', footagePitch: "16'", soloVoice: 'OCTAV', id: 4 },
  { stopName: 'SPITZFLÖTE', footagePitch: "8'", id: 5 },
  { stopName: 'FIFTEENTH', footagePitch: "8'", id: 6 },
  { stopName: 'MIXTURE', footagePitch: "4'", id: 7 },
  { stopName: 'TROMBA', footagePitch: 'III', id: 8 },
  { stopName: 'KRUMHORN', footagePitch: "16'", id: 9 },
  { stopName: 'TREMULANT', footagePitch: "8'", id: 10 },
  { stopName: 'CHIMES', id: 11 },
  { stopName: 'SWELL TO GREAT', id: 12 },
  { stopName: 'MIDI ON GREAT', id: 13 },
  { stopName: 'CLASSIC VOICING GT-PD', id: 14 }
]
