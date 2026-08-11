/* Canvas Pixel Engine & Tile Renderer for 《위임장》 */
class CanvasRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.tileSize = 52; // 10x10 grid (520x520px map area)
    this.offsetX = 140; // Center map horizontally (800 - 520) / 2
    this.offsetY = 60;  // Render map below the 48px HUD bar
    this.animFrame = 0;
    
    // Disable anti-aliasing for retro pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  render(mapData, player, npcs, documents) {
    if (!mapData || !mapData.grid) return;

    this.animFrame = (this.animFrame + 0.05) % (Math.PI * 2);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Dark Background Pattern
    this.ctx.fillStyle = '#0d0a08';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Map Tiles
    for (let r = 0; r < mapData.rows; r++) {
      for (let c = 0; c < mapData.cols; c++) {
        const tileType = mapData.grid[r][c];
        const screenX = this.offsetX + c * this.tileSize;
        const screenY = this.offsetY + r * this.tileSize;
        this.drawTile(tileType, screenX, screenY, c, r, mapData);
      }
    }

    // 2. Draw Collectible Documents (Sparkling Papers)
    if (documents && Array.isArray(documents)) {
      documents.forEach(doc => {
        if (doc.mapId === mapData.id && !playerState.hasCollectedDoc(doc.id)) {
          const docX = this.offsetX + doc.x * this.tileSize;
          const docY = this.offsetY + doc.y * this.tileSize;
          this.drawDocumentPaper(docX, docY);
        }
      });
    }

    // 3. Draw NPCs
    if (npcs && typeof npcs === 'object') {
      Object.values(npcs).forEach(npc => {
        if (npc.initialMap === mapData.id) {
          const npcX = this.offsetX + npc.x * this.tileSize;
          const npcY = this.offsetY + npc.y * this.tileSize;
          this.drawCharacterSprite(npcX, npcY, npc.color, npc.name, false);
        }
      });
    }

    // 4. Draw Player Character
    const playerX = this.offsetX + player.x * this.tileSize;
    const playerY = this.offsetY + player.y * this.tileSize;
    this.drawCharacterSprite(playerX, playerY, '#e0a96d', player.name, true);
  }

  drawTile(tileType, x, y, col, row, mapData) {
    if (tileType === 0) {
      // Walkable Wood / Stone Floor
      this.ctx.fillStyle = (col + row) % 2 === 0 ? '#2b231c' : '#231b15';
      this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
      this.ctx.strokeStyle = '#17120d';
      this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
    } else if (tileType === 1) {
      // Wall / Wooden Fence
      this.ctx.fillStyle = '#4a3828';
      this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
      this.ctx.fillStyle = '#2b1f14';
      this.ctx.fillRect(x + 4, y + 4, this.tileSize - 8, this.tileSize - 8);
    } else if (tileType === 2) {
      // Grass & Courtyard Garden
      this.ctx.fillStyle = '#1e3820';
      this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
      // Small dots for grass
      this.ctx.fillStyle = '#345e38';
      this.ctx.fillRect(x + 10, y + 10, 4, 4);
      this.ctx.fillRect(x + 35, y + 25, 4, 4);
      this.ctx.fillRect(x + 20, y + 45, 4, 4);
    } else if (tileType === 3) {
      // Great Oak Tree Center Tile
      this.ctx.fillStyle = '#2e1c0c';
      this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
      // Oak Leaves Canopy
      this.ctx.fillStyle = '#1c4a20';
      this.ctx.beginPath();
      this.ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 28, 0, Math.PI * 2);
      this.ctx.fill();
      // Acorn Dot
      this.ctx.fillStyle = '#d4a359';
      this.ctx.fillRect(x + 26, y + 26, 8, 8);
    } else if (tileType === 4) {
      // Desk / Paper Shelf
      this.ctx.fillStyle = '#593d25';
      this.ctx.fillRect(x + 6, y + 6, this.tileSize - 12, this.tileSize - 12);
      this.ctx.fillStyle = '#f4ead5';
      this.ctx.fillRect(x + 12, y + 14, 16, 20); // Stacked paper
      this.ctx.fillRect(x + 32, y + 18, 14, 16);
    } else if (tileType === 5) {
      // Portal Door Exit with Direction & Destination Tag (Render Signplate Once per Door)
      this.ctx.fillStyle = '#3a2d1d';
      this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
      this.ctx.strokeStyle = '#f0c370';
      this.ctx.strokeRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);

      const matchedPortal = mapData && mapData.portals ? mapData.portals.find(p => p.x === col && p.y === row) : null;

      // Check if this tile is the first portal tile in the door group to prevent duplicate labels
      const firstIndex = mapData && mapData.portals ? mapData.portals.findIndex(p => p.targetMap === matchedPortal?.targetMap) : -1;
      const currentIndex = mapData && mapData.portals ? mapData.portals.findIndex(p => p.x === col && p.y === row) : -1;
      const isPrimaryTile = (firstIndex === currentIndex);

      if (isPrimaryTile && matchedPortal) {
        const floatY = Math.sin(this.animFrame * 2) * 3;
        
        const targetMapNames = {
          sanctum: "대상의 정전",
          heir: "후계자의 처소",
          outpost: "외방관 집무실",
          archive: "중앙 서고",
          courtyard: "참나무 중정"
        };

        const destName = targetMapNames[matchedPortal.targetMap] || '이동';

        // Smart Direction Arrow Calculation based on map layout & tile position
        let arrow = "🚪";
        if (row === 0) arrow = "▲ [북]";
        else if (row >= 8) arrow = "▼ [남]";
        else if (col <= 1) arrow = "◀ [서]";
        else if (col >= 8) arrow = "▶ [동]";

        // Specific map overrides for exact clarity
        if (mapData.id === "outpost") arrow = "◀ [서]";
        if (mapData.id === "heir") arrow = "▶ [동]";

        const destText = `${arrow} ${destName}`;
        const plateWidth = 110;
        const plateX = x + (this.tileSize / 2) - (plateWidth / 2);

        // Draw Single Portal Signplate (Centered)
        this.ctx.fillStyle = 'rgba(20, 16, 13, 0.95)';
        this.ctx.fillRect(plateX, y + 14 + floatY, plateWidth, 22);
        this.ctx.strokeStyle = '#d4a359';
        this.ctx.strokeRect(plateX, y + 14 + floatY, plateWidth, 22);

        this.ctx.fillStyle = '#f0c370';
        this.ctx.font = 'bold 11px Gowun Batang, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(destText, x + (this.tileSize / 2), y + 29 + floatY);
      }
    }
  }

  drawDocumentPaper(x, y) {
    const floatY = Math.sin(this.animFrame * 3) * 4;
    // Glowing golden aura
    this.ctx.fillStyle = 'rgba(240, 195, 112, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x + 30, y + 30 + floatY, 18, 0, Math.PI * 2);
    this.ctx.fill();

    // Parchment Scroll icon
    this.ctx.fillStyle = '#f4ead5';
    this.ctx.fillRect(x + 22, y + 20 + floatY, 16, 20);
    this.ctx.fillStyle = '#a83220';
    this.ctx.fillRect(x + 28, y + 28 + floatY, 4, 4); // Red seal
  }

  drawCharacterSprite(x, y, mainColor, name, isPlayer) {
    const bobY = Math.sin(this.animFrame * 2) * 2;
    const centerX = x + 30;
    const centerY = y + 30 + bobY;

    // Shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(centerX, y + 50, 14, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Joseon Hanbok Coat
    this.ctx.fillStyle = mainColor;
    this.ctx.fillRect(centerX - 12, centerY - 8, 24, 26);

    // Head / Hat (Gat or Headband)
    this.ctx.fillStyle = '#f2c99c'; // Skin tone
    this.ctx.fillRect(centerX - 8, centerY - 20, 16, 14);

    if (isPlayer) {
      // Blue Junior Clerk Headband
      this.ctx.fillStyle = '#1e88e5';
      this.ctx.fillRect(centerX - 9, centerY - 18, 18, 4);
    } else {
      // Joseon Gat / Black Hat
      this.ctx.fillStyle = '#111';
      this.ctx.fillRect(centerX - 14, centerY - 22, 28, 3);
      this.ctx.fillRect(centerX - 8, centerY - 30, 16, 9);
    }

    // Eyes
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(centerX - 4, centerY - 14, 2, 3);
    this.ctx.fillRect(centerX + 2, centerY - 14, 2, 3);

    // Name Label above character
    this.ctx.fillStyle = isPlayer ? '#f0c370' : '#ffffff';
    this.ctx.font = '11px Gowun Batang';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(name, centerX, centerY - 32);
  }
}
