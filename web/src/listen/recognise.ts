// Recognition behind the interface in prd.md:
//   recognise(audioWindow) -> [{ birdId or latinName, confidence }]
// The engine is parked (prd.md, "Recognition"). Until it is chosen this is a
// stub that returns fixed results, so LYTT, saving and SAMLING can be built
// and tested. Do not add a model here without Eirik's decision.

export interface Match {
  birdId?: string;    // one of the 18 in data/birds/index.json
  latinName?: string; // a bird outside Tipp
  confidence: number; // 0 to 1
}

// Mono samples at sampleRate, the last few seconds the microphone heard.
export interface AudioWindow {
  samples: Float32Array;
  sampleRate: number;
}

export const isStub = true;

// Fixed answer, the one in design/Listen.dc.html: blackbird, song thrush,
// and redwing, which is not one of the 18.
export async function recognise(_window: AudioWindow): Promise<Match[]> {
  return [
    { birdId: 'svarttrost', confidence: 0.86 },
    { birdId: 'maltrost', confidence: 0.09 },
    { latinName: 'Turdus iliacus', confidence: 0.03 },
  ];
}
