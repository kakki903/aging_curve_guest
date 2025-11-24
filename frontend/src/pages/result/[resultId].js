import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import { get, post } from "../../utils/api";

/* Kakao 스타일 */
const KAKAO = {
  yellow: "#FEE500",
  black: "#000000",
  gray1: "#111111",
  gray3: "#555555",
  gray5: "#999999",
  border: "#e5e5e5",
  bg: "#fafafa",
};

/* 그라디언트 리스트 */
const GRADIENTS = [
  "linear-gradient(135deg, #2b5876, #4e4376)",
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #373b44, #4286f4)",
  "linear-gradient(135deg, #1f4037, #99f2c8)",
  "linear-gradient(135deg, #141e30, #243b55)",
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
];

/* 텍스트 포맷 */
const formatText = (t) => {
  if (!t) return "";
  let f = t.replace(/\n+/g, " ");
  f = f.replace(/\.(?!\s*$)/g, ".\n");
  f = f.replace(/\n\s+/g, "\n");
  return f;
};

/* Section Component */
const Section = ({ title, icon, children, initialOpen, color }) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <h3 style={styles.sectionTitle}>
          <span style={styles.icon}>{icon}</span> {title}
        </h3>
        <span style={{ ...styles.toggleIcon, color }}>{open ? "−" : "+"}</span>
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

/* Detail Item */
const DetailItem = ({ title, content }) => {
  if (!content) return null;
  return (
    <div style={styles.detailItem}>
      <p style={styles.detailLabel}>
        <span style={styles.listDot}>●</span> <strong>{title}</strong>
      </p>
      <p style={styles.detailContent}>{formatText(content)}</p>
    </div>
  );
};

const ResultPage = () => {
  const router = useRouter();
  const { resultId } = router.query;

  const [fortuneData, setFortuneData] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [againLoading, setAgainLoading] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");

  const [bg, setBg] = useState(null);
  useEffect(() => {
    setBg(GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]);
  }, []);

  /* 데이터 로드 */
  useEffect(() => {
    if (!resultId) return;

    setShareUrl(window.location.href);

    const load = async () => {
      try {
        const api = await get(`/result/${resultId}`);
        if (!api.success) throw new Error("사주 분석 결과가 없습니다.");

        setFortuneData(api.data);
        setInputData(api.inputdata);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [resultId]);

  /* 오류 시 자동 이동 */
  useEffect(() => {
    if (!loading && (error || !fortuneData || !inputData)) {
      router.replace("/init");
    }
  }, [loading, error, fortuneData, inputData]);

  if (error || !fortuneData || !inputData) return null;

  /* 🔥 재요청 로딩 화면 */
  if (againLoading) {
    return (
      <>
        {/* 스피너 keyframes */}
        <style jsx global>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div style={styles.loadingFull}>
          <div style={styles.loadingCard}>
            <p style={styles.loadingText}>사주를 확인하고 있습니다</p>

            {/* 요청 정보 */}
            <div style={styles.requestInfo}>
              <strong>출생일:</strong> {inputData.birth}
              <br />
              <strong>성별:</strong>{" "}
              {inputData.gender === "M" ? "남자" : "여자"}
              <br />
              <strong>결혼 여부:</strong>{" "}
              {inputData.isMarried === "Y" ? "기혼" : "미혼"}
              <br />
              {inputData.isMarried === "N" && (
                <>
                  <strong>연애 여부:</strong>{" "}
                  {inputData.isDating === "Y" ? "연애 중" : "솔로"}
                  <br />
                </>
              )}
            </div>

            {/* 스피너 */}
            <div style={styles.spinner}></div>

            <p style={styles.loadingSub}>잠시만 기다려 주세요…</p>
          </div>
        </div>
      </>
    );
  }

  /* 기본 로딩 화면 */
  if (loading) {
    return (
      <>
        <style jsx global>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div style={styles.container}>
          <div style={styles.loadingCard}>
            <p style={styles.loadingText}>🔍 분석 중입니다...</p>
            <div style={styles.spinner}></div>
          </div>
        </div>
      </>
    );
  }

  /* 🔄 Again 요청 */
  const handleAgain = async () => {
    const confirmed = window.confirm("사주를 다시 요청하시겠습니까?");
    if (!confirmed) return;

    setAgainLoading(true);

    try {
      const payload = {
        birthDate: inputData.birth.substring(0, 16),
        gender: inputData.gender,
        isMarried: inputData.isMarried,
        ...(inputData.isMarried === "N" && {
          isDating: inputData.isDating,
        }),
      };

      const res = await post("/aging/reInit", payload);

      console.log(res);

      if (res.success) {
        setAgainLoading(false);
        router.push(`/result/${res.resultId}`);
        return;
      }
    } catch (err) {
      console.log("again error:", err);
      setAgainLoading(false);
    }
  };

  const {
    analysis_summary,
    personality_and_aptitude,
    relationship_and_family,
    wealth_and_career,
  } = fortuneData;

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div style={styles.container}>
        <Head>
          <title>사주 분석 결과</title>
        </Head>

        {/* 카카오 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
            }
          }}
        />

        {/* 광고 */}
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5063634047102858"
          crossOrigin="anonymous"
        />

        <h1 style={styles.title}>사주 결과</h1>
        <p style={styles.subtitle}>
          출생일: {inputData.birth} | 성별:{" "}
          {inputData.gender === "M" ? "남자" : "여자"}
        </p>

        <div style={{ ...styles.mainCard, background: bg }}>
          <h2 style={styles.mainTheme}>{analysis_summary.theme}</h2>
          <div style={styles.divider}></div>
          <p style={styles.mainAdvice}>{formatText(analysis_summary.advice)}</p>
        </div>

        {/* 광고 */}
        <div style={styles.adWrap}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-5063634047102858"
            data-ad-slot="2915246442"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <Script id="adsense-push-top" strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>

        <div style={styles.sectionWrap}>
          <Section
            title="타고난 성격 및 적성"
            icon="👤"
            color="#4A90E2"
            initialOpen={true}
          >
            <DetailItem
              title="핵심 기질"
              content={personality_and_aptitude.core_trait}
            />
            <DetailItem
              title="강점"
              content={personality_and_aptitude.strength}
            />
            <DetailItem
              title="주의점"
              content={personality_and_aptitude.weakness}
            />
          </Section>

          <Section
            title="애정 및 대인관계"
            icon="💖"
            color="#FF6FA1"
            initialOpen={false}
          >
            <DetailItem
              title="연애 스타일"
              content={relationship_and_family.love_style}
            />
            <DetailItem
              title="최적 인연"
              content={relationship_and_family.partner_affinity}
            />
            <DetailItem
              title="사회적 패턴"
              content={relationship_and_family.social_pattern}
            />
          </Section>

          <Section
            title="재물운 및 성공 전략"
            icon="💰"
            color="#F4B400"
            initialOpen={false}
          >
            <DetailItem
              title="재복의 성질"
              content={wealth_and_career.wealth_type}
            />
            <DetailItem
              title="추천 직업"
              content={wealth_and_career.best_career}
            />
            <DetailItem
              title="재물 조언"
              content={wealth_and_career.financial_advice}
            />
          </Section>
        </div>

        {/* 광고 */}
        <div style={{ margin: "40px 0 20px 0" }}>
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

        {/* FOOTER */}
        <div style={styles.footer}>
          <button
            style={styles.grayBtn}
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            📎링크 복사
          </button>

          <button
            style={styles.kakaoBtn}
            onClick={() => {
              if (window.Kakao) {
                window.Kakao.Share.sendDefault({
                  objectType: "feed",
                  content: {
                    title: "스토리텔링 사주 결과",
                    description: "전문적인 스토리텔링 사주를 확인하세요",
                    imageUrl: "https://your-image-url.com/share-thumb.png",
                    link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
                  },
                  buttons: [
                    {
                      title: "결과 보기",
                      link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
                    },
                  ],
                });
              }
            }}
          >
            💬 카톡 공유
          </button>

          <button style={styles.blackBtn} onClick={() => router.push("/init")}>
            🏠 메인으로
          </button>

          <button style={styles.grayBtn} onClick={handleAgain}>
            🔄 사주 받기
          </button>
        </div>
      </div>
    </>
  );
};

/* =========================================
   스타일
========================================= */
const styles = {
  container: {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "20px",
    background: "#fff",
    border: `1px solid ${KAKAO.border}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    fontFamily: "'Pretendard', sans-serif",
  },

  /* 전체화면 로딩 */
  loadingFull: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  loadingCard: {
    padding: "40px",
    background: "#fff",
    borderRadius: "15px",
    border: "1px solid #eee",
    textAlign: "center",
    width: "80%",
    maxWidth: "350px",
  },

  requestInfo: {
    marginBottom: "20px",
    fontSize: "15px",
    color: "#555",
    lineHeight: 1.6,
  },

  loadingText: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  loadingSub: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#888",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #eee",
    borderTop: `4px solid ${KAKAO.yellow}`,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "900",
    color: KAKAO.gray1,
  },

  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "25px",
    color: KAKAO.gray5,
  },

  mainCard: {
    padding: "35px",
    borderRadius: "20px",
    color: "white",
    textAlign: "center",
    marginBottom: "40px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.20)",
  },

  mainTheme: { fontSize: "24px", fontWeight: "900" },

  divider: {
    width: "50px",
    height: "3px",
    background: "rgba(255,255,255,0.9)",
    margin: "12px auto",
    borderRadius: "2px",
  },

  mainAdvice: {
    fontSize: "17px",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },

  sectionWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  sectionCard: {
    background: "#fff",
    borderRadius: "20px",
    border: `1px solid ${KAKAO.border}`,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    padding: "18px 24px",
    cursor: "pointer",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${KAKAO.border}`,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: KAKAO.gray1,
    display: "flex",
    alignItems: "center",
  },

  icon: { fontSize: "22px", marginRight: "10px" },

  toggleIcon: { fontSize: "22px", fontWeight: "900" },

  sectionContent: {
    overflow: "hidden",
    transition: "max-height 0.35s ease",
    padding: "0 24px",
  },

  sectionContentInner: { padding: "18px 0" },

  detailItem: {
    padding: "18px",
    background: "#fafafa",
    borderRadius: "16px",
    marginBottom: "14px",
    borderLeft: "4px solid #ddd",
  },

  detailLabel: {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "6px",
    color: KAKAO.gray1,
  },

  listDot: { color: KAKAO.yellow, marginRight: "6px" },

  detailContent: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    color: "#333",
    fontSize: "15px",
  },

  footer: {
    marginTop: "40px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  grayBtn: {
    padding: "12px 20px",
    borderRadius: "12px",
    background: "#f0f0f0",
    color: "#333",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  },

  blackBtn: {
    padding: "12px 20px",
    borderRadius: "12px",
    background: "#212121",
    color: "#fff",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  },

  kakaoBtn: {
    padding: "12px 20px",
    background: KAKAO.yellow,
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    color: "#000",
  },
};

export default ResultPage;
