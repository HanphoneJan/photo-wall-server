let getDbConnection;
try {
  const db = require('../config/db');
  if (db && typeof db.getDbConnection === 'function') {
    getDbConnection = db.getDbConnection;
  }
} catch (err) {
  getDbConnection = null;
}

async function likes(req, res) {
  let client;
  try {
    const { id } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: '缺少或无效的id参数', status: 0 });
    }

    if (!getDbConnection) {
      return res.status(500).json({ status: 0, message: '服务器配置错误：无法获取数据库连接函数' });
    }

    client = await getDbConnection();
    // PostgreSQL使用$1作为参数占位符，且不使用反引号包裹字段名
    const result = await client.query(
      'UPDATE atlas_files SET likes = likes + 1 WHERE id = $1',
      [id]
    );

    // PostgreSQL通过rowCount获取受影响的行数
    if (result.rowCount > 0) {
      res.json({ message: '点赞成功', status: 830 });
    } else {
      res.json({ message: '未找到该记录或没有更改', status: 0 });
    }
  } catch (error) {
    res.status(500).json({ message: `点赞失败: ${error.message}`, status: 0 });
  } finally {
    if (client && typeof client.release === 'function') {
      client.release();
    }
  }
}

module.exports = { likes };
