// What the interface has set. The engine's own state (knob values,
// overrides, the phrase) comes back from the worklet; this is only what the
// host sends, so it can be sent again after another screen changed it.

export interface State {
  bird: string;
  sex: number;
  age: number;
  season: number;
  time: number;
  type: number;
  place: number;
  apOn: boolean;
  latch: boolean;
  hold: number;
  speed: number;
  shift: boolean;
  draw: boolean;
  kept: boolean;
  playing: boolean;
}

export function initialState(): State {
  return {
    bird: 'svarttrost', sex: 0, age: 0, season: 0, time: 0, type: 0, place: 0,
    apOn: true, latch: true, hold: 3, speed: 0, shift: false, draw: false, kept: false, playing: false,
  };
}
