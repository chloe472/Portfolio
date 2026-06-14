(function () {
    const header = document.querySelector('.header');
    const sections = Array.from(document.querySelectorAll('section'));

    if (!header || !sections.length) {
        return;
    }

    const usedIds = new Set(Array.from(document.querySelectorAll('[id]'), element => element.id));

    function toSlug(text) {
        return text
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function ensureId(element, label, fallback) {
        if (element.id) {
            return element.id;
        }

        const base = toSlug(label) || fallback;
        let id = `project-${base}`;
        let suffix = 2;

        while (usedIds.has(id)) {
            id = `project-${base}-${suffix}`;
            suffix += 1;
        }

        element.id = id;
        usedIds.add(id);
        return id;
    }

    function getSectionLabel(section, index) {
        if (section.classList.contains('overview-section')) {
            return 'Overview';
        }

        const heading = section.querySelector('.section-header, .section-title, h2');
        if (heading && heading.textContent.trim()) {
            return heading.textContent.trim();
        }

        return `Section ${index + 1}`;
    }

    const navItems = [
        {
            target: header,
            label: 'Top',
            id: ensureId(header, 'top', 'top')
        }
    ];

    sections.forEach((section, index) => {
        const label = getSectionLabel(section, index);
        navItems.push({
            target: section,
            label,
            id: ensureId(section, label, `section-${index + 1}`)
        });
    });

    if (navItems.length < 2) {
        return;
    }

    const nav = document.createElement('nav');
    nav.className = 'project-section-nav';
    nav.setAttribute('aria-label', 'Project sections');

    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = `#${item.id}`;
        link.textContent = item.label;
        link.addEventListener('click', event => {
            event.preventDefault();
            item.target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        nav.appendChild(link);
        item.link = link;
    });

    document.body.insertBefore(nav, document.body.firstChild);

    function updateActiveSection() {
        const marker = window.scrollY + window.innerHeight * 0.35;
        const isAtPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
        let activeItem = navItems[0];

        navItems.forEach(item => {
            if (item.target.offsetTop <= marker) {
                activeItem = item;
            }
        });

        if (isAtPageBottom) {
            activeItem = navItems[navItems.length - 1];
        }

        navItems.forEach(item => {
            const isActive = item === activeItem;
            item.link.classList.toggle('is-active', isActive);

            if (isActive) {
                item.link.setAttribute('aria-current', 'location');
            } else {
                item.link.removeAttribute('aria-current');
            }
        });
    }

    let ticking = false;

    function requestNavUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
        });
    }

    window.addEventListener('scroll', requestNavUpdate, { passive: true });
    window.addEventListener('resize', requestNavUpdate);
    updateActiveSection();
}());
