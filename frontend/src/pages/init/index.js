import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils/api";

const InitFortunePage = () => {
  const router = useRouter();

  // ------------------------------
  // STATE
  // ------------------------------
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

  // ------------------------------
  // SELECT OPTIONS
  // ------------------------------
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

  // ------------------------------
  // HANDLERS
  // ------------------------------
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
          setStep(6); // skip dating step
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

  // ------------------------------
  // PROGRESS BAR WIDTH
  // ------------------------------
  const progressWidth = useMemo(() => {
    const s = Math.min(step, MAX_STEP);
    if (s <= 1) return "0%";
    const pct = ((s - 1) / (MAX_STEP - 1)) * 100;
    return `${Math.min(pct, 100)}%`;
  }, [step]);

  // ------------------------------
  // STYLE (FortuneResultPage 맞춤)
  // ------------------------------
  const styles = {
    page: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "35px",
      borderRadius: "25px",
      background: "#ffffffaa",
      backdropFilter: "blur(6px)",
      boxShadow: "0 20px 50px rgba(120, 80, 200, 0.2)",
      border: "1px solid #eee",
      fontFamily: "'Inter', sans-serif",
    },
    title: {
      textAlign: "center",
      fontSize: "32px",
      fontWeight: "900",
      color: "#6a0dad",
      marginBottom: "10px",
    },
    subtitle: {
      textAlign: "center",
      fontSize: "16px",
      color: "#8d99ae",
      marginBottom: "35px",
    },

    // Progress
    progressContainer: {
      position: "relative",
      marginBottom: "40px",
      padding: "0 20px",
    },
    progressBar: {
      height: "5px",
      background: "#eee",
      borderRadius: "3px",
      position: "relative",
    },
    progressFill: {
      height: "100%",
      width: progressWidth,
      background: "linear-gradient(90deg, #8e44ad, #9b59b6)",
      transition: "0.4s",
      borderRadius: "3px",
    },

    card: {
      borderRadius: "20px",
      padding: "28px",
      background: "#faf8ff",
      border: "2px solid #d4b5ef",
      boxShadow: "0 10px 25px rgba(160, 100, 220, 0.15)",
      animation: "fadeIn 0.4s ease",
      minHeight: "220px",
    },

    label: {
      fontSize: "20px",
      fontWeight: "800",
      color: "#6a0dad",
      marginBottom: "18px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    select: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #ccc",
      fontSize: "16px",
      background: "#fff",
    },
    dateRow: {
      display: "flex",
      gap: "12px",
    },
    input: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #ccc",
      fontSize: "16px",
      background: "#fff",
    },

    radioGroup: {
      display: "flex",
      gap: "20px",
    },
    radio: (checked) => ({
      padding: "14px 20px",
      borderRadius: "12px",
      border: checked ? "2px solid #8e44ad" : "2px solid #ccc",
      background: checked ? "#f3e7ff" : "#fff",
      fontWeight: "700",
      cursor: "pointer",
      transition: "0.25s",
      boxShadow: checked ? "0 0 10px rgba(140,70,200,0.25)" : "none",
    }),
    radioInput: { display: "none" },

    error: {
      marginTop: "15px",
      padding: "12px",
      borderRadius: "10px",
      background: "#ffe6e6",
      color: "#d63031",
      border: "1px solid #ff7675",
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
      padding: "16px",
      borderRadius: "12px",
      fontWeight: "800",
      border: "none",
      cursor: "pointer",
      background: primary
        ? "linear-gradient(45deg, #8e44ad, #9b59b6)"
        : "#f0f0f0",
      color: primary ? "white" : "#555",
      boxShadow: primary ? "0 8px 18px rgba(155, 89, 182, 0.35)" : "none",
      transition: "0.3s",
    }),

    submitButton: {
      marginTop: "25px",
      padding: "18px",
      width: "100%",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(45deg, #e67e22, #f39c12)",
      color: "white",
      fontSize: "20px",
      fontWeight: "800",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(230, 126, 34, 0.35)",
    },

    loadingText: {
      marginTop: "20px",
      fontSize: "18px",
      fontWeight: "900",
      color: "#e67e22",
      textAlign: "center",
    },
    loadingBar: {
      marginTop: "10px",
      width: "100%",
      height: "14px",
      background: "#fbe9e7",
      borderRadius: "8px",
      overflow: "hidden",
    },
    loadingFill: {
      width: "100%",
      height: "100%",
      background: "#e67e22",
    },
  };

  // ------------------------------
  // Radio Option Component
  // ------------------------------
  const RadioOption = ({ name, value, checked, label, onChange }) => (
    <label style={styles.radio(checked)}>
      <input
        style={styles.radioInput}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );

  // ------------------------------
  // Review Data
  // ------------------------------
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

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🔮 당신의 운명 분석</h1>
      <p style={styles.subtitle}>단계별로 정보를 입력해주세요.</p>

      {/* Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
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

        {/* FINAL STEP */}
        {step === 6 && (
          <div style={{ ...styles.card, borderColor: "#f39c12" }}>
            <div style={{ ...styles.label, color: "#e67e22" }}>최종 확인</div>

            {reviewData.map((i, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <strong>{i.label}:</strong> {i.value}
              </div>
            ))}

            {isSubmitting ? (
              <>
                <p style={styles.loadingText}>🔥 분석 중...</p>
                <div style={styles.loadingBar}>
                  <div style={styles.loadingFill}></div>
                </div>
              </>
            ) : (
              <button type="submit" style={styles.submitButton}>
                🚀 분석 요청하기
              </button>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && <div style={styles.error}>⚠️ {error}</div>}

        {/* BUTTONS */}
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

export default InitFortunePage;
