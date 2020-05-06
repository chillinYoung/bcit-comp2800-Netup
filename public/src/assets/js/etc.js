setTimeout(function () {
    document.querySelector('.main-notification').style.height='2rem';
    document.querySelector('.main-notification span').style.opacity='1';
}, 500);

setTimeout(function () {
    document.querySelector('.main-notification span').style.opacity='0';
    document.querySelector('.main-notification').style.height='0';
}, 3000);

