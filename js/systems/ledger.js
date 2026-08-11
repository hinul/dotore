/* Incident Ledger (사건 장부) Management System */
class LedgerSystem {
  constructor() {
    this.facts = [];
    this.testimonies = [];
    this.interpretations = {
      heir: [],
      outpost: []
    };
    this.contradictions = [];
    this.hypotheses = [];
  }

  addEntry(category, entry) {
    if (category === "facts") {
      if (!this.facts.some(f => f.id === entry.id)) this.facts.push(entry);
    } else if (category === "testimonies") {
      if (!this.testimonies.some(t => t.id === entry.id)) this.testimonies.push(entry);
    } else if (category === "interpretations") {
      if (entry.id.includes("heir")) {
        if (!this.interpretations.heir.some(i => i.id === entry.id)) this.interpretations.heir.push(entry);
      } else {
        if (!this.interpretations.outpost.some(i => i.id === entry.id)) this.interpretations.outpost.push(entry);
      }
    } else if (category === "contradictions") {
      if (!this.contradictions.some(c => c.id === entry.id)) this.contradictions.push(entry);
    }
    this.renderUI();
  }

  renderUI() {
    // Render Facts List
    const factsContainer = document.getElementById("facts-list");
    if (factsContainer) {
      if (this.facts.length === 0) {
        factsContainer.innerHTML = `<p class="subtitle">아직 기록된 사실이 없습니다. 맵의 서류를 수집하십시오.</p>`;
      } else {
        factsContainer.innerHTML = this.facts.map(f => `
          <div class="clue-card">
            <div class="clue-header">
              <span>${f.title}</span>
              <span class="clue-source">[출처: ${f.source}]</span>
            </div>
            <div class="clue-body">${f.body}</div>
          </div>
        `).join("");
      }
    }

    // Render Testimonies List
    const testContainer = document.getElementById("testimonies-list");
    if (testContainer) {
      if (this.testimonies.length === 0) {
        testContainer.innerHTML = `<p class="subtitle">아직 획득한 인물 증언이 없습니다. NPC와 대화하십시오.</p>`;
      } else {
        testContainer.innerHTML = this.testimonies.map(t => `
          <div class="clue-card">
            <div class="clue-header">
              <span>${t.title}</span>
              <span class="clue-source">[발언자: ${t.speaker}]</span>
            </div>
            <div class="clue-body">“${t.body}”</div>
          </div>
        `).join("");
      }
    }

    // Render Interpretations Comparison
    const heirContainer = document.getElementById("heir-interp-list");
    const outpostContainer = document.getElementById("outpost-interp-list");
    if (heirContainer && outpostContainer) {
      heirContainer.innerHTML = this.interpretations.heir.length ? this.interpretations.heir.map(i => `
        <div class="clue-card">
          <div class="clue-header"><span>${i.title}</span></div>
          <div class="clue-body">${i.body}</div>
        </div>
      `).join("") : `<p class="subtitle">해석 수집 대기 중</p>`;

      outpostContainer.innerHTML = this.interpretations.outpost.length ? this.interpretations.outpost.map(i => `
        <div class="clue-card">
          <div class="clue-header"><span>${i.title}</span></div>
          <div class="clue-body">${i.body}</div>
        </div>
      `).join("") : `<p class="subtitle">해석 수집 대기 중</p>`;
    }

    // Render Contradictions
    const contraContainer = document.getElementById("contradictions-list");
    if (contraContainer) {
      if (this.contradictions.length === 0) {
        contraContainer.innerHTML = `<p class="subtitle">아직 서류와 증언 사이의 모순점이 발견되지 않았습니다.</p>`;
      } else {
        contraContainer.innerHTML = this.contradictions.map(c => `
          <div class="clue-card contradiction">
            <div class="clue-header">
              <span>⚠️ ${c.title}</span>
              <span class="clue-source">[출처: ${c.source}]</span>
            </div>
            <div class="clue-body">${c.body}</div>
          </div>
        `).join("");
      }
    }

    // Render Hypotheses Builder
    const hypoContainer = document.getElementById("hypotheses-list");
    if (hypoContainer) {
      const unlockedCount = this.facts.length + this.contradictions.length;
      hypoContainer.innerHTML = `
        <div class="hypo-option">
          <h4>가설 A: 대상은 특정 후계자를 지목하지 않았다.</h4>
          <p class="subtitle">단서 수집 충족률: ${Math.min(100, unlockedCount * 25)}%</p>
          <p>모호한 발언은 권력 위임이 아닌, 조직 구성원 각자의 자발적 책임과 근면을 묻는 정황 증거다.</p>
        </div>
      `;
    }
  }
}

const ledgerSystem = new LedgerSystem();
