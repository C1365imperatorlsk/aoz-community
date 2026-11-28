/* The hidden #lang value keeps the application's existing change pipeline intact. */
const HubLanguagePicker = (() => {
  'use strict';
  const languages = [
    ['ru', 'Русский'], ['en', 'English'], ['es', 'Español'], ['vi', 'Tiếng Việt'],
    ['ar', 'العربية'], ['zh', '繁體中文'], ['hr', 'Hrvatski'], ['it', 'Italiano']
  ];
  const words = {
    ru: {title: 'Язык приложения', change: 'Выбрать язык', close: 'Закрыть выбор языка'},
    en: {title: 'App language', change: 'Choose language', close: 'Close language selection'},
    es: {title: 'Idioma de la aplicación', change: 'Elegir idioma', close: 'Cerrar selección de idioma'},
    vi: {title: 'Ngôn ngữ ứng dụng', change: 'Chọn ngôn ngữ', close: 'Đóng bảng chọn ngôn ngữ'},
    ar: {title: 'لغة التطبيق', change: 'اختيار اللغة', close: 'إغلاق اختيار اللغة'},
    zh: {title: '應用程式語言', change: '選擇語言', close: '關閉語言選單'},
    hr: {title: 'Jezik aplikacije', change: 'Odaberi jezik', close: 'Zatvori odabir jezika'},
    it: {title: 'Lingua dell’app', change: 'Scegli lingua', close: 'Chiudi selezione lingua'}
  };
  function install({host, state, document: doc = document, window: win = window}) {
    const make = (tag, cls, text) => {
      const el = doc.createElement(tag);
      if (cls) el.className = cls;
      if (text !== undefined) el.textContent = text;
      return el;
    };
    function icon(path, cls) {
      const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', cls); svg.setAttribute('aria-hidden', 'true');
      const shape = doc.createElementNS('http://www.w3.org/2000/svg', 'path'); shape.setAttribute('d', path); svg.append(shape);
      return svg;
    }
    const globe = () => icon('M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z', 'hlpGlobe');
    const trigger = make('button', 'hlpTrigger'), current = make('bdi', 'hlpCurrent');
    trigger.id = 'hubLanguageToggle'; trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'dialog'); trigger.setAttribute('aria-expanded', 'false'); trigger.setAttribute('aria-controls', 'hubLanguageDialog');
    current.dir = 'auto';
    trigger.append(globe(), current, icon('m7 10 5 5 5-5', 'hlpChevron'));
    host.append(trigger); host.closest('header')?.classList.add('hubLanguageHeader');
    const overlay = make('div', 'hlpOverlay'); overlay.hidden = true;
    const panel = make('div', 'hlpPanel'); panel.id = 'hubLanguageDialog';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'hubLanguageTitle');
    const header = make('div', 'hlpHeading'), title = make('h2'); title.id = 'hubLanguageTitle';
    const closeButton = make('button', 'hlpClose'); closeButton.type = 'button';
    closeButton.append(icon('m6 6 12 12M18 6 6 18', 'hlpCross'));
    header.append(globe(), title, closeButton);
    const list = make('div', 'hlpList'); list.setAttribute('role', 'listbox'); list.setAttribute('aria-labelledby', title.id);
    const options = languages.map(([code, label], i) => {
      const option = make('button', 'hlpOption'), name = make('span', 'hlpName', label);
      option.type = 'button'; option.dataset.language = code;
      option.setAttribute('role', 'option'); option.tabIndex = -1;
      name.lang = code === 'zh' ? 'zh-Hant' : code; name.dir = 'auto';
      option.append(name, icon('m5 12 4 4L19 6', 'hlpCheck'));
      option.onclick = () => choose(code); list.append(option); return option;
    });
    panel.append(header, list); overlay.append(panel); doc.body.append(overlay);
    let opened = false, closeTimer = null, openingFrame = null, focused = 0, previousOverflow = '', previousInert = false;
    const background = doc.querySelector('main');
    const copy = () => words[state.value] || words.en;
    const reduced = () => win.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    function sync() {
      const active = Math.max(0, languages.findIndex(([code]) => code === state.value));
      const text = copy();
      current.textContent = languages[active][1]; current.lang = languages[active][0] === 'zh' ? 'zh-Hant' : languages[active][0];
      trigger.setAttribute('aria-label', text.change + ': ' + languages[active][1]);
      title.textContent = text.title; closeButton.setAttribute('aria-label', text.close);
      panel.dir = state.value === 'ar' ? 'rtl' : 'ltr'; panel.lang = state.value === 'zh' ? 'zh-Hant' : state.value;
      options.forEach((option, i) => option.setAttribute('aria-selected', String(i === active)));
      focused = active; options.forEach((option, i) => {option.tabIndex = i === focused ? 0 : -1;});
    }
    function viewport() {
      const height = win.visualViewport?.height || win.innerHeight;
      if (Number.isFinite(height) && height > 0) overlay.style.setProperty('--hlp-height', height + 'px');
    }
    function open() {
      if (opened) return;
      if (closeTimer !== null) win.clearTimeout(closeTimer);
      closeTimer = null; opened = true; sync(); viewport();
      previousOverflow = doc.body.style.overflow; doc.body.style.overflow = 'hidden';
      previousInert = background?.inert === true;
      if (background && 'inert' in background) background.inert = true;
      overlay.hidden = false; trigger.setAttribute('aria-expanded', 'true');
      openingFrame = win.requestAnimationFrame(() => {openingFrame = null; if (opened) overlay.classList.add('is-open');});
      options[focused].focus({preventScroll: true});
      options[focused].scrollIntoView({block: 'nearest'});
    }
    function close() {
      if (!opened) return;
      opened = false;
      if (openingFrame !== null) win.cancelAnimationFrame(openingFrame);
      openingFrame = null; overlay.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = previousOverflow;
      if (background && 'inert' in background) background.inert = previousInert;
      trigger.focus({preventScroll: true});
      closeTimer = win.setTimeout(() => {closeTimer = null; if (!opened) overlay.hidden = true;}, reduced() ? 0 : 180);
    }
    function choose(code) {
      if (!languages.some(([value]) => value === code)) return;
      state.value = code;
      state.dispatchEvent(new win.Event('change', {bubbles: true}));
      sync(); close();
    }
    function focusOption(index) {
      focused = (index + options.length) % options.length;
      options.forEach((option, i) => {option.tabIndex = i === focused ? 0 : -1;});
      options[focused].focus({preventScroll: true}); options[focused].scrollIntoView({block: 'nearest'});
    }
    trigger.onclick = () => opened ? close() : open(); closeButton.onclick = close;
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault(); open();}
    });
    overlay.addEventListener('click', event => {if (event.target === overlay) close();});
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); close(); return;}
      if (event.key === 'Tab') {
        event.preventDefault();
        if (doc.activeElement === closeButton) options[focused].focus(); else closeButton.focus();
        return;
      }
      if (!options.includes(doc.activeElement)) return;
      const target = {ArrowDown: focused + 1, ArrowUp: focused - 1, Home: 0, End: options.length - 1}[event.key];
      if (target !== undefined) {event.preventDefault(); focusOption(target);}
    });
    state.addEventListener('change', sync);
    win.addEventListener('resize', viewport, {passive: true});
    win.visualViewport?.addEventListener('resize', viewport, {passive: true});
    sync();
    return Object.freeze({sync, open, close});
  }
  return Object.freeze({install});
})();
