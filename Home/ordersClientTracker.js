/*ordersClientTracker.js*/
document.getElementById('saveTrackerCodeButton').addEventListener('click', function () {
    const wantedProduct = document.getElementById('trackerCodeInput').value;
    if (wantedProduct) {
        localStorage.setItem('wantedProduct', wantedProduct);
        window.location.href = 'wearHouseSearch.html';
    } else {
        alert('يرجى إدخال رمز التتبع.');
    }
});