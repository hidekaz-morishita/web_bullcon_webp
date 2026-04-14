document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recruit-form');
    
    // バリデーションルール
    const rules = {
        'job_type': {
            required: true,
            messageId: 'error-job_type'
        },
        'name': {
            required: true,
            messageId: 'error-name'
        },
        'kana': {
            required: true,
            pattern: /^[ァ-ヶー\s]+$/,
            messageId: 'error-kana'
        },
        'zip': {
            required: true,
            pattern: /^\d{7}$/,
            messageId: 'error-zip'
        },
        'adress': {
            required: true,
            messageId: 'error-adress'
        },
        'tel': {
            required: true,
            messageId: 'error-tel'
        },
        'mailaddress': {
            required: true,
            type: 'email',
            messageId: 'error-mailaddress'
        },
        'mailaddress2': {
            required: true,
            match: 'mailaddress',
            messageId: 'error-mailaddress2'
        }
    };

    form.addEventListener('submit', (e) => {
        let hasError = false;

        // 全てのエラー表示をリセット
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.input-area input, .input-area select, .input-area textarea').forEach(el => el.classList.remove('error'));

        // 各項目のチェック
        for (const [name, rule] of Object.entries(rules)) {
            const input = form.elements[name];
            if (!input) continue;

            let value = input.value.trim();
            let isItemError = false;

            // 必須チェック
            if (rule.required && value === '') {
                isItemError = true;
            }
            // パターンチェック（カタカナ、郵便番号など）
            else if (rule.pattern && !rule.pattern.test(value)) {
                isItemError = true;
            }
            // メール形式チェック
            else if (rule.type === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                isItemError = true;
            }
            // 一致チェック（メールアドレス確認）
            else if (rule.match && value !== form.elements[rule.match].value.trim()) {
                isItemError = true;
            }

            if (isItemError) {
                const errorEl = document.getElementById(rule.messageId);
                if (errorEl) errorEl.style.display = 'block';
                input.classList.add('error');
                hasError = true;
            }
        }

        if (hasError) {
            e.preventDefault();
            // 最初のエラー項目へスクロール
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // 入力時にエラーを消す（UX向上）
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const rule = rules[input.name];
            if (rule) {
                const errorEl = document.getElementById(rule.messageId);
                if (errorEl) errorEl.style.display = 'none';
            }
        });
    });
});
