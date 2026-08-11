/* Map Tilemaps & Spatial Layouts for Cheonglimwon (청림원) */
const MAPS_DATA = {
  courtyard: {
    id: "courtyard",
    name: "청림원 - 중앙 참나무 중정",
    cols: 10,
    rows: 10,
    // 0: Walkable Floor, 1: Wooden Fence/Wall, 2: Grass/Flowers, 3: Great Oak Tree, 5: Portal Door
    grid: [
      [1, 1, 1, 1, 5, 5, 1, 1, 1, 1], // Top row -> Portal to Sanctum (col 4, 5)
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 0, 0, 2, 2, 0, 1],
      [5, 0, 2, 3, 3, 3, 3, 2, 0, 5], // Left (col 0) -> Heir, Right (col 9) -> Outpost
      [5, 0, 0, 3, 3, 3, 3, 0, 0, 5],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 5, 5, 1, 1, 1, 1]  // Bottom row -> Portal to Archive (col 4, 5)
    ],
    portals: [
      { x: 4, y: 0, targetMap: "sanctum", targetX: 5, targetY: 8 },
      { x: 5, y: 0, targetMap: "sanctum", targetX: 5, targetY: 8 },
      { x: 0, y: 3, targetMap: "heir", targetX: 8, targetY: 4 },
      { x: 0, y: 4, targetMap: "heir", targetX: 8, targetY: 4 },
      { x: 9, y: 3, targetMap: "outpost", targetX: 1, targetY: 4 },
      { x: 9, y: 4, targetMap: "outpost", targetX: 1, targetY: 4 },
      { x: 4, y: 9, targetMap: "archive", targetX: 5, targetY: 1 },
      { x: 5, y: 9, targetMap: "archive", targetX: 5, targetY: 1 }
    ]
  },

  sanctum: {
    id: "sanctum",
    name: "청림원 - 대상의 정전 (頂殿)",
    cols: 10,
    rows: 10,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 4, 0, 0, 0, 0, 4, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 4, 4, 4, 4, 0, 0, 1], // Grand Master's Throne Desk
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 5, 5, 1, 1, 1, 1], // South exit -> Courtyard
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    portals: [
      { x: 4, y: 8, targetMap: "courtyard", targetX: 4, targetY: 1 },
      { x: 5, y: 8, targetMap: "courtyard", targetX: 5, targetY: 1 }
    ]
  },

  heir: {
    id: "heir",
    name: "청림원 - 후계자의 처소 (後繼處)",
    cols: 10,
    rows: 10,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 4, 4, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 5, 1], // East exit -> Courtyard
      [1, 0, 0, 4, 4, 0, 0, 0, 5, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    portals: [
      { x: 8, y: 4, targetMap: "courtyard", targetX: 1, targetY: 3 },
      { x: 8, y: 5, targetMap: "courtyard", targetX: 1, targetY: 4 }
    ]
  },

  outpost: {
    id: "outpost",
    name: "청림원 - 외방관 집무실 (外方廳)",
    cols: 10,
    rows: 10,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 0, 0, 0, 4, 4, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 5, 0, 0, 0, 0, 0, 0, 0, 1], // West exit -> Courtyard
      [1, 5, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    portals: [
      { x: 1, y: 4, targetMap: "courtyard", targetX: 8, targetY: 3 },
      { x: 1, y: 5, targetMap: "courtyard", targetX: 8, targetY: 4 }
    ]
  },

  archive: {
    id: "archive",
    name: "청림원 - 중앙 서고 (中央書庫)",
    cols: 10,
    rows: 10,
    grid: [
      [1, 1, 1, 1, 5, 5, 1, 1, 1, 1], // North exit -> Courtyard
      [1, 4, 4, 0, 0, 0, 0, 4, 4, 1],
      [1, 4, 4, 0, 0, 0, 0, 4, 4, 1],
      [1, 0, 0, 0, 4, 4, 0, 0, 0, 1], // Archive paper shelves
      [1, 0, 0, 0, 4, 4, 0, 0, 0, 1],
      [1, 4, 4, 0, 0, 0, 0, 4, 4, 1],
      [1, 4, 4, 0, 0, 0, 0, 4, 4, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    portals: [
      { x: 4, y: 0, targetMap: "courtyard", targetX: 4, targetY: 8 },
      { x: 5, y: 0, targetMap: "courtyard", targetX: 5, targetY: 8 }
    ]
  }
};
