/* Collectible Documents Data for 《위임장》 */
const DOCUMENTS_DATA = [
  {
    id: "doc_old_ledger",
    mapId: "archive",
    x: 4,
    y: 3,
    title: "10년 전 외방 곡물 수입 장부",
    rewardPts: 15,
    category: "facts",
    content: `
      <p><strong>[기록 날짜: 10년 전 유월]</strong></p>
      <p>외방 거점에서 청림원 중앙으로 이송된 쌀 3,000석 중 500석이 '대상의 특별 지시'라는 명목으로 남쪽 마을 구휼미로 방출됨.</p>
      <p>그러나 당시 대상의 공식 발언 기록에는 구휼미 방출 명령이 전혀 기록되어 있지 않음.</p>
      <p class="highlight">💡 모순 발견: 10년 전에도 누군가가 '대상의 의중'이라며 임의로 수량을 집행한 흔적이 존재함.</p>
    `,
    ledgerEntry: {
      id: "fact_1",
      title: "10년 전 외방 곡물 장부 비공식 집행",
      source: "중앙 서고 장부",
      body: "10년 전 대상의 구두 명목으로 500석이 구휼미로 방출되었으나 대상의 공식 명령 문서가 존재하지 않음."
    }
  },
  {
    id: "doc_secret_letter",
    mapId: "heir",
    x: 7,
    y: 2,
    title: "후계자의 오른팔이 작성한 밀서 초안",
    rewardPts: 20,
    category: "interpretations",
    content: `
      <p><strong>[후계자 오른팔의 장황한 자필 밀서 초안]</strong></p>
      <p>“대상께서 지나가는 담소 중 '외방관의 노고가 크나 짐을 내려놓을 때'라 몇 자 읊조리셨다. 이 모호한 어휘는 필시 후계자 전하께 모든 전권을 위임하신다는 영명한 훈시다! 이에 본 보좌관의 신념인 '외방 수입 전면 재조정안'과 '전권 위임 교지 발포안'을 덧붙여 명확한 정사 지침으로 확정한다.”</p>
      <p class="highlight">💡 장황한 과잉 해석: 대상의 짧은 정황 발언에 자신의 욕망과 개혁안을 덧칠하여 '전권 위임'으로 억측 부풀림.</p>
    `,
    ledgerEntry: {
      id: "interp_heir_1",
      title: "후계자 오른팔의 장황한 과잉 억측 & 주관 덧칠",
      source: "처소 밀서 초안",
      body: "대상의 짧고 모호한 발언에 본인의 개혁안과 권력 욕망을 듬뿍 덧붙여 장황하게 '전권 위임 교지'로 부풀려 전달함."
    }
  },
  {
    id: "doc_outpost_rule",
    mapId: "outpost",
    x: 2,
    y: 5,
    title: "외방관 집무실의 훈령 및 과거 기록",
    rewardPts: 20,
    category: "interpretations",
    content: `
      <p><strong>[외방관의 자필 일기 & 오른팔의 메모]</strong></p>
      <p>“대상께서는 모호하게 말씀하셨으나, 내 30년 현장 경험상 이는 옛 원칙 준수의 시련이다. 내가 직접 몸소 겪었던 과거의 경험이야말로 유일한 진실이자 기준이다.” — 외방관</p>
      <p>“외방관님의 과거 고집도, 대상의 두루뭉술함도 내심 마음에 들지 않는다. 하지만 내가 굳이 나서서 판을 엎을 이유가 있는가? 그저 조용히 따라갈 뿐.” — 오른팔 메모</p>
      <p class="highlight">💡 해석 추적: 외방관은 과거 경험만을 유일한 진실로 확신하며, 오른팔은 불만이면서도 수동적으로 방관하고 있음.</p>
    `,
    ledgerEntry: {
      id: "interp_outpost_1",
      title: "외방관 측의 과거 경험 절대화 & 방관적 태도",
      source: "외방관 자필 일기",
      body: "외방관은 자신이 직접 겪은 과거 경험만을 유일한 진실 기준으로 삼음. 오른팔은 이에 불만을 느끼면서도 나서지 않고 수동적으로 방관함."
    }
  },
  {
    id: "doc_gm_memo",
    mapId: "sanctum",
    x: 5,
    y: 2,
    title: "대상의 친필 여백 메모",
    rewardPts: 25,
    category: "contradictions",
    content: `
      <p><strong>[참나무 잎 모양 여백지에 적힌 글]</strong></p>
      <p>“사람들은 내가 문을 열어주길 바라지만, 정작 자신이 열쇠를 쥐고 있음을 깨닫지 못한다. 나무는 가지에게 어디로 뻗으라 지시하지 않는다.”</p>
      <p class="highlight">💡 대상의 본의: 대상은 권력을 누구에게 위임하거나 명령을 내릴 생각이 전혀 없었음!</p>
    `,
    ledgerEntry: {
      id: "contradiction_1",
      title: "대상의 본의 - 위임 명령의 부재",
      source: "정전 친필 메모",
      body: "대상이 숲의 가지에 지시를 내리지 않는다는 친필 메모. 누구에게도 특정 위임을 내린 적이 없음이 암시됨."
    }
  },
  {
    id: "doc_acorn_record",
    mapId: "courtyard",
    x: 3,
    y: 7,
    title: "참나무 아래 묻혀있던 신입 서리의 오래된 맹세록",
    rewardPts: 30,
    category: "facts",
    content: `
      <p><strong>[청림원 서리 원초 서약]</strong></p>
      <p>“서리는 특정 세력의 가지가 되지 아니하며, 자신이 직접 눈으로 보고 기록한 장부만을 바탕으로 청림원의 진실을 지킨다.”</p>
      <p class="highlight">💡 독립성의 열쇠: 플레이어 본인이 주관을 가지고 기록을 바로잡아야 함을 시사함.</p>
    `,
    ledgerEntry: {
      id: "fact_2",
      title: "서리의 원초 독립 서약",
      source: "중정 참나무 아래 기록",
      body: "서리는 세력에 휩쓸리지 않고 자신의 눈으로 확인한 사실을 기록하는 독립적 인물이어야 함."
    }
  }
];
