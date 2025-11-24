const { query, pool } = require("../config/db"); // 트랜잭션을 위해 pool 객체 필요

const agingRepository = {
  init: async () => {
    const sql = `
            SELECT to_char(now(), 'YYYY-MM-DD HH24:MI:SS.MS') AS "time"
        `;
    const result = await query(sql);
    return result.rows[0];
  },

  savePrediction: async (birth, gender, isMarried, isDating, resultData) => {
    const sql = `
        INSERT INTO aging_results (user_input, result_data, status)
        VALUES ($1, $2, 'Y')
        RETURNING result_id;
    `;

    const userInputData = {
      birth: birth, // 생년월일 + 시간
      gender: gender,
      isMarried: isMarried,
      isDating: isDating,
    };
    const userInputJson = JSON.stringify(userInputData);
    const resultDataJson = JSON.stringify(resultData);

    const result = await query(sql, [userInputJson, resultDataJson]);
    return result.rows[0].result_id; // 새로 생성된 result_id 반환
  },

  deletePrediction: async (existId) => {
    const sql = `
    UPDATE aging_results 
    SET status = 'N', delete_at = NOW()
    WHERE result_id = $1
  `;

    await query(sql, [existId]);

    return existId;
  },
};

module.exports = agingRepository;
