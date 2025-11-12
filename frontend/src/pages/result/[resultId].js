import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { get } from "../../utils/api";

const AnalysisSection = ({ title, icon, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHeader} onClick={() => setIsOpen(!isOpen)}>
        <h3 style={styles.sectionTitle}>
          <span style={styles.icon}>{icon}</span> {title}
        </h3>
        <span style={styles.toggleIcon}>{isOpen ? "▼" : "▶"}</span>
      </div>

      <div
        style={{ ...styles.sectionContent, maxHeight: isOpen ? "2000px" : "0" }}
      >
        {children}
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
    if (resultId) {
      setShareUrl(window.location.href);

      const fetchFortune = async () => {
        try {
          const endpoint = `/result/${resultId}`;
          const apiResult = await get(endpoint);

          if (!apiResult.success) {
            throw new Error("사주 분석 결과를 찾을 수 없습니다.");
          }

          const data = apiResult.data;
          const inputData = apiResult.inputdata;

          setFortuneData(data);
          setInputData(inputData);
        } catch (err) {
          console.error("데이터 페칭 오류:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFortune();
    }
  }, [resultId]);

  // Loading/Error 상태 처리 (이전과 동일)
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingSpinner}></div>
          <p>🔮 역술가가 사주를 분석하고 있습니다. 잠시만 기다려 주세요...</p>
        </div>
      </div>
    );
  }

  if (error || !fortuneData || !inputData) {
    return (
      <div style={{ ...styles.container, color: "red" }}>
        ❌ 오류: {error || "데이터를 찾을 수 없습니다."}
      </div>
    );
  }

  // 공유 링크 복사 핸들러 (이전과 동일)
  const handleCopy = () => {
    const tempInput = document.createElement("textarea");
    tempInput.value = shareUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand("copy");
      alert("✅ 사주 결과 링크가 클립보드에 복사되었습니다!");
    } catch (err) {
      alert("❌ 링크 복사에 실패했습니다. 직접 복사해 주세요.");
    }
    document.body.removeChild(tempInput);
  };

  // 사주 분석 데이터를 구조분해 할당합니다.
  const {
    analysis_summary,
    personality_and_aptitude,
    relationship_and_family,
    wealth_and_career,
  } = fortuneData;

  // 개별 분석 항목을 렌더링하는 헬퍼 컴포넌트
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
        <title>사주 분석 보고서</title>
      </Head>

      <h1 style={styles.title}>🍀 사주팔자 보고서</h1>
      <p style={styles.subtitle}>
        <span>출생일: {inputData.birth}</span> | 성별:{" "}
        {inputData.gender === "M" ? "남자" : "여자"} | 결혼 여부:{" "}
        {inputData.isMarried === "Y" ? "기혼" : "미혼"}
        {inputData.isMarried === "N"
          ? inputData.isDating === "Y"
            ? " | 연애 여부: 연애 중"
            : " | 연애 여부: 솔로"
          : ""}
      </p>

      {/* ======================================================= */}
      {/* 1. 핵심 요약 및 테마 (Analysis Summary) - 토글 없이 항상 보임 */}
      {/* ======================================================= */}
      <div style={styles.mainCard}>
        <h2 style={styles.mainTitle}>✨ {analysis_summary.theme}</h2>
        <p style={styles.mainAdvice}>{analysis_summary.advice}</p>
      </div>

      <div style={styles.resultGrid}>
        {/* 2. 성격 및 적성 (Personality and Aptitude) */}
        <AnalysisSection title="타고난 성격 및 적성" icon="👤">
          <DetailSection
            title="핵심 기질"
            content={personality_and_aptitude.core_trait}
          />
          <DetailSection
            title="강점 및 잠재력"
            content={personality_and_aptitude.strength}
          />
          <DetailSection
            title="주의해야 할 점"
            content={personality_and_aptitude.weakness}
          />
        </AnalysisSection>

        {/* 3. 애정 및 대인관계 (Relationship and Family) */}
        <AnalysisSection title="애정 및 대인관계 운" icon="💖">
          <DetailSection
            title="연애 스타일"
            content={relationship_and_family.love_style}
          />
          <DetailSection
            title="최고의 인연 특징"
            content={relationship_and_family.partner_affinity}
          />
          <DetailSection
            title="사회생활 패턴"
            content={relationship_and_family.social_pattern}
          />
        </AnalysisSection>

        {/* 4. 재물운 및 직업 전략 (Wealth and Career) */}
        <AnalysisSection title="재물운 및 성공 전략" icon="💰">
          <div style={styles.detailGridContainer}>
            <DetailSection
              title="타고난 재복 형태"
              content={wealth_and_career.wealth_type}
            />
            <DetailSection
              title="최적의 직업 분야"
              content={wealth_and_career.best_career}
            />
            <DetailSection
              title="재물을 키우는 조언"
              content={wealth_and_career.financial_advice}
            />
          </div>
        </AnalysisSection>
      </div>

      {/* 6. 공유 링크 섹션 */}
      <div style={styles.shareSection}>
        <p style={styles.shareLabel}>
          🔗 이 결과는 아래 링크를 통해 공유할 수 있습니다:
        </p>
        <input
          type="text"
          value={shareUrl}
          readOnly
          style={styles.shareInput}
          onClick={(e) => e.target.select()}
        />
        <button onClick={handleCopy} style={styles.copyButton}>
          링크 복사
        </button>
      </div>
    </div>
  );
};

// =======================================================
// 🎨 스타일 정의 (가독성 및 시안성 개선)
// =======================================================

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "30px",
    fontFamily: "'Noto Sans KR', sans-serif", // 한국어 폰트 권장
    backgroundColor: "#f4f7f9", // 전체 배경 밝게 변경
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: "40px",
    lineHeight: "1.8",
    paddingBottom: "20px",
    borderBottom: "1px dashed #ccc",
  },
  // 메인 요약 카드 스타일 (가장 눈에 띄게)
  mainCard: {
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    marginBottom: "40px",
    backgroundColor: "#e8f6f3", // 산뜻한 연녹색 배경
    border: "3px solid #2ecc71",
    boxShadow: "0 8px 20px rgba(46, 204, 113, 0.2)",
  },
  mainTitle: {
    fontSize: "28px",
    color: "#2c3e50",
    marginBottom: "15px",
    fontWeight: "700",
  },
  mainAdvice: {
    fontSize: "18px",
    color: "#34495e",
    lineHeight: "1.8",
    fontWeight: "500",
  },
  // 섹션들을 담는 그리드 컨테이너
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr", // 모든 섹션을 세로로 배치 (토글형태에 더 적합)
    gap: "20px",
    marginBottom: "40px",
  },
  // 토글 섹션 카드 스타일
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    border: "1px solid #dcdde1",
    overflow: "hidden", // 토글 애니메이션을 위해 필수
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    cursor: "pointer",
    backgroundColor: "#f7f7f7",
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#34495e",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: "10px",
    fontSize: "24px",
  },
  toggleIcon: {
    fontSize: "16px",
    color: "#7f8c8d",
    fontWeight: "bold",
  },
  sectionContent: {
    padding: "0 20px",
    overflow: "hidden",
    transition: "max-height 0.5s ease-in-out", // 부드러운 토글 애니메이션
  },
  detailGridContainer: {
    paddingTop: "10px",
  },
  // 세부 항목 스타일
  detailItem: {
    marginBottom: "25px",
    padding: "15px",
    backgroundColor: "#fcfcfc",
    borderRadius: "8px",
    borderLeft: "4px solid #3498db", // 세부 항목 강조선
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.03)",
  },
  detailLabel: {
    fontSize: "16px",
    color: "#2c3e50",
    marginBottom: "8px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
  },
  listDot: {
    color: "#3498db",
    fontSize: "10px",
    marginRight: "8px",
  },
  detailContent: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.7",
    paddingLeft: "18px",
    whiteSpace: "pre-wrap", // 내용이 길 경우 줄 바꿈을 유지
  },
  // 공유 섹션 (이전과 동일하게 유지)
  shareSection: {
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #ccc",
    textAlign: "center",
  },
  shareLabel: { fontWeight: "bold", marginBottom: "15px", color: "#34495e" },
  shareInput: {
    width: "70%",
    padding: "12px",
    border: "2px solid #3498db",
    borderRadius: "8px",
    marginRight: "10px",
    fontSize: "14px",
    backgroundColor: "#ecf0f1",
  },
  copyButton: {
    padding: "12px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
};

export default FortuneResultPage;
