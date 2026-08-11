/* Keyboard, Mouse, and Touch Controller for 《위임장》 */
class InputHandler {
  constructor(onMoveCallback, onActionCallback, onKeyModalCallback) {
    this.onMove = onMoveCallback;
    this.onAction = onActionCallback;
    this.onKeyModal = onKeyModalCallback;
    this.setupListeners();
  }

  setupListeners() {
    // Keyboard keydown
    window.addEventListener("keydown", (e) => {
      // Ignore if typing in input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const key = e.key.toLowerCase();

      // Dedicated Modal Hotkeys (J, M, T)
      if (key === "j") {
        this.onKeyModal("ledger");
        return;
      } else if (key === "m") {
        this.onKeyModal("map");
        return;
      } else if (key === "t") {
        this.onKeyModal("tree");
        return;
      }

      // Movement & Action
      if (key === "arrowup" || key === "w") {
        this.onMove("up");
      } else if (key === "arrowdown" || key === "s") {
        this.onMove("down");
      } else if (key === "arrowleft" || key === "a") {
        this.onMove("left");
      } else if (key === "arrowright" || key === "d") {
        this.onMove("right");
      } else if (key === " " || key === "enter") {
        this.onAction();
      }
    });

    // Touch D-Pad buttons
    document.querySelectorAll(".dpad-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const dir = e.target.getAttribute("data-dir");
        if (dir) this.onMove(dir);
      });
    });

    const actionTouchBtn = document.getElementById("touch-action");
    if (actionTouchBtn) {
      actionTouchBtn.addEventListener("click", () => {
        this.onAction();
      });
    }

    // Canvas click to move/interact — listen on game-container since canvas has pointer-events:none
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.addEventListener("click", (e) => {
        // Ignore if click was on a HUD button or modal (they handle themselves)
        if (e.target.closest("#hud-bar") || e.target.closest(".modal-overlay") || e.target.closest("#touch-controls") || e.target.closest("#interact-prompt")) {
          return;
        }

        const canvas = document.getElementById("game-canvas");
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Map tile click offset calculation (offsetX: 140, offsetY: 60, tileSize: 52)
        const col = Math.floor((clickX - 140) / 52);
        const row = Math.floor((clickY - 60) / 52);

        if (col >= 0 && col < 10 && row >= 0 && row < 10) {
          const dx = col - playerState.x;
          const dy = row - playerState.y;

          if (Math.abs(dx) > Math.abs(dy)) {
            this.onMove(dx > 0 ? "right" : "left");
          } else if (dy !== 0) {
            this.onMove(dy > 0 ? "down" : "up");
          } else {
            this.onAction();
          }
        }
      });
    }
  }
}
