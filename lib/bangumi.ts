import type { paths } from "../types/bangumiAPI";
import type { UserData, CollectionItem } from "../store/userStore";

const headers = {
  "User-Agent":
    "shenlye/bangumi-ai-recommender (https://github.com/shenlye/bangumi-ai-recommender)",
};

/**
 * 检查用户是否存在
 * @param username Bangumi 用户名
 * @throws 当用户不存在或请求失败时抛出错误
 * @returns 如果用户存在返回 true
 */
export async function checkUserExists(username: string): Promise<boolean> {
  const response = await fetch(
    `https://api.bgm.tv/v0/users/${encodeURIComponent(username)}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "用户不存在"
        : `请求失败: HTTP ${response.status}`
    );
  }

  return true;
}

/**
 * 获取用户收藏
 * @param username Bangumi 用户名
 * @param type 收藏类型 (anime|game)
 */
export async function getUserCollections(
  username: string,
  type: "anime" | "game",
  limit: number = 50,
  offset: number = 0
): Promise<
  paths["/v0/users/{username}/collections"]["get"]["responses"][200]["content"]["application/json"]
> {
  const response = await fetch(
    `https://api.bgm.tv/v0/users/${encodeURIComponent(
      username
    )}/collections?type=2&limit=${limit}&offset=${offset}&subject_type=${
      type === "anime" ? 2 : 4
    }`
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
 * @returns 处理后的用户收藏数据
 */
export async function fetchUserData(
  username: string,
  type: "anime" | "game",
  onPage?: (page: number) => void
): Promise<UserData> {
  await checkUserExists(username);

  let allData: CollectionItem[] = [];
  let offset = 0;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    if (onPage) {
      onPage(offset / limit + 1);
    }
    const response = await getUserCollections(username, type, limit, offset);

    const filteredData = response.data.map(
      (
        item: paths["/v0/users/{username}/collections"]["get"]["responses"][200]["content"]["application/json"]["data"][number]
      ) => {
        const result: CollectionItem = {
          name_cn: item.subject?.name_cn || item.subject?.name || "未命名",
          rate: item.rate,
        };

        if (item.comment) {
          result.comment = item.comment;
        }

        return result;
      }
    );

    allData = [...allData, ...filteredData];

    if (offset + limit >= response.total) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  return {
    collections: {
      data: allData,
      total: allData.length,
    },
  };
}
