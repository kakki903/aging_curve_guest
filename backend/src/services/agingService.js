// ========================
// agingService.js (최종 안정 버전)
// ========================
const agingRepository = require("../repositories/agingRepository");
const resultRepository = require("../repositories/resultRepository");
const resultService = require("./resultService");
const OpenAI = require("openai");

let keyIndex = 0;

const getKey = () => {
  const keys = [
    process.env.OPEN_AI_KEY_QA_1,
    process.env.OPEN_AI_KEY_QA_2,
    process.env.OPEN_AI_KEY_QA_3,
    process.env.OPEN_AI_KEY_QA_4,
    process.env.OPEN_AI_KEY_QA_5,
  ];

  const key = keys[keyIndex];
  keyIndex = (keyIndex + 1) % keys.length;
  return key;
};

const openai = new OpenAI({
  apiKey: getKey(),
});

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY_QA,
// });

// gpt-4o-mini 단일 모델
const MODEL = "gpt-4o-mini";

// JSON 템플릿 - GPT가 절대 구조를 깨뜨릴 수 없음
const JSON_TEMPLATE = `
{
  "analysis_summary": {
    "theme": "<<THEME>>",
    "advice": "<<ADVICE>>"
  },
  "personality_and_aptitude": {
    "core_trait": "<<CORE_TRAIT>>",
    "strength": "<<STRENGTH>>",
    "weakness": "<<WEAKNESS>>"
  },
  "relationship_and_family": {
    "love_style": "<<LOVE_STYLE>>",
    "partner_affinity": "<<PARTNER_AFFINITY>>",
    "social_pattern": "<<SOCIAL_PATTERN>>"
  },
  "wealth_and_career": {
    "wealth_type": "<<WEALTH_TYPE>>",
    "best_career": "<<BEST_CAREER>>",
    "financial_advice": "<<FINANCIAL_ADVICE>>"
  }
}
`;

const agingService = {
  calculateKoreanAge: (birth) => {
    const year = new Date(birth).getFullYear();
    return new Date().getFullYear() - year + 1;
  },

  // 프롬프트 생성: theme/advice 짧게, 나머지는 길게
  createSectionPrompt: (birth, gender, isMarried, isDating) => {
    const age = agingService.calculateKoreanAge(birth);

    return `
너는 스토리텔링 사주 작가이다.
받은 사용자 정보를 기반으로 적극적으로 재밌게 운세를 작성한다.

각 항목 생성 규칙:
- THEME: 전체 내용을 1줄로 요약하여 어떤 사람이라고 명시 ( 예시 - 서촌에 흩날리는 은행잎 같은 사람 )
- ADVICE: 2~3줄 조언
- 나머지 항목(CORE_TRAIT, STRENGTH, WEAKNESS, LOVE_STYLE, PARTNER_AFFINITY, SOCIAL_PATTERN, WEALTH_TYPE, BEST_CAREER, FINANCIAL_ADVICE)은 모두 10~12문장 장문
- 이야기 하듯 내용을 적어주고 과한 유머도 가능해
- 문자열 내부에서 따옴표("), 특수 따옴표(“, ”, ‘, ’) 금지
- 인용문 금지
- 코드블록 금지
- 각 항목 블록 마지막에 반드시 개행(\\n)을 넣어라 (중요)

출력 형식:

THEME:
[1줄]

ADVICE:
[3~4줄]

CORE_TRAIT:
[10~12문장]

STRENGTH:
[10~12문장]

WEAKNESS:
[10~12문장]

LOVE_STYLE:
[10~12문장]

PARTNER_AFFINITY:
[10~12문장]

SOCIAL_PATTERN:
[10~12문장]

WEALTH_TYPE:
[10~12문장]

BEST_CAREER:
[10~12문장]

FINANCIAL_ADVICE:
[10~12문장]

사용자 정보:
- 생년월일: ${birth}
- 한국 나이: ${age}세
- 성별: ${gender === "M" ? "남자" : "여자"}
- 결혼 여부: ${isMarried === "Y" ? "기혼" : "미혼"}
${isMarried === "N" ? (isDating === "Y" ? "- 연애 중" : "- 솔로") : ""}
`;
  },

  // 템플릿 삽입 함수
  fillTemplate: (template, map) => {
    let result = template;
    for (const key in map) {
      result = result.replace(`<<${key}>>`, map[key]);
    }
    return result;
  },

  init: async (birth, gender, isMarried, isDating) => {
    // 기존 저장된 결과 확인
    const existId = await agingService.checkResultData(
      birth,
      gender,
      isMarried,
      isDating
    );

    if (existId) {
      const loaded = await resultService.getId(existId);
      return { success: true, data: loaded, resultId: existId };
    }

    // 프롬프트 생성
    const prompt = agingService.createSectionPrompt(
      birth,
      gender,
      isMarried,
      isDating
    );

    // GPT 요청
    const res = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "너는 감성적 운세 스토리텔링 작가이다. 반드시 포맷을 지켜서 출력한다.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 9000,
    });

    const raw = res.choices[0].message.content;

    console.log("\n====== GPT RAW OUTPUT ======");
    console.log(raw);
    console.log("============================\n");

    // JSON 파싱용 키 목록
    const keys = [
      "THEME",
      "ADVICE",
      "CORE_TRAIT",
      "STRENGTH",
      "WEAKNESS",
      "LOVE_STYLE",
      "PARTNER_AFFINITY",
      "SOCIAL_PATTERN",
      "WEALTH_TYPE",
      "BEST_CAREER",
      "FINANCIAL_ADVICE",
    ];

    const sections = {};

    // 마지막 블록까지 100% 잡는 정규식
    keys.forEach((key) => {
      const regex = new RegExp(`${key}:(.*?)(?=\\n[A-Z_]+:|$)`, "s");
      const match = raw.match(regex);
      sections[key] = match ? match[1].trim() : "";
    });

    // 템플릿에 삽입
    let finalJsonStr = agingService.fillTemplate(JSON_TEMPLATE, sections);

    // 제어문자 제거 (JSON.parse 에러 0%)
    const sanitized = finalJsonStr.replace(/[\u0000-\u0019]+/g, " ");

    console.log("\n====== Sanitized JSON (Before Parse) ======");
    console.log(sanitized);
    console.log("===========================================\n");

    // JSON 파싱
    const finalObj = JSON.parse(sanitized);

    // DB 저장
    const saveId = await agingRepository.savePrediction(
      birth,
      gender,
      isMarried,
      isDating,
      finalObj
    );

    return { success: true, data: finalObj, resultId: saveId };
  },

  checkResultData: async (birth, gender, isMarried, isDating) => {
    const p = await resultRepository.getProfile(
      birth,
      gender,
      isMarried,
      isDating
    );
    return p?.result_id;
  },

  reInit: async (birth, gender, isMarried, isDating) => {
    // 기존 저장된 결과 확인
    const existId = await agingService.checkResultData(
      birth,
      gender,
      isMarried,
      isDating
    );

    if (existId) {
      await agingRepository.deletePrediction(existId);
    }

    // 프롬프트 생성
    const prompt = agingService.createSectionPrompt(
      birth,
      gender,
      isMarried,
      isDating
    );

    // GPT 요청
    const res = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "너는 감성적 운세 스토리텔링 작가이다. 반드시 포맷을 지켜서 출력한다.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 9000,
    });

    const raw = res.choices[0].message.content;

    console.log("\n====== GPT RAW OUTPUT ======");
    console.log(raw);
    console.log("============================\n");

    // JSON 파싱용 키 목록
    const keys = [
      "THEME",
      "ADVICE",
      "CORE_TRAIT",
      "STRENGTH",
      "WEAKNESS",
      "LOVE_STYLE",
      "PARTNER_AFFINITY",
      "SOCIAL_PATTERN",
      "WEALTH_TYPE",
      "BEST_CAREER",
      "FINANCIAL_ADVICE",
    ];

    const sections = {};

    // 마지막 블록까지 100% 잡는 정규식
    keys.forEach((key) => {
      const regex = new RegExp(`${key}:(.*?)(?=\\n[A-Z_]+:|$)`, "s");
      const match = raw.match(regex);
      sections[key] = match ? match[1].trim() : "";
    });

    // 템플릿에 삽입
    let finalJsonStr = agingService.fillTemplate(JSON_TEMPLATE, sections);

    // 제어문자 제거 (JSON.parse 에러 0%)
    const sanitized = finalJsonStr.replace(/[\u0000-\u0019]+/g, " ");

    console.log("\n====== Sanitized JSON (Before Parse) ======");
    console.log(sanitized);
    console.log("===========================================\n");

    // JSON 파싱
    const finalObj = JSON.parse(sanitized);

    // DB 저장
    const saveId = await agingRepository.savePrediction(
      birth,
      gender,
      isMarried,
      isDating,
      finalObj
    );

    return { success: true, data: finalObj, resultId: saveId };
  },
};

module.exports = agingService;
