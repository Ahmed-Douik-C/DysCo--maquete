var AdminMode = sessionStorage.getItem('AdminMode') === 'true';

function setAdminMode(value) {
    AdminMode = value;
    sessionStorage.setItem('AdminMode', String(value));
}

document.querySelectorAll('.log-btn')[0].addEventListener('click', () => {
    setAdminMode(true);

});
document.querySelectorAll('.log-btn')[1].addEventListener('click', () => {
    setAdminMode(false);
});