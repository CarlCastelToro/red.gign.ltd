document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
            }
        });
    });
    const backToTopElement = document.getElementById('backToTop');
    if (!backToTopElement) {
        const backToTopDiv = document.createElement('div');
        backToTopDiv.id = 'backToTop';
        backToTopDiv.className = 'back-to-top';

        const link = document.createElement('a');
        link.href = '#_jumptitle';
        link.onclick = function () {
            window.location.hash = '#_jumptitle';
        };
        link.textContent = '↑';

        backToTopDiv.appendChild(link);
        document.body.appendChild(backToTopDiv);
    }
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function () {
        backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const initTheme = () => {
            const savedTheme = localStorage.getItem('siteTheme') || 'light';
            if (savedTheme === 'light') {
                document.documentElement.classList.add('light-theme');
                themeToggle.checked = true;
            } else {
                document.documentElement.classList.remove('light-theme');
                themeToggle.checked = false;
            }
        };
        const switchTheme = () => {
            const isLight = themeToggle.checked;
            const newTheme = isLight ? 'light' : 'dark';
            if (isLight) {
                document.documentElement.classList.add('light-theme');
            } else {
                document.documentElement.classList.remove('light-theme');
            }
            localStorage.setItem('siteTheme', newTheme);
        };
        initTheme();
        themeToggle.addEventListener('change', switchTheme, { passive: true });
    }
    const fontToggle = document.getElementById('fontToggle');
    if (fontToggle) {
        const initFont = () => {
            const savedFont = localStorage.getItem('siteFont') || 'yahei';
            if (savedFont === 'georgia') {
                document.documentElement.classList.add('font-georgia');
                document.documentElement.classList.remove('font-yahei');
                fontToggle.checked = false;
            } else {
                document.documentElement.classList.add('font-yahei');
                document.documentElement.classList.remove('font-georgia');
                fontToggle.checked = true;
            }
        };
        const switchFont = () => {
            const isGeorgia = !fontToggle.checked;
            const newFont = isGeorgia ? 'georgia' : 'yahei';
            if (isGeorgia) {
                document.documentElement.classList.add('font-georgia');
                document.documentElement.classList.remove('font-yahei');
            } else {
                document.documentElement.classList.add('font-yahei');
                document.documentElement.classList.remove('font-georgia');
            }
            localStorage.setItem('siteFont', newFont);
        };
        initFont();
        fontToggle.addEventListener('change', switchFont, { passive: true });
    }
    const video = document.getElementById('autoplayvideo');
    var videofirsttimeplay = false;
    document.addEventListener('click', function () {
        if (!videofirsttimeplay && video) {
            video.play().catch(function (error) {
                console.log('播放失败:', error);
            });
            videofirsttimeplay = true;
        }
    });
    function applyIDEStyleToCode() {
        const codeElements = document.querySelectorAll('code.loadstylesheet');
        codeElements.forEach(codeElement => {
            if (codeElement.classList.contains('highlighted')) {
                return;
            }
            codeElement.classList.add('highlighted');
            codeElement.classList.add('ide-style-code');
            if (!codeElement.parentElement.matches('pre')) {
                const preElement = document.createElement('pre');
                codeElement.parentNode.insertBefore(preElement, codeElement);
                preElement.appendChild(codeElement);
            }
            const syntaxType = codeElement.getAttribute('name') || 'js';
            const originalText = codeElement.textContent;
            codeElement.textContent = '';
            buildHighlightedCode(codeElement, originalText, syntaxType);
        });
    }
    function buildHighlightedCode(codeElement, text, syntaxType) {
        const lines = text.split('\n');
        let minIndent = Infinity;
        lines.forEach(line => {
            if (line.trim().length > 0) {
                const indent = line.match(/^(\s*)/)[1].length;
                minIndent = Math.min(minIndent, indent);
            }
        });
        if (minIndent === Infinity) minIndent = 0;
        lines.forEach((line, index) => {
            if (line.length >= minIndent) {
                line = line.substring(minIndent);
            }
            const lineElement = document.createElement('div');
            let commentIndex = -1;
            if (syntaxType === 'js' && line.includes('//')) {
                commentIndex = line.indexOf('//');
            } else if (syntaxType === 'vb.net' && line.includes("'")) {
                commentIndex = line.indexOf("'");
            }
            if (commentIndex !== -1) {
                const codePart = line.substring(0, commentIndex);
                const commentPart = line.substring(commentIndex);
                if (codePart.trim()) {
                    processCodePart(lineElement, codePart, syntaxType);
                }
                const commentElement = document.createElement('span');
                commentElement.className = 'comment';
                commentElement.textContent = commentPart;
                lineElement.appendChild(commentElement);
            } else {
                processCodePart(lineElement, line, syntaxType);
            }
            codeElement.appendChild(lineElement);
            if (index < lines.length - 1) {
                codeElement.appendChild(document.createTextNode('\n'));
            }
        });
    }
    function processCodePart(parentElement, code, syntaxType) {
        const keywords = {
            'js': ['var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'static'],
            'vb.net': ['Console', 'Object', 'As' , 'Handles', 'End', 'Module', 'Class', 'Dim', 'Private', 'Public', 'Function', 'Sub', 'Return', 'If', 'Else', 'For', 'While', 'Do', 'Select', 'Case', 'Default', 'Exit', 'Continue', 'Class', 'Inherits', 'Import', 'Export', 'Async', 'Await', 'Try', 'Catch', 'Finally', 'Throw', 'New', 'Me', 'MyBase', 'Shared']
        };
        const currentKeywords = keywords[syntaxType] || keywords['js'];
        const tempContainer = document.createElement('div');
        let remainingCode = code;
        const stringRegex = /"([^"]*)"|'([^']*)'/g;
        let match;
        let lastIndex = 0;
        while ((match = stringRegex.exec(remainingCode)) !== null) {
            if (match.index > lastIndex) {
                const textBefore = remainingCode.substring(lastIndex, match.index);
                processText(tempContainer, textBefore, currentKeywords, syntaxType);
            }
            const stringElement = document.createElement('span');
            stringElement.className = 'string';
            stringElement.textContent = match[0];
            tempContainer.appendChild(stringElement);
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < remainingCode.length) {
            const textAfter = remainingCode.substring(lastIndex);
            processText(tempContainer, textAfter, currentKeywords, syntaxType);
        }
        while (tempContainer.firstChild) {
            parentElement.appendChild(tempContainer.firstChild);
        }
    }
    function processText(parentElement, text, keywords, syntaxType) {
        const numberRegex = /\b\d+(\.\d+)?\b/g;
        let match;
        let lastIndex = 0;
        while ((match = numberRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                const textBefore = text.substring(lastIndex, match.index);
                processKeywords(parentElement, textBefore, keywords, syntaxType);
            }
            const numberElement = document.createElement('span');
            numberElement.className = 'number';
            numberElement.textContent = match[0];
            parentElement.appendChild(numberElement);
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
            const textAfter = text.substring(lastIndex);
            processKeywords(parentElement, textAfter, keywords, syntaxType);
        }
    }
    function processKeywords(parentElement, text, keywords, syntaxType) {
        let processedText = text;
        if (syntaxType === 'js') {
            processedText = processedText.replace(/function\s+(\w+)/g, (match, funcName) => {
                return 'function ' + funcName;
            });
        } else if (syntaxType === 'vb.net') {
            processedText = processedText.replace(/Function\s+(\w+)/g, (match, funcName) => {
                return 'Function ' + funcName;
            });
            processedText = processedText.replace(/Sub\s+(\w+)/g, (match, subName) => {
                return 'Sub ' + subName;
            });
        }
        const tokens = processedText.split(/(\s+)/);
        tokens.forEach(token => {
            if (keywords.includes(token)) {
                const keywordElement = document.createElement('span');
                keywordElement.className = 'keyword';
                keywordElement.textContent = token;
                parentElement.appendChild(keywordElement);
            } else if (token.trim() === '') {
                parentElement.appendChild(document.createTextNode(token));
            } else {
                parentElement.appendChild(document.createTextNode(token));
            }
        });
    }
    applyIDEStyleToCode();
    function applyAutoDecrypt() {
        const encryptedElements = document.querySelectorAll('.autodecrypt');
        encryptedElements.forEach(element => {
            if (element.classList.contains('decrypted')) {
                return;
            }
            element.classList.add('decrypted');
            const decryptType = element.getAttribute('name') || 'basecoder';
            const encryptedText = element.textContent.trim();
            if (!encryptedText) {
                return;
            }
            let decryptedText = '';
            try {
                switch (decryptType) {
                    case 'basecoder':
                        decryptedText = basecoderDecode(encryptedText);
                        break;
                    case 'safe62':
                        const bytes = _safe62.decode(encryptedText);
                        decryptedText = new TextDecoder().decode(bytes);
                        break;
                    case 'base64':
                        const binaryStr = atob(encryptedText);
                        const uint8arr = Uint8Array.from([...binaryStr].map(c => c.charCodeAt(0)));
                        decryptedText = new TextDecoder().decode(uint8arr);
                        break;
                    default:
                        decryptedText = '[未知加密类型: ' + decryptType + ']';
                }
            } catch (err) {
                decryptedText = '[解密失败: ' + err.message + ']';
            }
            element.textContent = '';
            const lines = decryptedText.split('\n');
            lines.forEach((line, index) => {
                element.appendChild(document.createTextNode(line));
                if (index < lines.length - 1) {
                    element.appendChild(document.createElement('br'));
                }
            });
        });
    }
    applyAutoDecrypt();
    async function loadVisitorStats() {
        const countElement = document.getElementById('visitor-count');
        const statusElement = document.getElementById('visitor-status');
        if (!countElement || !statusElement) return;
        try {
            const response = await fetch('https://kv.gign.ltd/stats/json');
            if (!response.ok) throw new Error('Failed to fetch stats');            
            const data = await response.json();
            countElement.textContent = data.totalVisitors;
            countElement.classList.add('loaded');
            if (data.isNewVisitor) {
                statusElement.textContent = '新访客';
                statusElement.className = 'visitor-stats-status new-visitor';
            } else {
                statusElement.textContent = '欢迎回来';
                statusElement.className = 'visitor-stats-status returning-visitor';
            }
        } catch (error) {
            console.log('加载访客统计失败:', error);
            countElement.textContent = '--';
            statusElement.textContent = '暂不可用';
            statusElement.className = 'visitor-stats-status error';
        }
    }
    loadVisitorStats();
});