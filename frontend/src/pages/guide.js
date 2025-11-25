// src/pages/guide.js
import Head from "next/head";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// 스크롤 인디케이터 컴포넌트
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function Guide() {
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
          <h1 style={styles.heroTitle}>📘 이용 가이드</h1>
          <p style={styles.heroSub}>
            빨랑 사주가 어떤 기준으로 분석하는지
            <br />
            쉽고 자연스럽게 설명해드릴게요.
          </p>
        </div>
      </div>

      {/* SECTION 1 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🔮 빨랑 사주는 어떤 서비스인가요?</h2>
        <p style={styles.text}>
          빨랑 사주는 전통 명리학의 핵심 구조를 기반으로
          <strong>타고난 성향 · 관계 흐름 · 재물운</strong>을 현대적인 분석
          방식으로 정리해주는 리포트 서비스예요.
        </p>
        <p style={styles.text}>
          명리학은 사람이 태어난 순간의 기운을 통해 성향과 흐름을 읽는
          학문이에요. 빨랑 사주는 이 복잡한 구조를
          <strong>가장 이해하기 쉬운 형태로 재해석</strong>합니다.
        </p>
      </section>

      {/* SECTION 2 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🧩 명리학 기본 구조</h2>

        <p style={styles.text}>
          명리는 크게 <strong>네 개의 기둥(사주)</strong>으로 구성돼요:
        </p>

        <ul style={styles.list}>
          <li>
            📌 <strong>연주(年柱)</strong> — 기본적인 성향, 외부환경
          </li>
          <li>
            📌 <strong>월주(月柱)</strong> — 기질·능력·성격의 핵심
          </li>
          <li>
            📌 <strong>일주(日柱)</strong> — 자신, 내면, 관계 방식
          </li>
          <li>
            📌 <strong>시주(時柱)</strong> — 재능, 미래 흐름, 직업 기질
          </li>
        </ul>

        <p style={styles.text}>
          이 네 기둥의 조합으로
          <strong>기질 · 관계 · 재물 · 시기 흐름</strong>이 해석됩니다.
        </p>
      </section>

      {/* SECTION 3 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🌱 오행이란?</h2>

        <p style={styles.text}>
          명리의 기본은 <strong>오행(五行)</strong>이에요:
        </p>

        <ul style={styles.list}>
          <li>🌳 목(木) — 성장, 추진력, 창조성</li>
          <li>🔥 화(火) — 열정, 표현, 에너지</li>
          <li>🪨 토(土) — 안정, 균형, 신뢰</li>
          <li>⚙ 금(金) — 명확함, 판단, 구조</li>
          <li>💧 수(水) — 지혜, 유연함, 흐름</li>
        </ul>

        <p style={styles.text}>
          사람마다 오행의 비율이 다르고 이 균형이{" "}
          <strong>성격, 감정, 행동 패턴, 재물 흐름</strong>에 직접 영향을 줘요.
        </p>
      </section>

      {/* SECTION 4 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>💖 왜 태어난 시간까지 필요할까요?</h2>
        <p style={styles.text}>
          태어난 시간(시주)은
          <strong>재능, 일의 스타일, 미래 흐름</strong>을 결정하는 핵심
          요소예요.
        </p>
        <p style={styles.text}>
          같은 생년월일이어도 태어난 시간에 따라 사주 구조가 완전히 달라집니다.
        </p>
        <p style={styles.text}>그래서 정확한 분석을 위해 필수 입력이에요.</p>
      </section>

      {/* SECTION 5 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>💡 빨랑 사주 결과는 어떻게 구성되나요?</h2>

        <ul style={styles.list}>
          <li>
            🧠 <strong>기질 · 성격</strong> — 타고난 핵심 성향
          </li>
          <li>
            💬 <strong>관계 흐름</strong> — 연애·사회적 패턴
          </li>
          <li>
            💰 <strong>재물 운</strong> — 금전 흐름·직업 방향
          </li>
          <li>
            📌 <strong>조언</strong> — 안정과 기회 포인트
          </li>
          <li>
            🔗 <strong>요약 카드</strong> — 한 줄로 정리된 결과
          </li>
        </ul>

        <p style={styles.text}>
          모든 해석은 명리 기운의 조합에 따라
          <strong>실제적인 내용으로 정리</strong>해 제공합니다.
        </p>
      </section>

      {/* SECTION 6 */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>⏱ 하루 1회 조회 제한</h2>

        <p style={styles.text}>
          서버 안정성과 정확한 이용 패턴을 위해
          <strong>사주 분석은 하루 1회</strong>만 제공돼요.
        </p>

        <p style={styles.text}>다음날 0시가 되면 다시 조회할 수 있어요.</p>
      </section>

      {/* FOOTER MESSAGE */}
      <div style={styles.last}>
        <p style={styles.lastText}>
          더 많은 기능이 계속 업데이트될 예정이에요 😊
        </p>
      </div>

      {/* 🔥 스크롤 인디케이터 적용 */}
      <ScrollDownIndicator />
    </div>
  );
}

/* --------------------------------------------
   Styles (index.js와 동일 디자인)
-------------------------------------------- */
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
