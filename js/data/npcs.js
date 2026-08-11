/* Enhanced NPC Characters & Multi-Choice Dynamic Dialogue System for 《위임장》 */
const NPCS_DATA = {
  grandmaster: {
    id: "grandmaster",
    name: "대상 (大上)",
    title: "청림원 최고 책임자",
    avatarBg: "#8c6d46",
    color: "#f0c370",
    description: "청림원 최고 연장자이자 수장. 생각나는 대로 툭 던지는 버릇이 있다.",
    initialMap: null,   // 이벤트 전용 인물 — 맵에 배치되지 않음
    x: -1,
    y: -1,
    dialogues: {
      intro: [
        {
          text: "“그 일은 잘되고 있나? ...그런데 요즘 사람들은 왜 그렇게 서두르는지 모르겠군. 아, 그리고 남쪽 일은 어떻게 됐지?”",
          options: [
            {
              label: "1. [경청] “대상의 말씀 속에 담긴 주름을 고요히 헤아립니다.”",
              effects: { observe: 15, indep: 5 },
              toast: "💡 관찰력 +15, 독립성 +5 상승!",
              next: "gm_choice_1"
            },
            {
              label: "2. [직언] “대상의 모호한 한마디 때문에 조직이 해석의 혼란에 빠져 있습니다.”",
              effects: { indep: 25, observe: 10 },
              toast: "🔥 독립성 +25 상승! 진실을 꿰뚫어보기 시작합니다.",
              next: "gm_choice_2"
            }
          ]
        },
        {
          id: "gm_choice_1",
          text: "“나무는 가지에게 어디로 뻗으라 강요하지 않는다... 참나무 그늘이 길어지면 도토리는 스스로 햇살을 찾아야 하는 법이지.”",
          options: [{ label: "“명심하겠습니다.”", end: true }]
        },
        {
          id: "gm_choice_2",
          text: "“호오... 말단 서리가 내 앞에서 그런 말을 하다니. 사람들은 내가 문을 열어주길 바라지만 열쇠는 본인이 쥐고 있음을 모른다네.”",
          options: [{ label: "(대상의 깊은 의중을 가슴에 새긴다)", end: true }]
        }
      ]
    }
  },

  heir: {
    id: "heir",
    name: "후계자",
    title: "대상의 아들",
    avatarBg: "#3b7080",
    color: "#64b5f6",
    description: "수동적이고 결정을 미루는 성격. 대상의 모호함 때문에 항상 불안해한다.",
    initialMap: "heir",
    x: 4,
    y: 4,
    dialogues: {
      intro: [
        {
          text: "“아버님의 말씀은 늘 알 수가 없소... 내게 전권을 위임하신 것인지, 아니면 나를 시험하시는 것인지... 자네 생각은 어떤가?”",
          options: [
            {
              label: "1. [위로 & 세력 결탁] “대상의 아들이신 전하께서 전권을 잡으시는 것이 이치에 맞습니다.”",
              effects: { indep: -10, heirTrust: 20 },
              toast: "🤝 후계자의 신뢰 상승! (독립성 -10)",
              next: "heir_choice_1"
            },
            {
              label: "2. [사실 검증] “감정에 의존하기보다, 서고의 공식 문서와 장부 기록만을 검증해야 합니다.”",
              effects: { indep: 15, reason: 10 },
              toast: "⚖️ 독립성 +15, 추리력 +10 상승! 후계자가 경계하기 시작합니다.",
              next: "heir_choice_2"
            }
          ]
        },
        {
          id: "heir_choice_1",
          text: "“고맙소 서리... 자네 말이 맞겠지. 내 오른팔 보좌관의 말대로 내가 적극적으로 청림원을 지휘해야겠소.”",
          options: [{ label: "대화를 마친다.", end: true }]
        },
        {
          id: "heir_choice_2",
          text: "“서고의 장부라... 자네는 너무 딱딱하고 차갑구려. 하지만 틀린 말은 아니오.”",
          options: [{ label: "대화를 마친다.", end: true }]
        }
      ]
    }
  },

  heir_righthand: {
    id: "heir_righthand",
    name: "후계자의 오른팔",
    title: "후계자 핵심 보좌관",
    avatarBg: "#2e5b70",
    color: "#81d4fa",
    description: "대상의 모호하고 짧은 말을 과하게 억측·해석하고, 본인의 생각과 욕망을 듬뿍 덧붙여 장황하게 전달하는 수다스러운 보좌관.",
    initialMap: "heir",
    x: 6,
    y: 4,
    dialogues: {
      intro: [
        {
          text: "“오, 신입 서리인가! 잘 들어보게! 대상께서 지나가시듯 '남쪽 일은 어떻게 됐지?' 하고 툭 던지신 짧은 한마디! 보통 사람들은 모르겠지만 내 비범한 안목으로 판단하건대, 이는 후계자 전하께 청림원 전권을 위임하신다는 거룩한 교지이며... 여기에 내가 구상한 거대 개혁안까지 더해진 웅대한 뜻이네! 내 해석이 얼마나 명쾌한가!”",
          options: [
            {
              label: "1. [장황함 수용] “보좌관님의 쉼 없는 열변과 웅대한 과잉 해석에 조용히 동조합니다.”",
              effects: { indep: -15, work: 10 },
              toast: "📜 후계자 세력 동조 (독립성 -15, 업무 +10)",
              next: "hr_choice_1"
            },
            {
              label: "2. [과잉 억측 지적] “대상의 짧은 한마디에 보좌관 본인의 생각과 욕망을 과하게 덧붙여 부풀리신 것입니다.”",
              effects: { indep: 25, reason: 20 },
              toast: "⚡ 독립성 +25, 추리력 +20! 장황한 과잉 억측의 맹점을 정확히 찌릅니다.",
              next: "hr_choice_2"
            }
          ]
        },
        {
          id: "hr_choice_1",
          text: "“헛헛헛! 그렇지! 내 원대한 비전과 웅변을 알아보다니 자네는 참으로 앞날이 밝군! 앞으로도 내가 전달하는 '대상의 참뜻'을 장부에 잘 받들어 적게나!”",
          options: [{ label: "대화를 마친다.", end: true }]
        },
        {
          id: "hr_choice_2",
          text: "“뭐... 무어라?! 내 생각과 욕망을 덧붙였다고?! 모호한 뜻에 구체적 비전을 입혀 장황하게 설명해 준 것이 내 공이거늘, 어찌 감히 서리가 내 정교한 해석을 억측이라 폄하하는가!”",
          options: [{ label: "대화를 마친다.", end: true }]
        }
      ]
    }
  },

  outpost: {
    id: "outpost",
    name: "외방관",
    title: "원칙주의 거점 책임자",
    avatarBg: "#4a8c59",
    color: "#81c784",
    description: "자신이 몸소 겪었던 과거의 경험이야말로 유일한 진실이자 판단 기준으로 여기는 성품.",
    initialMap: "outpost",
    x: 4,
    y: 3,
    dialogues: {
      intro: [
        {
          text: "“내 30년 현장 경험상, 사람이 직접 겪지 않은 변화는 결코 믿을 수 없소! 내가 몸소 거쳐온 과거의 선례와 경험만이 이 청림원의 유일한 진실이자 기준이오. 후계자의 위임 주장은 경험해 본 적 없는 허상일 뿐이오.”",
          options: [
            {
              label: "1. [선례 존중] “외방관님이 거쳐오신 과거 경험의 깊이를 존중합니다.”",
              effects: { indep: -10, observe: 10 },
              toast: "🍵 외방관의 호감을 얻음 (독립성 -10, 관찰력 +10)",
              next: "op_choice_1"
            },
            {
              label: "2. [경험 편향 지적] “과거의 경험만이 전부라고 고집하신다면, 새로 다가온 변화와 진실을 보지 못하실 수 있습니다.”",
              effects: { indep: 20, reason: 15 },
              toast: "📊 독립성 +20, 추리력 +15! 외방관의 과거 편향을 파헤칩니다.",
              next: "op_choice_2"
            }
          ]
        },
        {
          id: "op_choice_1",
          text: "“그렇지! 직접 겪은 경험만이 진짜 장부이자 지혜니라. 한 번도 겪어보지 않은 헛소리를 늘어놓는 후계자 측을 절대 믿지 말게.”",
          options: [{ label: "대화를 마친다.", end: true }]
        },
        {
          id: "op_choice_2",
          text: "“무어라? 과거의 경험이 전부가 아니라고?! 내 평생 청림원에서 직접 겪고 확인한 사실만이 정답이었거늘, 어찌 감히 서리가 내 경험을 부정하는가!”",
          options: [{ label: "대화를 마친다.", end: true }]
        }
      ]
    }
  },

  outpost_righthand: {
    id: "outpost_righthand",
    name: "외방관의 오른팔",
    title: "전직 훈육 서리 & 관조자",
    avatarBg: "#2d5435",
    color: "#a5d6a7",
    description: "외방관의 과거 고집이나 대상의 두루뭉술함이 내심 마음에 들지 않으나, 굳이 나서지 않고 묵묵히 따라가는 성격.",
    initialMap: "outpost",
    x: 6,
    y: 3,
    dialogues: {
      intro: [
        {
          text: "“외방관님의 꽉 막힌 과거 타령이나 대상의 두루뭉술한 말까지... 사실 내 마음에 드는 건 하나도 없네. 하지만 서리, 내가 굳이 위험을 무릅쓰고 총대를 메며 판을 뒤엎으려 나서겠는가? 그저 조용히 흐름을 따라갈 뿐이지.”",
          options: [
            {
              label: "1. [관조에 동조] “마음에 들지 않으면서도 조직의 순리에 따라 묵묵히 따라가는 태도에 공감합니다.”",
              effects: { observe: 15, indep: 5 },
              toast: "💬 관조적 조력 (관찰력 +15, 독립성 +5)",
              next: "or_choice_1"
            },
            {
              label: "2. [방관 지적] “내심 불만이면서도 자기 판단 없이 수동적으로 따라가기만 한다면 결국 타인의 해석에 이용될 뿐입니다.”",
              effects: { indep: 20, reason: 20 },
              toast: "🧠 독립성 +20, 추리력 +20! 수동적 방관 태도를 일깨웁니다.",
              next: "or_choice_2"
            }
          ]
        },
        {
          id: "or_choice_1",
          text: "“자네도 세상 이치를 아는군... 쓸데없이 나서봤자 바람맞는 나뭇잎 신세일 뿐이야. 그저 시키는 대로 조용히 따라가게.”",
          options: [{ label: "대화를 마친다.", end: true }]
        },
        {
          id: "or_choice_2",
          text: "“타인의 해석에 이용된다라... 틀린 말은 아니구려. 내심 불만족스러우면서도 굳이 나서지 않는 것이 내 한계일지도 모르겠군.”",
          options: [{ label: "대화를 마친다.", end: true }]
        }
      ]
    }
  },

  senior_clerk: {
    id: "senior_clerk",
    name: "선배 관원",
    title: "청림원 장부 관리 선배",
    avatarBg: "#594635",
    color: "#d4a359",
    description: "플레이어에게 업무와 장부 기록의 중요성을 일깨워준다.",
    initialMap: "courtyard",
    x: 5,
    y: 5,
    dialogues: {
      intro: [
        {
          text: "“어서 오게 신입! 이곳 청림원에선 윗사람들의 말싸움에 휩쓸리지 말고, 자네만의 장부를 충실히 적는 것이 살아남는 길이라네.”",
          options: [
            {
              label: "1. [조언 수용] “주관을 가지고 제 눈으로 확인한 사실만 장부에 기록하겠습니다.”",
              effects: { indep: 15, work: 10 },
              toast: "📜 독립성 +15, 업무 능력 +10 상승!",
              next: "sc_choice_1"
            },
            {
              label: "2. [세력 동향 문의] “어느 분의 편에 서는 것이 조속한 승진에 유리합니까?”",
              effects: { indep: -10, observe: 10 },
              toast: "👀 조직 관찰력 +10 (독립성 -10)",
              next: "sc_choice_2"
            }
          ]
        },
        {
          id: "sc_choice_1",
          text: "“훌륭한 자세네! 맵 곳곳의 서류를 줍고 서리 업무를 수행하면 자네만의 훌륭한 기록이 쌓일 걸세.”",
          options: [{ label: "대화를 마친다.", end: true }]
        },
        {
          id: "sc_choice_2",
          text: "“승진이라... 누군가의 가지가 되려 하지 말게. 바람이 불면 가지부터 부러지는 법이라네.”",
          options: [{ label: "대화를 마친다.", end: true }]
        }
      ]
    }
  }
};
