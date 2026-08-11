/* Main Game Controller & Application Logic for 《위임장》 */
class RPGGameController {
  constructor() {
    this.renderer = null;
    this.input = null;
    this.currentDialogueNPC = null;
    this.dialogueStep = 0;
  }

  init() {
    // 1. Initialize Renderer
    this.renderer = new CanvasRenderer("game-canvas");

    // 2. Initialize Audio & Ambient Sounds
    window.addEventListener("click", () => {
      audioEngine.init();
      audioEngine.startAmbientBGM();
    }, { once: true });

    // 3. Setup Input Handler
    this.input = new InputHandler(
      (dir) => this.handlePlayerMove(dir),
      () => this.handleAction(),
      (modalName) => this.toggleModalByName(modalName)
    );

    // 4. Setup HUD & UI Button Event Listeners
    this.bindUIEvents();

    // 5. Initial Ledger Render
    ledgerSystem.renderUI();

    // 6. Start Main Game Loop
    this.startLoop();

    // Show initial welcome toast
    this.showToast("📜 청림원에 입문하였습니다. [Space] 또는 화면 아래 [조사/대화] 버튼으로 탐색하십시오.");
  }

  startLoop() {
    const loop = () => {
      const currentMap = MAPS_DATA[playerState.currentMapId];
      this.renderer.render(currentMap, playerState, NPCS_DATA, DOCUMENTS_DATA);
      this.updateInteractPrompt();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  handlePlayerMove(dir) {
    playerState.dir = dir;
    let nextX = playerState.x;
    let nextY = playerState.y;

    if (dir === "up") nextY--;
    else if (dir === "down") nextY++;
    else if (dir === "left") nextX--;
    else if (dir === "right") nextX++;

    const currentMap = MAPS_DATA[playerState.currentMapId];

    // Boundary Check
    if (nextX < 0 || nextX >= currentMap.cols || nextY < 0 || nextY >= currentMap.rows) {
      return;
    }

    // Collision Check (Tile 1: Wall, 3: Oak Tree trunk, 4: Desk)
    const tile = currentMap.grid[nextY][nextX];
    if (tile === 1 || tile === 3 || tile === 4) {
      return; // Blocked
    }

    // Move player
    playerState.x = nextX;
    playerState.y = nextY;
    audioEngine.playFootstep();

    // Check Portal Transition
    const portal = currentMap.portals.find(p => p.x === nextX && p.y === nextY);
    if (portal) {
      this.changeMap(portal.targetMap, portal.targetX, portal.targetY);
    }
  }

  changeMap(targetMapId, targetX, targetY) {
    playerState.currentMapId = targetMapId;
    playerState.x = targetX;
    playerState.y = targetY;

    const mapData = MAPS_DATA[targetMapId];
    document.getElementById("hud-location").innerText = mapData.name;
    this.showToast(`📍 ${mapData.name}에 도착했습니다.`);

    // Grand Master Emergence Scripted Event Triggering
    if (targetMapId === "sanctum" && playerState.witnessedEmergences === 0 && playerState.cluePoints >= 15) {
      this.triggerGrandMasterEmergence();
    }
  }

  // Find nearby interactable item or NPC within 1 tile distance
  getNearbyDoc() {
    return DOCUMENTS_DATA.find(d => 
      d.mapId === playerState.currentMapId && 
      Math.abs(d.x - playerState.x) <= 1 && 
      Math.abs(d.y - playerState.y) <= 1 && 
      !playerState.hasCollectedDoc(d.id)
    );
  }

  getNearbyNPC() {
    // 대상(grandmaster)은 이벤트 전용 인물 — 일반 NPC 감지에서 제외
    return Object.values(NPCS_DATA).find(n =>
      n.id !== "grandmaster" &&
      n.initialMap === playerState.currentMapId &&
      Math.abs(n.x - playerState.x) <= 1 &&
      Math.abs(n.y - playerState.y) <= 1
    );
  }

  updateInteractPrompt() {
    const promptEl = document.getElementById("interact-prompt");
    const labelEl = document.getElementById("interact-label");

    // Check for nearby document
    const doc = this.getNearbyDoc();
    if (doc) {
      promptEl.classList.remove("hidden");
      labelEl.innerText = `[서류 습득] ${doc.title}`;
      return;
    }

    // Check for nearby NPC
    const npc = this.getNearbyNPC();
    if (npc) {
      promptEl.classList.remove("hidden");
      labelEl.innerText = `[대화] ${npc.name} (${npc.title})`;
      return;
    }

    promptEl.classList.add("hidden");
  }

  handleAction() {
    // If dialogue modal is open, advance dialogue
    const dialogueModal = document.getElementById("dialogue-modal");
    if (!dialogueModal.classList.contains("hidden")) {
      this.advanceDialogue();
      return;
    }

    // 1. Check Document Pickup (Within 1 tile distance)
    const doc = this.getNearbyDoc();
    if (doc) {
      this.openDocumentModal(doc);
      return;
    }

    // 2. Check NPC Dialogue (Within 1 tile distance)
    const npc = this.getNearbyNPC();
    if (npc) {
      if (npc.id === "grandmaster" && playerState.cluePoints >= 40) {
        this.openClimaxModal();
      } else {
        this.startNPCDialogue(npc);
      }
      return;
    }

    this.showToast("💡 인물이나 서류 근처로 이동한 후 [조사/대화] 버튼을 누르십시오.");
  }

  openDocumentModal(doc) {
    playerState.collectDoc(doc.id);
    playerState.addCluePoints(doc.rewardPts);
    document.getElementById("hud-clue-pts").innerText = playerState.cluePoints;

    document.getElementById("doc-title").innerText = doc.title;
    document.getElementById("doc-content").innerHTML = doc.content;
    document.getElementById("doc-reward-pts").innerText = doc.rewardPts;

    const docModal = document.getElementById("document-modal");
    docModal.classList.remove("hidden");
    audioEngine.playPickup();

    const addBtn = document.getElementById("btn-add-to-ledger");
    addBtn.onclick = () => {
      ledgerSystem.addEntry(doc.category, doc.ledgerEntry);
      playerState.addRecord(`서류 [${doc.title}]를 검토하고 사건 장부에 증거를 기록함.`);
      docModal.classList.add("hidden");
      this.showToast("📖 사건 장부에 증무 정보가 반영되었습니다.");
    };
  }

  startNPCDialogue(npc) {
    this.currentDialogueNPC = npc;
    this.dialogueStep = 0;

    document.getElementById("speaker-name").innerText = npc.name;
    document.getElementById("speaker-title").innerText = npc.title;
    document.getElementById("speaker-avatar").style.backgroundColor = npc.avatarBg;

    const dialogueModal = document.getElementById("dialogue-modal");
    dialogueModal.classList.remove("hidden");

    // Check if dialogue with this NPC was already completed in this turn
    if (playerState.hasTalkedTo(npc.id)) {
      this.renderAlreadyTalkedDialogue(npc);
    } else {
      this.renderDialogueStep();
    }
  }

  renderAlreadyTalkedDialogue(npc) {
    const textEl = document.getElementById("dialogue-text");
    const choicesEl = document.getElementById("dialogue-choices");
    choicesEl.innerHTML = "";
    choicesEl.classList.remove("hidden");

    textEl.innerText = `“이미 나와 깊은 이야기를 나누지 않았는가. 자네가 내린 판단과 대화 기록은 언제든 [서리 기록장]에서 다시 검토할 수 있네.”`;
    audioEngine.playBlip();

    // Option 1: View records modal
    const viewBtn = document.createElement("button");
    viewBtn.className = "choice-btn";
    viewBtn.innerText = "1. [📜 나의 대화 및 판단 기록장 확인하기]";
    viewBtn.onclick = () => {
      document.getElementById("dialogue-modal").classList.add("hidden");
      this.toggleModalByName("stats");
    };
    choicesEl.appendChild(viewBtn);

    // Option 2: Close
    const closeBtn = document.createElement("button");
    closeBtn.className = "choice-btn";
    closeBtn.innerText = "2. [대화 종료]";
    closeBtn.onclick = () => {
      document.getElementById("dialogue-modal").classList.add("hidden");
    };
    choicesEl.appendChild(closeBtn);
  }

  renderDialogueStep() {
    const npc = this.currentDialogueNPC;
    const dialogueTree = npc.dialogues.intro;
    const node = dialogueTree[this.dialogueStep];

    if (!node) {
      document.getElementById("dialogue-modal").classList.add("hidden");
      playerState.markTalked(npc.id);
      return;
    }

    const textEl = document.getElementById("dialogue-text");
    const choicesEl = document.getElementById("dialogue-choices");
    choicesEl.innerHTML = "";
    choicesEl.classList.add("hidden");

    textEl.innerText = node.text;
    audioEngine.playBlip();

    if (node.options) {
      choicesEl.classList.remove("hidden");
      node.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerText = opt.label;
        btn.onclick = () => {
          // Apply stat modifiers if option has effects
          if (opt.effects) {
            Object.keys(opt.effects).forEach(statKey => {
              if (playerState.stats[statKey] !== undefined) {
                playerState.boostStat(statKey, opt.effects[statKey]);
              }
            });
            playerState.addRecord(`${npc.name}과의 대화 중 판단: "${opt.label}"`);
          }

          if (opt.toast) {
            this.showToast(opt.toast);
          }

          if (opt.end) {
            playerState.markTalked(npc.id);
            document.getElementById("dialogue-modal").classList.add("hidden");
          } else if (opt.next) {
            const nextIdx = dialogueTree.findIndex(n => n.id === opt.next);
            if (nextIdx !== -1) {
              this.dialogueStep = nextIdx;
              this.renderDialogueStep();
            } else {
              playerState.markTalked(npc.id);
              document.getElementById("dialogue-modal").classList.add("hidden");
            }
          }
        };
        choicesEl.appendChild(btn);
      });
    }
  }

  advanceDialogue() {
    const choicesEl = document.getElementById("dialogue-choices");
    if (!choicesEl.classList.contains("hidden") && choicesEl.children.length > 0) {
      return; // Wait for choice select
    }
    this.dialogueStep++;
    this.renderDialogueStep();
  }

  triggerGrandMasterEmergence() {
    playerState.witnessedEmergences++;
    audioEngine.playGrandMasterGong();

    const fx = document.getElementById("fx-grandmaster");
    fx.classList.remove("hidden");

    setTimeout(() => {
      fx.classList.add("hidden");
      // 정전 첫 입장 시 장부 기록
      ledgerSystem.addEntry("contradictions", {
        id: "gm_emergence_1",
        title: "[미확인 의중] 대상의 갑작스러운 출몰",
        source: "참나무 중정",
        body: "대상이 «그렇게까지 할 일인가?»라는 모호한 한마디를 남김. 후계자 측과 외방관 측의 해석이 정면 충돌하기 시작함."
      });
      playerState.addRecord("대상의 갑작스러운 출몰을 목격함. 사건 [미확인 의중] 등록.");
      this.showToast("📜 대상이 갑자기 나타났다가 사라졌습니다. 사건 장부에 기록되었습니다.");
    }, 2200);
  }

  // ── 장부 제출 → 대상 갑작스러운 출몰 이벤트 ──────────────────────────────
  submitLedgerToGrandMaster() {
    document.getElementById("ledger-modal").classList.add("hidden");

    this.showToast("📜 장부를 품에 안고 정전으로 향합니다...");
    audioEngine.playGrandMasterGong();

    const fx = document.getElementById("fx-grandmaster");
    fx.classList.remove("hidden");

    setTimeout(() => {
      fx.classList.add("hidden");
      this.openGrandMasterSternDialogue();
    }, 2000);
  }

  openGrandMasterSternDialogue() {
    const gm = NPCS_DATA.grandmaster;
    document.getElementById("speaker-name").innerText = gm.name;
    document.getElementById("speaker-title").innerText = gm.title;
    document.getElementById("speaker-avatar").style.backgroundColor = gm.avatarBg;

    const docCount = playerState.collectedDocIds.size;
    const recordedCount = playerState.records.length;

    // 표독하고 날카로운 대사
    const sternLines = [
      `(묵묵히 장부를 받아 든 대상이 한 장씩 천천히 넘기다 문득 눈을 가늘게 뜬다.)`,
      `"...서류 ${docCount}장, 기록 ${recordedCount}건. 그래, 자네가 직접 눈으로 확인한 것들이겠지."`,
      `(손가락으로 장부를 탁 닫으며 차갑게 응시한다.)`,
      `"서리가 이런 것을 직접 가지고 올 줄은 몰랐군. ...좋아. 그래서 자네는 어떻게 생각하나?"`
    ];

    const choicesEl = document.getElementById("dialogue-choices");
    choicesEl.innerHTML = "";
    choicesEl.classList.add("hidden");

    // 대사를 순서대로 한 줄씩 흘려보내며 연출
    let lineIdx = 0;
    const textEl = document.getElementById("dialogue-text");
    textEl.innerText = sternLines[0];
    audioEngine.playBlip();

    document.getElementById("dialogue-modal").classList.remove("hidden");

    // 클로즈 버튼: 대상이 그냥 사라짐
    const closeBtn = document.getElementById("btn-close-dialogue");
    const dismissFn = () => {
      document.getElementById("dialogue-modal").classList.add("hidden");
      this.showToast("대상이 아무 말 없이 장부를 품에 넣고 사라진다.");
      // 대상이 사라지는 FX 연출
      const fx = document.getElementById("fx-grandmaster");
      fx.classList.remove("hidden");
      setTimeout(() => fx.classList.add("hidden"), 1200);
    };
    closeBtn.onclick = dismissFn;

    // 대화창 클릭/스페이스로 다음 줄 진행
    const advanceLine = () => {
      lineIdx++;
      if (lineIdx < sternLines.length) {
        textEl.innerText = sternLines[lineIdx];
        audioEngine.playBlip();
      } else {
        // 마지막 대사 후 → 엔딩 선택지 표시
        this.openClimaxChoices();
      }
    };

    // 임시 클릭 핸들러 (선택지 나오면 제거)
    this._advanceSternLine = advanceLine;
    textEl.style.cursor = "pointer";
    textEl.onclick = advanceLine;

    // 하단 힌트 업데이트
    document.querySelector(".dialogue-footer .hint-text").innerText = "[클릭] 다음 대사";
  }

  openClimaxChoices() {
    // 클릭 핸들러 정리
    const textEl = document.getElementById("dialogue-text");
    textEl.style.cursor = "default";
    textEl.onclick = null;
    document.querySelector(".dialogue-footer .hint-text").innerText = "장부를 제출할 판단을 선택하십시오.";

    const climax = STORY_DATA.climaxQuestions;
    const choicesEl = document.getElementById("dialogue-choices");
    choicesEl.innerHTML = "";
    choicesEl.classList.remove("hidden");

    climax.choices.forEach(c => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";

      const hasPts   = playerState.cluePoints >= (c.reqPts || 0);
      const hasIndep = playerState.stats.indep >= (c.reqIndep || 0);
      const hasDocs  = playerState.collectedDocIds.size >= (c.reqDocs || 0);
      const isUnlocked = hasPts && hasIndep && hasDocs;

      if (isUnlocked) {
        btn.innerText = `${c.text}  [✅ ${c.reqLabel}]`;
        btn.onclick = () => this.triggerEnding(c.endingId);
      } else {
        btn.innerText = `${c.text}  [🔒 ${c.reqLabel}]`;
        btn.style.opacity = "0.55";
        btn.style.cursor = "not-allowed";
        btn.onclick = () => this.showToast(`🔒 조건 미달: ${c.reqLabel} (현재 PT:${playerState.cluePoints}, 독립성:${playerState.stats.indep})`);
      }

      choicesEl.appendChild(btn);
    });

    // 닫기 버튼: 대상 그냥 사라짐
    const closeBtn = document.getElementById("btn-close-dialogue");
    closeBtn.onclick = () => {
      document.getElementById("dialogue-modal").classList.add("hidden");
      this.showToast("대상이 무표정으로 장부를 덮고 조용히 사라진다.");
      const fx = document.getElementById("fx-grandmaster");
      fx.classList.remove("hidden");
      setTimeout(() => fx.classList.add("hidden"), 1200);
    };
  }

  triggerEnding(endingId) {
    document.getElementById("dialogue-modal").classList.add("hidden");
    const endingData = STORY_DATA.endings[endingId] || STORY_DATA.endings.BAD_STAY_SHADE;

    document.getElementById("ending-title").innerText = endingData.type;
    document.getElementById("ending-subtitle").innerText = endingData.title;
    document.getElementById("ending-summary").innerHTML = endingData.summary;

    const endingScreen = document.getElementById("ending-screen");
    endingScreen.classList.remove("hidden");
    audioEngine.playGrandMasterGong();


    document.getElementById("btn-restart").onclick = () => {
      window.location.reload();
    };
  }

  toggleModalByName(modalName) {
    const modalIdMap = {
      tree: "tree-modal",
      ledger: "ledger-modal",
      work: "work-modal",
      map: "map-modal",
      stats: "stats-modal"
    };

    const targetId = modalIdMap[modalName];
    if (targetId) {
      const modal = document.getElementById(targetId);
      if (modal) {
        // Close all other modals first to prevent overlay stack blocking
        Object.values(modalIdMap).forEach(id => {
          if (id !== targetId) {
            const m = document.getElementById(id);
            if (m) m.classList.add("hidden");
          }
        });

        modal.classList.toggle("hidden");
        if (modalName === "stats") this.renderStatsUI();
      }
    }
  }

  renderStatsUI() {
    const setStat = (barId, valId, statVal) => {
      const bar = document.getElementById(barId);
      const val = document.getElementById(valId);
      if (bar) bar.style.width = `${statVal}%`;
      if (val) val.innerText = `Lv.${Math.floor(statVal / 20)} (${statVal}/100)`;
    };

    setStat("stat-work", "val-work", playerState.stats.work || 0);
    setStat("stat-observe", "val-observe", playerState.stats.observe || 0);
    setStat("stat-reason", "val-reason", playerState.stats.reason || 0);
    setStat("stat-indep", "val-indep", playerState.stats.indep || 0);

    const recContainer = document.getElementById("records-list");
    if (recContainer && playerState.records) {
      recContainer.innerHTML = playerState.records.map(r => `<div class="record-item">${r}</div>`).join("");
    }
  }

  bindUIEvents() {
    const bindClick = (id, fn) => {
      const el = document.getElementById(id);
      if (el) {
        el.onclick = (e) => {
          e.stopPropagation();
          fn();
        };
      }
    };

    // HUD Button toggles
    bindClick("btn-tree", () => this.toggleModalByName("tree"));
    bindClick("btn-ledger", () => this.toggleModalByName("ledger"));
    bindClick("btn-work", () => this.toggleModalByName("work"));
    bindClick("btn-map", () => this.toggleModalByName("map"));
    bindClick("btn-stats", () => this.toggleModalByName("stats"));

    // Click directly on prompt box
    bindClick("interact-prompt", () => this.handleAction());

    // Touch action button
    bindClick("touch-action", () => this.handleAction());

    // Screen submit button next to touch-action button
    bindClick("btn-screen-submit-ledger", () => this.submitLedgerToGrandMaster());

    // Close buttons
    bindClick("btn-close-dialogue", () => document.getElementById("dialogue-modal")?.classList.add("hidden"));
    bindClick("btn-close-tree", () => document.getElementById("tree-modal")?.classList.add("hidden"));
    bindClick("btn-close-ledger", () => document.getElementById("ledger-modal")?.classList.add("hidden"));
    bindClick("btn-close-doc", () => document.getElementById("document-modal")?.classList.add("hidden"));
    bindClick("btn-close-work", () => document.getElementById("work-modal")?.classList.add("hidden"));
    bindClick("btn-close-map", () => document.getElementById("map-modal")?.classList.add("hidden"));
    bindClick("btn-close-stats", () => document.getElementById("stats-modal")?.classList.add("hidden"));

    // Ledger Submission Button
    bindClick("btn-submit-ledger", () => this.submitLedgerToGrandMaster());

    // Incident Ledger Tabs
    document.querySelectorAll(".ledger-tabs .tab-btn").forEach(btn => {
      btn.onclick = (e) => {
        document.querySelectorAll(".ledger-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".ledger-body .tab-content").forEach(c => c.classList.remove("active"));

        e.target.classList.add("active");
        const targetTabId = e.target.getAttribute("data-tab");
        document.getElementById(targetTabId).classList.add("active");
      };
    });

    // World Map Fast Travel (Safe Map Zone Click Handler)
    document.querySelectorAll(".map-zone").forEach(zone => {
      zone.addEventListener("click", (e) => {
        const targetEl = e.currentTarget;
        const targetMap = targetEl.getAttribute("data-target");
        if (targetMap && MAPS_DATA[targetMap]) {
          document.querySelectorAll(".map-zone").forEach(z => z.classList.remove("active"));
          targetEl.classList.add("active");
          
          // Safe spawn coordinates per map (avoiding obstacles/Oak tree)
          const spawnCoords = {
            courtyard: { x: 5, y: 7 },
            sanctum: { x: 5, y: 6 },
            heir: { x: 4, y: 4 },
            outpost: { x: 4, y: 4 },
            archive: { x: 5, y: 4 }
          };
          const spawn = spawnCoords[targetMap] || { x: 5, y: 5 };

          this.changeMap(targetMap, spawn.x, spawn.y);
          document.getElementById("map-modal").classList.add("hidden");
          audioEngine.playPickup();
        }
      });
    });

    // Work minigame cards
    document.querySelectorAll(".work-card .work-start-btn").forEach(btn => {
      btn.onclick = (e) => {
        const card = e.target.closest(".work-card");
        const taskId = card.getAttribute("data-work");
        workSystem.startTask(taskId);
      };
    });
  }

  showToast(msg) {
    const toast = document.getElementById("toast-notify");
    if (toast) {
      toast.innerText = msg;
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 3500);
    }
  }
}

// Global Modal Toggle Helper
window.toggleModalByName = function(modalName) {
  if (window.gameInstance) {
    window.gameInstance.toggleModalByName(modalName);
  } else {
    const modalIdMap = {
      tree: "tree-modal",
      ledger: "ledger-modal",
      work: "work-modal",
      map: "map-modal",
      stats: "stats-modal"
    };
    const targetId = modalIdMap[modalName];
    if (targetId) {
      const modal = document.getElementById(targetId);
      if (modal) {
        Object.values(modalIdMap).forEach(id => {
          if (id !== targetId) {
            const m = document.getElementById(id);
            if (m) m.classList.add("hidden");
          }
        });
        modal.classList.toggle("hidden");
      }
    }
  }
};

// Global Toast helper
window.showToast = (msg) => {
  const toast = document.getElementById("toast-notify");
  if (toast) {
    toast.innerText = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3500);
  }
};

// Fail-proof Game Initialization
const launchGame = () => {
  if (window.gameInstance) return;
  window.gameInstance = new RPGGameController();
  window.gameInstance.init();
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", launchGame);
} else {
  launchGame();
}
