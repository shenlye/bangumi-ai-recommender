/**
 * 检查用户是否存在
 * @param username Bangumi 用户名
 * @throws 当用户不存在或请求失败时抛出错误
 * @returns 如果用户存在返回 true
 */
export async function checkUserExists(username: string): Promise<boolean> {
  const response = await fetch(`https://api.bgm.tv/v0/users/${encodeURIComponent(username)}`);

  if (!response.ok) {
    throw new Error(response.status === 404 ? "用户不存在" : `请求失败: HTTP ${response.status}`);
  }

  return true;
}

/**
 * 获取用户收藏
 * @param username Bangumi 用户名
 * @param type 收藏类型 (anime|game)
 */
export async function getUserCollections(username: string, type: 'anime' | 'game') {
  const response = await fetch(
    `https://api.bgm.tv/v0/users/${encodeURIComponent(username)}/collections?type=2&subject_type=${type === 'anime' ? 2 : 4}`
  );

  if (!response.ok) {
    throw new Error(`获取收藏失败: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * 获取用户收藏
 * @param username Bangumi 用户名
 * @param type 收藏类型 (anime|game)
 * @returns 用户收藏数据
 */
export async function fetchUserData(username: string, type: 'anime' | 'game') {
    
  await checkUserExists(username);
  
  const collections = await getUserCollections(username, type);
  return { collections };
}