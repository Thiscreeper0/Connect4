document.getElementById('themeSetting').addEventListener('click', changeToTheme);
document.getElementById('generalSetting').addEventListener('click', changeToGeneral);
document.getElementById('sideSetting').addEventListener('click', changeToSide);

const settingsContainer = document.getElementById('settingsContainer');

const themeSetting = document.getElementById('themeSetting');
const generalSetting = document.getElementById('generalSetting');
const sideSetting = document.getElementById('sideSetting');


const themeSettings = document.getElementById('themeSettings');
const generalSettings = document.getElementById('generalSettings');
const sideSettings = document.getElementById('sideSettings');

document.addEventListener('DOMContentLoaded', () => {
    const lightThemeBtn = document.getElementById('lightMode');
    const darkThemeBtn = document.getElementById('darkMode');

    // Load the saved theme from localStorage or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Event listener for light theme button
    lightThemeBtn.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    });

    // Event listener for dark theme button
    darkThemeBtn.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    });
});

function changeToTheme() {
    if (themeSettings.classList.contains("flex")) {return}
    const settings = settingsContainer.querySelectorAll(':scope > *')
    settings.forEach(setting => {
        setting.classList.remove("flex")
        setting.classList.add("hidden")
    })
    themeSettings.classList.add("flex")
    themeSettings.classList.remove("hidden")
}

function changeToGeneral() {
    if (generalSettings.classList.contains("flex")) {return}
    const settings = settingsContainer.querySelectorAll(':scope > *')
    settings.forEach(setting => {
        setting.classList.remove("flex")
        setting.classList.add("hidden")
    })
    generalSettings.classList.add("flex")
    generalSettings.classList.remove("hidden")
}
function changeToSide() {
    if (sideSettings.classList.contains("flex")) {return}
    const settings = settingsContainer.querySelectorAll(':scope > *')
    settings.forEach(setting => {
        setting.classList.remove("flex")
        setting.classList.add("hidden")
    })
    sideSettings.classList.add("flex")
    sideSettings.classList.remove("hidden")
}


document.addEventListener('DOMContentLoaded', () => {
    const sideSettings = document.getElementById('sideSettings');
    const generalSettings = document.getElementById('generalSettings');
    const sideChildren = sideSettings.children;
    const generalChildren = generalSettings.children;

    const updateSettings = (evt) => {
        let set = localStorage.getItem('set') || '0000';
        const target = evt.target.closest('.setting');

        if (target) {
            const index = target.dataset.index;
            let newSet = set.split('');

            if (newSet[index] === '0') {
                newSet[index] = '1';
                target.classList.add('on');
                target.classList.remove('off');
            } else {
                newSet[index] = '0';
                target.classList.add('off');
                target.classList.remove('on');
            }

            set = newSet.join('');
            localStorage.setItem('set', set);
        }
    };

    const updateGeneralSettings = (evt) => {
        let set = localStorage.getItem('generalSet') || '0';
        const target = evt.target.closest('.setting');

        if (target) {
            let newSet = set.split('');

            if (newSet[0] === '0') {
                newSet[0] = '1';
                target.classList.add('on');
                target.classList.remove('off');
            } else {
                newSet[0] = '0';
                target.classList.add('off');
                target.classList.remove('on');
            }

            set = newSet.join('');
            localStorage.setItem('generalSet', set);
        }
    };

    const applySettings = () => {
        let set = localStorage.getItem('set') || '0000';
        Array.from(sideChildren).forEach((element, index) => {
            if (set[index] === '1') {
                element.classList.add('on');
                element.classList.remove('off');
            } else {
                element.classList.add('off');
                element.classList.remove('on');
            }
        });
    };

    const applyGeneralSettings = () => {
        let set = localStorage.getItem('generalSet') || '0';
        Array.from(generalChildren).forEach((element, index) => {
            if (set[index] === '1') {
                element.classList.add('on');
                element.classList.remove('off');
            } else {
                element.classList.add('off');
                element.classList.remove('on');
            }
        });
    };

    Array.from(sideChildren).forEach((element) => {
        element.addEventListener('click', updateSettings);
    });

    Array.from(generalChildren).forEach((element) => {
        element.addEventListener('click', updateGeneralSettings);
    });

    applySettings(); // Apply settings on page load
    applyGeneralSettings(); // Apply general settings on page load
});