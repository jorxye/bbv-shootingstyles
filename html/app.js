(() => {
    'use strict';

    const resourceName = typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'jx-shootingstyles';

    const app = document.getElementById('app');
    const panel = document.getElementById('panel');
    const closeButton = document.getElementById('close');
    const stylesContainer = document.getElementById('styles');
    const template = document.getElementById('style-card-template');
    const eyebrow = document.getElementById('eyebrow');
    const title = document.getElementById('menu-title');
    const subtitle = document.getElementById('menu-subtitle');
    const footerClose = document.getElementById('footer-close');
    const footerHint = document.getElementById('footer-hint');
    const statusText = document.getElementById('status');
    const dragHandle = document.getElementById('drag-handle');

    let selectedStyle = 1;
    let locale = {};
    let isOpen = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let appStartX = 0;
    let appStartY = 0;

    const t = (key, fallback = '') => locale[key] || fallback;

    const hardHide = () => {
        isOpen = false;
        isDragging = false;
        app.classList.remove('is-open');
        app.setAttribute('aria-hidden', 'true');
        panel.classList.remove('is-dragging');
        app.style.left = '50%';
        app.style.top = '50%';
        app.style.transform = 'translate(-50%, -50%) scale(0.985)';
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
    };

    const post = async (eventName, payload = {}) => {
        try {
            const response = await fetch(`https://${resourceName}/${eventName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(payload),
            });

            return await response.json().catch(() => ({}));
        } catch (error) {
            return { ok: false, error: String(error) };
        }
    };

    const setCssVar = (name, value) => {
        if (typeof value === 'string' && value.trim().length > 0) {
            document.documentElement.style.setProperty(name, value.trim());
        }
    };

    const applyTheme = (theme = {}) => {
        setCssVar('--accent', theme.accent);
        setCssVar('--accent-rgb', theme.accentRgb);
        setCssVar('--accent-second', theme.accentSecond);
        setCssVar('--accent-second-rgb', theme.accentSecondRgb);
        setCssVar('--success', theme.success);
        setCssVar('--success-rgb', theme.successRgb);
    };

    const resetPosition = () => {
        app.style.left = '50%';
        app.style.top = '50%';
        app.style.transform = 'translate(-50%, -50%) scale(1)';
    };

    const openMenu = () => {
        resetPosition();
        isOpen = true;
        app.classList.add('is-open');
        app.setAttribute('aria-hidden', 'false');

        requestAnimationFrame(() => {
            try {
                closeButton.focus({ preventScroll: true });
            } catch (_) {
                closeButton.focus();
            }
        });
    };

    const closeMenu = async () => {
        hardHide();
        await post('exit');
    };

    const markSelected = () => {
        document.querySelectorAll('.style-card').forEach((card) => {
            const isSelected = Number(card.dataset.style) === Number(selectedStyle);
            card.classList.toggle('is-selected', isSelected);
            card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
    };

    const applyStyle = async (styleId) => {
        const previousStyle = selectedStyle;
        selectedStyle = Number(styleId);
        markSelected();
        statusText.textContent = t('selecting', 'Applying...');

        const result = await post('changestyle', { style: selectedStyle });

        if (result && result.ok === false) {
            selectedStyle = previousStyle;
            markSelected();
            statusText.textContent = t('error', 'Error');
            return;
        }

        statusText.textContent = t('selected', 'Applied');
    };

    const renderStyles = (styles) => {
        stylesContainer.innerHTML = '';

        styles.forEach((style) => {
            const node = template.content.firstElementChild.cloneNode(true);
            const imageWrap = node.querySelector('.image-wrap');
            const image = node.querySelector('.style-image');
            const badge = node.querySelector('.selected-badge');

            node.dataset.style = style.id;
            node.querySelector('.style-title').textContent = style.label || `${t('style_fallback', 'Style')} ${style.id}`;
            node.querySelector('.style-description').textContent = style.description || '';
            badge.textContent = t('selected', 'Applied');

            if (style.image) {
                image.src = style.image;
                image.alt = style.label || '';
            } else if (imageWrap) {
                imageWrap.remove();
            }

            node.addEventListener('click', () => applyStyle(style.id));
            stylesContainer.appendChild(node);
        });

        markSelected();
    };

    const applyLocale = (lang) => {
        document.documentElement.lang = lang || 'es';
        document.title = t('title', 'Shooting styles');
        eyebrow.textContent = t('eyebrow', 'Weapon stance');
        title.textContent = t('title', 'Shooting styles');
        subtitle.textContent = t('subtitle', 'Choose how your character aims and shoots.');
        footerClose.textContent = t('footer_close', 'ESC to close');
        footerHint.textContent = t('drag_hint', 'Drag to move');
        statusText.textContent = t('ready', 'Ready');
        closeButton.setAttribute('aria-label', t('close_aria', t('close', 'Close')));
        closeButton.setAttribute('title', t('close', 'Close'));
    };

    const startDrag = (event) => {
        if (!isOpen || event.target.closest('button')) return;

        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        const rect = app.getBoundingClientRect();
        appStartX = rect.left;
        appStartY = rect.top;

        panel.classList.add('is-dragging');
    };

    const onDrag = (event) => {
        if (!isDragging) return;

        const nextX = appStartX + event.clientX - dragStartX;
        const nextY = appStartY + event.clientY - dragStartY;
        const maxX = window.innerWidth - app.offsetWidth;
        const maxY = window.innerHeight - app.offsetHeight;

        app.style.left = `${Math.min(Math.max(nextX, 8), Math.max(maxX - 8, 8))}px`;
        app.style.top = `${Math.min(Math.max(nextY, 8), Math.max(maxY - 8, 8))}px`;
        app.style.transform = 'none';
    };

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        panel.classList.remove('is-dragging');
    };

    window.addEventListener('message', (event) => {
        const data = event.data || {};

        if (data.action === 'openMenu') {
            locale = data.locale || {};
            selectedStyle = data.selected || 1;
            applyTheme(data.theme || {});
            applyLocale(data.lang);
            renderStyles(data.styles || []);
            openMenu();
            return;
        }

        if (data.action === 'closeMenu' || data.action === 'forceClose') {
            hardHide();
            return;
        }

        if (data.action === 'setSelected') {
            selectedStyle = data.selected || selectedStyle;
            markSelected();
        }
    });

    closeButton.addEventListener('click', closeMenu);
    dragHandle.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('blur', stopDrag);

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });

    window.addEventListener('DOMContentLoaded', hardHide);
    window.addEventListener('load', () => {
        if (!isOpen) hardHide();
    });

    hardHide();
})();
