import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { get } from "../../utils/api";

const COLORS = {
  personality: "#4A90E2",
  relationship: "#FF6FA1",
  wealth: "#F4B400",
  summaryGradient: "linear-gradient(135deg, #8e44ad, #9b59b6, #b57ee2)",
};

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
      style={{ ...styles.sectionCard, borderLeft: `6px solid ${colorTheme}` }}
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
        style={{ ...styles.sectionContent, maxHeight: open ? "2000px" : "0" }}
      >
        <div style={styles.sectionContentInner}>{children}</div>
      </div>
    </div>
  );
};

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

    const load = async () => {
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

    load();
  }, [resultId]);

  const initKakao = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("📎 링크가 복사되었습니다!");
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) return;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "사주 분석 결과",
        description: "당신의 사주 분석 결과를 확인해보세요!",
        imageUrl: "https://your-image-url.com/share-thumb.png",
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: "결과 보러가기",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    });
  };

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

  return (
    <div style={styles.container}>
      <Head>
        <title>AI 사주 분석 결과</title>
      </Head>

      {/* Kakao Script */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initKakao}
      />

      {/* AdSense Script */}
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID"
        crossOrigin="anonymous"
      />

      <h1 style={styles.title}>🌌 AI 운세 분석 결과</h1>

      <p style={styles.subtitle}>
        출생일: {inputData.birth} | 성별:{" "}
        {inputData.gender === "M" ? "남자" : "여자"}
      </p>

      {/* 광고 1 — 제목 아래 */}
      <div style={{ margin: "10px 0 25px 0", textAlign: "center" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client="YOUR_ADSENSE_CLIENT_ID"
          data-ad-slot="YOUR_AD_SLOT_ID_TOP"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script id="adsense-push-top" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>

      <div style={styles.mainCard}>
        <h2 style={styles.mainTitle}>✨ {analysis_summary.theme}</h2>
        <div style={styles.divider}></div>
        <p style={styles.mainAdvice}>{analysis_summary.advice}</p>
      </div>

      <div style={styles.resultGrid}>
        {/* Sections */}
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

      {/* 광고 2 — 페이지 하단 */}
      <div style={{ margin: "40px 0 20px 0", textAlign: "center" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="YOUR_ADSENSE_CLIENT_ID"
          data-ad-slot="YOUR_AD_SLOT_ID_BOTTOM"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script id="adsense-push-bottom" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>

      <div style={styles.footerSection}>
        <div style={styles.shareBox}>
          <button style={styles.copyButton} onClick={handleCopy}>
            링크 복사
          </button>

          <button style={styles.kakaoButton} onClick={handleKakaoShare}>
            카카오톡 공유
          </button>

          <button
            style={styles.newAnalysisButton}
            onClick={() => router.push("/init")}
          >
            메인
          </button>
        </div>
      </div>
    </div>
  );
};

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

  kakaoButton: {
    padding: "12px 18px",
    background: "#FEE500",
    color: "#1b1b1b",
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
