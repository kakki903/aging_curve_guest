"use client";

import { useEffect, useState } from "react";
import { get } from "../utils/api";

export default function HomePage() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = "/main/init";
      setLoading(true);

      try {
        const apiResult = await get(endpoint);

        setResult(apiResult.data.time);
      } catch (error) {
        console.error("API 호출 오류:", error);
        alert(`데이터 로드에 실패했습니다: ${error.message}`);
        setResult("데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    };

    // 함수 즉시 호출
    fetchData();
  }, []);

  if (loading) {
    return <div>불러오는 중입니다...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>사주 Fun Site</h1>
      {result ? (
        <p>데이터: **{result}**</p>
      ) : (
        <p>데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
}
