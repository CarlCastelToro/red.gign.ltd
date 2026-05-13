(function() {
    const siteTheme = localStorage.getItem('siteTheme');
    if (siteTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
    } else if (siteTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    }
    const oldThemeLinks = document.querySelectorAll('#dark-theme, #light-theme');
    oldThemeLinks.forEach(link => link.remove());
})();
let alertZIndex = 9999; 
let alertIdCounter = 0; 
let alertInstances = []; 
/**
 * 全局居中弹窗函数（支持多弹窗叠加+最早弹窗置顶+独立背景层）
 * @param {string} content - 弹窗显示的内容（支持\n换行）
 * @param {object} options - 可选配置项
 * @param {string} options.icon - 自定义图标（默认!，可选√/?/其他符号）
 * @param {string} options.iconColor - 图标颜色（默认#ff6b6b，可传十六进制/rgb等）
 * @param {function} callback - 点击确认按钮后的回调函数（可选）
 * @returns {number} - 弹窗ID（可用于手动关闭）
 */
function showCenterAlert(content, options = {}, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    const alertId = ++alertIdCounter;
    alertZIndex -= 1; 
    const currentZIndex = alertZIndex;
    const defaultOptions = {
        icon: '!',
        iconColor: '#ff6b6b'
    };
    const config = { ...defaultOptions, ...options };
    const iconColorMap = {
        '!': '#ff6b6b', 
        '√': '#4CAF50', 
        '?': '#2196F3',
        'ℹ': '#FF9800',
        '×': '#f44336'
    };
    if (!options.iconColor && iconColorMap[config.icon]) {
        config.iconColor = iconColorMap[config.icon];
    }
    const overlay = document.createElement('div');
    overlay.id = `alertOverlay_${alertId}`;
    overlay.dataset.alertId = alertId;
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7); /* 独立半透明背景 */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: ${currentZIndex}; /* 层级递减，最早的在最顶 */
        backdrop-filter: blur(2px);
        opacity: 0; /* 渐入动画 */
        transition: opacity 0.2s ease;
    `;
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        width: auto;
        max-width: 90vw;
        background-color: var(--light-bg, #fff);
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        color: var(--text-color, #333);
        transform: scale(0.95); /* 缩放动画 */
        transition: transform 0.2s ease;
    `;
    const alertIcon = document.createElement('div');
    alertIcon.style.cssText = `
        font-size: 40px;
        color: ${config.iconColor};
        font-weight: bold;
        line-height: 1;
    `;
    alertIcon.textContent = config.icon;
    const alertContent = document.createElement('div');
    alertContent.style.cssText = `
        text-align: center;
        font-size: 16px;
        line-height: 1.5;
        word-break: break-word;
        white-space: pre-line; /* \n换行生效 */
    `;
    alertContent.textContent = content || '操作提示';
    const confirmBtn = document.createElement('button');
    confirmBtn.style.cssText = `
        padding: 8px 24px;
        background-color: var(--button-bg-color, #2196f3);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
        margin-top: 8px;
    `;
    confirmBtn.textContent = '确认';
    confirmBtn.addEventListener('mouseover', () => {
        confirmBtn.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--button-hover-bg-color') || '#1976d2';
    });
    confirmBtn.addEventListener('mouseout', () => {
        confirmBtn.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--button-bg-color') || '#2196f3';
    });
    const closeAlert = () => {
        overlay.style.opacity = 0;
        alertBox.style.transform = 'scale(0.95)';
        setTimeout(() => {
            overlay.remove();
            alertInstances = alertInstances.filter(item => item.id !== alertId);
            if (typeof callback === 'function') {
                callback();
            }
        }, 200);
    };
    confirmBtn.addEventListener('click', closeAlert);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAlert();
    });
    alertBox.appendChild(alertIcon);
    alertBox.appendChild(alertContent);
    alertBox.appendChild(confirmBtn);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    alertInstances.unshift({ id: alertId, overlay });
    setTimeout(() => {
        overlay.style.opacity = 1;
        alertBox.style.transform = 'scale(1)';
    }, 10);
    confirmBtn.focus();
    return alertId;
}
/**
 * 手动关闭指定弹窗（可选扩展函数）
 * @param {number} alertId - 弹窗ID（showCenterAlert返回的值）
 */
function closeAlertById(alertId) {
    const overlay = document.getElementById(`alertOverlay_${alertId}`);
    if (overlay) {
        overlay.click();
    }
}
const _safe62 = (function() {
    const CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const BASE = 62;
    const CHAR_TO_VALUE = new Map();
    for (let i = 0; i < CHAR_SET.length; i++) CHAR_TO_VALUE.set(CHAR_SET[i], i);
    class Safe62Encoder {
        constructor() {
            this.blocks = [];
            this.currentBlock = 0n;
            this.blockSize = 0;
            this.totalLength = 0;
        }
        addData(data) {
            for (const b of data) {
                this.currentBlock = (this.currentBlock << 8n) | BigInt(b);
                this.blockSize++;
                this.totalLength++;
                if (this.blockSize >= 256) this._flush();
            }
        }
        _flush() {
            if (!this.blockSize) return;
            let num = this.currentBlock, enc = "";
            if (num === 0n) enc = CHAR_SET[0];
            else while (num > 0n) {
                const r = Number(num % BigInt(BASE));
                enc = CHAR_SET[r] + enc;
                num /= BigInt(BASE);
            }
            this.blocks.push({ s: this.blockSize, d: enc });
            this.currentBlock = 0n;
            this.blockSize = 0;
        }
        _len(n) {
            const buf = [];
            if (n === 0) buf.push(0);
            else while (n > 0) {
                let b = n & 0x7F;
                n >>= 7;
                if (n > 0) b |= 0x80;
                buf.push(b);
            }
            return buf.map(b => CHAR_SET[Math.floor(b / BASE)] + CHAR_SET[b % BASE]).join("");
        }
        _hdr(s) {
            return CHAR_SET[Math.floor(s / BASE)] + CHAR_SET[s % BASE];
        }
        end() {
            this._flush();
            let out = this._len(this.totalLength);
            for (const b of this.blocks) out += this._hdr(b.s) + b.d;
            return out;
        }
    }
    class Safe62Decoder {
        constructor(s) { this.s = s; this.p = 0; }
        decode() {
            const total = this._dlen();
            const out = [];
            let dec = 0;
            while (dec < total && this.p < this.s.length) {
                const size = this._dhdr();
                const data = this._dblk();
                out.push(...this._ddata(data, size));
                dec += size;
            }
            return new Uint8Array(out.slice(0, total));
        }
        _dlen() {
            let r = 0, sh = 0;
            while (this.p < this.s.length) {
                const h = CHAR_TO_VALUE.get(this.s[this.p]);
                const l = CHAR_TO_VALUE.get(this.s[this.p + 1]);
                if (h === undefined || l === undefined) break;
                const b = h * BASE + l;
                this.p += 2;
                r |= (b & 0x7F) << sh;
                sh += 7;
                if (!(b & 0x80)) break;
            }
            return r;
        }
        _dhdr() {
            const h = CHAR_TO_VALUE.get(this.s[this.p]);
            const l = CHAR_TO_VALUE.get(this.s[this.p + 1]);
            this.p += 2;
            return h * BASE + l;
        }
        _dblk() {
            const st = this.p;
            while (this.p < this.s.length && CHAR_TO_VALUE.has(this.s[this.p])) this.p++;
            return this.s.slice(st, this.p);
        }
        _ddata(enc, exp) {
            let n = 0n;
            for (const c of enc) n = n * BigInt(BASE) + BigInt(CHAR_TO_VALUE.get(c));
            const b = [];
            while (n > 0n) {
                b.unshift(Number(n & 0xFFn));
                n >>= 8n;
            }
            while (b.length < exp) b.unshift(0);
            return b;
        }
    }
    return {
        encode(input) {
            const e = new Safe62Encoder();
            e.addData(typeof input === "string" ? new TextEncoder().encode(input) : input);
            return e.end();
        },
        decode(str) {
            return new Safe62Decoder(str).decode();
        }
    };
})();
/**
 * 编码：文本 → UTF-8 → Base64 → Safe62
 * @param {string} text - 要编码的文本
 * @returns {string} Safe62 编码后的字符串
 */
function basecoderEncode(text) {
    const uint8 = new TextEncoder().encode(text);
    const b64 = btoa(String.fromCharCode(...uint8));
    return _safe62.encode(b64);
}
/**
 * 解码：Safe62 → Base64 → UTF-8 → 文本
 * @param {string} str - Safe62 编码的字符串
 * @returns {string} 解码后的原始文本
 */
function basecoderDecode(str) {
    const b64Uint8 = _safe62.decode(str);
    const b64 = new TextDecoder().decode(b64Uint8);
    const binary = atob(b64);
    return new TextDecoder().decode(
        Uint8Array.from([...binary].map(c => c.charCodeAt(0)))
    );
}