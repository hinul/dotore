/* Administrative Work Minigames (서리 업무 시스템) */
class WorkSystem {
  constructor() {
    this.currentTask = null;
  }

  startTask(taskId) {
    this.currentTask = taskId;
    const area = document.getElementById("work-minigame-area");
    const selection = document.querySelector(".work-selection");
    const title = document.getElementById("minigame-title");
    const content = document.getElementById("minigame-content");

    if (!area || !content) return;

    selection.classList.add("hidden");
    area.classList.remove("hidden");

    if (taskId === "ledger-audit") {
      title.innerText = "📂 세입 장부 수치 대조 작업";
      content.innerHTML = `
        <p style="margin-bottom: 12px; font-size:14px;">장부 A(외방 보고서)와 장부 B(중앙 입고서)를 비교하여 수치가 서로 맞지 않는 모순 항목을 고르십시오:</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="choice-btn audit-choice" data-correct="false">항목 1: 3월 쌀 500석 입고 (양쪽 동일)</button>
          <button class="choice-btn audit-choice" data-correct="true">항목 2: 6월 남쪽 구휼미 500석 방출 (장부 B에 대상 친서 미첨부!)</button>
          <button class="choice-btn audit-choice" data-correct="false">항목 3: 9월 보리 200석 이송 (양쪽 동일)</button>
        </div>
      `;
    } else if (taskId === "region-survey") {
      title.innerText = "🗺️ 남쪽 거점 보고서 분류";
      content.innerHTML = `
        <p style="margin-bottom: 12px; font-size:14px;">대상의 발언 «남쪽 일은 어떻게 되었지?»에 부합하는 적절한 보고서 서류를 분류하십시오:</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="choice-btn survey-choice" data-correct="true">선택: 남쪽 흉년 수해 복구 지원 및 세금 감면 조율안</button>
          <button class="choice-btn survey-choice" data-correct="false">선택: 남쪽 관아 무기 창고 확충 보고서</button>
        </div>
      `;
    } else if (taskId === "event-prep") {
      title.innerText = "🏮 청림원 추수 의례 서리 조율안 작성";
      content.innerHTML = `
        <p style="margin-bottom: 12px; font-size:14px;">후계자 측과 외방관 측이 서로 상석을 요구하고 있습니다. 중립적인 서리로서 최선의 배치는?</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button class="choice-btn prep-choice" data-correct="true">선택: 동/서 동일 사각 방석 배치 및 대상의 참나무 중앙 좌석 고수</button>
          <button class="choice-btn prep-choice" data-correct="false">선택: 후계자를 대상 바로 오른쪽에 상석으로 배치</button>
        </div>
      `;
    }

    // Attach click listeners to choices
    content.querySelectorAll(".choice-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const isCorrect = e.target.getAttribute("data-correct") === "true";
        this.finishTask(isCorrect);
      });
    });
  }

  finishTask(success) {
    const area = document.getElementById("work-minigame-area");
    const selection = document.querySelector(".work-selection");

    if (success) {
      playerState.boostStat("work", 15);
      playerState.boostStat("reason", 10);
      playerState.addCluePoints(15);
      const rec = playerState.addRecord("성공적으로 서리 일상 업무를 처리하고 보고서를 작성함. (업무 능력 +15, 조사포인트 +15)");
      if (window.showToast) window.showToast("✍️ 업무 완성! 업무 능력과 조사 포인트 상승!");
      if (window.audioEngine) window.audioEngine.playPickup();
    } else {
      if (window.showToast) window.showToast("⚠️ 업무 서류 검토에 오점이 있었습니다. 다시 확인하십시오.");
    }

    if (area && selection) {
      area.classList.add("hidden");
      selection.classList.remove("hidden");
    }

    // Close work modal
    const workModal = document.getElementById("work-modal");
    if (workModal) workModal.classList.add("hidden");

    // Update Act 1 story condition
    if (STORY_DATA.currentAct === 1) {
      STORY_DATA.acts[1].completed = true;
    }
  }
}

const workSystem = new WorkSystem();
