import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils/api";

const InitFortunePage = () => {
  const router = useRouter();
  // 1. 상태 관리
  const [step, setStep] = useState(1); // 현재 진행 단계
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const [additionalData, setAdditionalData] = useState({
    birthTime: "",
    gender: "",
    isMarried: "", // 결혼 여부: Y/N
    isDating: "", // 연애 여부: Y/N
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const MAX_STEP = 5; // 최대 입력 단계 수 (최종 확인 단계는 6)

  // 2. Select Box 옵션 생성
  const currentYear = new Date().getFullYear();
  const startYear = 1940;

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear, startYear]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const dayOptions = useMemo(() => {
    if (!year || !month) return [];
    // 윤년을 고려하여 정확한 마지막 날짜 계산
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [year, month]);

  // 3. 부가 정보 입력값 변경 핸들러
  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;

    // 결혼 여부가 '기혼'으로 변경되면, 연애 여부 값은 'N'으로 초기화
    if (name === "isMarried" && value === "Y") {
      setAdditionalData((prevData) => ({
        ...prevData,
        [name]: value,
        isDating: "N", // 기혼이면 연애 여부를 '솔로'로 강제 설정
      }));
    } else {
      setAdditionalData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // 4. 스텝 이동 로직
  const handleNextStep = () => {
    setError("");
    let canAdvance = true;

    // 현재 스텝별 유효성 검사
    switch (step) {
      case 1: // 생년월일
        if (!year || !month || !day) {
          setError("❌ 생년월일 세 항목을 모두 선택해 주세요.");
          canAdvance = false;
        }
        break;
      case 2: // 태어난 시간
        if (!additionalData.birthTime) {
          setError("❌ 태어난 시간을 반드시 입력해 주세요.");
          canAdvance = false;
        }
        break;
      case 3: // 성별
        if (!additionalData.gender) {
          setError("❌ 성별을 선택해 주세요.");
          canAdvance = false;
        }
        break;
      case 4: // 결혼 여부
        if (!additionalData.isMarried) {
          setError("❌ 결혼 여부를 선택해 주세요.");
          canAdvance = false;
        }
        // 미혼(N)인 경우, 다음 스텝이 5번 (연애 여부)
        if (additionalData.isMarried === "Y" && canAdvance) {
          setStep(6); // 기혼이면 연애 여부 스킵하고 최종 확인 단계(6)로 이동
          return;
        }
        break;
      case 5: // 연애 여부 (미혼인 경우만 해당)
        if (additionalData.isMarried === "N" && !additionalData.isDating) {
          setError("❌ 연애 여부를 선택해 주세요.");
          canAdvance = false;
        }
        break;
      default:
        break;
    }

    if (canAdvance) {
      // 5단계에서 다음 버튼을 누르면 6단계(최종 확인)로 이동
      setStep((prev) => Math.min(prev + 1, MAX_STEP + 1));
    }
  };

  const handlePrevStep = () => {
    setError("");
    // 최종 확인 단계(6)에서 기혼으로 스킵했을 경우, Prev 버튼을 누르면 4단계(결혼 여부)로 돌아가야 함
    if (step === 6 && additionalData.isMarried === "Y") {
      setStep(4);
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  // 5. 폼 제출 및 API 통신 핸들러 (최종 스텝)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (step < 6) return; // 최종 스텝이 아니면 제출 방지

    // 최종 생년월일 (YYYY-MM-DD) 포맷 생성
    const birthDate =
      year && month && day
        ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
            2,
            "0"
          )}`
        : "";

    setIsSubmitting(true);

    try {
      // 최종 전송할 데이터
      const finalFormData = {
        birthDate,
        birthTime: additionalData.birthTime,
        gender: additionalData.gender,
        isMarried: additionalData.isMarried,
        // 미혼일 때만 isDating 값을 전송
        ...(additionalData.isMarried === "N" && {
          isDating: additionalData.isDating,
        }),
      };

      const endpoint = "/aging/init";
      const apiResult = await post(endpoint, finalFormData);

      if (apiResult.success) {
        const resultId = apiResult.resultId;
        router.push(`/result/${resultId}`);
      } else {
        setError(
          apiResult.error ||
            "운세 분석 중 신비로운 오류가 발생했습니다. 다시 시도해 주세요."
        );
      }
    } catch (err) {
      console.error("API 통신 실패:", err);
      setError("서버와 연결할 수 없습니다. 타임머신 연결을 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. 진행률 계산 (Progress Bar Width)
  const progressWidth = useMemo(() => {
    // 5개의 점(dot) = 4개의 구간.
    // 현재 단계(step)를 MAX_STEP (5) 이내로 제한하여 100%를 초과하지 않도록 함.
    const currentProgressStep = Math.min(step, MAX_STEP);
    if (currentProgressStep <= 1) return "0%";

    // (현재 단계 - 1) / (총 구간 수: MAX_STEP - 1) * 100
    const percentage = ((currentProgressStep - 1) / (MAX_STEP - 1)) * 100;

    // 계산된 값이 100%를 초과하지 않도록 Math.min을 사용하여 CSS 오버플로우 방지
    return `${Math.min(percentage, 100)}%`;
  }, [step, MAX_STEP]);

  // 7. 트렌디한 스타일링을 위한 인라인 스타일 정의 (개선된 디자인)
  const styles = {
    container: {
      maxWidth: "550px",
      margin: "40px auto",
      padding: "30px",
      borderRadius: "25px",
      backgroundColor: "#ffffff",
      boxShadow: "0 15px 40px rgba(78, 56, 178, 0.15)", // 보라색 계열의 그림자
      fontFamily: "'Inter', sans-serif",
      border: "1px solid #eee",
    },
    title: {
      textAlign: "center",
      color: "#4a4e69",
      fontSize: "32px",
      marginBottom: "8px",
      fontWeight: "900",
    },
    subtitle: {
      textAlign: "center",
      color: "#8d99ae",
      fontSize: "16px",
      marginBottom: "35px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    progressContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
      position: "relative",
      padding: "0 10px",
    },
    progressBar: {
      position: "absolute",
      top: "12px",
      left: "20px",
      right: "20px",
      height: "4px",
      backgroundColor: "#e0e0e0",
      zIndex: 1,
      borderRadius: "2px",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#6a0dad", // 진한 보라색
      width: progressWidth, // useMemo로 계산된 값 사용
      transition: "width 0.5s ease-in-out",
      borderRadius: "2px",
    },
    stepDot: (stepNum) => ({
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: stepNum <= step ? "#6a0dad" : "#e0e0e0",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "14px",
      zIndex: 2,
      transition: "background-color 0.3s, transform 0.3s",
      transform: stepNum === step ? "scale(1.1)" : "scale(1)",
      boxShadow: stepNum === step ? "0 0 15px rgba(106, 13, 173, 0.5)" : "none",
      cursor: "default",
    }),
    currentStepCard: {
      padding: "30px",
      borderRadius: "18px",
      backgroundColor: "#f4f4f9", // 연한 회색 배경
      border: "3px solid #6a0dad", // 보라색 테두리 강조
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      minHeight: "200px",
      transition: "opacity 0.5s ease-in-out",
    },
    label: {
      marginBottom: "12px",
      fontWeight: "900",
      color: "#4a4e69",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    dateSelectGroup: {
      display: "flex",
      gap: "10px",
    },
    input: {
      padding: "15px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "17px",
      backgroundColor: "#ffffff",
      transition: "border-color 0.3s, box-shadow 0.3s",
      width: "100%",
    },
    select: {
      padding: "15px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "17px",
      backgroundColor: "white",
      cursor: "pointer",
      appearance: "none",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 15px center",
      backgroundSize: "12px",
      backgroundImage:
        'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%22292.4%22%3E%3Cpath%20fill%3D%22%236a0dad%22%20d%3D%22M287%20197.8%20146.2%2057%205.4%20197.8z%22%2F%3E%3C%2Fsvg%3E")',
    },
    radioGroup: {
      display: "flex",
      gap: "30px",
      marginTop: "10px",
    },
    radioLabel: {
      padding: "12px 20px",
      borderRadius: "8px",
      border: "2px solid #ddd",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      color: "#4a4e69",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    radioInput: {
      display: "none", // 기본 라디오 버튼 숨김
    },
    radioChecked: {
      borderColor: "#6a0dad",
      backgroundColor: "#e9dff7",
      color: "#6a0dad",
      boxShadow: "0 0 10px rgba(106, 13, 173, 0.2)",
    },
    errorText: {
      color: "#e74c3c",
      textAlign: "center",
      fontSize: "15px",
      fontWeight: "bold",
      padding: "12px",
      backgroundColor: "#fbe9e7",
      borderRadius: "10px",
      border: "1px solid #e74c3c",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "25px",
      gap: "15px",
    },
    navButton: (isPrimary) => ({
      padding: "15px 25px",
      background: isPrimary
        ? "linear-gradient(45deg, #6a0dad, #9b59b6)"
        : "#ecf0f1",
      color: isPrimary ? "white" : "#4a4e69",
      border: "none",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: isPrimary ? "0 8px 18px rgba(106, 13, 173, 0.4)" : "none",
      transition: "all 0.3s ease",
      flexGrow: 1,
    }),
    submitButton: {
      padding: "18px",
      background: "linear-gradient(45deg, #e67e22, #f39c12)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "22px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "20px",
      boxShadow: "0 10px 20px rgba(230, 126, 34, 0.4)",
      transition: "all 0.3s ease",
    },
    reviewItem: {
      marginBottom: "15px",
      padding: "10px 0",
      borderBottom: "1px dashed #ddd",
      fontSize: "16px",
      color: "#4a4e69",
    },
    reviewLabel: {
      fontWeight: "bold",
      color: "#6a0dad",
      marginRight: "10px",
    },
  };

  // 라디오 버튼 스타일을 동적으로 적용하는 헬퍼 컴포넌트
  const RadioOption = ({ label, name, value, checked, onChange }) => (
    <label
      style={{ ...styles.radioLabel, ...(checked && styles.radioChecked) }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required
        style={styles.radioInput}
      />
      {label}
    </label>
  );

  // 최종 요약 데이터
  const reviewData = useMemo(() => {
    const isDatingVisible =
      additionalData.isMarried === "N" && additionalData.isDating;
    return [
      {
        label: "생년월일",
        value: `${year}년 ${month}월 ${day}일`,
        required: true,
      },
      { label: "태어난 시간", value: additionalData.birthTime, required: true },
      {
        label: "성별",
        value: additionalData.gender === "M" ? "남자" : "여자",
        required: true,
      },
      {
        label: "결혼 여부",
        value: additionalData.isMarried === "Y" ? "기혼 💍" : "미혼 💔",
        required: true,
      },
      ...(isDatingVisible
        ? [
            {
              label: "연애 여부",
              value: additionalData.isDating === "Y" ? "연애 중 ❤️" : "솔로 👻",
              required: true,
            },
          ]
        : []),
    ].filter((item) => item.value);
  }, [year, month, day, additionalData]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌌 당신의 운명 분석</h1>
      <p style={styles.subtitle}>
        단계별로 정보를 입력하고 마법의 보고서를 받아보세요!
      </p>

      {/* 진행 상태 표시기 */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        {/* MAX_STEP 만큼의 도트를 표시 */}
        {Array.from({ length: MAX_STEP }, (_, i) => i + 1).map((stepNum) => (
          <div key={stepNum} style={styles.stepDot(stepNum)}>
            {stepNum}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* ======================================= */}
        {/* STEP 1: 생년월일 */}
        {/* ======================================= */}
        {step === 1 && (
          <div style={styles.currentStepCard}>
            <label style={styles.label}>
              <span role="img" aria-label="calendar">
                🗓️
              </span>{" "}
              1단계: 생년월일
            </label>
            <div style={styles.dateSelectGroup}>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                style={{ ...styles.select, flex: "4" }}
              >
                <option value="">년</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                style={{ ...styles.select, flex: "3" }}
                disabled={!year}
              >
                <option value="">월</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
                style={{ ...styles.select, flex: "3" }}
                disabled={!year || !month}
              >
                <option value="">일</option>
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}일
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* STEP 2: 태어난 시간 */}
        {/* ======================================= */}
        {step === 2 && (
          <div style={styles.currentStepCard}>
            <label htmlFor="birthTime" style={styles.label}>
              <span role="img" aria-label="clock">
                ⏰
              </span>{" "}
              2단계: 태어난 시간
            </label>
            <input
              type="time"
              id="birthTime"
              name="birthTime"
              value={additionalData.birthTime}
              onChange={handleAdditionalChange}
              required
              style={styles.input}
            />
          </div>
        )}

        {/* ======================================= */}
        {/* STEP 3: 성별 */}
        {/* ======================================= */}
        {step === 3 && (
          <div style={styles.currentStepCard}>
            <label style={styles.label}>
              <span role="img" aria-label="person">
                🚻
              </span>{" "}
              3단계: 성별
            </label>
            <div style={styles.radioGroup}>
              <RadioOption
                label="남성 👨"
                name="gender"
                value="M"
                checked={additionalData.gender === "M"}
                onChange={handleAdditionalChange}
              />
              <RadioOption
                label="여성 👩"
                name="gender"
                value="F"
                checked={additionalData.gender === "F"}
                onChange={handleAdditionalChange}
              />
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* STEP 4: 결혼 여부 */}
        {/* ======================================= */}
        {step === 4 && (
          <div style={styles.currentStepCard}>
            <label style={styles.label}>
              <span role="img" aria-label="ring">
                💍
              </span>{" "}
              4단계: 결혼 여부
            </label>
            <div style={styles.radioGroup}>
              <RadioOption
                label="기혼 🤵‍♀️"
                name="isMarried"
                value="Y"
                checked={additionalData.isMarried === "Y"}
                onChange={handleAdditionalChange}
              />
              <RadioOption
                label="미혼 🧑"
                name="isMarried"
                value="N"
                checked={additionalData.isMarried === "N"}
                onChange={handleAdditionalChange}
              />
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* STEP 5: 연애 여부 (미혼일 때만) */}
        {/* ======================================= */}
        {step === 5 && additionalData.isMarried === "N" && (
          <div style={styles.currentStepCard}>
            <label style={styles.label}>
              <span role="img" aria-label="heart">
                💖
              </span>{" "}
              5단계: 연애 여부
            </label>
            <div style={styles.radioGroup}>
              <RadioOption
                label="연애 중 ❤️"
                name="isDating"
                value="Y"
                checked={additionalData.isDating === "Y"}
                onChange={handleAdditionalChange}
              />
              <RadioOption
                label="솔로 💔"
                name="isDating"
                value="N"
                checked={additionalData.isDating === "N"}
                onChange={handleAdditionalChange}
              />
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* FINAL STEP: 최종 정보 확인 및 제출 */}
        {/* ======================================= */}
        {step === 6 && (
          <div
            style={{ ...styles.currentStepCard, border: "3px solid #e67e22" }}
          >
            <label style={{ ...styles.label, color: "#e67e22" }}>
              <span role="img" aria-label="check">
                ✅
              </span>{" "}
              최종 확인 및 요청
            </label>
            <div style={{ padding: "10px 0" }}>
              {reviewData.map((item, index) => (
                <div key={index} style={styles.reviewItem}>
                  <span style={styles.reviewLabel}>{item.label}:</span>
                  {item.value}
                </div>
              ))}
            </div>
            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={
                isSubmitting
                  ? {
                      ...styles.submitButton,
                      opacity: 0.7,
                      cursor: "not-allowed",
                    }
                  : styles.submitButton
              }
            >
              {isSubmitting
                ? "🔥 운명의 알고리즘 가동 중..."
                : "🚀 AI 운세 분석 요청하기"}
            </button>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <p style={styles.errorText}>🚨 {error}</p>}

        {/* 네비게이션 버튼 그룹 */}
        <div style={styles.buttonGroup}>
          {/* 이전 버튼 */}
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              style={styles.navButton(false)}
            >
              « 이전 단계
            </button>
          )}

          {/* 다음 버튼 (5단계까지) */}
          {step <= MAX_STEP && (
            <button
              type="button"
              onClick={handleNextStep}
              style={{
                ...styles.navButton(true),
                // 첫 단계에서 이전 버튼이 없으면 전체 너비 사용
                ...(step === 1 && { flexGrow: 0, width: "100%" }),
                ...(step > 1 && { flexGrow: 1 }),
              }}
            >
              {step === MAX_STEP ? "확인 단계로 이동 »" : "다음 단계 »"}
            </button>
          )}

          {/* 최종 확인 단계(6)에서는 '정보 수정하기' 버튼만 표시 */}
          {step === 6 && (
            <button
              type="button"
              onClick={handlePrevStep}
              style={styles.navButton(false)}
            >
              « 정보 수정하기
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InitFortunePage;
