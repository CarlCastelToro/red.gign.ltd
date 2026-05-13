(function() {
    var firstvisit = false;
    if(localStorage.getItem('siteTheme')===null && localStorage.getItem('siteFont')===null){
        localStorage.setItem('siteTheme', 'light');
        localStorage.setItem('siteFont', 'georgia');
        firstvisit = true;  
    }
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    const savedFont = localStorage.getItem('siteFont') || 'georgia'; 
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
    if (savedFont === 'georgia') {
        document.documentElement.classList.add('font-georgia');
        document.documentElement.classList.remove('font-yahei');
    } else {
        document.documentElement.classList.add('font-yahei');
        document.documentElement.classList.remove('font-georgia');
    }
    const oldThemeStyles = document.querySelectorAll('link[id="dark-theme"], link[id="light-theme"]');
    oldThemeStyles.forEach(link => link.remove());
    if (!document.getElementById('main-theme')) {
        const mainStyle = document.createElement('link');
        mainStyle.rel = 'stylesheet';
        mainStyle.href = '/assets/css/style.css';
        mainStyle.id = 'main-theme';
        mainStyle.onload = function() {
            document.documentElement.classList.add('theme-loaded');
        };
        document.head.insertBefore(mainStyle, document.head.firstChild);
    } else {
        document.documentElement.classList.add('theme-loaded');
    }
    function initToggleState() {
        const themeToggle = document.getElementById('themeToggle');
        const fontToggle = document.getElementById('fontToggle');        
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'light';
        }
        if (fontToggle) {
            fontToggle.checked = savedFont !== 'georgia'; 
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggleState);
    } else {
        initToggleState();
    }
})();