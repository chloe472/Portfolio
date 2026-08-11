let slideIndex = 1;

function openWireframe(image) {
    const lightbox = document.getElementById('wireframe-lightbox');
    const expandedImage = document.getElementById('wireframe-lightbox-image');
    expandedImage.src = image.src;
    expandedImage.alt = image.alt;
    lightbox.classList.add('open');
}

function closeWireframe(event) {
    if (event.target.id === 'wireframe-lightbox' || event.target.classList.contains('wireframe-lightbox-close')) {
        document.getElementById('wireframe-lightbox').classList.remove('open');
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.getElementById('wireframe-lightbox')?.classList.remove('open');
    }
});

function changeUISlide(n) {
    showUISlide(slideIndex += n);
}

function currentUISlide(n) {
    showUISlide(slideIndex = n);
}

function showUISlide(n) {
    const slides = Array.from(document.getElementsByClassName('ui-slide'));
    const dots = Array.from(document.getElementsByClassName('ui-dot'));

    if (!slides.length) {
        return;
    }

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex - 1].classList.add('active');

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    showUISlide(slideIndex);

    document.querySelectorAll('.fade-in').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});
