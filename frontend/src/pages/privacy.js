// src/pages/privacy.js
import Head from "next/head";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Scroll Indicator
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function Privacy() {
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
          <h1 style={styles.heroTitle}>🔒 개인정보 처리방침</h1>
          <p style={styles.heroSub}>
            안전하고 투명한 서비스 제공을 위해 개인정보 처리 기준을
            안내드립니다.
          </p>
        </div>
      </div>

      {/* SECTION */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>1. 수집하는 개인정보 항목</h2>
        <p style={styles.text}>
          빨랑 사주는 아래의 최소한의 정보만을 수집합니다:
        </p>
        <ul style={styles.list}>
          <li>생년월일</li>
          <li>태어난 시간</li>
          <li>성별</li>
          <li>결혼 여부</li>
          <li>연애 여부</li>
        </ul>
        <p style={styles.text}>
          이 정보는 사주 분석을 위한 목적 외에는 어떠한 용도로도 사용되지
          않습니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>2. 개인정보의 이용 목적</h2>
        <p style={styles.text}>
          수집된 정보는 오직 사주 분석 및 리포트 제공을 위해서만 사용됩니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>3. 개인정보의 보관 및 파기</h2>
        <p style={styles.text}>
          빨랑 사주는 분석 과정에서 입력된 정보는 즉시 리포트 생성에만
          사용됩니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>4. 제3자 제공</h2>
        <p style={styles.text}>
          빨랑 사주는 개인정보를 어떠한 외부 기관이나 제3자에게도 제공하지
          않습니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>5. 쿠키(Cookie) 사용</h2>
        <p style={styles.text}>
          웹사이트 이용 편의를 위해 쿠키를 사용할 수 있으나 개인정보는 저장되지
          않습니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>6. 문의</h2>
        <p style={styles.text}>
          개인정보와 관련된 문의는 아래 이메일로 연락해주세요.
        </p>
        <p style={styles.text}>📧 kidoong903@gmail.com</p>
      </section>

      <ScrollDownIndicator />
    </div>
  );
}

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
    fontSize: "26px",
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
  },
};
