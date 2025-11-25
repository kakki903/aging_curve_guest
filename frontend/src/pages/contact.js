// src/pages/contact.js
import Head from "next/head";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// 스크롤 인디케이터
import ScrollDownIndicator from "@/components/ScrollDownIndicator";

export default function Contact() {
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
          <h1 style={styles.heroTitle}>📬 Contact</h1>
          <p style={styles.heroSub}>
            서비스 관련 문의는 아래 이메일로 편하게 보내주세요.
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <section data-aos="fade-up" style={styles.card}>
        <h2 style={styles.title}>📩 문의 이메일</h2>

        <p style={styles.text}>
          서비스 이용 중 궁금한 점이나 개선 요청이 있다면 아래 이메일로 언제든
          연락해주세요.
        </p>

        <div style={styles.emailBox}>
          <span style={styles.emailLabel}>Email</span>
          <a href="mailto:kidoong903@gmail.com" style={styles.emailText}>
            kidoong903@gmail.com
          </a>
        </div>

        <p style={styles.textSmall}>가능한 빠른 시간 내에 답변드릴게요.</p>
      </section>

      {/* FOOTER */}
      <div style={styles.last}>
        <p style={styles.lastText}>
          항상 더 나은 서비스가 되기 위해 노력하고 있어요 😊
        </p>
      </div>

      {/* Scroll Indicator */}
      <ScrollDownIndicator />
    </div>
  );
}

/* --------------------------------------------
   Styles (index/guide/about와 동일)
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

  textSmall: {
    fontSize: "15px",
    color: "#777",
    marginTop: "10px",
  },

  emailBox: {
    background: "#fafafa",
    padding: "18px 20px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    marginTop: "14px",
    marginBottom: "14px",
  },

  emailLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "4px",
  },

  emailText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#333",
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
