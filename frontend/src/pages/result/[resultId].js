import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { get } from "../../utils/api";

// -------------------------------------------------------------
// 🎨 COLOR PALETTE
// -------------------------------------------------------------
const COLORS = {
  personality: "#4A90E2",
  relationship: "#FF6FA1",
  wealth: "#F4B400",
  summaryGradient: "linear-gradient(135deg, #8e44ad, #9b59b6, #b57ee2)",
};

// -------------------------------------------------------------
// 📌 Section Component
// -------------------------------------------------------------
const AnalysisSection = ({
  title,
  icon,
  children,
  colorTheme,
  initialOpen = false,
}) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <div
      style={{
        ...styles.sectionCard,
        borderLeft: `6px solid ${colorTheme}`,
      }}
    >
      <div
        style={{ ...styles.sectionHeader, color: colorTheme }}
        onClick={() => setOpen(!open)}
      >
        <h3 style={{ ...styles.sectionTitle, color: colorTheme }}>
          <span style={styles.icon}>{icon}</span> {title}
        </h3>

        <span style={{ ...styles.toggleIcon, color: colorTheme }}>
          {open ? "▼" : "▶"}
        </span>
      </div>

      <div
        style={{
          ...styles.sectionContent,
          maxHeight: open ? "2000px" : "0",
        }}
      >
        <div style={styles.sectionContentInner}>{children}</div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 📌 Main Page
// -------------------------------------------------------------
const FortuneResultPage = () => {
  const router = useRouter();
  const { resultId } = router.query;

  const [fortuneData, setFortuneData] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (!resultId) return;

    setShareUrl(window.location.href);

    const fetchData = async () => {
      try {
        const api = await get(`/result/${resultId}`);
        if (!api.success) throw new Error("사주 분석 결과가 없습니다.");

        setFortuneData(api.data);
        setInputData(api.inputdata);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resultId]);

  // Loading
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <p style={styles.loadingText}>🔮 분석 중입니다...</p>
          <div style={styles.loadingBarContainer}>
            <div style={styles.loadingBarFill}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !fortuneData || !inputData) {
    return (
      <div style={styles.container}>
        <h2 style={{ ...styles.title, color: "#e74c3c" }}>❌ 분석 오류</h2>
        <p style={styles.subtitle}>{error}</p>
        <button
          style={styles.newAnalysisButton}
          onClick={() => router.push("/init")}
        >
          다시 분석하기
        </button>
      </div>
    );
  }

  // Copy share link
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("📎 링크가 복사되었습니다!");
  };

  const {
    analysis_summary,
    personality_and_aptitude,
    relationship_and_family,
    wealth_and_career,
  } = fortuneData;

  const DetailSection = ({ title, content }) => (
    <div style={styles.detailItem}>
      <p style={styles.detailLabel}>
        <span style={styles.listDot}>●</span> <strong>{title}</strong>
      </p>
      <p style={styles.detailContent}>{content}</p>
    </div>
  );

  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  return (
    <div style={styles.container}>
      <Head>
        <title>AI 사주 분석 결과</title>
      </Head>

      <h1 style={styles.title}>🌌 AI 운세 분석 결과</h1>
      <p style={styles.subtitle}>
        출생일: {inputData.birth} | 성별:{" "}
        {inputData.gender === "M" ? "남자" : "여자"}
      </p>

      {/* Summary */}
      <div style={styles.mainCard}>
        <h2 style={styles.mainTitle}>✨ {analysis_summary.theme}</h2>
        <div style={styles.divider}></div>
        <p style={styles.mainAdvice}>{analysis_summary.advice}</p>
      </div>

      {/* Sections */}
      <div style={styles.resultGrid}>
        <AnalysisSection
          title="타고난 성격 및 적성"
          icon="👤"
          colorTheme={COLORS.personality}
          initialOpen={true}
        >
          <DetailSection
            title="핵심 기질"
            content={personality_and_aptitude.core_trait}
          />
          <DetailSection
            title="강점"
            content={personality_and_aptitude.strength}
          />
          <DetailSection
            title="주의점"
            content={personality_and_aptitude.weakness}
          />
        </AnalysisSection>

        <AnalysisSection
          title="애정 및 대인관계"
          icon="💖"
          colorTheme={COLORS.relationship}
        >
          <DetailSection
            title="연애 스타일"
            content={relationship_and_family.love_style}
          />
          <DetailSection
            title="최적의 인연"
            content={relationship_and_family.partner_affinity}
          />
          <DetailSection
            title="사회적 패턴"
            content={relationship_and_family.social_pattern}
          />
        </AnalysisSection>

        <AnalysisSection
          title="재물운 및 성공 전략"
          icon="💰"
          colorTheme={COLORS.wealth}
        >
          <DetailSection
            title="재복의 성질"
            content={wealth_and_career.wealth_type}
          />
          <DetailSection
            title="추천 직업"
            content={wealth_and_career.best_career}
          />
          <DetailSection
            title="재물 조언"
            content={wealth_and_career.financial_advice}
          />
        </AnalysisSection>
      </div>

      {/* Bottom Buttons */}
      <div style={styles.footerSection}>
        <p style={styles.shareLabel}>🔗 결과 공유하기</p>
        <div style={styles.shareBox}>
          <button style={styles.copyButton} onClick={handleCopy}>
            📋 링크 복사
          </button>

          <button
            style={styles.newAnalysisButton}
            onClick={() => router.push("/init")}
          >
            🔄 새로운 분석
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 🎨 STYLES
// -------------------------------------------------------------
const styles = {
  container: {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "25px",
    backgroundColor: "#ffffff",
    boxShadow: "0 15px 40px rgba(78, 56, 178, 0.15)",
    border: "1px solid #eee",
    fontFamily: "'Inter', sans-serif",
  },

  title: {
    textAlign: "center",
    color: "#4a4e69",
    fontSize: "32px",
    fontWeight: "900",
  },

  subtitle: {
    textAlign: "center",
    color: "#8d99ae",
    fontSize: "16px",
    marginBottom: "35px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },

  mainCard: {
    padding: "35px",
    borderRadius: "20px",
    background: COLORS.summaryGradient,
    color: "white",
    textAlign: "center",
    marginBottom: "40px",
    boxShadow: "0 12px 25px rgba(155, 89, 182, 0.35)",
  },
  mainTitle: {
    fontSize: "26px",
    fontWeight: "900",
  },
  divider: {
    width: "60px",
    height: "4px",
    background: "#fff",
    margin: "10px auto",
    borderRadius: "2px",
  },
  mainAdvice: {
    fontSize: "18px",
    lineHeight: 1.8,
  },

  resultGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  // Section
  sectionCard: {
    background: "#fafafa",
    borderRadius: "16px",
    border: "1px solid #ddd",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  sectionHeader: {
    padding: "20px 25px",
    cursor: "pointer",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "800",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: "24px",
    marginRight: "10px",
  },
  toggleIcon: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  sectionContent: {
    overflow: "hidden",
    transition: "max-height 0.5s ease",
    padding: "0 20px",
  },
  sectionContentInner: {
    padding: "20px 0",
  },

  detailItem: {
    padding: "16px",
    background: "#fff",
    borderRadius: "12px",
    marginBottom: "15px",
    borderLeft: "4px solid #bbb",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontSize: "17px",
    fontWeight: "800",
    marginBottom: "8px",
  },
  listDot: {
    color: "#6a0dad",
    marginRight: "8px",
  },
  detailContent: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    color: "#444",
  },

  footerSection: {
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
    textAlign: "center",
  },
  shareLabel: {
    fontWeight: "700",
    marginBottom: "10px",
  },
  shareBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  copyButton: {
    padding: "12px 18px",
    background: "#6a0dad",
    color: "white",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  newAnalysisButton: {
    padding: "12px 25px",
    background: "linear-gradient(45deg, #2ecc71, #27ae60)",
    color: "white",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingBox: {
    textAlign: "center",
    padding: "50px",
    background: "#fff8f5",
    borderRadius: "15px",
    border: "2px solid #e67e22",
  },
  loadingText: {
    color: "#e67e22",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  loadingBarContainer: {
    width: "80%",
    height: "15px",
    background: "#fbe9e7",
    margin: "0 auto",
    borderRadius: "8px",
  },
  loadingBarFill: {
    width: "100%",
    height: "100%",
    background: "#e67e22",
  },
};

export default FortuneResultPage;
