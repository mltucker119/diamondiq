export const playbook = [
  {
    id: 1,
    title: "The 1-3 Force Play",
    description: "Ground ball to the Pitcher. Bases empty.",
    targets: {
      'P': { x: 500, y: 550, r: 60, hint: "Field it and throw!" },
      '1B': { x: 850, y: 650, r: 60, hint: "Get to the bag!" },
      // ... add all 9 players
    }
  },
  {
    id: 2,
    title: "Force at Second",
    description: "Runner on 1st. Grounder to SS.",
    targets: { /* ... coordinates ... */ }
  }
];
