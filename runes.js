const runesData = [
    // --- FREYA'S AETT ---
    {
        name: "Fehu",
        symbol: "ᚠ",
        meaning: "Wealth, Mobile Property, New Beginnings",
        meaningRev: "Loss of property, greed, burnout, atrophy.",
        desc: "The Cattle. Archetypal energy and the power of becoming. It suggests a time of creation, fire, and wealth that must be circulated to remain healthy."
    },
    {
        name: "Uruz",
        symbol: "ᚢ",
        meaning: "Strength, Vitality, Health, Survival",
        meaningRev: "Weakness, obsession, misdirected force, sickness.",
        desc: "The Aurochs. Untamed physical strength, speed, and endurance. It is the raw power of survival and the healing energy of the earth."
    },
    {
        name: "Thurisaz",
        symbol: "ᚦ",
        meaning: "Gateway, Giant, Defense, Breakthrough",
        meaningRev: "Danger, defenselessness, betrayal, malice.",
        desc: "The Thorn or Giant. A directed force of destruction and defense. It represents breaking down barriers and clearing the path, but requires caution."
    },
    {
        name: "Ansuz",
        symbol: "ᚨ",
        meaning: "Communication, Breath, Divine Wisdom",
        meaningRev: "Miscommunication, delusion, manipulation, silence.",
        desc: "The Odin Rune. It governs communication, song, poetry, and magic. Watch for messages, coincidences, and signals from the Other."
    },
    {
        name: "Raido",
        symbol: "ᚱ",
        meaning: "Journey, Rhythm, Right Action",
        meaningRev: "Crisis, rigidity, stasis, irrationality.",
        desc: "The Wagon. It represents the journey of life, travel, and taking the right action at the right time. Trust the rhythm of the wheel."
    },
    {
        name: "Kenaz",
        symbol: "ᚲ",
        meaning: "Torch, Knowledge, Revelation, Creativity",
        meaningRev: "False hope, lack of creativity, blindness, instability.",
        desc: "The Torch. It is the fire of transformation and regeneration. It illuminates what was previously hidden in the dark."
    },
    {
        name: "Gebo",
        symbol: "ᚷ",
        meaning: "Gift, Exchange, Partnership, Balance",
        meaningRev: "Greed, dependence, obligation, bribery. (Shadow aspect)",
        desc: "The Gift. It represents the sacred connection between giver and receiver. All gifts require energy in return. A rune of sexual and magical union."
    },
    {
        name: "Wunjo",
        symbol: "ᚹ",
        meaning: "Joy, Harmony, Fellowship, Hope",
        meaningRev: "Sorrow, strife, alienation, delirium.",
        desc: "The Flag of Joy. It represents harmony within the self and the group. A time of peace, happiness, and the realization of desire."
    },

    // --- HEIMDALL'S AETT ---
    {
        name: "Hagalaz",
        symbol: "ᚺ",
        meaning: "Hail, Disruption, Radical Change",
        meaningRev: "Pain, loss, natural disaster, suffering. (Shadow aspect)",
        desc: "The Hailstorm. It is the rune of unconscious evolution and necessary destruction. It clears the way for new growth, often through a shock."
    },
    {
        name: "Nauthiz",
        symbol: "ᚾ",
        meaning: "Need, Resistance, Friction, Shadow Work",
        meaningRev: "Constraint, distress, starvation of the spirit.",
        desc: "The Need-Fire. It represents the friction caused by resistance which lights the fire of survival. It teaches the lesson of endurance."
    },
    {
        name: "Isa",
        symbol: "ᛁ",
        meaning: "Ice, Stillness, Concentration, Ego",
        meaningRev: "Ego-mania, dullness, blindness, dissipation. (Shadow aspect)",
        desc: "The Ice. It freezes movement to allow for introspection. It acts as a bridge across dangerous waters, but warns against emotional freezing."
    },
    {
        name: "Jera",
        symbol: "ᛃ",
        meaning: "Harvest, Year, Cycles, Patience",
        meaningRev: "Bad timing, repetition, conflict. (Shadow aspect)",
        desc: "The Harvest. It is the reward for past efforts. It teaches patience, as the harvest cannot be rushed. Everything moves in cycles."
    },
    {
        name: "Eihwaz",
        symbol: "ᛇ",
        meaning: "Yew Tree, Death & Life, Reliability",
        meaningRev: "Confusion, destruction, dissatisfaction, weakness. (Shadow aspect)",
        desc: "The Yew. The tree of life and death, representing the vertical axis of the world. A rune of protection and spiritual endurance."
    },
    {
        name: "Perthro",
        symbol: "ᛈ",
        meaning: "Dice Cup, Fate, Mystery, Occult",
        meaningRev: "Addiction, stagnation, loneliness, malaise.",
        desc: "The Lot Cup. It governs the secrets of the Norns and the unmanifest. It suggests a game is being played; rely on your intuition."
    },
    {
        name: "Algiz",
        symbol: "ᛉ",
        meaning: "Elk/Sedge, Protection, Higher Self",
        meaningRev: "Hidden danger, consumption by divine forces, warning.",
        desc: "The Elk. A powerful rune of protection and connection to the divine. It creates a channel for energy to flow properly."
    },
    {
        name: "Sowilo",
        symbol: "ᛊ",
        meaning: "Sun, Success, Wholeness, Honor",
        meaningRev: "False goals, bad counsel, false success, gullibility. (Shadow aspect)",
        desc: "The Sun. It represents clear vision, victory, and the conscious will. It is the life force that drives you toward your highest aim."
    },

    // --- TYR'S AETT ---
    {
        name: "Tiwaz",
        symbol: "ᛏ",
        meaning: "Tyr, Justice, Sacrifice, Order",
        meaningRev: "Mental paralysis, over-analysis, injustice, imbalance.",
        desc: "The God Tyr. It represents logic, justice, and self-sacrifice for the greater good. It is the polestar that guides the warrior."
    },
    {
        name: "Berkano",
        symbol: "ᛒ",
        meaning: "Birch, Birth, Sanctuary, Growth",
        meaningRev: "Domestic trouble, deceit, sterility, stagnation.",
        desc: "The Birch Goddess. It governs birth (physical and mental), sanctuary, and plant life. It is a gentle, healing energy of new beginnings."
    },
    {
        name: "Ehwaz",
        symbol: "ᛖ",
        meaning: "Horse, Trust, Teamwork, Movement",
        meaningRev: "Mistrust, disharmony, betrayal, feeling trapped.",
        desc: "The Horse. It represents the trust between rider and mount (body and spirit). It indicates steady progress and partnership."
    },
    {
        name: "Mannaz",
        symbol: "ᛗ",
        meaning: "Mankind, The Self, Social Order",
        meaningRev: "Depression, manipulation, isolation, self-delusion.",
        desc: "The Human. It represents the self and the collective. It reminds us that we are all connected, but that the self must be known first."
    },
    {
        name: "Laguz",
        symbol: "ᛚ",
        meaning: "Water, Flow, Intuition, The Unconscious",
        meaningRev: "Confusion, withering, obsession, suicide.",
        desc: "The Lake. It represents the flow of water and the depths of the unconscious mind. It asks you to yield to the current and trust your feelings."
    },
    {
        name: "Inguz",
        symbol: "ᛝ",
        meaning: "Seed, Potential, Internal Growth",
        meaningRev: "Impotence, movement without change, toil. (Shadow aspect)",
        desc: "The Seed. It is a rune of isolation and gestation. Energy is being stored for a future burst of creative growth. Completion."
    },
    {
        name: "Othala",
        symbol: "ᛟ",
        meaning: "Heritage, Ancestral Land, Home",
        meaningRev: "Homelessness, bad blood, slavery, total lack of order.",
        desc: "The Estate. It represents what is inherited from ancestors—land, genetics, and debt. It defines the boundary of 'us' vs 'them'."
    },
    {
        name: "Dagaz",
        symbol: "ᛞ",
        meaning: "Day, Dawn, Awakening, Paradox",
        meaningRev: "Blindness, hopelessness, patterns repeating. (Shadow aspect)",
        desc: "The Day. It represents the moment of awakening and the blending of opposites (night and day). A rune of radical shift in consciousness."
    }
];
