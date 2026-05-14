const breadcrumbKey = "breadcrumb_history";

function formatSegment(segment) {
  return segment
    .replace(/\.html?$/, '')                   // remove .html
    .replace(/([a-z])([A-Z])/g, '$1 $2')       // split camelCase
    .replace(/-/g, ' ')                        // replace dashes with spaces
    .replace(/\bwear\s*house\b/gi, '')         // ❌ remove "wear house"
    .trim()
    .toLowerCase();
}

function getPageName(path) {
  return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

function updateBreadcrumbHistory() {
  const currentPath = getPageName(window.location.pathname);
  let history = JSON.parse(localStorage.getItem(breadcrumbKey)) || [];

  if (currentPath === 'index.html' || window.location.pathname === "/") {
    history = []; // reset on homepage
    localStorage.setItem(breadcrumbKey, JSON.stringify(history));
    return history;
  }

  // Check if currentPath already exists in history
  const existingIndex = history.indexOf(currentPath);
  
  if (existingIndex !== -1) {
    // Page already in history - TRUNCATE history up to this point
    history = history.slice(0, existingIndex + 1);
    localStorage.setItem(breadcrumbKey, JSON.stringify(history));
    return history;
  }
  
  // New page - add to end
  history.push(currentPath);
  localStorage.setItem(breadcrumbKey, JSON.stringify(history));
  return history;
}

function generateBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  const baseURL = window.location.origin;
  const currentPath = getPageName(window.location.pathname);
  const history = updateBreadcrumbHistory();

  // Clear existing breadcrumb items first
  breadcrumb.innerHTML = '';

  // Always show Home link
  const home = document.createElement('li');
  home.innerHTML = `<a href="${baseURL}/index.html">home</a>`;
  breadcrumb.appendChild(home);

  // Add rest from history
  history.forEach((page, index) => {
    const label = formatSegment(page);
    const li = document.createElement('li');
    const path = `${baseURL}/${page}`;

    if (page === currentPath) {
      // Current page - highlight it instead of making it unclickable
      li.innerHTML = `<a href="${path}" class="current-breadcrumb" style="color: #007bff; font-weight: 600;">${label}</a>`;
    } else {
      li.innerHTML = `<a href="${path}">${label}</a>`;
    }

    breadcrumb.appendChild(li);
  });
}

// Generate breadcrumb on page load
generateBreadcrumb();

// Regenerate breadcrumb when navigating back/forward
window.addEventListener('popstate', generateBreadcrumb);