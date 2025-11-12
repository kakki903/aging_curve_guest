const { query, pool } = require("../config/db"); // 트랜잭션을 위해 pool 객체 필요

const resultRepository = {
  getId: async (resultId) => {
    const sql = `
      SELECT * FROM aging_results WHERE result_id = $1
        `;
    const result = await query(sql, [resultId]);
    return result.rows[0];
  },
};

module.exports = resultRepository;
