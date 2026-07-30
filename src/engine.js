/**
 * engine.js — Sogoian Personality Assessment
 *
 * Responsibilities:
 *  1. Define all twelve archetype objects (coordinate, name, analysis, image path).
 *  2. Accumulate a running score vector from answer selections.
 *  3. Normalize the accumulated score to the [-2, +2] range before comparison.
 *  4. Resolve the normalized score to the closest archetype via Euclidean distance.
 *  5. Expose diagnostic output in development mode.
 *
 * Vector axis order: [Projection, Sight, Order, Resonance, Alignment, Action]
 *   Projection  — Inward (-2) to Outward (+2)
 *   Sight       — Concrete (-2) to Abstract (+2)
 *   Order       — Structured (-2) to Chaotic (+2)
 *   Resonance   — Detached (-2) to Empathetic (+2)
 *   Alignment   — Selfless (-2) to Self-Directed (+2)
 *   Action      — Flow (-2) to Imposing (+2)
 *
 * NORMALIZATION NOTE:
 *   Each question contributes one answer vector with values in [-2, +2].
 *   With 25 questions, raw axis sums range from -50 to +50.
 *   Dividing by the question count produces a per-question average in [-2, +2],
 *   which is directly comparable to the archetype coordinates.
 *   Without normalization, archetype coordinates are effectively irrelevant at raw scale.
 *
 * DIAGNOSTIC MODE:
 *   Set DIAGNOSTIC_MODE = true to log score details to the browser console.
 *   Always set back to false before deployment.
 */

'use strict';

// ── CONFIGURATION ─────────────────────────────────────────────────────────────

const DIAGNOSTIC_MODE = false;

// ── ARCHETYPE DEFINITIONS ─────────────────────────────────────────────────────
//
// Coordinates derived from personalitiesoverview.md axis profiles.
// Encoding:  +2 = strong positive pole, +1 = moderate positive pole,
//             0 = neutral/variable, -1 = moderate negative pole, -2 = strong negative pole
//
// Axis order: [Projection, Sight, Order, Resonance, Alignment, Action]
//
// CALIBRATION NOTE: These coordinates are your primary tuning surface.
// Adjust individual values to expand or contract each archetype's gravitational pull.
// Increasing separation between similar archetypes on their distinguishing axes
// is the most reliable way to reduce routing overlap.

const ARCHETYPES = [
  {
    key: 'theGeneral',
    name: 'The General',
    // Outward +2, Concrete -1, Structured -2, Detached -2, Self-Directed -1, Imposing +2
    // Distinguishes from Overachiever via Detached (-2) and Self-Directed (-1 vs +1)
    // Distinguishes from Manipulator via visible authority (Outward +2) vs engineered influence
    coordinate: [2, -1, -2, -2, -1, 2],
    image: 'assets/images/The_General.png',
    analysis: `You have always understood that the world is a set of variables to be managed, not a collection of people to be considered. You do not lack empathy so much as you have correctly identified it as a liability in most operational contexts. Structure is not a preference for you — it is a prerequisite for everything else to function. You arrive at conclusions before the conversation begins and spend the discussion waiting for everyone else to catch up. The people who misread you as cold are the same people who would be grateful for your decisions in a genuine emergency. You have learned to tolerate the misreading. You have also learned that the tolerance has a ceiling, and that you installed that ceiling yourself.`
  },
  {
    key: 'theCaretaker',
    name: 'The Caretaker',
    // Outward +1, Concrete -2, Structured -1, Empathetic +2, Selfless -2, Imposing -1
    // CORRECTED: Alignment was +2 (Self-Directed), must be -2 (Selfless — overview: "Selfless, very high")
    // CORRECTED: Projection was -1 (Inward), must be +1 (Outward — overview: "Outward, high")
    coordinate: [1, -2, -1, 2, -2, -1],
    image: 'assets/images/The_Caretaker.png',
    analysis: `You are the load-bearing wall in every room you enter, and no one has thought to check whether you are tired. Your care is not performed — it is structural, reflexive, and largely invisible to the people it sustains. You have a precise sense of what everyone around you needs and a deeply impractical compulsion to provide it. The cost of this is not something you discuss. You have built an architecture of reliability that others navigate without knowing they are inside it. The resentment, when it arrives, is quiet and self-directed. You will absorb the unfairness of your own generosity and describe it, if pressed, as simply how things are.`
  },
  {
    key: 'theOverachiever',
    name: 'The Overachiever',
    // Outward +2, Concrete -1, Structured -2, Detached -1, Self-Directed +1, Imposing +2
    // Distinguishes from General via Alignment (+1 Self-Directed vs -1) and Resonance (-1 vs -2)
    coordinate: [2, -1, -2, -1, 1, 2],
    image: 'assets/images/The_Overacheiver.png',
    analysis: `The finish line is a location you pass through without stopping because you have already identified the next one. You understand that this is not entirely healthy and you have decided not to care. Your standards are not a performance of rigor — they are the minimum threshold below which things stop being worth doing. You have made the mistake of assuming others share this threshold and have been disappointed in ways you no longer bother expressing. What drives you is not approval, though approval is a useful data point. What drives you is the specific discomfort of knowing you have not yet become what you are capable of being. That discomfort is chronic and, if you are honest, you are not sure you would remove it if you could.`
  },
  {
    key: 'theAngel',
    name: 'The Angel',
    // Neutral 0, Abstract +1, Structured -1, Empathetic +2, Selfless -2, Flow -2
    // CORRECTED: Alignment was +2 (Self-Directed), must be -2 (Selfless — overview: "Selfless, very high")
    // CORRECTED: Action was -2 which is correct (Flow, high — overview confirmed)
    // Distinguishes from Caretaker: Angel is Abstract (+1), Caretaker is Concrete (-2)
    // Distinguishes from Inmyfeels: Angel emotion moves outward; Inmyfeels emotion is self-centered frame
    coordinate: [0, 1, -1, 2, -2, -2],
    image: 'assets/images/The_Angel.png',
    analysis: `You experience other people's suffering as your own, which is either a gift or a design flaw depending on the day. You do not help people because it reflects well on you. You help them because the alternative — knowing someone is in pain and doing nothing — creates a specific dissonance you cannot endure. People describe you as good in a tone that occasionally sounds like pity. You have noticed this. The weight of chronic compassion is something you carry in silence because expressing it would require making your goodness into a complaint, and you find that morally untidy. You are not naive. You simply choose, repeatedly and with full awareness of the cost, to behave as though people deserve better than they usually receive.`
  },
  {
    key: 'theInmyfeels',
    name: 'The Inmyfeels',
    // Neutral/variable 0, Abstract +1, Chaotic +1, Empathetic +2, Self-Directed +1, Flow -1
    // CORRECTED: Projection was -2 (Strongly Inward), overview says "Neutral/variable" → 0
    // Distinguishes from Angel: Alignment +1 (self-referential) vs -2 (truly selfless)
    coordinate: [0, 1, 1, 2, 1, -1],
    image: 'assets/images/The_Inmyfeels.png',
    analysis: `You live at a frequency that most people cannot quite receive. Your interior experience is dense, layered, and in near-constant motion, and you have spent years developing the vocabulary to describe it to people who process the world at a different resolution. The irony is that the richer your interior life becomes, the harder it is to export. You feel things in full before you have words for them, and by the time the words arrive the moment has already shifted. You are not performing sensitivity — you are genuinely wired for depth, which means shallow environments cost you more than they cost others. You have made a partial peace with this. Partial.`
  },
  {
    key: 'theCreative',
    name: 'The Creative',
    // Inward -1, Abstract +2, Chaotic +1, Neutral 0, Self-Directed +1, Flow -1
    // Distinguishes from Mad Scientist: Collaborative (neutral Resonance, lower Action)
    // Distinguishes from Fairy: Compelled to make something (lower Projection, more grounded)
    coordinate: [-1, 2, 1, 0, 1, -1],
    image: 'assets/images/The_Creative.png',
    analysis: `Your mind does not move in straight lines, which is not a flaw in the architecture — it is the architecture. You make connections that others miss not because you are smarter but because you are looking at a fundamentally different map. Structure is something you understand well enough to dismantle productively. You are drawn to the unfinished, the uncertain, the still-becoming. The fully resolved bores you in a way that is difficult to disguise. You have a high tolerance for ambiguity and a low tolerance for people who mistake that comfort for lack of rigor. The work you produce when left alone in a room with a problem is frequently the thing no one else thought to try.`
  },
  {
    key: 'theFairy',
    name: 'The Fairy',
    // CORRECTED: Was [2,1,2,1,0,-2] — Projection +2 (Outward). Overview says "Inward, high" → -2
    // Inward -2, Abstract +2, Chaotic +1, Slight Empathy +1, Neutral 0, Flow -2
    // Distinguishes from Creative: Fairy inhabits wonder; Creative must make something
    // Distinguishes from Recluse: Fairy drifts; Recluse wants to be left alone
    coordinate: [-2, 2, 1, 1, 0, -2],
    image: 'assets/images/The_Fairy.png',
    analysis: `You move through the world with a lightness that other people consistently mistake for the absence of weight. You are not unserious — you have simply decided that gravity is optional in most situations and that whimsy is a more interesting lens than dread. You carry contradiction easily: you can be deeply present and completely unpredictable in the same moment. People are drawn to you in the way they are drawn to something they cannot fully categorize. You do not require explanation or continuity. You require space to move and the freedom to follow whatever thread has captured your attention this particular hour. The chaos you generate is, on inspection, usually the most interesting thing in the room.`
  },
  {
    key: 'theRecluse',
    name: 'The Recluse',
    // Inward -2, Neutral/variable 0, Neutral 0, Detached -1, Neutral 0, Flow -2
    // Distinguishes from Fairy: Recluse wants this reality to stop knocking; no wonder or drift
    // Distinguishes from Mad Scientist: Recluse is disengaged, not experimentally driven
    coordinate: [-2, 0, 0, -1, 0, -2],
    image: 'assets/images/The_Recluse.png',
    analysis: `You are not antisocial. You are selective in a way that the undiscerning read as antisocial, and you have decided their misreading is not your problem. Solitude is not a consolation prize for you — it is the primary condition under which your mind functions at full capacity. In company, you are present but partially translated, offering the version of yourself that can operate in that environment without exposing the mechanism. The real work happens alone, in the unremarkable hours that other people fill with noise. You have a rich internal architecture that you have no particular interest in making public. This is not mystery for its own sake. It is simply that the interior is more interesting than the exterior has ever been.`
  },
  {
    key: 'theMadScientist',
    name: 'The Mad Scientist',
    // Inward -1, Abstract +2, Chaotic +1, Detached -2, Self-Directed +1, Imposing +2
    // CORRECTED: Action was +1 (Imposing, moderate), overview says "Imposing, very high" → +2
    // Distinguishes from Creative: Mad Scientist forces possibility to submit; Action +2 vs -1
    // Distinguishes from Recluse: Mad Scientist compels reality, doesn't just withdraw
    coordinate: [-1, 2, 1, -2, 1, 2],
    image: 'assets/images/The_Mad_Scientist.png',
    analysis: `You are less interested in what things are than in what they become when subjected to conditions no one thought to test. Your curiosity has no ethical ceiling and a flexible relationship with precedent. You do not experience chaos as a problem — you experience it as a dataset. Other people's discomfort with your methods is information you record without particular urgency. You have burned things down in the name of understanding and considered the result a fair exchange. The distinction between a brilliant mind and a dangerous one has always seemed to you like a matter of framing rather than substance. You are aware that not everyone shares this assessment. You find their concern understandable and almost entirely irrelevant.`
  },
  {
    key: 'theTrickster',
    name: 'The Trickster',
    // Outward +2, Abstract +1, Chaotic +2, Neutral/variable 0, Self-Directed +1, Flow -1
    // CORRECTED: Action was +1 (Imposing). Overview says "Flow, high" → -1
    // CORRECTED: Resonance was -1. Overview says "Neutral/variable" → 0
    // Distinguishes from Deviant: Trickster violates expectations; Deviant violates boundaries
    // Distinguishes from Manipulator: Trickster is performative and outward; Manipulator is invisible
    coordinate: [2, 1, 2, 0, 1, -1],
    image: 'assets/images/The_Trickster.png',
    analysis: `You have always understood that reality is mostly a shared agreement, and that agreements can be renegotiated by anyone with sufficient audacity and timing. You do not lie — you reframe, redirect, and reconfigure the available information into a shape that serves the moment. The people who call this manipulation are using the word wrong. You call it fluency. You are at your most alive when the situation is unstable and you are the only one who knows it. Not because you caused the instability — though that is sometimes true — but because you are the only one equipped to navigate it. The line between a trickster and a genius has always been drawn by whoever was in the room when the trick worked.`
  },
  {
    key: 'theDeviant',
    name: 'The Deviant',
    // Slight Outward +1, Neutral/variable 0, Chaotic +2, Detached -1, Self-Directed +2, Imposing +1
    // CORRECTED: Sight was -2 (Concrete, very high). Overview says "Neutral/variable" → 0
    // Distinguishes from Trickster: Deviant violates boundaries, not just expectations
    // Distinguishes from Manipulator: Deviant wants the act itself; Manipulator wants the outcome
    coordinate: [1, 0, 2, -1, 2, 1],
    image: 'assets/images/The_Deviant.png',
    analysis: `You have a practical, unsentimental relationship with transgression. Rules are not the enemy — pointless rules are the enemy, and you have developed a reliable method for distinguishing between the two. You operate at the outer edge of acceptable behavior not because you are careless but because you have concluded that the outer edge is where the interesting problems live. People who remain safely in the center are not more ethical than you — they are more comfortable, which is a different thing. Your instincts are fast, direct, and occasionally alarming to people who have more to lose. You do not carry much guilt about this. Guilt is a tax levied by people who want you to carry the cost of their discomfort.`
  },
  {
    key: 'theManipulator',
    name: 'The Manipulator',
    // Outward +1, Abstract +1, Structured -2, Detached -1, Self-Directed +2, Imposing +2
    // Distinguishes from General: Manipulator arranges; General commands visibly
    // Distinguishes from Trickster: Manipulator is invisible and outcome-oriented vs performative
    // Distinguishes from Deviant: Manipulator wants the engineered outcome, not the act
    coordinate: [1, 1, -2, -1, 2, 2],
    image: 'assets/images/The_Manipulator.png',
    analysis: `You understand people with a precision that most of them would find unsettling if they could see it operating. You do not experience this as predatory — you experience it as competence. You have mapped the motivational architecture of nearly everyone in your environment and you maintain that map with the same discipline you apply to everything else that matters to you. You do not force outcomes. You create conditions. The distinction feels important to you, though you are aware it is not a distinction that would satisfy most people. You have learned to keep the mechanism invisible because the alternative — being correctly understood — produces a friction you find inefficient. You are not without feeling. You are simply unwilling to let feeling determine the outcome.`
  }
];

// ── SCORING ENGINE ────────────────────────────────────────────────────────────

/**
 * Calculates the squared Euclidean distance between two equal-length vectors.
 * Squared distance avoids the sqrt call — relative ordering is identical.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
function squaredDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return sum;
}

/**
 * Accumulates the final score vector by summing all selected answer vectors.
 * @param {number[][]} selectedVectors — Array of answer vectors chosen by the user.
 * @returns {number[]} — The raw summed 6-dimensional score vector.
 */
function accumulateScore(selectedVectors) {
  const result = [0, 0, 0, 0, 0, 0];
  for (const vec of selectedVectors) {
    for (let i = 0; i < 6; i++) {
      result[i] += vec[i];
    }
  }
  return result;
}

/**
 * Normalizes a raw summed score vector to the [-2, +2] range by dividing
 * by the number of questions answered. This makes the user's score directly
 * comparable to the archetype coordinate vectors.
 * @param {number[]} rawVector
 * @param {number} questionCount
 * @returns {number[]} — Normalized vector with values in [-2, +2].
 */
function normalizeScore(rawVector, questionCount) {
  // Each answer contributes values in [-2, +2]. The raw sum ranges from
  // -2*n to +2*n. Dividing by n returns the per-question average in [-2, +2].
  return rawVector.map(v => v / questionCount);
}

/**
 * Resolves a normalized score vector to the closest archetype.
 * Also returns the full ranked list for diagnostic use.
 * @param {number[]} normalizedVector — Score vector already normalized to [-2, +2].
 * @returns {{ result: object, ranked: Array }} — Closest archetype and full ranking.
 */
function findClosestArchetype(normalizedVector) {
  const ranked = ARCHETYPES.map(archetype => ({
    archetype,
    distance: squaredDistance(normalizedVector, archetype.coordinate)
  })).sort((a, b) => a.distance - b.distance);

  return {
    result: ranked[0].archetype,
    ranked
  };
}

/**
 * Main scoring pipeline. Call this with the array of selected answer vectors.
 * Returns the matched archetype and optionally logs diagnostics.
 * @param {number[][]} selectedVectors
 * @returns {object} — The matched archetype object.
 */
function scoreAssessment(selectedVectors) {
  const raw = accumulateScore(selectedVectors);
  const normalized = normalizeScore(raw, selectedVectors.length);
  const { result, ranked } = findClosestArchetype(normalized);

  if (DIAGNOSTIC_MODE) {
    const axisNames = ['Projection', 'Sight', 'Order', 'Resonance', 'Alignment', 'Action'];
    console.group('%c[SOGOIAN DIAGNOSTIC]', 'color: #4a7c59; font-weight: bold');
    console.log('Raw sum vector:');
    axisNames.forEach((name, i) => console.log(`  ${name}: ${raw[i].toFixed(2)}`));
    console.log('Normalized vector (÷' + selectedVectors.length + '):');
    axisNames.forEach((name, i) => console.log(`  ${name}: ${normalized[i].toFixed(3)}`));
    console.log('Ranked outcomes:');
    ranked.forEach(({ archetype, distance }, idx) => {
      const marker = idx === 0 ? ' ◀ RESULT' : idx === 1 ? ' (2nd)' : '';
      console.log(`  ${String(idx + 1).padStart(2)}. ${archetype.name.padEnd(18)} dist²=${distance.toFixed(4)}${marker}`);
    });
    console.groupEnd();
  }

  return result;
}
