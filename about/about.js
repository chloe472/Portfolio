const WEB3FORMS_ACCESS_KEY = '__WEB3FORMS_ACCESS_KEY__';

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

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === '__WEB3FORMS_ACCESS_KEY__') {
        alert('Contact form is not configured for local preview. It works after deploy via GitHub Actions.');
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
                access_key: WEB3FORMS_ACCESS_KEY,
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
