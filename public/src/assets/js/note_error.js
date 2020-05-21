// error flash message -  appear and disappear above header
setTimeout(function () {
    document.querySelector('.main-notification-error').style.height='2rem';
    document.querySelector('.main-notification-error span').style.opacity='1';
}, 500);

setTimeout(function () {
    document.querySelector('.main-notification-error span').style.opacity='0';
    document.querySelector('.main-notification-error').style.height='0';
}, 3000);

