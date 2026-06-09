(() => {
    'use strict';

    const resourceName = typeof GetParentResourceName === 'function' ? GetParentResourceName() : 'jx-shootingstyles';
    const menu = document.getElementById('menu');
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
    let panelStartX = 0;
    let panelStartY = 0;

    const t = (key, fallback = '') => locale[key] || fallback;

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

    const initializeClosedState = () => {
        menu.classList.remove('is-visible');
        menu.setAttribute('aria-hidden', 'true');
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
    };

    const applyTheme = (theme = {}) => {
        setCssVar('--accent', theme.accent);
        setCssVar('--accent-rgb', theme.accentRgb);
        setCssVar('--accent-second', theme.accentSecond);
        setCssVar('--accent-second-rgb', theme.accentSecondRgb);
        setCssVar('--success', theme.success);
        setCssVar('--success-rgb', theme.successRgb);
        setCssVar('--danger', theme.danger);
        setCssVar('--danger-rgb', theme.dangerRgb);
    };

    const setOpen = (state) => {
        isOpen = state;
        menu.classList.toggle('is-visible', state);
        menu.setAttribute('aria-hidden', state ? 'false' : 'true');
    };

    const focusCloseButton = () => {
        try {
            closeButton.focus({ preventScroll: true });
        } catch (_) {
            closeButton.focus();
        }
    };

    const resetPanelPosition = () => {
        panel.style.left = '50%';
        panel.style.top = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
    };

    const openMenu = () => {
        resetPanelPosition();
        setOpen(true);
        requestAnimationFrame(focusCloseButton);
    };

    const closeMenu = async () => {
        if (!isOpen && !menu.classList.contains('is-visible')) return;
        setOpen(false);
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
            const media = node.querySelector('.style-card__media');
            const image = node.querySelector('.style-card__image');
            const badge = node.querySelector('.style-card__badge');

            node.dataset.style = style.id;
            node.querySelector('.style-card__title').textContent = style.label || `${t('style_fallback', 'Style')} ${style.id}`;
            node.querySelector('.style-card__description').textContent = style.description || '';
            badge.textContent = t('selected', 'Applied');

            if (style.image) {
                image.src = style.image;
                image.alt = style.label || '';
            } else {
                media.remove();
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
        if (event.target.closest('button')) return;

        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        const rect = panel.getBoundingClientRect();
        panelStartX = rect.left;
        panelStartY = rect.top;

        panel.classList.add('is-dragging');
    };

    const onDrag = (event) => {
        if (!isDragging) return;

        const nextX = panelStartX + event.clientX - dragStartX;
        const nextY = panelStartY + event.clientY - dragStartY;
        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;

        panel.style.left = `${Math.min(Math.max(nextX, 8), Math.max(maxX - 8, 8))}px`;
        panel.style.top = `${Math.min(Math.max(nextY, 8), Math.max(maxY - 8, 8))}px`;
        panel.style.transform = 'none';
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

        if (data.action === 'closeMenu') {
            setOpen(false);
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

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });


    window.addEventListener('DOMContentLoaded', initializeClosedState);
    window.addEventListener('load', initializeClosedState);
    initializeClosedState();
})();
