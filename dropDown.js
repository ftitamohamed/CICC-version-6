const dropDown = document.querySelector(".dropDown");
const dropBtn = document.querySelector(".dropBtn");
const spanList = document.querySelectorAll(".dropBtn span");

const toggleBtn = document.getElementById("toggleTracker");
const toggleBtn2 = document.getElementById("toggleTracker2");
const tracker = document.querySelector(".trackerDropDown");
const closeTrackerBtn = document.querySelector('.close-tracker-btn');

/* ===============================
   OUTSIDE CLICK HANDLER
================================ */
function outsideClickHandlerTracker(e) {
  if (
    tracker.classList.contains("show") &&
    !tracker.contains(e.target) &&
    !toggleBtn.contains(e.target) &&
    !toggleBtn2.contains(e.target)
  ) {
    tracker.classList.remove("show");
    document.removeEventListener("click", outsideClickHandlerTracker);
  }
}

/* ===============================
   DROPDOWN BUTTON
================================ */
dropBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const isOpen = dropDown.style.display === 'flex';

  if (isOpen) {
    dropDown.classList.add("hide");
    setTimeout(() => dropDown.style.display = 'none', 500);
  } else {
    dropDown.style.display = 'flex';
    dropDown.classList.remove("hide");
  }

  dropBtn.classList.toggle('btnInv');
  spanList.forEach(span => span.classList.toggle('spanInv'));
});

/* ===============================
   TRACKER TOGGLE BUTTONS
================================ */
function toggleTracker(e) {
  e.stopPropagation();

  tracker.classList.toggle("show");

  // close dropdown if open
  dropDown.classList.add("hide");
  setTimeout(() => dropDown.style.display = 'none', 500);

  dropBtn.classList.remove('btnInv');
  spanList.forEach(span => span.classList.remove('spanInv'));

  document.addEventListener("click", outsideClickHandlerTracker);
}

toggleBtn.addEventListener("click", toggleTracker);
toggleBtn2.addEventListener("click", toggleTracker);

/* ===============================
   OPTIONAL CLOSE BUTTON
================================ */
if (closeTrackerBtn) {
  closeTrackerBtn.addEventListener("click", () => {
    tracker.classList.remove("show");
  });
}
