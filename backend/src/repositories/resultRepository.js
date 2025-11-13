const { query, pool } = require("../config/db"); // 트랜잭션을 위해 pool 객체 필요

const resultRepository = {
  getId: async (resultId) => {
    const sql = `
      SELECT * FROM aging_results WHERE result_id = $1
        `;
    const result = await query(sql, [resultId]);
    return result.rows[0];
  },

  getProfile: async (birth, gender, isMarried, isDating) => {
    const userInputData = {
      birth: birth, // 생년월일 + 시간
      gender: gender,
      isMarried: isMarried,
      isDating: isDating,
    };
    const userInputJson = JSON.stringify(userInputData);

    const sql = `
      SELECT * FROM aging_results WHERE user_input = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const result = await query(sql, [userInputJson]);
    // 🌟 핵심 수정: result.rows에 데이터가 있는지 확인합니다.
    if (result.rows && result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  },
};

module.exports = resultRepository;
