const { verifyToken } = require('../utils/token'); // 引入工具函数

/**
 * 辅助函数：从 Authorization 或 Token header 中提取纯净的 token
 * 支持格式: "Bearer xxxx", "Bearer "xxxx"", ""xxxx"", "xxxx"
 * @param {string | undefined} authHeader - 从请求头获取的原始 token 字符串
 * @returns {string | null} - 返回提取出的 token，如果无法提取则返回 null
 */
const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  // 1. 去除首尾的空格
  let token = authHeader.trim();

  // 2. 检查并移除 "Bearer" 前缀（不区分大小写）
  //    "Bearer ".length === 7
  if (token.toLowerCase().startsWith('bearer ')) {
    token = token.substring(7).trim();
  }

  // 3. 检查并移除可能包裹在 token 外层的单引号或双引号
  if ((token.startsWith('"') && token.endsWith('"')) || 
      (token.startsWith("'") && token.endsWith("'"))) {
    token = token.slice(1, -1);
  }

  // 4. 再次去除可能因移除引号后产生的空格
  return token.trim();
};

/**
 * 请求拦截中间件
 * 拦截所有访问 /admin/ 路径的请求，并进行 token 验证和权限检查
 */
function interceptRequest(req, res, next) {
  const adminPath = '/admin/';
  const currentPath = req.path;

  // 只对 /admin/ 路径进行拦截
  if (currentPath.startsWith(adminPath)) {
    // 优先从 'authorization' header 获取，其次从 'token' header 获取
    // HTTP header 名称是大小写不敏感的，使用小写是更常见的 Node.js 实践
    const authHeader = req.headers.authorization || req.headers.token;

    // 使用辅助函数提取 token
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({ message: '未授权的请求：缺少访问令牌' });
    }

    // 使用工具函数验证 token
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: '无效的 token' });
    }

    // 验证用户类型是否为管理员（userType为1）
    if (payload.userType !== "1") {
      return res.status(403).json({ message: '权限不足' });
    }
    
    // 将用户信息附加到请求对象，以便后续中间件或路由使用
    req.user = payload;
    next();
  } else {
    // 非 /admin/ 路径，直接放行
    next();
  }
}

module.exports = { interceptRequest };