/**
 * Mastodon Comments - A Mastodon comment section component built with Tailwind CSS – backend-free deployment, with all data natively stored in Mastodon. 基于 Tailwind CSS 构建的 Mastodon 评论区组件，免后端部署，数据原生存储在 Mastodon 中。
 * @version 1.0.0
 * @author feiju12138
 */
(function () {
  'use strict';

  (function(window) {
    let mastodonCommentsInstance = null;
    class MastodonComments {
      constructor(options) {
        if (!options.MASTODON_DOMAIN || !options.TOOT_ID || !options.MASTODON_USER) {
          throw new Error("MASTODON_DOMAIN、MASTODON_USER 和 TOOT_ID 为必填参数");
        }
        this.config = {
          containerId: "mastodon-comments",
          ...options
        };
        this.elements = {};
        this.init();
      }
      init() {
        this.container = document.getElementById(this.config.containerId);
        if (!this.container) {
          throw new Error(`未找到挂载容器 #${this.config.containerId}`);
        }
        this.renderBaseUI();
        this.cacheElements();
        this.bindEvents();
        this.fetchAndRenderComments();
      }
      renderBaseUI() {
        this.container.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 inline-flex items-center gap-2">
              用户评论
              <a id="original-post-link" target="_blank" rel="noopener noreferrer"
                 class="text-blue-500 hover:text-blue-400 transition-colors"
                 title="打开原帖">
                <i class="fa-solid fa-external-link-alt text-lg"></i>
              </a>
            </h2>
            <p class="mt-2 text-gray-600">共展示 <span id="comment-count" class="font-medium">0</span> 条评论</p>
          </div>

          <div id="loading" class="bg-white rounded-lg p-8 text-center">
            <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
              <i class="fa-solid fa-spinner fa-spin text-4xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900">加载评论中...</h3>
          </div>

          <div id="empty-state" class="bg-white rounded-lg p-8 text-center hidden">
            <div class="mx-auto h-16 w-16 text-gray-400 mb-4">
              <i class="fa-solid fa-comment-dots text-4xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900">暂无评论</h3>
          </div>

          <div id="comment-list" class="space-y-6 hidden"></div>

          <div id="error-state" class="bg-white rounded-lg p-8 text-center hidden">
            <div class="mx-auto h-16 w-16 text-red-400 mb-4">
              <i class="fa-solid fa-triangle-exclamation text-4xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900">加载评论失败</h3>
            <button id="retry-btn" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
              重新加载
            </button>
          </div>
        </div>
      `;
      }
      cacheElements() {
        this.elements = {
          loading: this.container.querySelector("#loading"),
          emptyState: this.container.querySelector("#empty-state"),
          commentList: this.container.querySelector("#comment-list"),
          errorState: this.container.querySelector("#error-state"),
          commentCount: this.container.querySelector("#comment-count"),
          retryBtn: this.container.querySelector("#retry-btn"),
          originalPostLink: this.container.querySelector("#original-post-link")
        };
      }
      bindEvents() {
        this.elements.retryBtn.addEventListener("click", () => {
          this.elements.errorState.classList.add("hidden");
          this.elements.loading.classList.remove("hidden");
          this.fetchAndRenderComments();
        });
      }
      formatDateTime(isoString) {
        if (!isoString) return "未知时间";
        const date = new Date(isoString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
      filterComments(comments) {
        return comments.filter(comment => {
          return comment.sensitive === false &&
            ["public", "unlisted"].includes(comment.visibility);
        });
      }
      sortRootCommentsDesc(comments) {
        return comments.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      }
      sortReplyCommentsAsc(comments) {
        return comments.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
      }
      buildCommentHierarchy(comments) {
        const mainTootId = this.config.TOOT_ID;
        const commentMap = new Map();
        comments.forEach(comment => {
          commentMap.set(comment.id, { ...comment, replies: [] });
        });
        const rootComments = [];
        comments.forEach(comment => {
          const commentNode = commentMap.get(comment.id);
          if (comment.in_reply_to_id === mainTootId) {
            rootComments.push(commentNode);
          }
        });
        const sortedRootComments = this.sortRootCommentsDesc(rootComments);
        comments.forEach(comment => {
          const commentNode = commentMap.get(comment.id);
          if (comment.in_reply_to_id === mainTootId) return;
          const parentComment = commentMap.get(comment.in_reply_to_id);
          if (parentComment) {
            if (rootComments.includes(parentComment)) {
              parentComment.replies.push(commentNode);
            } else {
              let topParent = parentComment;
              while (topParent && !rootComments.includes(topParent)) {
                topParent = commentMap.get(topParent.in_reply_to_id);
              }
              if (topParent) {
                topParent.replies.push(commentNode);
              } else {
                sortedRootComments.push(commentNode);
              }
            }
          } else {
            sortedRootComments.push(commentNode);
          }
        });
        sortedRootComments.forEach(rootComment => {
          rootComment.replies = this.sortReplyCommentsAsc(rootComment.replies);
        });
        return sortedRootComments;
      }
      renderComment(comment, isReply = false) {
        const commentClasses = isReply
          ? "bg-gray-100 rounded-lg p-4"
          : "bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow";
        return `
        <div class="${commentClasses}" data-comment-id="${comment.id}">
            <div class="flex items-start mb-4">
                <div class="flex-shrink-0 mr-4">
                    <a href="${comment.account.url}" target="_blank" rel="noopener noreferrer">
                        <img class="h-12 w-12 rounded-full object-cover"
                             src="${comment.account.avatar}"
                             alt="${comment.account.acct}"
                             onerror="this.src="https://picsum.photos/200/200?random=999"">
                    </a>
                </div>
                <div>
                    <a href="${comment.account.url}" target="_blank" rel="noopener noreferrer" class="font-medium text-lg text-gray-900 hover:text-blue-500">
                        ${comment.account.acct || "未知用户"}
                    </a>
                    <p class="text-sm text-gray-500 mt-1">
                        <time>${this.formatDateTime(comment.created_at)}</time>
                    </p>
                </div>
            </div>
            <div class="text-gray-700 leading-relaxed ml-16">
                ${comment.content || "<p>无内容</p>"}
            </div>

            ${comment.replies && comment.replies.length > 0
        ? `<div class="ml-8 border-l-2 border-gray-200 pl-6 space-y-4 mt-4">
                    ${comment.replies.map(reply => this.renderReplyComment(reply)).join("")}
                  </div>`
        : ""}
        </div>
      `;
      }
      renderReplyComment(comment) {
        return `
        <div class="bg-gray-100 rounded-lg p-4" data-comment-id="${comment.id}">
            <div class="flex items-start mb-4">
                <div class="flex-shrink-0 mr-4">
                    <a href="${comment.account.url}" target="_blank" rel="noopener noreferrer">
                        <img class="h-12 w-12 rounded-full object-cover"
                             src="${comment.account.avatar}"
                             alt="${comment.account.acct}"
                             onerror="this.src="https://picsum.photos/200/200?random=999"">
                    </a>
                </div>
                <div>
                    <a href="${comment.account.url}" target="_blank" rel="noopener noreferrer" class="font-medium text-lg text-gray-900 hover:text-blue-500">
                        ${comment.account.acct || "未知用户"}
                    </a>
                    <p class="text-sm text-gray-500 mt-1">
                        <time>${this.formatDateTime(comment.created_at)}</time>
                    </p>
                </div>
            </div>
            <div class="text-gray-700 leading-relaxed ml-16">
                ${comment.content || "<p>无内容</p>"}
            </div>
        </div>
      `;
      }
      renderComments(comments) {
        const validComments = this.filterComments(comments);
        this.elements.commentCount.textContent = validComments.length;
        this.elements.loading.classList.add("hidden");
        this.elements.errorState.classList.add("hidden");
        if (validComments.length === 0) {
          this.elements.commentList.classList.add("hidden");
          this.elements.emptyState.classList.remove("hidden");
          return;
        }
        this.elements.commentList.classList.remove("hidden");
        const commentHierarchy = this.buildCommentHierarchy(validComments);
        this.elements.commentList.innerHTML = commentHierarchy.map(comment => this.renderComment(comment)).join("");
      }
      async fetchAndRenderComments() {
        try {
          const { MASTODON_DOMAIN, MASTODON_USER, TOOT_ID } = this.config;
          this.elements.originalPostLink.href = `https://${MASTODON_DOMAIN}/@${MASTODON_USER}/${TOOT_ID}`;
          const response = await fetch(`https://${MASTODON_DOMAIN}/api/v1/statuses/${encodeURIComponent(TOOT_ID)}/context`);
          if (!response.ok) throw new Error(`请求失败: ${response.status}`);
          const data = await response.json();
          this.renderComments(data.descendants || []);
        } catch (error) {
          console.error("获取评论失败:", error);
          this.elements.loading.classList.add("hidden");
          this.elements.errorState.classList.remove("hidden");
        }
      }
    }
    window.initMastodonComments = function(options) {
      if (mastodonCommentsInstance) {
        console.warn("Mastodon Comments 已初始化，将重新创建实例");
      }
      mastodonCommentsInstance = new MastodonComments(options);
      return mastodonCommentsInstance;
    };
  })(window);

})();
