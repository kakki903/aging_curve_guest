// ========================
// agingService.js (롱폼 + 안정판)
// ========================
const agingRepository = require("../repositories/agingRepository");
const resultRepository = require("../repositories/resultRepository");
const resultService = require("./resultService");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY_QA,
});

// 장문 생성용 메인 모델 → 부족하면 mini로 fallback
const MODEL_LONG = "gpt-4o";
const MODEL_FALLBACK = "gpt-4o-mini";

// ====================================
// JSON 스키마 (기존 유지)
// ====================================
const analysisSchema = {
  type: "object",
  properties: {
    analysis_summary: {
      type: "object",
      properties: {
        theme: { type: "string" },
        advice: { type: "string" },
      },
      required: ["theme", "advice"],
    },
    personality_and_aptitude: {
      type: "object",
      properties: {
        core_trait: { type: "string" },
        strength: { type: "string" },
        weakness: { type: "string" },
      },
      required: ["core_trait", "strength", "weakness"],
    },
    relationship_and_family: {
      type: "object",
      properties: {
        love_style: { type: "string" },
        partner_affinity: { type: "string" },
        social_pattern: { type: "string" },
      },
      required: ["love_style", "partner_affinity", "social_pattern"],
    },
    wealth_and_career: {
      type: "object",
      properties: {
        wealth_type: { type: "string" },
        best_career: { type: "string" },
        financial_advice: { type: "string" },
      },
      required: ["wealth_type", "best_career", "financial_advice"],
    },
  },
  required: [
    "analysis_summary",
    "personality_and_aptitude",
    "relationship_and_family",
    "wealth_and_career",
  ],
};

// ====================================
// 서비스 객체
// ====================================
const agingService = {
  calculateKoreanAge: (birth) => {
    const year = new Date(birth).getFullYear();
    return new Date().getFullYear() - year + 1;
  },

  // 장문 생성 프롬프트
  createPrompt: (birth, gender, isMarried, isDating) => {
    const age = agingService.calculateKoreanAge(birth);

    return `
당신은 전문 스토리텔러 역술가입니다.
각 항목을 **최소 8~12문장 이상으로 길고 풍부하게** 작성해야 합니다.
짧은 한두 문장 답변은 절대 허용되지 않습니다.

사용자 정보:
- 생년월일: ${birth}
- 한국나이: ${age}세
- 성별: ${gender === "M" ? "남자" : "여자"}
- 결혼 여부: ${isMarried === "Y" ? "기혼" : "미혼"}
${isMarried === "N" ? (isDating === "Y" ? "- 연애 중" : "- 솔로") : ""}

작성 항목 (각각 8~12문장 이상):

[analysis_summary]
theme, advice

[personality_and_aptitude]
core_trait, strength, weakness

[relationship_and_family]
love_style, partner_affinity, social_pattern

[wealth_and_career]
wealth_type, best_career, financial_advice

절대 규칙:
1) 각 항목은 8~12문장 이상
2) 비유·장면 묘사 적극 사용
3) 소설처럼 길게 작성
4) 단문 금지
    `;
  },

  createJsonPrompt: (longText) => `
다음 긴 분석 텍스트를 JSON 스키마에 맞게 변환해라.
내용 삭제 금지. 재구성만 허용.

JSON 스키마:
${JSON.stringify(analysisSchema, null, 2)}

긴 텍스트:
${longText}

주의:
- JSON만 출력
- 코드블록(\`\`\`) 금지
  `,

  // ====================================
  // init (2단계: 장문 → JSON 재구성)
  // ====================================
  init: async (birth, gender, isMarried, isDating) => {
    // 기존 분석 존재하면 DB에서 로드
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

    // 1단계: 장문 생성
    const prompt = agingService.createPrompt(
      birth,
      gender,
      isMarried,
      isDating
    );

    let longResult;

    try {
      longResult = await openai.chat.completions.create({
        model: MODEL_LONG,
        messages: [
          {
            role: "system",
            content:
              "너는 장문 스토리텔링 역술가이다. 각 항목을 최소 8~12문장 이상으로 생성하라.",
          },
          { role: "user", content: prompt },
        ],
      });
    } catch (e) {
      // 429 등 에러 시 fallback
      console.log("⚠️ 4o 오류 → mini fallback 사용");
      longResult = await openai.chat.completions.create({
        model: MODEL_FALLBACK,
        messages: [
          { role: "system", content: "장문으로 작성하라." },
          { role: "user", content: prompt },
        ],
      });
    }

    const longText = longResult.choices[0].message.content;

    // 2단계: 긴 텍스트 → JSON 변환
    const jsonPrompt = agingService.createJsonPrompt(longText);

    let jsonRaw;
    try {
      const jsonRes = await openai.chat.completions.create({
        model: MODEL_LONG,
        messages: [
          {
            role: "system",
            content: "긴 텍스트를 JSON으로 변환하는 전문가이다.",
          },
          { role: "user", content: jsonPrompt },
        ],
      });

      jsonRaw = jsonRes.choices[0].message.content;
    } catch (e) {
      console.log("⚠️ JSON 변환 실패 → mini fallback");
      const jsonRes = await openai.chat.completions.create({
        model: MODEL_FALLBACK,
        messages: [
          {
            role: "system",
            content: "긴 텍스트를 JSON으로 변환하는 전문가이다.",
          },
          { role: "user", content: jsonPrompt },
        ],
      });
      jsonRaw = jsonRes.choices[0].message.content;
    }

    // JSON 파싱을 위해 코드블록 제거
    const cleaned = jsonRaw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const resultJson = JSON.parse(cleaned);

    // DB 저장
    const saveId = await agingRepository.savePrediction(
      birth,
      gender,
      isMarried,
      isDating,
      resultJson
    );

    return { success: true, data: resultJson, resultId: saveId };
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
};

module.exports = agingService;
