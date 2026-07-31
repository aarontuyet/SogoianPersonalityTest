/**
 * engine.js — Sogoian Personality Assessment
 *
 * Responsibilities:
 *  1. Define all twelve archetype objects (coordinate, name, analysis, image path).
 *  2. Accumulate a running score vector by summing selected answer vectors.
 *  3. Compare the raw sum directly against each archetype coordinate using
 *     squared Euclidean distance. No normalization, division, or rescaling occurs.
 *  4. Expose diagnostic output in development mode.
 *
 * Vector axis order: [Projection, Sight, Order, Resonance, Alignment, Action]
 *   Projection  — Inward (-) to Outward (+)
 *   Sight       — Concrete (-) to Abstract (+)
 *   Order       — Structured (-) to Chaotic (+)
 *   Resonance   — Detached (-) to Empathetic (+)
 *   Alignment   — Selfless (-) to Self-Directed (+)
 *   Action      — Flow (-) to Imposing (+)
 *
 * SCORING:
 *   Selected answer vectors are summed axis by axis into a raw six-axis score.
 *   That raw score is compared directly with the finalized archetype coordinates.
 *   Squared Euclidean distance determines ranking. The archetype with the
 *   smallest squared distance is the result.
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
// Finalized coordinates per scoring_contract_v2.md.
// Do not alter coordinates, names, analyses, keys, or image paths.
//
// Axis order: [Projection, Sight, Order, Resonance, Alignment, Action]

const ARCHETYPES = [
  {
    key: 'theGeneral',
    name: 'The General',
    coordinate: [12, -4, -10, -2, -6, 10],
    image: 'assets/images/The_General.png',
    analysis: `You create order through authority. When pressure arrives and everyone else forms a committee to discuss the smoke, you are already holding the extinguisher and assigning exits. You see the concrete objective, build a structure around it, and push reality until it cooperates. At your best, that force is protective rather than theatrical. You make hard decisions, carry consequences, and use strength in service of people who may not be able to hold the line themselves. Once someone is inside the perimeter of your loyalty, heaven help whatever is threatening them.

The trouble begins when leadership quietly becomes ownership. Advice sounds like insubordination, emotion looks inefficient, and "I hear you" means the same order will now be delivered more slowly. Because you are often right that a problem exists, you may assume you are also right about the solution, timing, acceptable losses, and who gets a vote. Your growth is not becoming softer, smaller, or less dangerous. It is becoming strong enough to leave other people free. If people obey you but cannot tell you the truth, you are not leading a team. You are managing hostages.`
  },
  {
    key: 'theCaretaker',
    name: 'The Caretaker',
    coordinate: [4, -8, -12, 16, -12, 6],
    image: 'assets/images/The_Caretaker.png',
    analysis: `You create safety through practical service. You notice the empty glass, the tired face, the missed appointment, and the fact that civilization has apparently chosen this Tuesday to collapse. Then you step in. Love becomes food, rides, reminders, medicine, clean towels, and the mysterious spare charger that appears exactly when needed. You are warm, concrete, organized, and willing to take charge when care requires more than sympathetic noises. At your best, you do not merely comfort people. You make life workable again, then hand it back without demanding naming rights.

Your shadow keeps helping long after help has become occupation. If usefulness is how you secure love, another person's independence can feel suspiciously like abandonment. You anticipate needs nobody voiced, solve problems nobody assigned you, and maintain a secret ledger you insist does not exist until conflict reveals a fully itemized invoice. The family is fed, the calendar is perfect, and nobody can breathe without submitting a request. Your growth is learning to ask before rescuing, state your own needs before they ferment into martyrdom, and let generosity remain a gift. If nobody is allowed to function without you, your helpfulness may be keeping everyone helpless.`
  },
  {
    key: 'theOverachiever',
    name: 'The Overachiever',
    coordinate: [10, -6, -8, 2, 4, 12],
    image: 'assets/images/The_Overacheiver.png',
    analysis: `You create worth through accomplishment. You do not take a walk; you complete an optimized recovery interval while listening to a book at 1.8 speed. Goals become metrics, metrics become identity, and identity receives a quarterly review. You are practical, disciplined, visibly capable, and very good at turning pressure into finished work. While others are waiting to feel inspired, you have delivered the result and built a dashboard explaining why their inspiration is late. At your best, ambition becomes craftsmanship: focused effort, real competence, and proof that difficult things can actually be done.

The shadow appears when the self becomes another product to optimize. Rest looks like evidence tampering, vulnerability needs a communications plan, and relationships become additional places to earn a five-star rating. You can adapt so perfectly to what the room rewards that nobody, including you, remembers what was there before the performance. Every victory brings relief for approximately eleven minutes, then the scoreboard refreshes. Your growth is doing something meaningful that nobody can score and telling the truth before you have polished it into a resilience story. If failure would make you nobody, success has not made you somebody. It has only delayed the hearing.`
  },
  {
    key: 'theAngel',
    name: 'The Angel',
    coordinate: [8, 2, 0, 16, -12, 0],
    image: 'assets/images/The_Angel.png',
    analysis: `You create hope through mercy. You look at a damaged person and see the part that has not yet been ruined, which is beautiful, rare, and occasionally how you end up explaining that the latest catastrophe was "complicated." You move toward people with empathy, generosity, and an almost unreasonable belief that nobody should be reduced to their worst moment. At your best, you lower shame without lowering the truth. You make room for repair, restore dignity, and remind people that they are still capable of choosing again. Your compassion does not need a spotlight; it simply refuses to let the verdict become the whole person.

Your shadow confuses goodness with harmlessness. Anger feels unloving, consequences feel cruel, and a boundary can look disturbingly similar to abandonment. You may forgive before the facts arrive, restore access before trust exists, or keep calling endurance "faith" because a clean decision would hurt. At the darkest edge, you do not build the cage; you decorate it with inspirational quotes and ask the injured person to appreciate the redemption arc. Your growth is joining mercy to discernment and allowing no to be a complete sentence. Sometimes the most loving thing in the room is the locked door.`
  },
  {
    key: 'theInmyfeels',
    name: 'The Inmyfeels',
    coordinate: [-4, 4, 4, 8, 6, -4],
    image: 'assets/images/The_Inmyfeels.png',
    analysis: `You make emotional experience the center of reality. You do not have feelings; you have seasons, atmospheres, mythologies, and occasionally a prestige miniseries with no responsible editor. A delayed reply is not merely delayed. It has texture, ancestry, and a playlist. Inward, imaginative, empathetic, and resistant to tidy resolution, you notice the grief beneath anger and the longing beneath sarcasm. At your best, you enter places other people avoid, name what is actually happening, and make private pain speakable. You remind the efficient world that functioning and being alive are not the same thing.

The shadow arrives when emotional truth becomes emotional jurisdiction. If the feeling is real, the interpretation must be real, the accusation must be fair, and everyone else has been cast in supporting roles. You may protect a wound because it has become an identity with excellent lighting, or turn a boundary into proof that love was always a fraud. Soon the whole room is required to participate in your weather, which is unfortunately a renewable resource. Your growth is honoring the feeling without handing it the chair, the gavel, and veto power. A feeling can be completely true without being the complete truth.`
  },
  {
    key: 'theCreative',
    name: 'The Creative',
    coordinate: [-2, 12, 6, 2, 0, 2],
    image: 'assets/images/The_Creative.png',
    analysis: `You transform inner vision into original form. You looked at a chair and saw loneliness, architecture, childhood, late capitalism, and a bird wearing shoes. Nobody asked, which has never been a meaningful obstacle. You live among patterns and possibilities, combining what exists until something new appears. Structure is useful only after it stops strangling discovery; accidents are collaborators, and the work often tells you what it wants to become. At your best, you tolerate ambiguity long enough to find the strange thing, then apply enough will and craft to give it a body other people can actually encounter.

Your shadow treats creativity as diplomatic immunity. Deadlines are oppression, criticism is proof of mediocrity, and consistency was invented by spiritually compromised people who own label makers. You accumulate unfinished projects like sacred ruins because an uncompleted masterpiece can never disappoint you. Under pressure, one difficult task becomes five new concepts, a revised identity, and an urgent need to reorganize your brushes. Your growth is accepting that form does not murder possibility; it is how possibility enters the world. The world cannot encounter the masterpiece you are protecting from completion, even if the file is named FINAL_v17_realfinal_USETHIS.`
  },
  {
    key: 'theFairy',
    name: 'The Fairy',
    coordinate: [4, 8, 8, -2, 0, -10],
    image: 'assets/images/The_Fairy.png',
    analysis: `You create freedom through wonder. You can be socially bright, curious, and briefly enchanting while remaining only lightly tethered to the shared reality everyone else keeps calling a schedule. You follow beauty, coincidence, mood, strange ideas, and invisible threads that practical people missed while completing forms. Abstract, spontaneous, and deeply Flow-oriented, you do not force life so much as drift toward whatever begins glowing. At your best, this looseness restores mystery and possibility. You remind the room that reality is larger than its procedures, then wander away before anyone assigns you ownership of the revelation.

Your shadow turns wonder into avoidance. Responsibility has bad energy, evidence feels needlessly aggressive, and commitments are quietly returned to the universe without a forwarding address. You may call impulse intuition because intuition sounds better than "I did not want to consider consequences." Your detachment is rarely cruelty; it is the charming bafflement of someone surprised that other people expected an answer, a return, or continued participation in the conversation. Your growth is learning that embodiment does not kill wonder. Keep one promise exactly as made, and notice who has been carrying the gravity that permits you to float. Otherwise freedom is just sponsorship with better lighting.`
  },
  {
    key: 'theRecluse',
    name: 'The Recluse',
    coordinate: [-12, 0, 2, -4, 0, -10],
    image: 'assets/images/The_Recluse.png',
    analysis: `You create safety through distance. You do not hate people; you simply prefer them individually, briefly, and with an established departure time. Society is often a meeting that should have been an email, and the email contained three unnecessary exclamation points. Strongly inward, detached, and Flow-oriented, you protect a private world from noise, demand, and emotional occupation. Your inner life may be practical or strange, tidy or mildly feral. At your best, solitude becomes depth. You observe without performing participation, think without social static, and offer quiet loyalty that does not require an audience.

Your shadow turns boundaries into walls and autonomy into disappearance. You stop explaining, stop responding, and then use everyone's confusion as fresh evidence that people are exhausting. Silence becomes punishment with excellent plausible deniability. At the darkest edge, you want to be understood without speaking, loved without being reached, and deeply missed without anyone having the indecency to visit. Your growth is making absence legible: "I need two days, and I still care about you" can prevent an impressive amount of mythology. Nobody can respect a boundary you refuse to communicate. They can only experience the wall.`
  },
  {
    key: 'theMadScientist',
    name: 'The Mad Scientist',
    coordinate: [-4, 12, -8, -12, 2, 10],
    image: 'assets/images/The_Mad_Scientist.png',
    analysis: `You force an internally compelling possibility into reality through experimentation and control. You see systems, hidden mechanisms, and improbable solutions while everyone else remains distracted by feasibility, ethics, and whether the building will survive. The answer is probably. More importantly, the prototype achieved consciousness for almost seven seconds. Inward, abstract, structured, detached, and highly imposing, you do not merely imagine; you formulate, test, optimize, and repeat until reality submits or produces interesting debris. At your best, obsession becomes discovery, rigor gives vision a machine, and impossible things become operational.

Your shadow begins when curiosity eats conscience. People become inputs, warnings become proof of cowardice, and each catastrophe is reclassified as useful data. Contradictory evidence does not weaken the theory; it inspires a larger apparatus. You may sacrifice sleep, safety, money, relationships, and several unpaid interns because stopping now would be intellectually dishonest. Your growth is defining ethical limits and stopping conditions before the experiment becomes interesting, then allowing somebody else to enforce them. Intelligence does not remove you from morality. It only makes your rationalizations harder for other people to debug.`
  },
  {
    key: 'theTrickster',
    name: 'The Trickster',
    coordinate: [8, 4, 8, -2, 4, 12],
    image: 'assets/images/The_Trickster.png',
    analysis: `You create freedom by disrupting the script. You enter a tense room, locate the hypocrisy holding it together, and introduce movement through humor, contradiction, mischief, or a completely unnecessary accent. You did not make the situation weird; you made the existing weirdness visible and gave it better timing. Outward, abstract, chaotic, and forceful, you do not wait for permission to change the atmosphere. At your best, that social voltage punctures false authority, relieves shame, and lets a room breathe again. You spend embarrassment like currency and make stale certainty briefly lose its costume.

Your shadow uses comedy as camouflage and control. Nothing stays sincere long enough to demand accountability; every boundary becomes material, and every injury receives diplomatic immunity because you were "obviously joking." Since you control the tone, another person's pain can be made to look humorless, rigid, or socially incompetent. The room keeps laughing partly because you are funny and partly because everyone has learned what happens when the laughter stops. Your growth is staying after the joke lands badly, repairing without directing the other person's response, and letting one undefended moment survive. If nobody can tell when you are sincere, humor has started evicting you from intimacy.`
  },
  {
    key: 'theDeviant',
    name: 'The Deviant',
    coordinate: [10, -4, 12, -12, 2, 16],
    image: 'assets/images/The_Deviant.png',
    analysis: `You claim freedom through transgression. Rules do not impress you merely because somebody laminated them. You test boundaries, reject inherited shame, and refuse to confuse convention with morality. Outward, concrete, chaotic, detached, and intensely imposing, you do not just question the line; you cross it and examine who starts sweating. At your best, this makes you difficult to domesticate, courageous around taboo, and willing to expose hypocrisy polite systems depend on. Sometimes you are the only honest person in the room. Sometimes the rule was "do not steal the ambulance."

Your shadow confuses freedom with exemption. Desire becomes justification, restraint becomes weakness, and anyone objecting is dismissed as frightened, controlling, or insufficiently evolved. Because remorse can feel like surrender to someone else's morality, you may tell the truth about wanting something and assume honesty makes taking it ethical. At the darkest edge, freedom becomes predation and another person's consent becomes merely an irritating obstacle in your sovereignty narrative. Your growth is choosing limits that prove appetite does not own you. A boundary can be oppressive, but nobody becomes less sovereign because you dislike the boundary they placed around themselves.`
  },
  {
    key: 'theManipulator',
    name: 'The Manipulator',
    coordinate: [6, -2, -6, -6, 14, 16],
    image: 'assets/images/The_Manipulator.png',
    analysis: `You control outcomes by engineering perception, emotion, and choice. You understand that people rarely move because they were ordered; they move because the incentives, atmosphere, timing, and available facts were arranged until one direction felt like their own idea. You do not push the piece. You redesign the board and compliment the piece on its excellent judgment. Outward, concrete, structured, detached, fiercely self-directed, and highly imposing, you read motives and social leverage with a destination already in mind. At your best, this becomes ethical strategy: negotiation, alignment, and cooperation that people can understand and freely choose.

Your shadow turns relationship into infrastructure. Affection becomes leverage, vulnerability becomes intelligence, and every kindness quietly opens an account payable later. Force creates resistance, witnesses, and paperwork, so you prefer softer architecture: guilt, selective truth, triangulation, or the emotional conditions under which somebody volunteers to enter the cage and apologizes for being difficult during construction. Your growth is risking direct desire, complete information, and another person's unedited no. If people would choose differently after seeing the whole design, you did not persuade them. You removed part of their freedom.`
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
 * Accumulates the raw score vector by summing all selected answer vectors
 * axis by axis.
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
 * Resolves a raw score vector to the closest archetype by comparing it
 * directly against all archetype coordinates using squared Euclidean distance.
 * No normalization is applied. Returns the full ranked list.
 * @param {number[]} scoreVector — Raw summed 6-axis score vector.
 * @returns {{ result: object, ranked: Array }}
 */
function findClosestArchetype(scoreVector) {
  const ranked = ARCHETYPES.map(archetype => ({
    archetype,
    distance: squaredDistance(scoreVector, archetype.coordinate)
  })).sort((a, b) => a.distance - b.distance);

  return {
    result: ranked[0].archetype,
    ranked
  };
}

/**
 * Main scoring pipeline. Sums all selected answer vectors into a raw score,
 * then compares that raw score directly against archetype coordinates.
 * No division, normalization, or rescaling occurs at any step.
 * @param {number[][]} selectedVectors
 * @returns {{ result: object, ranked: Array, raw: number[] }}
 */
function scoreAssessment(selectedVectors) {
  const raw = accumulateScore(selectedVectors);
  const { result, ranked } = findClosestArchetype(raw);

  if (DIAGNOSTIC_MODE) {
    const axisNames = [
      'Projection',
      'Sight',
      'Order',
      'Resonance',
      'Alignment',
      'Action'
    ];

    console.group(
      '%c[SOGOIAN DIAGNOSTIC]',
      'color: #4a7c59; font-weight: bold'
    );

    console.log('Raw score vector used for distance comparison:');
    axisNames.forEach((name, index) => {
      console.log(`  ${name}: ${raw[index].toFixed(2)}`);
    });

    console.log('Ranked outcomes:');
    ranked.forEach(({ archetype, distance }, index) => {
      const marker =
        index === 0 ? ' ◀ RESULT' :
        index === 1 ? ' (2nd)' :
        index === 2 ? ' (3rd)' : '';

      console.log(
        `  ${String(index + 1).padStart(2)}. ` +
        `${archetype.name.padEnd(18)} ` +
        `dist²=${distance.toFixed(4)}${marker}`
      );
    });

    console.groupEnd();
  }

  return {
    result,
    ranked,
    raw
  };
}
