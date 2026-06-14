// Injected at deploy from GitHub secret WEB3FORMS_ACCESS_KEY (local dev: replace placeholder or use Actions)
const WEB3FORMS_ACCESS_KEY = '__WEB3FORMS_ACCESS_KEY__';

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0,
    rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const sectionNavLinks = Array.from(document.querySelectorAll('[data-section-link]'));
const sectionTargets = sectionNavLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function updateActiveSection() {
    if (!sectionTargets.length) {
        return;
    }

    const marker = window.scrollY + window.innerHeight * 0.35;
    const isAtPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    let activeSection = sectionTargets[0];

    sectionTargets.forEach(section => {
        if (section.offsetTop <= marker) {
            activeSection = section;
        }
    });

    if (isAtPageBottom) {
        activeSection = sectionTargets[sectionTargets.length - 1];
    }

    sectionNavLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${activeSection.id}`;
        link.classList.toggle('is-active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

let sectionNavTicking = false;

function requestSectionNavUpdate() {
    if (sectionNavTicking) {
        return;
    }

    sectionNavTicking = true;
    window.requestAnimationFrame(() => {
        updateActiveSection();
        sectionNavTicking = false;
    });
}

window.addEventListener('scroll', requestSectionNavUpdate, { passive: true });
window.addEventListener('resize', requestSectionNavUpdate);
updateActiveSection();

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.section-decoration');

    parallax.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
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

function navigateToAuroraMart() {
    window.open('./auroramart/auroramart.html', '_blank');
}

function navigateToImpactHub() {
    window.open('./impacthub/impacthub.html', '_blank');
}

function navigateToLaundryDash() {
    window.open('./laundrydash/laundrydash.html', '_blank');
}

function navigateToPersonalFinance() {
    window.open('./personalfinance/personalfinance.html', '_blank');
}

function navigateToIRR() {
    window.open('./irr/irr.html', '_blank');
}

function navigateToConvoPal() {
    window.open('./convopal_case_study/convopal_case_study.html', '_blank');
}

function navigateToWomenInTech() {
    window.open('./women_in_tech/women_in_tech.html', '_blank');
}

function navigateToNUSPickleball() {
    window.open('./nus_pickleball/nus_pickleball.html', '_blank');
}

function navigateToMigrantWorkers() {
    window.open('./migrant_workers/migrant_workers.html', '_blank');
}

function navigateToClubRainbow() {
    window.open('./club_rainbow/club_rainbow.html', '_blank');
}
