import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// 컴포넌트 불러오기
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function Home() {
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
          <h1 style={styles.heroTitle}>🔮 빨랑 사주</h1>
          <p style={styles.heroSub}>
            생년월일 · 태어난 시간 · 성별 · 결혼 여부로 보는
            <br />
            개인 흐름 기반 명리 리포트
          </p>
        </div>
      </div>

      {/* SECTIONS */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>📘 어떤 서비스인가요?</h2>
        <p style={styles.text}>
          빨랑 사주는 전통 명리학 원리를 기반으로 성향 · 관계 · 재물 흐름을
          해석하는 개인 리포트 서비스입니다.
        </p>
        <p style={styles.text}>
          단순 운세가 아니라,
          <strong> 기질 + 관계 + 재물</strong>의 연결 구조를 분석하여 삶의 전체
          흐름을 이해할 수 있게 도와줍니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🧠 타고난 성격 · 적성</h2>
        <p style={styles.text}>
          명리학은 오행의 균형과 일간(日干)의 기세를 통해
          <strong> 기질 · 강점 · 주의점</strong>을 세밀하게 파악합니다.
        </p>
        <p style={styles.text}>
          나에게 맞는 환경, 반복되는 감정 패턴, 집중력이 올라가는 조건 등을
          명확하게 확인할 수 있어요.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>💖 애정 · 대인관계</h2>
        <p style={styles.text}>
          연애·사회적 관계의 패턴은 기질과 오행 흐름에 따라 드러납니다.
        </p>
        <p style={styles.text}>
          • 잘 맞는 사람 <br />
          • 갈등이 생기는 이유 <br />
          • 감정 표현 방식 <br />• 관계에서 나의 역할
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>💰 재물운 · 성공 흐름</h2>
        <p style={styles.text}>
          재물운은 단순한 금전운이 아니라
          <strong> 돈이 어떤 방식으로 흐르는지</strong>가 핵심입니다.
        </p>
        <p style={styles.text}>
          재복 성질, 직업 흐름, 기회 시기 등 현실적인 방향을 제시합니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>🔗 요약 · 공유 기능</h2>
        <p style={styles.text}>
          결과는 요약 카드 + 상세 리포트로 제공됩니다. 주변 사람과 공유하기 쉬운
          형태예요.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>⏱ 하루 1회 조회 가능</h2>
        <p style={styles.text}>
          리포트는 하루 한 번만 조회할 수 있으며 다음날 0시에 다시 이용할 수
          있습니다.
        </p>
      </section>

      <div data-aos="fade-up" style={styles.bottomCTA}>
        <h2 style={styles.title}>지금 바로 확인해보세요</h2>
        <Link href="/start" style={styles.cta}>
          사주 분석 시작하기 →
        </Link>
      </div>

      {/* 🔥 분리된 스크롤 컴포넌트 */}
      <ScrollDownIndicator />
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    width: "100%",
    padding: "20px",
    margin: "0 auto",
    maxWidth: "900px",
    fontFamily: "'Pretendard', sans-serif",
    position: "relative",
  },

  heroWrap: {
    padding: "80px 20px 40px",
    textAlign: "center",
  },

  heroInner: { maxWidth: "750px", margin: "0 auto" },

  heroTitle: {
    fontSize: "48px",
    fontWeight: 900,
    marginBottom: "18px",
  },

  heroSub: {
    fontSize: "19px",
    lineHeight: 1.7,
    color: "#555",
    marginBottom: "28px",
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
    fontSize: "30px",
    fontWeight: 800,
    marginBottom: "16px",
  },

  text: {
    fontSize: "17px",
    lineHeight: 1.75,
    color: "#444",
    marginBottom: "14px",
  },

  cta: {
    display: "inline-block",
    marginTop: "20px",
    padding: "15px 26px",
    background: "#FEE500",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "800",
    color: "#000",
  },

  bottomCTA: {
    textAlign: "center",
    marginTop: "60px",
    marginBottom: "80px",
  },
};
