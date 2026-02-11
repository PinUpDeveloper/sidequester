const CATEGORIES = ['tech', 'travel', 'food', 'lifestyle'];

function categoryLabel(cat) {
  return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

async function loadPosts(params = {}) {
  const q = new URLSearchParams();
  if (params.category) q.set('category', params.category);
  if (params.search) q.set('search', params.search);
  if (params.mine) q.set('mine', 'true');
  const query = q.toString();
  const url = '/posts' + (query ? '?' + query : '');
  const res = await api.get(url);
  return res.data.posts || [];
}

async function loadPost(id) {
  const res = await api.get('/posts/' + id);
  return res.data.post;
}

async function loadComments(postId) {
  const res = await api.get('/posts/' + postId + '/comments');
  return res.data.comments || [];
}

async function addComment(postId, content) {
  const res = await api.post('/posts/' + postId + '/comments', { content });
  return res.data.comment;
}

async function deleteComment(postId, commentId) {
  await api.delete('/posts/' + postId + '/comments/' + commentId);
}

function postCard(post, options = {}) {
  const showAuthor = options.showAuthor !== false;
  const showStatus = options.showStatus === true;
  const link = '/post.html?id=' + encodeURIComponent(post._id);
  const cover = post.coverImageUrl
    ? `<img src="${escapeHtml(post.coverImageUrl)}" alt="" class="post-cover" />`
    : '';
  const tags = (post.tags || []).length
    ? '<div class="post-tags">' + (post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') + '</div>'
    : '';
  let statusBadge = '';
  if (showStatus && post.status) {
    statusBadge = `<span class="status-badge status-${post.status}">${post.status}</span>`;
  }
  return `
    <article class="post-card" data-id="${escapeHtml(post._id)}">
      <a href="${link}" class="post-card-link">
        ${cover}
        <div class="post-card-body">
          <span class="post-category">${categoryLabel(post.category)}</span>
          ${statusBadge}
          <h2 class="post-title">${escapeHtml(post.title)}</h2>
          <p class="post-excerpt">${escapeHtml((post.content || '').slice(0, 150))}${(post.content || '').length > 150 ? '…' : ''}</p>
          ${tags}
          <div class="post-meta">
            ${showAuthor && post.author ? `<span class="author">${escapeHtml(post.author.username)}</span>` : ''}
            <time>${formatDate(post.createdAt)}</time>
          </div>
        </div>
      </a>
    </article>`;
}

function escapeHtml(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
