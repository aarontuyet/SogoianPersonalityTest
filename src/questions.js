/**
 * questions.js — Sogoian Personality Assessment
 *
 * 25 behavioral probes. Each answer applies a vector across six axes:
 * [Projection, Sight, Order, Resonance, Alignment, Action]
 *
 * Axes:
 *   Projection  — Inward (-2) to Outward (+2)
 *   Sight       — Concrete (-2) to Abstract (+2)
 *   Order       — Structured (-2) to Chaotic (+2)
 *   Resonance   — Detached (-2) to Empathetic (+2)
 *   Alignment   — Selfless (-2) to Self-Directed (+2)
 *   Action      — Flow (-2) to Imposing (+2)
 *
 * ALIGNMENT SIGN CONVENTION (critical):
 *   -2 = Selfless (acting for others' benefit)
 *   +2 = Self-Directed (acting for personal benefit, autonomy, or appetite)
 *   Protecting others is SELFLESS → negative Alignment values.
 *   Using situations for personal gain is SELF-DIRECTED → positive values.
 */

const QUESTIONS = [
  // ── Q01 — Tests: Order, Action, Resonance, Alignment ─────────────────
  {
    id: 1,
    text: "When a complex system you rely on begins to break down, what is your immediate response?",
    options: [
      {
        label: "A",
        text: "I step in and force the system back into compliance so my goals are not delayed.",
        vector: [1, -1, -2, -1, 1, 2]
      },
      {
        label: "B",
        text: "I quietly reinforce the foundation, sacrificing my time so others do not suffer the fallout.",
        vector: [0, -2, -1, 1, -2, -1]
      },
      {
        label: "C",
        text: "I watch it collapse to study the underlying mechanics of why it failed.",
        vector: [-1, 2, 0, -2, 1, -1]
      },
      {
        label: "D",
        text: "I abandon it entirely and improvise a completely new path forward.",
        vector: [1, 1, 2, 0, 1, -2]
      }
    ]
  },

  // ── Q02 — Tests: Resonance, Alignment, Action ─────────────────────────
  {
    id: 2,
    text: "Someone asks you to keep a secret that actively hurts another person. What do you do?",
    options: [
      {
        label: "A",
        text: "I expose the secret immediately because protecting the vulnerable outweighs any loyalty.",
        // Selfless (-2 Alignment): exposing to protect someone else is not self-directed
        vector: [1, 0, 1, 2, -2, 2]
      },
      {
        label: "B",
        text: "I absorb the burden, keeping the peace while trying to comfort the hurt party privately.",
        vector: [-1, -1, -1, 2, -1, -1]
      },
      {
        label: "C",
        text: "I use the information to gain leverage over the person who told me.",
        vector: [0, 0, -1, -2, 2, 1]
      },
      {
        label: "D",
        text: "I ignore it entirely because their drama is not my responsibility.",
        vector: [-1, 0, 0, -2, 1, -2]
      }
    ]
  },

  // ── Q03 — Tests: Order, Projection, Sight, Action ────────────────────
  {
    id: 3,
    text: "You are handed a project with no instructions, no deadline, and no defined outcome. How do you proceed?",
    options: [
      {
        label: "A",
        text: "I establish a rigid framework immediately. The absence of structure is a problem I correct first.",
        vector: [0, -1, -2, -1, 0, 2]
      },
      {
        label: "B",
        text: "I get excited. The blank canvas is the entire point. I begin generating ideas without filtering them.",
        vector: [0, 2, 2, 0, 0, -1]
      },
      {
        label: "C",
        text: "I find the person who should have given the instructions and make their oversight visible to others.",
        vector: [2, -1, -1, -1, 1, 2]
      },
      {
        label: "D",
        text: "I sit with the ambiguity until a single, correct direction reveals itself to me.",
        vector: [-2, 2, 1, 0, 0, -2]
      }
    ]
  },

  // ── Q04 — Tests: Projection, Resonance, Action, Alignment ────────────
  {
    id: 4,
    text: "A person you respect makes a decision you believe is fundamentally wrong. What is your move?",
    options: [
      {
        label: "A",
        text: "I confront them directly and articulate exactly why they are mistaken.",
        vector: [2, 0, -1, -1, 0, 2]
      },
      {
        label: "B",
        text: "I say nothing. Respect is not a transaction. Their authority was earned.",
        vector: [-1, -1, -2, 1, -1, -2]
      },
      {
        label: "C",
        text: "I plant seeds of doubt in the people around them and let the consensus do the work.",
        vector: [1, 1, 0, -1, 1, 1]
      },
      {
        label: "D",
        text: "I document my objection privately and proceed in my own direction regardless.",
        vector: [-1, 1, 1, -1, 1, -1]
      }
    ]
  },

  // ── Q05 — Tests: Projection, Alignment, Resonance, Action ────────────
  {
    id: 5,
    text: "You have achieved something significant. No one noticed. What is your internal response?",
    options: [
      {
        label: "A",
        text: "Indifference. The achievement itself was the point. Recognition is irrelevant.",
        vector: [-2, 1, 0, -1, 0, -2]
      },
      {
        label: "B",
        text: "Quiet resentment. I will remember who was not watching.",
        vector: [0, 0, -1, -1, 1, 0]
      },
      {
        label: "C",
        text: "I announce it. If they will not notice, I will make them notice.",
        vector: [2, -1, -1, -1, 1, 2]
      },
      {
        label: "D",
        text: "A deep, private sadness. I wanted to be seen, even if I will never admit it.",
        vector: [-1, 1, 1, 2, 0, -1]
      }
    ]
  },

  // ── Q06 — Tests: Order, Alignment, Projection, Action ────────────────
  {
    id: 6,
    text: "You discover that a rule everyone follows exists for no valid reason. What do you do?",
    options: [
      {
        label: "A",
        text: "I stop following it immediately and tell anyone who will listen it is pointless.",
        vector: [2, 0, 2, 0, 1, 1]
      },
      {
        label: "B",
        text: "I continue following it. Social cohesion depends on people not making individual exceptions.",
        vector: [-1, -2, -2, 1, -1, -1]
      },
      {
        label: "C",
        text: "I exploit the gap between the rule and its actual purpose for my own advantage.",
        vector: [0, 2, 1, -2, 2, 1]
      },
      {
        label: "D",
        text: "I file the observation and return to it when it becomes strategically useful.",
        vector: [-1, 1, -1, -1, 1, 0]
      }
    ]
  },

  // ── Q07 — Tests: Resonance, Projection, Alignment (replaces old stranger/distress Q)
  // Redesigned to isolate Resonance without bundling selflessness with self-direction
  {
    id: 7,
    text: "You find out a friend is making a serious mistake they have not asked for your opinion on. You:",
    options: [
      {
        label: "A",
        text: "Tell them anyway. Withholding what I know to spare their feelings is its own kind of dishonesty.",
        // Outward, direct, slight detachment, self-directed in perspective
        vector: [2, 0, -1, -1, 1, 2]
      },
      {
        label: "B",
        text: "Stay quiet and be available if they come to me. It is their life, not a project I manage.",
        // Inward, empathetic respect, selfless restraint, flow
        vector: [-1, 0, 0, 1, -1, -2]
      },
      {
        label: "C",
        text: "Tell them, but frame it as a question so the realization feels like their own.",
        // Neutral projection, abstract framing, structured approach, empathetic method
        vector: [0, 2, -1, 1, 0, 0]
      },
      {
        label: "D",
        text: "Say nothing. The mistake is the information. Let them collect it themselves.",
        // Inward, detached, flow, self-directed in a cold way
        vector: [-2, 1, 0, -2, 1, -2]
      }
    ]
  },

  // ── Q08 — Tests: Projection, Sight, Order, Action ────────────────────
  {
    id: 8,
    text: "Given complete freedom of an afternoon with no obligations, you will most likely be found:",
    options: [
      {
        label: "A",
        text: "Alone, absorbed in a project no one else would understand or care about.",
        vector: [-2, 2, 1, -1, 1, -1]
      },
      {
        label: "B",
        text: "Orchestrating something social. The energy of a group is a resource I prefer not to waste.",
        vector: [2, -1, -1, 1, 1, 2]
      },
      {
        label: "C",
        text: "Wandering without destination. Structured leisure is a contradiction in terms.",
        vector: [-1, 2, 2, 0, 0, -2]
      },
      {
        label: "D",
        text: "Catching up on obligations I previously avoided. Free time is a debt I repay to my future self.",
        vector: [0, -1, -2, 0, -1, 1]
      }
    ]
  },

  // ── Q09 — Tests: Resonance, Alignment, Action ────────────────────────
  // Redesigned: was "helping a failing person" (overlapped Q7). Now tests Resonance vs Alignment
  // when someone's pain is your inconvenience — a cleaner distinction.
  {
    id: 9,
    text: "Someone you care about is in genuine distress at an inconvenient moment for you. You:",
    options: [
      {
        label: "A",
        text: "Drop what I am doing. Their need is real and the inconvenience is mine to absorb.",
        vector: [0, -1, -1, 2, -2, -1]
      },
      {
        label: "B",
        text: "Attend to them, but I will be honest that I am managing multiple things. I am not a martyr.",
        vector: [1, 0, 0, 1, 0, 1]
      },
      {
        label: "C",
        text: "Set a time to talk that actually works. Emotional urgency is not always the same as urgency.",
        vector: [0, 1, -1, -1, 1, 1]
      },
      {
        label: "D",
        text: "Note it, finish what I was doing, then reach out. A distracted response helps no one.",
        vector: [-1, 1, -2, -1, 1, 0]
      }
    ]
  },

  // ── Q10 — Tests: Projection, Order, Resonance, Action ────────────────
  {
    id: 10,
    text: "You are tasked with leading a group through a crisis. What is your first action?",
    options: [
      {
        label: "A",
        text: "I assess the variables and issue a plan before anyone has time to panic and complicate the process.",
        vector: [1, -1, -2, -1, 0, 2]
      },
      {
        label: "B",
        text: "I read the room. Morale is a resource and I need to know how much I have to work with.",
        vector: [1, 1, 0, 2, 0, 0]
      },
      {
        label: "C",
        text: "I identify the person causing the most friction and remove their ability to interfere.",
        vector: [2, 0, -1, -2, 1, 2]
      },
      {
        label: "D",
        text: "I guide them toward discovering the solution themselves. Imposed leadership rarely holds.",
        vector: [-1, 2, 1, 2, -1, -1]
      }
    ]
  },

  // ── Q11 — Tests: Projection, Resonance, Order, Action ────────────────
  {
    id: 11,
    text: "You receive accurate but brutal criticism of your work. What happens next?",
    options: [
      {
        label: "A",
        text: "I absorb it and correct the work. Accuracy is the only criterion that matters.",
        vector: [-1, -1, -2, -1, 0, 1]
      },
      {
        label: "B",
        text: "I acknowledge it publicly and process it privately at a later time when I am alone.",
        vector: [-1, 0, 0, 1, 0, -1]
      },
      {
        label: "C",
        text: "I argue back. Even accurate criticism can be delivered wrongly, and I will not accept the framing.",
        vector: [2, 0, 0, -1, 1, 2]
      },
      {
        label: "D",
        text: "The criticism lands harder than it should and stays with me far longer than they intended.",
        vector: [-2, 1, 1, 2, 0, -2]
      }
    ]
  },

  // ── Q12 — Tests: Order, Projection, Action, Alignment ────────────────
  {
    id: 12,
    text: "A cause you believe in is gaining momentum, but the movement is becoming tactically sloppy. What is your role?",
    options: [
      {
        label: "A",
        text: "I step into a coordinating position and impose the discipline the movement requires.",
        vector: [2, -1, -2, 0, 0, 2]
      },
      {
        label: "B",
        text: "I continue contributing quietly and trust that the outcome matters more than the method.",
        vector: [-1, -1, -1, 2, -1, -1]
      },
      {
        label: "C",
        text: "I break off and operate as a separate, more precise unit. Dilution is worse than separation.",
        vector: [0, 1, 2, -1, 1, 0]
      },
      {
        label: "D",
        text: "I detach entirely. A cause that loses its rigor has lost its soul.",
        vector: [-2, 2, 1, -1, 0, -2]
      }
    ]
  },

  // ── Q13 — Tests: Projection, Sight, Alignment, Action ────────────────
  {
    id: 13,
    text: "You meet someone who seems to deliberately craft an air of mystery around themselves. Your reaction?",
    options: [
      {
        label: "A",
        text: "I find it irritating. Performed mystery is a form of social debt that others are asked to pay.",
        vector: [1, -1, -1, -1, 1, 1]
      },
      {
        label: "B",
        text: "I am drawn in. The act of concealment implies something worth finding.",
        vector: [0, 2, 1, 1, 0, -1]
      },
      {
        label: "C",
        text: "I mirror it back. I can do the same thing better and with more actual substance behind it.",
        vector: [0, 1, 1, -1, 2, 1]
      },
      {
        label: "D",
        text: "I feel a quiet solidarity. The need to obscure yourself is something I understand completely.",
        vector: [-2, 1, 0, 1, 0, -2]
      }
    ]
  },

  // ── Q14 — Tests: Order, Resonance, Alignment, Projection ─────────────
  {
    id: 14,
    text: "You are given the power to rewrite one social contract that most people accept without question. What do you change?",
    options: [
      {
        label: "A",
        text: "The obligation to perform contentment. People should be permitted to be unhappy without explanation.",
        vector: [-1, 1, 2, 2, -1, -1]
      },
      {
        label: "B",
        text: "The distribution of accountability. The people making decisions should bear their consequences directly.",
        vector: [2, 0, -1, 0, -1, 2]
      },
      {
        label: "C",
        text: "The fiction of equal standing. Hierarchies exist whether we acknowledge them or not.",
        vector: [1, 1, -2, -2, 2, 1]
      },
      {
        label: "D",
        text: "The ownership of private experience. What I feel is mine and I owe no one a window into it.",
        vector: [-2, 0, 0, 0, 1, -2]
      }
    ]
  },

  // ── Q15 — Tests: Resonance, Alignment, Action, Sight ─────────────────
  {
    id: 15,
    text: "A close friend asks for your honest opinion on a decision they have clearly already made.",
    options: [
      {
        label: "A",
        text: "I give them the honest assessment. They asked. That is consent.",
        vector: [1, 0, 0, -1, 0, 2]
      },
      {
        label: "B",
        text: "I soften the truth just enough to protect them without abandoning it entirely.",
        vector: [0, 0, 0, 2, -1, 0]
      },
      {
        label: "C",
        text: "I tell them what they want to hear. The decision is made. Honesty now is just cruelty with good branding.",
        vector: [0, 0, -1, 1, 1, -1]
      },
      {
        label: "D",
        text: "I ask a series of questions that lead them to the conclusion I would have stated directly.",
        vector: [0, 2, 0, 1, 1, 0]
      }
    ]
  },

  // ── Q16 — Tests: Order, Sight, Alignment, Action ─────────────────────
  {
    id: 16,
    text: "What is your relationship to rules you did not create and were never asked to ratify?",
    options: [
      {
        label: "A",
        text: "I follow them when they are useful and discard them when they are not. That is pragmatism.",
        vector: [1, 1, 2, -1, 1, 1]
      },
      {
        label: "B",
        text: "I follow them as written. Selective compliance is how systems degrade.",
        vector: [-1, -2, -2, 1, -1, 0]
      },
      {
        label: "C",
        text: "I study them intensely for the gaps, then use the gaps.",
        vector: [0, 2, 1, -2, 2, 1]
      },
      {
        label: "D",
        text: "I feel a low-grade, continuous irritation that I have learned to manage.",
        vector: [-1, 1, 1, 0, 0, -1]
      }
    ]
  },

  // ── Q17 — Tests: Projection, Sight, Order, Action ────────────────────
  {
    id: 17,
    text: "Describe your ideal operating environment.",
    options: [
      {
        label: "A",
        text: "High stakes. Clear metrics. People who execute without needing to be managed.",
        vector: [2, -1, -2, -1, 1, 2]
      },
      {
        label: "B",
        text: "Quiet. Uninterrupted. With enough space to think in circles until something useful emerges.",
        vector: [-2, 2, 1, -1, 0, -2]
      },
      {
        label: "C",
        text: "Fluid and collaborative. Good work emerges from the friction of different minds in close proximity.",
        vector: [1, 1, 2, 2, -1, -1]
      },
      {
        label: "D",
        text: "Any environment I have restructured to match my requirements. The default setting is never optimal.",
        vector: [1, 0, -2, -1, 1, 2]
      }
    ]
  },

  // ── Q18 — Tests: Projection, Alignment, Resonance, Action ────────────
  {
    id: 18,
    text: "You watch someone take credit for work you contributed significantly to. Your next move?",
    options: [
      {
        label: "A",
        text: "I correct the record publicly, in the moment, without apology.",
        vector: [2, -1, 0, -1, 1, 2]
      },
      {
        label: "B",
        text: "I say nothing now. I document everything and build a case to use at the correct time.",
        vector: [-1, 0, -1, -1, 1, 0]
      },
      {
        label: "C",
        text: "I absorb the injustice. The satisfaction of doing good work does not require attribution.",
        vector: [-2, 1, -1, 1, -1, -2]
      },
      {
        label: "D",
        text: "I ensure they become dependent on my contribution again, and I will not be so invisible next time.",
        vector: [0, 1, -1, -2, 2, 1]
      }
    ]
  },

  // ── Q19 — Tests: Action, Order, Projection, Alignment ────────────────
  // Revised option B tone: was too aspirational / social-desirability bait
  {
    id: 19,
    text: "You are given a choice between a guaranteed moderate success or a high-risk outcome that is either total victory or total failure.",
    options: [
      {
        label: "A",
        text: "The guarantee. Compounding moderate success over time produces something significant and survivable.",
        vector: [-1, -2, -2, 0, 0, 0]
      },
      {
        label: "B",
        text: "The risk. I am not interested in a life whose highest point is 'adequate.'",
        vector: [2, 1, 2, -1, 1, 2]
      },
      {
        label: "C",
        text: "Neither option as presented. I renegotiate the terms before I accept the frame.",
        vector: [0, 2, 1, 0, 1, 1]
      },
      {
        label: "D",
        text: "The guarantee. I will not bet what I have built against something I have not yet earned.",
        vector: [-1, -1, -1, 1, -1, -1]
      }
    ]
  },

  // ── Q20 — Tests: Projection, Alignment, Resonance, Sight ─────────────
  {
    id: 20,
    text: "How do you prefer people to experience you when they first encounter you?",
    options: [
      {
        label: "A",
        text: "As competent and direct. Warm first impressions are a form of advertising I find distasteful.",
        vector: [1, -1, -2, -1, 1, 2]
      },
      {
        label: "B",
        text: "As curious and open. I want them to feel that the conversation could go anywhere.",
        vector: [1, 2, 2, 1, 0, -1]
      },
      {
        label: "C",
        text: "As safe. I want them to believe they can trust me before they have any evidence to support it.",
        vector: [0, 0, -1, 2, -1, 0]
      },
      {
        label: "D",
        text: "As unreadable. The advantage of being underestimated compounds over time.",
        vector: [-2, 1, 0, -1, 2, -1]
      }
    ]
  },

  // ── Q21 — Tests: Resonance, Alignment, Action, Sight ─────────────────
  {
    id: 21,
    text: "A relationship that has been sustaining you is quietly becoming one that is consuming you. When do you leave?",
    options: [
      {
        label: "A",
        text: "The moment I identify the pattern. I do not wait for confirmation of what I have already understood.",
        vector: [1, 1, 0, -2, 1, 1]
      },
      {
        label: "B",
        text: "Not until I have done everything within my capability to correct the dynamic.",
        vector: [-1, -1, -1, 2, -2, -1]
      },
      {
        label: "C",
        text: "Long after I should have. Leaving requires acknowledging I was wrong to stay this long.",
        vector: [-2, 0, -1, 2, 0, -2]
      },
      {
        label: "D",
        text: "I restructure my participation so that I remain but the dynamic no longer reaches me.",
        vector: [0, 2, 1, -1, 1, 0]
      }
    ]
  },

  // ── Q22 — Tests: Alignment, Projection, Resonance, Action ────────────
  {
    id: 22,
    text: "What is the most honest description of your relationship with your own ambition?",
    options: [
      {
        label: "A",
        text: "It is the cleanest thing about me. It has never lied to me or asked me to be something I am not.",
        vector: [2, 0, -1, -2, 2, 2]
      },
      {
        label: "B",
        text: "It exhausts me. I do not want the things I want, but I cannot seem to stop wanting them.",
        vector: [-1, 1, 1, 2, 1, -1]
      },
      {
        label: "C",
        text: "It is something I have learned to suppress in social settings where it makes others uncomfortable.",
        vector: [-1, 1, -1, 1, 1, 0]
      },
      {
        label: "D",
        text: "It is a practical instrument I deploy when necessary and store when it is not.",
        vector: [0, 0, -2, -1, 1, 1]
      }
    ]
  },

  // ── Q23 — Tests: Alignment, Sight, Order, Resonance ──────────────────
  {
    id: 23,
    text: "You are alone in a room with access to information you were never meant to see. What do you do?",
    options: [
      {
        label: "A",
        text: "I read every word. Information I was not meant to have is the most accurate information available.",
        vector: [0, 2, 2, -2, 2, 1]
      },
      {
        label: "B",
        text: "I look away. The trust that was accidentally extended to me is not mine to violate.",
        vector: [-1, -1, -1, 2, -2, -2]
      },
      {
        label: "C",
        text: "I read it and then decide whether the knowledge is a burden or an asset before proceeding.",
        vector: [0, 1, 0, -1, 1, 0]
      },
      {
        label: "D",
        text: "I skim it just enough to know what I do not know, then leave. Partial information is a clean position.",
        vector: [-1, 1, 1, -1, 1, -1]
      }
    ]
  },

  // ── Q24 — Tests: Action, Order, Sight, Resonance ─────────────────────
  {
    id: 24,
    text: "What do you believe is the most underrated virtue?",
    options: [
      {
        label: "A",
        text: "Precision. Most problems are the result of imprecise thinking tolerated for too long.",
        vector: [0, -2, -2, -1, 0, 2]
      },
      {
        label: "B",
        text: "Patience. The capacity to let things unfold without imposing your timeline on them.",
        vector: [-1, 1, 0, 2, -1, -2]
      },
      {
        label: "C",
        text: "Audacity. The willingness to act on a conviction before the evidence fully supports it.",
        vector: [2, 1, 2, -1, 1, 2]
      },
      {
        label: "D",
        text: "Discretion. Knowing what not to say or do, and in which room, is a form of mastery.",
        vector: [-1, 1, -1, 0, 1, -1]
      }
    ]
  },

  // ── Q25 — Tests: Projection, Sight, Order, Resonance, Action ─────────
  // Final question. Designed to reinforce the most defining dimension of
  // each cluster. Answer D now targets Fairy/Recluse territory more clearly.
  {
    id: 25,
    text: "When you imagine the version of yourself that you will one day become, what is the dominant quality of that person?",
    options: [
      {
        label: "A",
        text: "Absolute command of their domain. Everyone else has conceded the territory.",
        vector: [2, -1, -2, -1, 1, 2]
      },
      {
        label: "B",
        text: "A quiet depth that other people sense but cannot quite name or locate.",
        vector: [-2, 2, 0, 0, 0, -2]
      },
      {
        label: "C",
        text: "A warmth so reliable that people structure their lives around its presence.",
        vector: [1, -1, -1, 2, -2, -1]
      },
      {
        label: "D",
        text: "A presence so alive to its own frequency that ordinary reality cannot quite contain it.",
        // Targets Fairy/Inmyfeels: inward, abstract, empathetic, flow
        vector: [-1, 2, 1, 2, 1, -2]
      }
    ]
  }
];
