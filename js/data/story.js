/* Story Acts, Grand Master Events & Ending Conditions for 《위임장》 */
const STORY_DATA = {
  currentAct: 1,
  acts: {
    1: {
      title: "제1장: 신입 서리의 입문과 장부 정리",
      objective: "중앙 서고와 청림원 구역을 탐색하며 서류 2개 이상을 습득하고 서리 업무를 1회 이상 완수하십시오.",
      unlocked: true
    },
    2: {
      title: "제2장: 모호한 지시와 대상의 출몰",
      objective: "대상이 갑자기 나타나 던진 말 «그렇게까지 할 일인가?»의 진위를 추리하고 사건 장부에 기록하십시오.",
      unlocked: false
    },
    3: {
      title: "제3장: 두 권력 해석자의 대립",
      objective: "후계자의 오른팔(현재 권력)과 외방관의 오른팔(과거 원칙)의 모순되는 증언을 비교 분석하십시오.",
      unlocked: false
    },
    4: {
      title: "최종장: 나무의 뜻과 나의 숲",
      objective: "대상이 직접 던진 질문 «자네는 어떻게 생각하나?»에 대한 답을 준비하십시오.",
      unlocked: false
    }
  },

  // Final Climax Decision Prompt & Ending Requirements
  climaxQuestions: {
    title: "대상이 정전에서 제출된 장부를 보며 물었다:",
    prompt: "“자네가 직접 확인하고 적어 올린 이 장부를 보았네. 그래... 이 청림원의 위임과 나무의 뜻에 대해 자네는 최종적으로 어떻게 결론을 내렸는가?”",
    choices: [
      {
        id: "choice_true_ending",
        text: "1. [독립된 서리의 제출] “대상께서는 그 누구에게도 위임하지 않으셨습니다. 나무는 가지에게 지시하지 않듯, 이제 어디에 뿌리내릴지는 서리인 제 스스로 판단합니다.”",
        reqPts: 30,
        reqIndep: 35,
        reqDocs: 2,
        reqLabel: "(조사포인트 30 PT & 독립성 35 & 서류 2개 필요)",
        endingId: "TRUE_HAPPY"
      },
      {
        id: "choice_heir_branch",
        text: "2. [후계자 장부 제출] “현재 청림원을 실질적으로 이끌고 계신 후계자 전하의 권력 위임 해석을 지지합니다.”",
        reqPts: 15,
        reqIndep: 0,
        reqLabel: "(조사포인트 15 PT 필요)",
        endingId: "BAD_HEIR_BRANCH"
      },
      {
        id: "choice_outpost_branch",
        text: "3. [외방관 장부 제출] “자신이 직접 겪었던 과거 경험과 선례만을 고수하는 외방관님의 경험 해석에 따릅니다.”",
        reqPts: 15,
        reqIndep: 0,
        reqLabel: "(조사포인트 15 PT 필요)",
        endingId: "BAD_OUTPOST_BRANCH"
      },
      {
        id: "choice_stay_shade",
        text: "4. [기권 장부 제출] “저는 그저 시키는 일만 하는 서리일 뿐입니다. 어떠한 스스로의 판단도 내리지 않겠습니다.”",
        reqPts: 0,
        reqIndep: 0,
        reqLabel: "(조건 없음 - 언제든 제출 가능)",
        endingId: "BAD_STAY_SHADE"
      }
    ]
  },

  endings: {
    TRUE_HAPPY: {
      type: "TRUE HAPPY ENDING",
      title: "「나의 숲으로」 (숲을 나서다)",
      subtitle: "스스로 판단하는 독립된 서리의 길",
      quote: "“나무를 떠난다고 해서 그 아래에서 자란 시간이 사라지는 것은 아니다.”\n“이제 어디에 뿌리내릴지는 내가 정한다.”",
      summary: `
        <p class="highlight" style="font-size:16px; margin-bottom:10px;">📜 엔딩 해석: 독립과 성장의 성찰</p>
        <p>당신은 대상의 모호한 말과 권력자들의 자의적 해석에 휘둘리지 않고, 직접 모은 서류와 장부 기록을 증거로 제시했습니다.</p>
        <p>청림원의 거대한 참나무는 여전히 그 자리에 남아 흔들리겠지만, 당신은 더 이상 누군가의 해석에 의존하는 도토리가 아닙니다.</p>
        <p>당신은 서리직의 백지 장부를 품에 안고 청림원의 숲을 유유히 나섭니다. 당신만의 독립된 숲이 새로운 뿌리를 내리기 시작합니다.</p>
      `
    },
    BAD_HEIR_BRANCH: {
      type: "BAD ENDING",
      title: "「누군가의 가지」",
      subtitle: "권력의 한 축에 편입된 서리",
      quote: "“결국 거대한 가지 끝에 붙은 잎사귀 하나가 되었을 뿐이다.”",
      summary: `
        <p class="highlight" style="font-size:16px; margin-bottom:10px;">📜 엔딩 해석: 권력에 안주한 해석</p>
        <p>당신은 후계자와 그 오른팔의 편에 서서 대상의 발언을 '권력 위임'으로 확정 짓는 데 일조했습니다.</p>
        <p>당장은 출세와 안정을 보장받았으나, 대상이 새로 출몰하여 한 마디 던질 때마다 당신의 입지는 위태롭게 흔들릴 것입니다.</p>
      `
    },
    BAD_OUTPOST_BRANCH: {
      type: "BAD ENDING",
      title: "「해석된 사람」",
      subtitle: "과거와 경험의 굴레에 갇힌 서리",
      quote: "“자신의 눈이 아닌, 타인의 과거 경험으로 세상을 바라보았다.”",
      summary: `
        <p class="highlight" style="font-size:16px; margin-bottom:10px;">📜 엔딩 해석: 편향된 경험 고수</p>
        <p>당신은 외방관의 과거 경험 절대화에 설득되어 지난 선례만을 고수했습니다.</p>
        <p>변화하는 청림원 속에서 당신은 진실을 밝히기보다는 타인의 명분에 동조하는 해석된 서리로 남아버렸습니다.</p>
      `
    },
    BAD_STAY_SHADE: {
      type: "BAD ENDING",
      title: "「그늘에 남다」",
      subtitle: "판단력을 상실한 평범한 서리",
      quote: "“참나무의 깊은 그늘 아래에서 생각하기를 멈추었다.”",
      summary: `
        <p class="highlight" style="font-size:16px; margin-bottom:10px;">📜 엔딩 해석: 판단 포기와 기권</p>
        <p>당신은 복잡한 정치적 갈등과 해석의 모순 앞에서 어떠한 책임도 지지 않는 안주를 선택했습니다.</p>
        <p>평생 무난하게 붓을 쥐고 장부를 적겠지만, 자신이 내린 진짜 판단은 단 하나도 남기지 못한 채 잊힐 것입니다.</p>
      `
    }
  }
};
