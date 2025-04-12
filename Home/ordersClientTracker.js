/*ordersClientTracker.js*/
document.getElementById('saveTrackerCodeButton').addEventListener('click', function () {
    const trackerCode = document.getElementById('trackerCodeInput').value;
    if (trackerCode) {
        localStorage.setItem('TrackerCode', trackerCode);
        window.location.href = 'visitor.html';
    } else {
        alert('يرجى إدخال رمز التتبع.');
    }
});