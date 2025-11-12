const { query, pool } = require("../config/db"); // 트랜잭션을 위해 pool 객체 필요

const mainRepository = {
  initSite: async () => {
    const sql = `
            SELECT to_char(now(), 'YYYY-MM-DD HH24:MI:SS.MS') AS "time"
        `;
    const result = await query(sql);
    return result.rows[0];
  },
};

module.exports = mainRepository;
