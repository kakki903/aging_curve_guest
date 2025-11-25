import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils/api";
import Script from "next/script";
import Head from "next/head";

// =========================
// 🔄 인라인 스피너
// =========================
const InlineSpinner = () => (
  <>
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "4px solid rgba(0,0,0,0.2)",
        borderTop: "4px solid #FEE500",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
        margin: "10px auto 0",
      }}
    ></div>

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
  </>
);

const InitFortunePage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const [additionalData, setAdditionalData] = useState({
    birthTime: "",
    gender: "",
    isMarried: "",
    isDating: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const MAX_STEP = 5;

  // =========================
  // 옵션 생성
  // =========================
  const currentYear = new Date().getFullYear();
  const startYear = 1940;

  const yearOptions = useMemo(() => {
    const res = [];
    for (let y = currentYear; y >= startYear; y--) res.push(y);
    return res;
  }, []);

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const dayOptions = useMemo(() => {
    if (!year || !month) return [];
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [year, month]);

  // =========================
  // 핸들러
  // =========================
  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;

    if (name === "isMarried" && value === "Y") {
      setAdditionalData((p) => ({ ...p, isMarried: "Y", isDating: "N" }));
      return;
    }

    setAdditionalData((p) => ({ ...p, [name]: value }));
  };

  const handleNextStep = () => {
    setError("");
    let canGo = true;

    switch (step) {
      case 1:
        if (!year || !month || !day) {
          setError("생년월일을 모두 선택해 주세요.");
          canGo = false;
        }
        break;
      case 2:
        if (!additionalData.birthTime) {
          setError("태어난 시간을 입력해 주세요.");
          canGo = false;
        }
        break;
      case 3:
        if (!additionalData.gender) {
          setError("성별을 선택해 주세요.");
          canGo = false;
        }
        break;
      case 4:
        if (!additionalData.isMarried) {
          setError("결혼 여부를 선택해 주세요.");
          canGo = false;
        }
        if (additionalData.isMarried === "Y" && canGo) {
          setStep(6);
          return;
        }
        break;
      case 5:
        if (additionalData.isMarried === "N" && !additionalData.isDating) {
          setError("연애 여부를 선택해 주세요.");
          canGo = false;
        }
        break;
      default:
        break;
    }

    if (canGo) setStep((prev) => Math.min(prev + 1, MAX_STEP + 1));
  };

  const handlePrevStep = () => {
    setError("");
    if (step === 6 && additionalData.isMarried === "Y") setStep(4);
    else setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 6 || isSubmitting) return;

    const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    setIsSubmitting(true);

    try {
      const payload = {
        birthDate,
        birthTime: additionalData.birthTime,
        gender: additionalData.gender,
        isMarried: additionalData.isMarried,
        ...(additionalData.isMarried === "N" && {
          isDating: additionalData.isDating,
        }),
      };

      const res = await post("/aging/init", payload);

      if (res.success) {
        router.push(`/result/${res.resultId}`);
      } else {
        setError(res.error || "예측 중 문제가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // 진행 바
  // =========================
  const progressWidth = useMemo(() => {
    const s = Math.min(step, MAX_STEP);
    if (s <= 1) return "0%";
    const pct = ((s - 1) / (MAX_STEP - 1)) * 100;
    return `${Math.min(pct, 100)}%`;
  }, [step]);

  // =========================
  // 리뷰 데이터
  // =========================
  const reviewData = useMemo(() => {
    return [
      { label: "생년월일", value: `${year}년 ${month}월 ${day}일` },
      { label: "태어난 시간", value: additionalData.birthTime },
      {
        label: "성별",
        value: additionalData.gender === "M" ? "남성" : "여성",
      },
      {
        label: "결혼 여부",
        value: additionalData.isMarried === "Y" ? "기혼" : "미혼",
      },
      ...(additionalData.isMarried === "N"
        ? [
            {
              label: "연애 여부",
              value: additionalData.isDating === "Y" ? "연애 중" : "솔로",
            },
          ]
        : []),
    ];
  }, [year, month, day, additionalData]);

  return (
    <div style={styles.page}>
      <Head>
        <title>빨랑 사주</title>
      </Head>
      {/* ADSENSE */}
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5063634047102858"
        crossOrigin="anonymous"
        onLoad={() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {}
        }}
      />

      <h1 style={styles.title}>🔮 사주 분석 시작하기</h1>
      <p style={styles.subtitle}>필요한 정보를 단계별로 입력해주세요.</p>

      {/* 광고 */}
      <div style={{ margin: "20px 0" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client="ca-pub-5063634047102858"
          data-ad-slot="2915246442"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      <Script id="adsense-push" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>

      {/* Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: progressWidth }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1 */}
        {step === 1 && (
          <div style={styles.card}>
            <div style={styles.label}>🗓️ 생년월일</div>

            <div style={styles.dateRow}>
              <select
                value={year}
                style={styles.select}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">년</option>
                {yearOptions.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>

              <select
                value={month}
                disabled={!year}
                style={styles.select}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">월</option>
                {monthOptions.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>

              <select
                value={day}
                disabled={!month}
                style={styles.select}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">일</option>
                {dayOptions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={styles.card}>
            <div style={styles.label}>⏰ 태어난 시간</div>
            <input
              type="time"
              name="birthTime"
              style={styles.input}
              value={additionalData.birthTime}
              onChange={handleAdditionalChange}
            />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={styles.card}>
            <div style={styles.label}>🚻 성별</div>

            <div style={styles.radioGroup}>
              <RadioOption
                label="남자"
                name="gender"
                value="M"
                checked={additionalData.gender === "M"}
                onChange={handleAdditionalChange}
              />
              <RadioOption
                label="여자"
                name="gender"
                value="F"
                checked={additionalData.gender === "F"}
                onChange={handleAdditionalChange}
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div style={styles.card}>
            <div style={styles.label}>💍 결혼 여부</div>

            <div style={styles.radioGroup}>
              <RadioOption
                label="기혼"
                name="isMarried"
                value="Y"
                checked={additionalData.isMarried === "Y"}
                onChange={handleAdditionalChange}
              />

              <RadioOption
                label="미혼"
                name="isMarried"
                value="N"
                checked={additionalData.isMarried === "N"}
                onChange={handleAdditionalChange}
              />
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && additionalData.isMarried === "N" && (
          <div style={styles.card}>
            <div style={styles.label}>💖 연애 여부</div>

            <div style={styles.radioGroup}>
              <RadioOption
                label="연애 중"
                name="isDating"
                value="Y"
                checked={additionalData.isDating === "Y"}
                onChange={handleAdditionalChange}
              />
              <RadioOption
                label="솔로"
                name="isDating"
                value="N"
                checked={additionalData.isDating === "N"}
                onChange={handleAdditionalChange}
              />
            </div>
          </div>
        )}

        {/* STEP 6 — 최종 확인 */}
        {step === 6 && (
          <div style={{ ...styles.card, borderColor: "#FEE500" }}>
            <div style={{ ...styles.label, color: "#111" }}>최종 확인</div>

            {reviewData.map((i, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <strong>{i.label}:</strong> {i.value}
              </div>
            ))}

            {isSubmitting ? (
              <>
                <p style={styles.loadingText}>분석 중입니다...</p>
                <InlineSpinner />
              </>
            ) : (
              <button type="submit" style={styles.submitButton}>
                🚀 분석 요청하기
              </button>
            )}
          </div>
        )}

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {/* Buttons */}
        <div style={styles.buttonRow}>
          {step > 1 && step < 6 && (
            <button
              type="button"
              onClick={handlePrevStep}
              style={styles.btn(false)}
            >
              이전
            </button>
          )}

          {step <= MAX_STEP && (
            <button
              type="button"
              onClick={handleNextStep}
              style={styles.btn(true)}
            >
              {step === MAX_STEP ? "확인 단계로" : "다음"}
            </button>
          )}

          {step === 6 && !isSubmitting && (
            <button
              type="button"
              onClick={handlePrevStep}
              style={styles.btn(false)}
            >
              수정하기
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// =========================
// 버튼 / 스타일 정의
// =========================
const RadioOption = ({ name, value, checked, label, onChange }) => (
  <label
    style={{
      padding: "14px 20px",
      borderRadius: "10px",
      border: checked ? "2px solid #FEE500" : "2px solid #ddd",
      background: checked ? "#FFF9C4" : "#fff",
      fontWeight: "700",
      cursor: "pointer",
      transition: "0.25s",
      boxShadow: checked ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
    }}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      style={{ display: "none" }}
    />
    {label}
  </label>
);

const styles = {
  page: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "35px",
    borderRadius: "25px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
    fontFamily: "'Inter', sans-serif",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "900",
    color: "#111",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "15px",
    color: "#666",
    marginBottom: "35px",
  },

  progressContainer: {
    marginBottom: "35px",
  },

  progressBar: {
    height: "6px",
    background: "#eee",
    borderRadius: "4px",
  },

  progressFill: {
    height: "100%",
    background: "#FEE500",
    transition: "0.4s",
    borderRadius: "4px",
  },

  card: {
    borderRadius: "20px",
    padding: "28px",
    background: "#fff",
    border: "1px solid #e6e6e6",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
    minHeight: "200px",
  },

  label: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#222",
    marginBottom: "20px",
  },

  select: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    background: "#fff",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
    background: "#fff",
  },

  dateRow: {
    display: "flex",
    gap: "12px",
  },

  radioGroup: {
    display: "flex",
    gap: "15px",
  },

  error: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "10px",
    background: "#FFF2F0",
    color: "#D32F2F",
    border: "1px solid #FFCDD2",
    textAlign: "center",
    fontWeight: "700",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "25px",
  },

  btn: (primary) => ({
    flex: 1,
    padding: "15px",
    borderRadius: "10px",
    border: primary ? "none" : "1px solid #ddd",
    background: primary ? "#FEE500" : "#f2f2f2",
    color: primary ? "#000" : "#555",
    fontWeight: "800",
    cursor: "pointer",
    transition: "0.3s",
  }),

  submitButton: {
    marginTop: "20px",
    width: "100%",
    padding: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#FEE500",
    color: "#000",
    fontSize: "20px",
    fontWeight: "800",
    cursor: "pointer",
  },

  loadingText: {
    marginTop: "15px",
    fontSize: "17px",
    fontWeight: "700",
    color: "#444",
    textAlign: "center",
  },
};

export default InitFortunePage;
