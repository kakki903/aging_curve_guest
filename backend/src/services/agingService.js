const agingRepository = require("../repositories/agingRepository");
const resultRepository = require("../repositories/resultRepository");
const resultService = require("./resultService");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY_QA,
});

const PERDICTION_MODEL = "gpt-4o-mini";
const FUNCTION_NAME = "submit_saju_analysis"; // 정적 분석 보고서 제출 함수명

// 1. OpenAI Tools (함수 스키마) 정의 - 정적 사주 분석 구조 (길이 지침 제거)
const analysisSchema = {
  type: "object",
  properties: {
    analysis_summary: {
      type: "object",
      description: "사주 분석의 핵심 요약 및 테마.",
      properties: {
        theme: {
          type: "string",
          description:
            "사용자의 사주를 대표하는 재미있고 매력적인 한 줄 테마 (예: '정글의 탐험가', '재능 넘치는 외교관').",
        },
        advice: {
          type: "string",
          description:
            "현재 사주를 기반으로 한 가장 중요한 개운(開運) 조언을 구체적이고 긍정적인 언어로 서술.",
        },
      },
      required: ["theme", "advice"],
    },
    personality_and_aptitude: {
      type: "object",
      description:
        "개인의 성격, 기질, 천성적인 적성에 대한 분석 (유머와 비유를 섞어 재미있게 서술).",
      properties: {
        core_trait: {
          type: "string",
          description:
            "타고난 핵심 성격 및 천성 (재미있는 비유와 함께 상세히 서술).",
        },
        strength: {
          type: "string",
          description: "강점으로 발현되는 특성과 잠재력.",
        },
        weakness: {
          type: "string",
          description:
            "주의해야 할 단점이나 극복해야 할 과제 (비판보다는 조언 형태로).",
        },
      },
      required: ["core_trait", "strength", "weakness"],
    },
    relationship_and_family: {
      type: "object",
      description:
        "애정운, 배우자운, 대인관계 패턴에 대한 분석 (따뜻하고 흥미롭게 서술).",
      properties: {
        love_style: {
          type: "string",
          description: "연애나 결혼 생활에서의 기본적인 태도와 애정운의 경향.",
        },
        partner_affinity: {
          type: "string",
          description:
            "가장 잘 맞는 배우자/파트너의 특징과 인연의 깊이 (예: '고요한 물가 같은 사람', '활기찬 불꽃 같은 사람').",
        },
        social_pattern: {
          type: "string",
          description: "대인관계에서 반복되는 패턴과 개선점.",
        },
      },
      required: ["love_style", "partner_affinity", "social_pattern"],
    },
    wealth_and_career: {
      type: "object",
      description:
        "재물운, 직업운, 성공을 위한 핵심 전략 분석 (야망을 자극하도록 서술).",
      properties: {
        wealth_type: {
          type: "string",
          description:
            "재물을 모으는 타고난 방식이나 재복의 형태 (예: '정보형 투자', '안정적인 근로형').",
        },
        best_career: {
          type: "string",
          description:
            "가장 성공할 확률이 높은 분야의 직업군을 3가지 이상 제시하고 그 이유를 설명.",
        },
        financial_advice: {
          type: "string",
          description: "재물을 지키고 키우기 위한 구체적이고 유머러스한 조언.",
        },
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

const tools = [
  {
    type: "function",
    function: {
      name: FUNCTION_NAME,
      description:
        "사용자의 생년월일을 기반으로 현재 사주팔자를 분석하여 성격, 관계, 재물운에 대한 구조화된 JSON 보고서를 제출하는 함수. 내용은 재미있고 매력적이며 매우 상세해야 한다.",
      parameters: analysisSchema, // 새 스키마 적용
    },
  },
];

const agingService = {
  // 사용자의 한국 나이를 계산하는 헬퍼 함수
  calculateKoreanAge: (birthDateStr) => {
    const birthYear = new Date(birthDateStr).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  },

  // 2. 프롬프트 데이터 생성 함수
  createPromptData: (birth, gender, isMarried, isDating) => {
    const currentKoreanAge = agingService.calculateKoreanAge(birth);

    // 프롬프트 지침 강화: 상세한 길이는 여기서 강조
    const prompt = `
        당신은 유머와 재치가 넘치는 전문 역술가 AI입니다.
        사용자의 사주 정보:
        출생일: ${birth} (현재 ${currentKoreanAge}세)
        성별: ${gender === "M" ? "남자" : "여자"}
        결혼 여부: ${isMarried === "Y" ? "기혼" : "미혼"}
        ${
          isMarried === "N"
            ? isDating === "Y"
              ? "연애 여부: 연애중"
              : "연애 여부: 솔로"
            : ""
        }

        요청: 이 사주 정보를 바탕으로 다음 네 가지 영역에 대해 재미있고 매력적이며 '상세한' 운세 분석 보고서를 작성해줘.
        
        ***[가장 중요한 지침]***: 
        1. 모든 서술은 유머러스하고 긍정적인 언어를 사용해야 합니다.
        2. 각 항목의 내용은 **최소 5~7문장 이상**이 되도록 **매우 상세하고 길게** 작성해야 합니다.
        3. 단순한 요약 대신, **생생한 비유나 짧은 이야기처럼 느껴지도록 서술**하여 재미를 극대화해야 합니다.

        분석 영역:
        1. analysis_summary: 사주를 대표하는 테마와 핵심 개운 조언.
        2. personality_and_aptitude: 성격과 적성.
        3. relationship_and_family: 애정 및 대인관계.
        4. wealth_and_career: 재물운 및 직업 전략.

        반드시 유머러스하고 긍정적인 언어를 사용하며, '${FUNCTION_NAME}' 함수를 호출하여 보고서를 제출해야 합니다.
    `;
    return prompt;
  },

  // 3. init 함수 (API 호출 로직)
  init: async (birth, gender, isMarried, isDating) => {
    const prompt = agingService.createPromptData(
      birth,
      gender,
      isMarried,
      isDating
    );

    // checkResultData 호출 시 안전하게 옵셔널 체이닝 처리된 값을 받음
    const checkData = await agingService.checkResultData(
      birth,
      gender,
      isMarried,
      isDating
    );

    if (checkData) {
      console.log("기존 분석 결과가 있어 DB에서 로드합니다.");
      const resultData = await resultService.getId(checkData);
      console.log(resultData);
      return {
        success: true,
        data: resultData,
        resultId: checkData,
      };
    }

    try {
      // 시스템 지침을 강화하여 모델의 페르소나와 서술 스타일을 더욱 명확히 함
      const completion = await openai.chat.completions.create({
        model: PERDICTION_MODEL,
        messages: [
          {
            role: "system",
            content:
              "당신은 사주팔자를 분석하여 재미있고 매력적인 운세를 예측하는 전문 역술가 AI입니다. 모든 내용은 긍정적이고 재치 있는 비유와 최소 5~7문장 이상의 상세한 설명을 사용하여 사용자에게 즐거움을 제공해야 합니다. 반드시 아래 지정된 함수 스키마를 완벽하게 준수하여 JSON 보고서를 생성하세요.",
          },
          { role: "user", content: prompt },
        ],
        tools: tools,
        // 반드시 이 함수를 사용하도록 강제
        tool_choice: { type: "function", function: { name: FUNCTION_NAME } },
      });

      const toolCall = completion.choices[0].message.tool_calls[0];

      if (toolCall && toolCall.function.name === FUNCTION_NAME) {
        // JSON.parse를 통해 JSON 문자열을 JS 객체로 변환
        const analysisReport = JSON.parse(toolCall.function.arguments);

        // resultData는 이제 단일 JSON 객체(분석 리포트)입니다.
        const resultData = analysisReport;

        // DB에 저장 (agingRepository.savePrediction 함수 호출)
        const saveResultId = await agingRepository.savePrediction(
          birth,
          gender,
          isMarried,
          isDating,
          resultData // 단일 객체를 DB에 전달
        );

        return {
          success: true,
          data: resultData, // 클라이언트에게 분석 보고서 전체 객체 전달
          resultId: saveResultId, // DB 저장 후 고유 ID 반환
        };
      } else {
        console.error(
          "❌ AI가 함수 호출 대신 일반 텍스트를 반환했습니다. 응답:",
          completion.choices[0].message.content
        );
        return {
          success: false,
          message: "운세 분석 포맷 오류: AI가 JSON 구조를 따르지 않았습니다.",
        };
      }
    } catch (e) {
      // JSON.parse 오류나 API 오류 발생 시
      console.error("❌ OpenAI API 호출 또는 JSON 파싱 중 오류 발생:", e);
      return { success: false, message: "AI 분석 또는 서버 저장 중 오류 발생" };
    }
  },

  // 4. checkResultData 수정 (옵셔널 체이닝 적용)
  checkResultData: async (birth, gender, isMarried, isDating) => {
    const profileData = await resultRepository.getProfile(
      birth,
      gender,
      isMarried,
      isDating
    );
    // profileData가 null이더라도 안전하게 undefined 반환
    return profileData?.result_id;
  },
};

module.exports = agingService;
