/**
 * questions.js — Sogoian Personality Assessment
 *
 * 25 behavioral probes. Each answer applies a vector across six axes:
 * [Projection, Sight, Order, Resonance, Alignment, Action]
 *
 * Axes:
 *   Projection  — Inward (-3) to Outward (+3)
 *   Sight       — Concrete (-3) to Abstract (+3)
 *   Order       — Structure (-3) to Chaos (+3)
 *   Resonance   — Detached (-3) to Empathetic (+3)
 *   Alignment   — Selfless (-3) to Selfish (+3)
 *   Action      — Flow (-3) to Imposing (+3)
 */

const QUESTIONS = [
  // ── Q01 ──────────────────────────────────────────────────────────────
  {
    id: 1,
    text: "How do you usually take your coffee?",
    options: [
      {
        label: "A",
        text: "Black, strong, and exactly the same every day. I am here to become operational.",
        vector: [-1, -2, -1, -1, 0, 1]
      },
      {
        label: "B",
        text: "Sweet, elaborate, and slightly embarrassing to order.",
        vector: [1, 1, 2, 1, 1, 1]
      },
      {
        label: "C",
        text: "Whatever is available. Caffeine has no need for ceremony.",
        vector: [0, -2, 1, -1, -1, -2]
      },
      {
        label: "D",
        text: "I make enough for everyone, then forget mine until it is cold.",
        vector: [2, -1, -1, 2, -2, -1]
      }
    ]
  },

  // ── Q02 ──────────────────────────────────────────────────────────────
  {
    id: 2,
    text: "Your alarm goes off. What happens next?",
    options: [
      {
        label: "A",
        text: "I get up. The alarm and I had an agreement.",
        vector: [1, -2, -2, -1, 0, 2]
      },
      {
        label: "B",
        text: "I have six alarms scheduled. Each one represents a different stage of denial.",
        vector: [-1, -1, -1, 1, -1, -1]
      },
      {
        label: "C",
        text: "I wake up when my body decides civilization needs me.",
        vector: [-2, 1, 2, -1, 1, -2]
      },
      {
        label: "D",
        text: "I snooze until getting ready becomes a household emergency.",
        vector: [-2, 1, 2, 0, 2, -1]
      }
    ]
  },

  // ── Q03 ──────────────────────────────────────────────────────────────
  {
    id: 3,
    text: "There is one slice of someone else's pizza in the refrigerator. You are very hungry.",
    options: [
      {
        label: "A",
        text: "I eat it. If questioned, I remember nothing.",
        vector: [-1, -1, 2, -3, 3, 2]
      },
      {
        label: "B",
        text: "I text the owner and wait for permission like a citizen.",
        vector: [1, -2, -1, -1, -1, -1]
      },
      {
        label: "C",
        text: "I leave it and assemble a meal from crackers, mustard, and spiritual resilience.",
        vector: [-1, 0, 1, 1, -1, 1]
      },
      {
        label: "D",
        text: "I eat it, then write an apology I may or may not send. The pizza is gone; the emotional paperwork continues.",
        vector: [-1, 1, 2, 2, 1, -1]
      }
    ]
  },

  // ── Q04 ──────────────────────────────────────────────────────────────
  {
    id: 4,
    text: "You leave for a trip tomorrow morning. What does packing look like?",
    options: [
      {
        label: "A",
        text: "I packed several days ago using a list refined through previous suffering.",
        vector: [-1, -1, -2, 1, -1, 2]
      },
      {
        label: "B",
        text: "I will pack twenty minutes before leaving. Destiny knows my size.",
        vector: [0, 1, 2, 0, 1, -2]
      },
      {
        label: "C",
        text: "I check what everyone else needs, pack three communal chargers, and bring enough medicine to open a small clinic.",
        vector: [3, -1, -2, 2, -2, 1]
      },
      {
        label: "D",
        text: "One small bag. Anything missing can become Future Me's problem.",
        vector: [0, 1, 1, -1, 1, -1]
      }
    ]
  },

  // ── Q05 ──────────────────────────────────────────────────────────────
  {
    id: 5,
    text: "You are lost in an unfamiliar place. What do you do?",
    options: [
      {
        label: "A",
        text: "I quietly let the GPS recalculate. It has seen worse.",
        vector: [-1, -1, -1, -1, 0, -1]
      },
      {
        label: "B",
        text: "I ask the nearest person for directions.",
        vector: [2, -2, 0, 1, 0, 1]
      },
      {
        label: "C",
        text: "I choose the road that feels correct and accept whatever mythology follows.",
        vector: [-1, 2, 2, -1, 1, -2]
      },
      {
        label: "D",
        text: "I take control of navigation and temporarily suspend everyone else's opinions.",
        vector: [1, -1, -2, -2, 2, 2]
      }
    ]
  },

  // ── Q06 ──────────────────────────────────────────────────────────────
  {
    id: 6,
    text: "The group chat has 67 unread messages. What do you do?",
    options: [
      {
        label: "A",
        text: "I read everything so I understand exactly how we lost our way.",
        vector: [-1, -1, -2, 1, -1, 1]
      },
      {
        label: "B",
        text: "I ask, \"What did I miss?\" and make someone else summarize the ruins.",
        vector: [1, -1, -1, 0, 1, 1]
      },
      {
        label: "C",
        text: "I post a meme without context and alter the direction of the conversation.",
        vector: [2, 1, 2, -2, 1, -1]
      },
      {
        label: "D",
        text: "I mute it forever and continue loving everyone from a safe distance.",
        vector: [-2, 1, 1, -1, -1, -2]
      }
    ]
  },

  // ── Q07 ──────────────────────────────────────────────────────────────
  {
    id: 7,
    text: "You arrive at a party where you know almost nobody. What do you do?",
    options: [
      {
        label: "A",
        text: "I drift from conversation to conversation like a benign social ghost.",
        vector: [3, 1, 1, 1, 0, -3]
      },
      {
        label: "B",
        text: "I introduce myself broadly and begin collecting people.",
        vector: [2, -2, -1, 0, 1, 3]
      },
      {
        label: "C",
        text: "I locate the household pet. My social obligation is now complete.",
        vector: [-2, 1, 1, -1, 0, -2]
      },
      {
        label: "D",
        text: "I observe quietly until I find a fascinating conversation, then steer it somewhere more interesting.",
        vector: [-2, 2, -1, -1, 0, 2]
      }
    ]
  },

  // ── Q08 ──────────────────────────────────────────────────────────────
  {
    id: 8,
    text: "A friend cancels plans with you for the third time. What do you do?",
    options: [
      {
        label: "A",
        text: "I ask what is really happening and set a clear boundary.",
        vector: [1, -2, -2, 2, -1, 2]
      },
      {
        label: "B",
        text: "I say, \"No problem,\" then experience several private problems.",
        vector: [-2, 1, 1, 0, 1, -2]
      },
      {
        label: "C",
        text: "I stop inviting them. No announcement, just natural consequences.",
        vector: [-1, -2, -1, -1, 1, -1]
      },
      {
        label: "D",
        text: "I make better plans with someone else and post photos.",
        vector: [2, -1, 1, -2, 2, 2]
      }
    ]
  },

  // ── Q09 ──────────────────────────────────────────────────────────────
  {
    id: 9,
    text: "A friend asks you to help them move, but you do not want to. What do you do?",
    options: [
      {
        label: "A",
        text: "I arrive early with gloves, a dolly, and an alarming amount of competence.",
        vector: [1, -2, -2, 1, -2, 2]
      },
      {
        label: "B",
        text: "I help, but I complain theatrically enough to receive emotional compensation.",
        vector: [2, -1, 0, 0, -1, 1]
      },
      {
        label: "C",
        text: "I suddenly remember an obligation that may or may not exist.",
        vector: [-1, 1, -1, -1, 2, -1]
      },
      {
        label: "D",
        text: "I say no honestly and send pizza.",
        vector: [0, -2, 0, 1, 0, 0]
      }
    ]
  },

  // ── Q10 ──────────────────────────────────────────────────────────────
  {
    id: 10,
    text: "A restaurant brings you the wrong meal. What do you do?",
    options: [
      {
        label: "A",
        text: "I eat it. Apparently this is my life now.",
        vector: [-1, -2, 0, 1, -1, -2]
      },
      {
        label: "B",
        text: "I politely ask for the meal I ordered.",
        vector: [1, -2, -1, 1, 0, 1]
      },
      {
        label: "C",
        text: "I ask for the manager, a correction, and recognition that civilization has standards.",
        vector: [2, -1, -2, -2, 2, 2]
      },
      {
        label: "D",
        text: "I recruit the table into swapping bites until the mistake becomes accidental tapas.",
        vector: [1, 2, 2, 1, 0, -1]
      }
    ]
  },

  // ── Q11 ──────────────────────────────────────────────────────────────
  {
    id: 11,
    text: "You receive a vague assignment at work. What do you do?",
    options: [
      {
        label: "A",
        text: "I ask specific questions and turn the answers into a checklist.",
        vector: [1, -1, -2, 0, -1, 1]
      },
      {
        label: "B",
        text: "I deliver something that meets what they asked for even if it doesn't make sense.  They must have their reasons.",
        vector: [-1, -2, 2, -1, 1, -1]
      },
      {
        label: "C",
        text: "I come up with a bunch of great ideas, then offer suggestions.",
        vector: [-1, 3, -1, -1, 1, -2]
      },
      {
        label: "D",
        text: "I reshape it into the project I think they should have requested.",
        vector: [1, 2, 2, 0, 1, 2]
      }
    ]
  },

  // ── Q12 ──────────────────────────────────────────────────────────────
  {
    id: 12,
    text: "A meeting has continued fifteen minutes beyond the point of usefulness. What do you do?",
    options: [
      {
        label: "A",
        text: "I summarize the decisions, assign next steps, and end it.",
        vector: [1, -1, -2, -1, 0, 2]
      },
      {
        label: "B",
        text: "I make a joke before the collective spirit leaves the body.",
        vector: [2, 2, 1, 1, 0, 1]
      },
      {
        label: "C",
        text: "I remain visibly present while departing on every other level.",
        vector: [-2, 1, 1, -1, 1, -2]
      },
      {
        label: "D",
        text: "I let everyone finish because being heard may matter more than the clock.",
        vector: [0, 0, -1, 3, -1, -2]
      }
    ]
  },

  // ── Q13 ──────────────────────────────────────────────────────────────
  {
    id: 13,
    text: "A coworker takes credit for something you did. What do you do?",
    options: [
      {
        label: "A",
        text: "I correct the record publicly and immediately. Since we are sharing accomplishments, let us include the author.",
        vector: [2, -1, -1, -1, 1, 2]
      },
      {
        label: "B",
        text: "I speak with them privately before deciding whether this was confusion or a career-limiting hobby.",
        vector: [1, -1, 2, 1, 0, 1]
      },
      {
        label: "C",
        text: "I document everything and save the evidence for the proper season. Winter is coming, and it has timestamps.",
        vector: [-2, 2, -2, -2, 2, 1]
      },
      {
        label: "D",
        text: "I let it go if the work succeeded and nobody was harmed. My halo is exhausting, but very flattering.",
        vector: [-1, 1, 0, 2, -2, -2]
      }
    ]
  },

  // ── Q14 ──────────────────────────────────────────────────────────────
  {
    id: 14,
    text: "You make a noticeable mistake at work. What do you do?",
    options: [
      {
        label: "A",
        text: "I own it immediately and start fixing it. My shame can wait until lunch.",
        vector: [1, -2, -2, 1, -1, 2]
      },
      {
        label: "B",
        text: "I repair it quietly before anyone realizes reality briefly malfunctioned.",
        vector: [-2, -2, -1, -1, 1, 1]
      },
      {
        label: "C",
        text: "I explain the larger system that made the mistake possible. Welcome to my documentary.",
        vector: [1, 2, 1, -1, 1, 0]
      },
      {
        label: "D",
        text: "I make a joke, ask for help, and turn the cleanup into an unwilling team-building exercise.",
        vector: [2, 2, 1, 2, 0, -1]
      }
    ]
  },

  // ── Q15 ──────────────────────────────────────────────────────────────
  {
    id: 15,
    text: "Someone criticizes something you are proud of. What do you do?",
    options: [
      {
        label: "A",
        text: "I challenge them immediately and make them defend every criticism. If we are opening court, we are hearing evidence.",
        vector: [2, -1, -1, -2, 1, 2]
      },
      {
        label: "B",
        text: "I explain my intention until they either understand or surrender.",
        vector: [2, 2, -1, -1, 1, 2]
      },
      {
        label: "C",
        text: "I thank them, sit with it privately, and use whatever proves true.",
        vector: [-1, 1, 0, 1, 0, -1]
      },
      {
        label: "D",
        text: "I conclude that they lack the equipment necessary to understand my genius.",
        vector: [-2, 2, 1, -2, 2, -1]
      }
    ]
  },

  // ── Q16 ──────────────────────────────────────────────────────────────
  {
    id: 16,
    text: "Someone close to you says, \"I'm fine.\" They are clearly not fine. What do you do?",
    options: [
      {
        label: "A",
        text: "I stay nearby without forcing them to talk.",
        vector: [-1, 0, 0, 2, -1, -2]
      },
      {
        label: "B",
        text: "I keep asking direct questions until we reach the truth.",
        vector: [1, -1, -1, 2, 0, 2]
      },
      {
        label: "C",
        text: "I accept the sentence as delivered. \"Fine\" is a complete word.",
        vector: [0, -2, -1, -2, 0, -2]
      },
      {
        label: "D",
        text: "I stop asking and start helping: make food, handle a chore, or solve the small problem orbiting the big one.",
        vector: [0, -2, -1, 2, -2, 1]
      }
    ]
  },

  // ── Q17 ──────────────────────────────────────────────────────────────
  {
    id: 17,
    text: "You realize you owe someone an apology. What do you do?",
    options: [
      {
        label: "A",
        text: "I apologize clearly without attaching a defense brief.",
        vector: [1, -1, -1, 2, -1, 1]
      },
      {
        label: "B",
        text: "I explain the full context, establish my intentions, and eventually approach \"sorry.\"",
        vector: [2, 2, -1, 0, 1, 1]
      },
      {
        label: "C",
        text: "I do something thoughtful for them and quietly hope we can both agree that counts as an apology.",
        vector: [-1, -1, 0, 2, -1, -1]
      },
      {
        label: "D",
        text: "I wait for the awkwardness to decompose naturally.",
        vector: [-2, 1, 2, -1, 1, -2]
      }
    ]
  },

  // ── Q18 ──────────────────────────────────────────────────────────────
  {
    id: 18,
    text: "Someone tells you a damaging secret. What do you do?",
    options: [
      {
        label: "A",
        text: "I keep it locked inside, even when carrying it becomes uncomfortable.",
        vector: [-2, -1, -2, 1, -1, 0]
      },
      {
        label: "B",
        text: "I tell one trusted person because I \"need advice,\" which is gossip wearing glasses.",
        vector: [1, 1, -1, 1, 1, 0]
      },
      {
        label: "C",
        text: "I confront the person the secret is about.",
        vector: [1, -1, -1, 0, 0, 2]
      },
      {
        label: "D",
        text: "I keep it until the information becomes strategically useful.",
        vector: [2, 1, -2, -2, 2, 2]
      }
    ]
  },

  // ── Q19 ──────────────────────────────────────────────────────────────
  {
    id: 19,
    text: "There is a rule everyone ignores because it is useless. What do you do?",
    options: [
      {
        label: "A",
        text: "I follow it until it is officially changed. Rules do not become optional through loneliness.",
        vector: [-1, -2, -2, -1, -1, 1]
      },
      {
        label: "B",
        text: "I ignore it quietly and continue with my life.",
        vector: [-1, -2, 1, -1, 1, -1]
      },
      {
        label: "C",
        text: "I challenge it publicly and invite the argument.",
        vector: [2, 1, 1, 0, 0, 2]
      },
      {
        label: "D",
        text: "I create a better system and persuade everyone to use it instead.",
        vector: [2, 2, -1, 1, 0, 2]
      }
    ]
  },

  // ── Q20 ──────────────────────────────────────────────────────────────
  {
    id: 20,
    text: "You find a wallet containing cash and identification. What do you do?",
    options: [
      {
        label: "A",
        text: "I track down the owner and return everything personally. Their relief is enough, although a small parade would be tasteful.",
        vector: [1, -2, -1, 2, -2, 1]
      },
      {
        label: "B",
        text: "I return the wallet. The cash appears to have chosen a new life.",
        vector: [-1, -2, 2, -2, 3, 1]
      },
      {
        label: "C",
        text: "I turn it in at the nearest responsible place. I did not audition for a subplot today.",
        vector: [0, -2, -2, -1, -1, -1]
      },
      {
        label: "D",
        text: "I post \"wallet found\" and make anyone claiming it pass an increasingly elaborate identity quiz. For twenty minutes, I am the Department of Wallet Security.",
        vector: [2, 1, -1, 0, 2, 2]
      }
    ]
  },

  // ── Q21 ──────────────────────────────────────────────────────────────
  {
    id: 21,
    text: "You unexpectedly receive $10,000 with no obligations attached. What do you do?",
    options: [
      {
        label: "A",
        text: "I pay debt or save it before excitement develops an opinion.",
        vector: [-1, -2, -2, -1, 0, 1]
      },
      {
        label: "B",
        text: "I use part of it to help family, friends, or a cause I care about.",
        vector: [1, 1, -1, 2, -2, 1]
      },
      {
        label: "C",
        text: "I disappear on an adventure and return with stories instead of money.",
        vector: [1, 3, 3, 0, 1, -1]
      },
      {
        label: "D",
        text: "I use it to gain access, influence, or an advantage I could not reach before.",
        vector: [1, 1, -2, -2, 2, 2]
      }
    ]
  },

  // ── Q22 ──────────────────────────────────────────────────────────────
  {
    id: 22,
    text: "Your neighbor's reckless behavior kills your favorite pet. Once the shock passes, what are you most likely to do?",
    options: [
      {
        label: "A",
        text: "I document everything and pursue every available legal consequence.",
        vector: [1, -2, -2, -1, 0, 2]
      },
      {
        label: "B",
        text: "I go over there ready to kill them. This survey may now be evidence.",
        vector: [2, 0, 3, -1, 2, 2]
      },
      {
        label: "C",
        text: "I withdraw, grieve privately, and remove them from my life forever.",
        vector: [-2, 3, 1, 2, 0, -2]
      },
      {
        label: "D",
        text: "I need to understand exactly what happened before deciding what justice requires.",
        vector: [-1, 3, -2, 0, 0, 1]
      }
    ]
  },

  // ── Q23 ──────────────────────────────────────────────────────────────
  {
    id: 23,
    text: "You are stranded with a group during a dangerous storm. No signal. No immediate rescue. What do you do?",
    options: [
      {
        label: "A",
        text: "I assign roles, count supplies, and establish a plan.",
        vector: [2, -2, -2, 1, -1, 2]
      },
      {
        label: "B",
        text: "I quietly handle the most practical problems without trying to lead.",
        vector: [-1, -2, -1, 0, -1, -2]
      },
      {
        label: "C",
        text: "I focus on keeping people calm and together.",
        vector: [1, -1, 2, 2, -2, -2]
      },
      {
        label: "D",
        text: "I leave the group briefly to search for a route based mostly on instinct.",
        vector: [-1, 2, 2, -1, 1, -1]
      }
    ]
  },

  // ── Q24 ──────────────────────────────────────────────────────────────
  {
    id: 24,
    text: "You become invisible for twenty-four hours. What do you do?",
    options: [
      {
        label: "A",
        text: "I observe people privately to learn what they are really like.",
        vector: [-2, 2, -1, -1, -1, -1]
      },
      {
        label: "B",
        text: "I help people anonymously and leave them wondering what happened.",
        vector: [-1, 1, 1, 2, -3, 1]
      },
      {
        label: "C",
        text: "I steal, spy, or settle a few old accounts. Let us not waste a miracle.",
        vector: [-1, 1, 1, -2, 2, 2]
      },
      {
        label: "D",
        text: "I haunt people, move objects, and become a minor regional legend.",
        vector: [2, 2, 2, 0, 1, 1]
      }
    ]
  },

  // ── Q25 ──────────────────────────────────────────────────────────────
  {
    id: 25,
    text: "Your closest friend is marrying someone you believe will make them miserable. The wedding is tomorrow. What do you do?",
    options: [
      {
        label: "A",
        text: "I tell them plainly tonight, even if the friendship does not survive the conversation.",
        vector: [1, -2, -1, 1, -1, 2]
      },
      {
        label: "B",
        text: "I say nothing and support them. Adults are allowed to choose their own terrible sequels.",
        vector: [-1, 3, 2, 1, -1, -2]
      },
      {
        label: "C",
        text: "I gather evidence and recruit two trusted people for an intervention. Congratulations, this is now a task force.",
        vector: [2, 3, -2, 1, -1, 2]
      },
      {
        label: "D",
        text: "I create enough chaos to delay the wedding. I do not have a plan, but apparently neither do they.",
        vector: [2, 1, 3, 0, 1, 2]
      }
    ]
  }
];