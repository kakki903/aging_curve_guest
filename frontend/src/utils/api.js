// const API_BASE_URL = "http://localhost:3000/api/v1";
const API_BASE_URL = "https://aging-curve-guest-backend.onrender.com/api/v1";

/**
 * 기본 fetch 함수를 래핑하여 공통 로직을 처리하는 함수
 * @param {string} endpoint - API 기본 경로를 제외한 엔드포인트 (예: '/api/hello')
 * @param {string} method - HTTP 메서드 (예: 'GET', 'POST')
 * @param {object} [body=null] - POST/PUT 요청 시 전송할 데이터
 * @returns {Promise<any>} API 응답 데이터
 */
async function fetcher(endpoint, method, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    // 필요하다면 인증 토큰 등을 추가
    // 'Authorization': `Bearer ${token}`,
  };

  const config = {
    method: method,
    headers: headers,
    // GET 메서드는 body를 포함하지 않음
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, config);

    // HTTP 상태 코드가 200번대가 아니면 에러를 던짐
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
    }

    // 응답 본문이 없을 경우 (예: 204 No Content) 빈 객체 반환
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return {};
  } catch (error) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error; // 호출하는 쪽에서 에러를 처리하도록 다시 던집니다.
  }
}
/**
 * GET 요청 함수 (데이터 조회)
 * @param {string} endpoint - 엔드포인트
 */
export const get = (endpoint) => fetcher(endpoint, "GET");

/**
 * POST 요청 함수 (데이터 생성)
 * @param {string} endpoint - 엔드포인트
 * @param {object} data - 전송할 본문 데이터
 */
export const post = (endpoint, data) => fetcher(endpoint, "POST", data);

/**
 * PUT 요청 함수 (데이터 전체 수정)
 * @param {string} endpoint - 엔드포인트
 * @param {object} data - 전송할 본문 데이터
 */
export const put = (endpoint, data) => fetcher(endpoint, "PUT", data);

/**
 * DELETE 요청 함수 (데이터 삭제)
 * @param {string} endpoint - 엔드포인트
 */
export const del = (endpoint) => fetcher(endpoint, "DELETE");
