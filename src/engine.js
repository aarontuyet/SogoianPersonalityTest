/**
 * engine.js — Sogoian Personality Assessment
 *
 * Responsibilities:
 *  1. Define all twelve archetype objects (coordinate, name, analysis, image path).
 *  2. Accumulate a running score vector from answer selections.
 *  3. Resolve the final score vector to the closest archetype via Euclidean distance.
 *
 * Vector axis order: [Projection, Sight, Order, Resonance, Alignment, Action]
 *   Projection  — Inward (-2) to Outward (+2)
 *   Sight       — Concrete (-2) to Abstract (+2)
 *   Order       — Structure (-2) to Chaos (+2)
 *   Resonance   — Detached (-2) to Empathetic (+2)
 *   Alignment   — Selfless (-2) to Selfish (+2)
 *   Action      — Flow (-2) to Imposing (+2)
 */

'use strict';

// ── ARCHETYPE DEFINITIONS ─────────────────────────────────────────────────────
// Coordinates are the approved baseline. Tuning pass deferred to post-testing.

const ARCHETYPES = [
  {
    key: 'theGeneral',
    name: 'The General',
    coordinate: [2, -1, -2, -2, -1, 2],
    image: 'assets/images/The_General.png',
    analysis: `You have always understood that the world is a set of variables to be managed, not a collection of people to be considered. You do not lack empathy so much as you have correctly identified it as a liability in most operational contexts. Structure is not a preference for you — it is a prerequisite for everything else to function. You arrive at conclusions before the conversation begins and spend the discussion waiting for everyone else to catch up. The people who misread you as cold are the same people who would be grateful for your decisions in a genuine emergency. You have learned to tolerate the misreading. You have also learned that the tolerance has a ceiling, and that you installed that ceiling yourself.`
  },
  {
    key: 'theCaretaker',
    name: 'The Caretaker',
    coordinate: [-1, -2, -2, 2, 2, -1],
    image: 'assets/images/The_Caretaker.png',
    analysis: `You are the load-bearing wall in every room you enter, and no one has thought to check whether you are tired. Your care is not performed — it is structural, reflexive, and largely invisible to the people it sustains. You have a precise sense of what everyone around you needs and a deeply impractical compulsion to provide it. The cost of this is not something you discuss. You have built an architecture of reliability that others navigate without knowing they are inside it. The resentment, when it arrives, is quiet and self-directed. You will absorb the unfairness of your own generosity and describe it, if pressed, as simply how things are.`
  },
  {
    key: 'theOverachiever',
    name: 'The Overachiever',
    coordinate: [2, 0, -2, -1, 1, 2],
    image: 'assets/images/The_Overacheiver.png',
    analysis: `The finish line is a location you pass through without stopping because you have already identified the next one. You understand that this is not entirely healthy and you have decided not to care. Your standards are not a performance of rigor — they are the minimum threshold below which things stop being worth doing. You have made the mistake of assuming others share this threshold and have been disappointed in ways you no longer bother expressing. What drives you is not approval, though approval is a useful data point. What drives you is the specific discomfort of knowing you have not yet become what you are capable of being. That discomfort is chronic and, if you are honest, you are not sure you would remove it if you could.`
  },
  {
    key: 'theAngel',
    name: 'The Angel',
    coordinate: [0, 1, 0, 2, 2, -2],
    image: 'assets/images/The_Angel.png',
    analysis: `You experience other people's suffering as your own, which is either a gift or a design flaw depending on the day. You do not help people because it reflects well on you. You help them because the alternative — knowing someone is in pain and doing nothing — creates a specific dissonance you cannot endure. People describe you as good in a tone that occasionally sounds like pity. You have noticed this. The weight of chronic compassion is something you carry in silence because expressing it would require making your goodness into a complaint, and you find that morally untidy. You are not naive. You simply choose, repeatedly and with full awareness of the cost, to behave as though people deserve better than they usually receive.`
  },
  {
    key: 'theInmyfeels',
    name: 'The Inmyfeels',
    coordinate: [-2, 1, 1, 2, 1, -1],
    image: 'assets/images/The_Inmyfeels.png',
    analysis: `You live at a frequency that most people cannot quite receive. Your interior experience is dense, layered, and in near-constant motion, and you have spent years developing the vocabulary to describe it to people who process the world at a different resolution. The irony is that the richer your interior life becomes, the harder it is to export. You feel things in full before you have words for them, and by the time the words arrive the moment has already shifted. You are not performing sensitivity — you are genuinely wired for depth, which means shallow environments cost you more than they cost others. You have made a partial peace with this. Partial.`
  },
  {
    key: 'theCreative',
    name: 'The Creative',
    coordinate: [0, 2, 2, 0, 0, -1],
    image: 'assets/images/The_Creative.png',
    analysis: `Your mind does not move in straight lines, which is not a flaw in the architecture — it is the architecture. You make connections that others miss not because you are smarter but because you are looking at a fundamentally different map. Structure is something you understand well enough to dismantle productively. You are drawn to the unfinished, the uncertain, the still-becoming. The fully resolved bores you in a way that is difficult to disguise. You have a high tolerance for ambiguity and a low tolerance for people who mistake that comfort for lack of rigor. The work you produce when left alone in a room with a problem is frequently the thing no one else thought to try.`
  },
  {
    key: 'theFairy',
    name: 'The Fairy',
    coordinate: [2, 1, 2, 1, 0, -2],
    image: 'assets/images/The_Fairy.png',
    analysis: `You move through the world with a lightness that other people consistently mistake for the absence of weight. You are not unserious — you have simply decided that gravity is optional in most situations and that whimsy is a more interesting lens than dread. You carry contradiction easily: you can be deeply present and completely unpredictable in the same moment. People are drawn to you in the way they are drawn to something they cannot fully categorize. You do not require explanation or continuity. You require space to move and the freedom to follow whatever thread has captured your attention this particular hour. The chaos you generate is, on inspection, usually the most interesting thing in the room.`
  },
  {
    key: 'theRecluse',
    name: 'The Recluse',
    coordinate: [-2, 1, 0, -1, 0, -2],
    image: 'assets/images/The_Recluse.png',
    analysis: `You are not antisocial. You are selective in a way that the undiscerning read as antisocial, and you have decided their misreading is not your problem. Solitude is not a consolation prize for you — it is the primary condition under which your mind functions at full capacity. In company, you are present but partially translated, offering the version of yourself that can operate in that environment without exposing the mechanism. The real work happens alone, in the unremarkable hours that other people fill with noise. You have a rich internal architecture that you have no particular interest in making public. This is not mystery for its own sake. It is simply that the interior is more interesting than the exterior has ever been.`
  },
  {
    key: 'theMadScientist',
    name: 'The Mad Scientist',
    coordinate: [-1, 2, 2, -2, 1, 1],
    image: 'assets/images/The_Mad_Scientist.png',
    analysis: `You are less interested in what things are than in what they become when subjected to conditions no one thought to test. Your curiosity has no ethical ceiling and a flexible relationship with precedent. You do not experience chaos as a problem — you experience it as a dataset. Other people's discomfort with your methods is information you record without particular urgency. You have burned things down in the name of understanding and considered the result a fair exchange. The distinction between a brilliant mind and a dangerous one has always seemed to you like a matter of framing rather than substance. You are aware that not everyone shares this assessment. You find their concern understandable and almost entirely irrelevant.`
  },
  {
    key: 'theTrickster',
    name: 'The Trickster',
    coordinate: [2, 1, 2, -1, 2, 1],
    image: 'assets/images/The_Trickster.png',
    analysis: `You have always understood that reality is mostly a shared agreement, and that agreements can be renegotiated by anyone with sufficient audacity and timing. You do not lie — you reframe, redirect, and reconfigure the available information into a shape that serves the moment. The people who call this manipulation are using the word wrong. You call it fluency. You are at your most alive when the situation is unstable and you are the only one who knows it. Not because you caused the instability — though that is sometimes true — but because you are the only one equipped to navigate it. The line between a trickster and a genius has always been drawn by whoever was in the room when the trick worked.`
  },
  {
    key: 'theDeviant',
    name: 'The Deviant',
    coordinate: [1, -2, 2, -1, 1, 2],
    image: 'assets/images/The_Deviant.png',
    analysis: `You have a practical, unsentimental relationship with transgression. Rules are not the enemy — pointless rules are the enemy, and you have developed a reliable method for distinguishing between the two. You operate at the outer edge of acceptable behavior not because you are careless but because you have concluded that the outer edge is where the interesting problems live. People who remain safely in the center are not more ethical than you — they are more comfortable, which is a different thing. Your instincts are fast, direct, and occasionally alarming to people who have more to lose. You do not carry much guilt about this. Guilt is a tax levied by people who want you to carry the cost of their discomfort.`
  },
  {
    key: 'theManipulator',
    name: 'The Manipulator',
    coordinate: [1, 0, -2, -2, 2, 1],
    image: 'assets/images/The_Manipulator.png',
    analysis: `You understand people with a precision that most of them would find unsettling if they could see it operating. You do not experience this as predatory — you experience it as competence. You have mapped the motivational architecture of nearly everyone in your environment and you maintain that map with the same discipline you apply to everything else that matters to you. You do not force outcomes. You create conditions. The distinction feels important to you, though you are aware it is not a distinction that would satisfy most people. You have learned to keep the mechanism invisible because the alternative — being correctly understood — produces a friction you find inefficient. You are not without feeling. You are simply unwilling to let feeling determine the outcome.`
  }
];

// ── SCORING ENGINE ────────────────────────────────────────────────────────────

/**
 * Calculates the squared Euclidean distance between two equal-length vectors.
 * Using squared distance avoids the sqrt call — relative ordering is identical.
 *
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
 *
 * @param {number[][]} selectedVectors — Array of 25 answer vectors chosen by the user.
 * @returns {number[]} — The summed 6-dimensional score vector.
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
 * Resolves a score vector to the closest archetype using Euclidean distance.
 *
 * @param {number[]} scoreVector — The accumulated 6D score vector.
 * @returns {object} — The matching archetype object from ARCHETYPES.
 */
function findClosestArchetype(scoreVector) {
  let closestArchetype = null;
  let closestDistance = Infinity;

  for (const archetype of ARCHETYPES) {
    const dist = squaredDistance(scoreVector, archetype.coordinate);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestArchetype = archetype;
    }
  }

  return closestArchetype;
}
