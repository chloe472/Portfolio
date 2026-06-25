// Injected at deploy from GitHub secret WEB3FORMS_ACCESS_KEY.
// Local preview can use ../web3forms.local.js, which is ignored by git.
const WEB3FORMS_ACCESS_KEY = '__WEB3FORMS_ACCESS_KEY__';
const localWeb3FormsConfig = loadLocalWeb3FormsConfig('../web3forms.local.js');

function isLocalPreview() {
    return window.location.protocol === 'file:' ||
        ['localhost', '127.0.0.1', '::1', ''].includes(window.location.hostname);
}

function hasInjectedWeb3FormsKey() {
    return WEB3FORMS_ACCESS_KEY && !WEB3FORMS_ACCESS_KEY.startsWith('__WEB3FORMS_');
}

function loadLocalWeb3FormsConfig(configPath) {
    if (!isLocalPreview() || hasInjectedWeb3FormsKey()) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = document.currentScript ? new URL(configPath, document.currentScript.src).href : configPath;
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });
}

function getWeb3FormsAccessKey() {
    if (typeof window.WEB3FORMS_ACCESS_KEY === 'string' && window.WEB3FORMS_ACCESS_KEY.trim()) {
        return window.WEB3FORMS_ACCESS_KEY.trim();
    }

    return hasInjectedWeb3FormsKey() ? WEB3FORMS_ACCESS_KEY.trim() : '';
}

function getMissingWeb3FormsMessage() {
    if (isLocalPreview()) {
        return 'Contact form is not configured for local preview. Copy web3forms.local.example.js to web3forms.local.js and add your Web3Forms access key.';
    }

    return 'Contact form is not configured on this deployment. Check that the GitHub secret WEB3FORMS_ACCESS_KEY is set and that GitHub Pages is deploying with GitHub Actions.';
}

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.fade-in').forEach(element => {
    fadeObserver.observe(element);
});

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.textContent;
    await localWeb3FormsConfig;
    const accessKey = getWeb3FormsAccessKey();

    if (!accessKey) {
        alert(getMissingWeb3FormsMessage());
        return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                name: form.elements.name.value,
                email: form.elements.email.value,
                message: form.elements.message.value,
                subject: 'New portfolio contact form message',
                from_name: 'Portfolio Contact Form'
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            btn.textContent = 'Sent!';
            form.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 3000);
        } else {
            throw new Error(data.message || 'Something went wrong. Please try again.');
        }
    } catch (err) {
        btn.textContent = 'Failed - try again';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 3000);
    }
}
