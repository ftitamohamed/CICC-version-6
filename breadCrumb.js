const breadcrumbKey = "breadcrumb_history";

function formatSegment(segment) {
  return segment
    .replace(/\.html?$/, '')                   // remove .html
    .replace(/([a-z])([A-Z])/g, '$1 $2')       // split camelCase
    .replace(/-/g, ' ')                        // replace dashes with spaces
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

  // Remove the currentPath if it exists anywhere in history (not just last)
  history = history.filter(page => page !== currentPath);
  
  // Add currentPath to the end
  history.push(currentPath);

  localStorage.setItem(breadcrumbKey, JSON.stringify(history));
  return history;
}

function generateBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  const baseURL = window.location.origin;
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

    if (index === history.length - 1) {
      li.innerHTML = `<a>${label}</a>`; // Current page (no link)
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