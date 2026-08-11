/* Player State & Progression System for 《위임장》 */
class PlayerState {
  constructor() {
    this.name = "신입 서리";
    this.x = 4; // Grid coordinate X
    this.y = 7; // Grid coordinate Y
    this.dir = "down"; // up, down, left, right
    this.currentMapId = "courtyard";
    
    // Stats (0 ~ 100)
    this.stats = {
      work: 20,       // 업무 능력
      observe: 30,    // 관찰력
      reason: 15,     // 추리력
      indep: 40       // 독립성 (주관)
    };

    // Investigation Points (조사 포인트)
    this.cluePoints = 0;

    // Inventory & Collected items
    this.collectedDocIds = new Set();
    this.talkedNpcIds = new Set(); // Track completed NPC dialogues per turn
    this.records = [
      "[기록 1] 청림원에 신입 서리로 입문함. 임무: 업무에 적응하고 장부를 정리하라."
    ];

    // Emergence triggers witnessed
    this.witnessedEmergences = 0;
  }

  hasTalkedTo(npcId) {
    return this.talkedNpcIds.has(npcId);
  }

  markTalked(npcId) {
    this.talkedNpcIds.add(npcId);
  }

  addCluePoints(pts) {
    this.cluePoints += pts;
    this.stats.observe = Math.min(100, this.stats.observe + 5);
    this.stats.reason = Math.min(100, this.stats.reason + 5);
  }

  addRecord(text) {
    const num = this.records.length + 1;
    const formatted = `[기록 ${num}] ${text}`;
    this.records.push(formatted);
    return formatted;
  }

  boostStat(statKey, amount) {
    if (this.stats[statKey] !== undefined) {
      this.stats[statKey] = Math.min(100, this.stats[statKey] + amount);
    }
  }

  hasCollectedDoc(docId) {
    return this.collectedDocIds.has(docId);
  }

  collectDoc(docId) {
    this.collectedDocIds.add(docId);
  }
}

const playerState = new PlayerState();
