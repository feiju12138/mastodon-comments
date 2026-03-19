/**
 * MastodonComments 核心逻辑
 * 核心规则：根级评论创建时间倒序、非根级评论创建时间正序
 * 功能：过滤警告评论、无限级嵌套、头像/用户名同URL跳转、原文跳转、时间格式化
 */
class MastodonComments {
  constructor(options) {
    this.config = {
      MASTODON_DOMAIN: options.MASTODON_DOMAIN,
      MASTODON_USER: options.MASTODON_USER,
      TOOT_ID: options.TOOT_ID,
      container: document.getElementById('mastodon-comments')
    };
    this.init();
  }

  async init() {
    if (!this.config.container) {
      console.error('MastodonComments: 未找到挂载节点 #mastodon-comments');
      return;
    }

    // 根评论跳转URL
    const { TOOT_ID } = this.config;
    const commentOriginalUrl = `https://${domain}/@${comment.account.acct}/${TOOT_ID}`;

    try {
      const commentsData = await this.fetchComments();
      const processedData = this.processComments(commentsData);
      this.renderComments(processedData);
    } catch (error) {
      console.error('MastodonComments 初始化失败：', error);
      this.config.container.innerHTML = `<a href="${commentOriginalUrl}" style="color: #f56c6c; padding: 16px;">评论加载失败，请稍后重试</a>`;
    }
  }

  async fetchComments() {
    const { MASTODON_DOMAIN, TOOT_ID } = this.config;
    const apiUrl = `https://${MASTODON_DOMAIN}/api/v1/statuses/${TOOT_ID}/context`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API请求失败：${response.status}`);
    }
    return await response.json();
  }

  processComments(contextData) {
    const { ancestors, descendants } = contextData;
    const TOOT_ID = this.config.TOOT_ID;
    const allComments = [...ancestors, ...descendants];

    // 过滤带警告的评论
    const filteredComments = allComments.filter(comment => {
      return !comment.spoiler_text || comment.spoiler_text.trim() === '';
    });

    // 构建评论父子映射
    const childCommentsMap = new Map();
    filteredComments.forEach(comment => {
      const parentId = comment.in_reply_to_id;
      if (!childCommentsMap.has(parentId)) {
        childCommentsMap.set(parentId, []);
      }
      childCommentsMap.get(parentId).push(comment);
    });

    // 根评论倒序排列
    const rootComments = childCommentsMap.get(TOOT_ID) || [];
    rootComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // 非根评论正序排列
    childCommentsMap.forEach(comments => {
      if (comments !== rootComments) {
        comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
    });

    return { rootComments, childCommentsMap };
  }

  renderComments({ rootComments, childCommentsMap }) {
    const container = this.config.container;
    const { MASTODON_DOMAIN } = this.config;
    container.innerHTML = '';

    // 根评论跳转URL
    const { TOOT_ID } = this.config;
    const commentOriginalUrl = `https://${domain}/@${comment.account.acct}/${TOOT_ID}`;

    if (rootComments.length === 0) {
      container.innerHTML = `<a href="${commentOriginalUrl}" style="padding: 16px; color: #666;">暂无评论</a>`;
      return;
    }

    rootComments.forEach(rootComment => {
      const rootCommentEl = this.createCommentElement(rootComment, MASTODON_DOMAIN, 0);
      this.renderNestedChildComments(rootCommentEl, rootComment.id, childCommentsMap, MASTODON_DOMAIN, 1);
      container.appendChild(rootCommentEl);
    });
  }

  /**
   * 创建单条评论DOM元素
   * @param {Object} comment 评论数据
   * @param {string} domain Mastodon域名
   * @param {number} level 评论嵌套层级
   * @returns {HTMLElement} 评论DOM节点
   */
  createCommentElement(comment, domain, level) {
    const commentEl = document.createElement('div');
    const indentStyle = level > 0 ? `margin-left: ${level * 24}px;` : '';
    commentEl.style = `
      ${indentStyle}
      margin: 16px 0;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 8px;
    `;

    // 统一用户主页跳转URL
    const userProfileUrl = `https://${domain}/@${comment.account.acct}`;
    // 评论原文跳转URL
    const commentOriginalUrl = `https://${domain}/@${comment.account.acct}/${comment.id}`;

    commentEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; align-items: center;">
          <!-- 头像跳转：使用统一的用户主页URL -->
          <a href="${userProfileUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <img src="${comment.account.avatar}" alt="${comment.account.display_name}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
          </a>
          <div>
            <!-- 名字跳转：使用和头像相同的用户主页URL -->
            <a href="${userProfileUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 14px; color: #999;">
              <div style="font-weight: 600; color: #333;">@${comment.account.acct}</div>
            </a>
            <div style="font-size: 12px; color: #999;">${this.formatTime(comment.created_at)}</div>
          </div>
        </div>
        <a href="${commentOriginalUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: #409eff; text-decoration: none;">
          查看原文
        </a>
      </div>
      <div style="color: #333; line-height: 1.5;">${comment.content}</div>
    `;

    return commentEl;
  }

  /**
   * 递归渲染嵌套子评论
   * @param {HTMLElement} parentEl 父评论DOM
   * @param {string} parentCommentId 父评论ID
   * @param {Map} childCommentsMap 评论父子映射
   * @param {string} domain Mastodon域名
   * @param {number} level 嵌套层级
   */
  renderNestedChildComments(parentEl, parentCommentId, childCommentsMap, domain, level) {
    const childComments = childCommentsMap.get(parentCommentId) || [];
    if (childComments.length === 0) return;

    const childContainer = document.createElement('div');
    childContainer.className = 'mastodon-nested-comments';
    childContainer.style = 'margin-top: 12px;';

    childComments.forEach(childComment => {
      const childCommentEl = this.createCommentElement(childComment, domain, level);
      this.renderNestedChildComments(childCommentEl, childComment.id, childCommentsMap, domain, level + 1);
      childContainer.appendChild(childCommentEl);
    });

    parentEl.appendChild(childContainer);
  }

  /**
   * 格式化时间为YYYY-MM-DD HH:mm
   * @param {string} timeStr ISO时间字符串
   * @returns {string} 格式化后的时间
   */
  formatTime(timeStr) {
    const date = new Date(timeStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}

// 全局初始化函数
window.initMastodonComments = function(options) {
  new MastodonComments(options);
};
