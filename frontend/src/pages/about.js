// src/pages/about.js
import Head from "next/head";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// 하단 스크롤 컴포넌트
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div style={styles.page}>
      <Head>
        <title>빨랑 사주</title>
      </Head>

      {/* HERO */}
      <div style={styles.heroWrap}>
        <div data-aos="fade-up" style={styles.heroInner}>
          <h1 style={styles.heroTitle}>📚 빨랑 사주</h1>
          <p style={styles.heroSub}>
            빨랑 사주는 “쉽고 정확한 명리 흐름 분석”을 목표로
            <br />
            누구나 이해하기 쉬운 리포트를 제공합니다.
          </p>
        </div>
      </div>

      {/* SECTION 1 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🔍 왜 만들었나요?</h2>
        <p style={styles.text}>
          전통 명리학은 매우 깊고 정교하지만 많은 사람들에게는 어렵고 방대한
          내용 때문에 접근이 쉽지 않았어요.
        </p>
        <p style={styles.text}>
          그래서 “누구나 쉽게 이해할 수 있는 명리 리포트”를 만들고자 빨랑 사주
          서비스가 시작되었습니다.
        </p>
      </section>

      {/* SECTION 2 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🎯 서비스 목표</h2>

        <ul style={styles.list}>
          <li>사용자가 자신의 흐름을 쉽게 이해하도록 돕기</li>
          <li>명리학의 핵심 요소를 현대적인 방식으로 재해석</li>
          <li>실생활에 바로 적용할 수 있는 분석 제공</li>
          <li>과하게 어려운 전문 용어 최소화</li>
          <li>한눈에 보이는 핵심 요약 제공</li>
        </ul>

        <p style={styles.text}>
          빨랑 사주는 단순한 운세 콘텐츠를 넘어
          <strong>“나를 이해하는 도구”</strong>가 되는 것을 목표로 해요.
        </p>
      </section>

      {/* SECTION 3 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🛠 어떻게 분석하나요?</h2>
        <p style={styles.text}>
          빨랑 사주는 전통 명리학의 구조를 기반으로 생년월일, 태어난 시간, 성별,
          결혼 여부를 입력받아
          <strong> 기질 · 관계 · 재물 흐름</strong>을 분석합니다.
        </p>

        <p style={styles.text}>
          너무 전문적인 용어는 피하고 “누가 봐도 이해되는 해석”을 기준으로 분석
          알고리즘을 지속적으로 개선하고 있어요.
        </p>
      </section>

      {/* SECTION 4 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>📈 앞으로의 방향</h2>

        <ul style={styles.list}>
          <li>더 정교한 흐름 분석 기능 추가</li>
          <li>맞춤형 리포트 확장</li>
          <li>연도별 흐름 전망 기능 준비</li>
          <li>사용자 요청 기반 기능 업데이트</li>
        </ul>

        <p style={styles.text}>
          꾸준히 개선하고 확장하면서 더 좋은 방향으로 발전해 나갈 예정입니다.
        </p>
      </section>

      {/* FOOTER */}
      <div style={styles.last}>
        <p style={styles.lastText}>
          여러분의 피드백이 서비스 발전에 큰 힘이 됩니다 😊
        </p>
      </div>

      {/* Scroll Indicator */}
      <ScrollDownIndicator />
    </div>
  );
}

/* Same styling as index/guide */
const styles = {
  page: {
    width: "100%",
    padding: "20px",
    margin: "0 auto",
    maxWidth: "900px",
    fontFamily: "'Pretendard', sans-serif",
  },

  heroWrap: {
    padding: "80px 20px 40px",
    textAlign: "center",
  },

  heroInner: { maxWidth: "750px", margin: "0 auto" },

  heroTitle: {
    fontSize: "42px",
    fontWeight: 900,
    marginBottom: "15px",
  },

  heroSub: {
    fontSize: "18px",
    lineHeight: 1.7,
    color: "#555",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    border: "1px solid #eee",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    margin: "40px 0",
  },

  title: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "14px",
  },

  text: {
    fontSize: "17px",
    lineHeight: 1.75,
    color: "#444",
    marginBottom: "14px",
  },

  list: {
    paddingLeft: "20px",
    marginBottom: "14px",
    lineHeight: 1.7,
    fontSize: "17px",
    color: "#444",
  },

  last: {
    textAlign: "center",
    marginTop: "60px",
    marginBottom: "40px",
  },

  lastText: {
    fontSize: "16px",
    color: "#777",
  },
};
