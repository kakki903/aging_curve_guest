// src/pages/terms.js
import Head from "next/head";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Scroll component
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function Terms() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div style={styles.page}>
      <Head>
        <title>빨랑 사주</title>
      </Head>

      <div style={styles.heroWrap}>
        <div data-aos="fade-up" style={styles.heroInner}>
          <h1 style={styles.heroTitle}>📄 이용약관</h1>
          <p style={styles.heroSub}>
            빨랑 사주 서비스 이용에 필요한 기본 안내사항입니다.
          </p>
        </div>
      </div>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>1. 목적</h2>
        <p style={styles.text}>
          본 약관은 빨랑 사주 서비스 이용과 관련하여 이용자와 서비스 간의
          권리·의무 및 책임사항을 규정합니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>2. 서비스 제공</h2>
        <p style={styles.text}>
          빨랑 사주는 이용자가 입력한 정보를 기반으로 명리 흐름 분석 리포트를
          제공하는 서비스입니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>3. 책임 제한</h2>
        <p style={styles.text}>
          분석 결과는 참고용으로 제공되며 사용자의 모든 선택과 행동의 책임은
          본인에게 있습니다.
        </p>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>4. 이용 제한</h2>
        <p style={styles.text}>
          다음 사항에 해당할 경우 서비스 이용이 제한될 수 있습니다.
        </p>
        <ul style={styles.list}>
          <li>서비스 목적에 어긋나는 이용</li>
          <li>비정상적 접근 또는 시스템 오류 유발</li>
          <li>악의적 사용 행위</li>
        </ul>
      </section>

      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>5. 약관의 변경</h2>
        <p style={styles.text}>
          서비스 정책 변경에 따라 약관은 업데이트될 수 있으며 변경된 약관은
          사이트에 공지한 시점부터 적용됩니다.
        </p>
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
