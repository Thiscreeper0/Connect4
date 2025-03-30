//Copyright 2024, Kasper Johansen, All rights reserved.


const observer = new MutationObserver(checkLengthAndToggleDisplay);
function checkLengthAndToggleDisplay() {
    const leftElement = document.querySelector('.left');
    const shortLogo = document.querySelector('.shortLogo');
    const middleLogo = document.querySelector('.middleLogo');
    const longLogo = document.querySelector('.longLogo');
    const width = leftElement.parentElement.offsetWidth;
    if ((width > 700)) {
        acc = leftElement.parentElement.querySelectorAll('a');
        acc.forEach(element => {
        element.style.padding = "4px 8px"
        })
        longLogo.classList.add('flex');
        shortLogo.classList.add('hidden');
        middleLogo.classList.add('hidden')
        shortLogo.classList.remove('flex');
        middleLogo.classList.remove('flex');
        longLogo.classList.remove('hidden');
    } else if ((width > 500)) {
        acc = leftElement.parentElement.querySelectorAll('a');
        acc.forEach(element => {
        element.style.padding = "4px 8px"
        })
        longLogo.classList.remove('flex');
        shortLogo.classList.remove('flex');
        longLogo.classList.add('hidden');
        shortLogo.classList.add('hidden');
        middleLogo.classList.add('flex');
        middleLogo.classList.remove('hidden')
    }else {
        acc = leftElement.parentElement.querySelectorAll('a');
        acc.forEach(element => {
        element.style.padding = "3px 5px"
        })
        middleLogo.classList.remove('flex');
        middleLogo.classList.add('hidden')
        longLogo.classList.remove('flex');
        longLogo.classList.add('hidden');
        shortLogo.classList.add('flex');
        shortLogo.classList.remove('hidden');
    }
    navbarHeight = document.querySelector('.navbar').offsetHeight;
    
}
// Initial check
checkLengthAndToggleDisplay();

// Observe changes in the content of .left
observer.observe(document.querySelector('.left'), { characterData: true, childList: true, subtree: true });

// Optional: Listen to window resize events to handle changes in parent element height
window.addEventListener('resize', checkLengthAndToggleDisplay);
