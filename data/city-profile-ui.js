const CityProfileUI = (() => {
  'use strict';
  function install({root, meta, table, engines, lang, buildingName, resourceNames, fmt, storage}) {
    const loaded = CityProfile.load(storage, meta);
    let data = loaded.data, status = loaded.state, pending = null, fileRequest = 0;
    const node = (tag, cls, text) => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text !== undefined) el.textContent = text;
      return el;
    };
    const w = () => cityProfileWords[lang()] || cityProfileWords.en;
    const profile = () => data.profiles[data.version];
    let saveLabel, result, transfer, textArea, message;
    function button(text, action) {
      const b = node('button', 'cpButton', text); b.type = 'button'; b.onclick = action; return b;
    }
    function labelStatus() {
      saveLabel.textContent = w()[status === 'saved' ? 'saved' : status === 'new' ? 'fresh' : status === 'loadError' ? 'loadError' : 'saveError'];
      saveLabel.className = 'cpStatus' + (status.endsWith('Error') ? ' warn' : '');
    }
    function save() {
      pending = null; fileRequest++; transfer?.replaceChildren();
      status = CityProfile.save(storage, data, meta) ? 'saved' : 'saveError';
      labelStatus();
    }
    function select(parent, title, key, values, value, onChange) {
      const label = node('label', 'cpField', title), input = node('select');
      input.dataset.cityField = key;
      for (const [v, text] of values) input.add(new Option(text, v === null ? '' : String(v)));
      input.value = value === null ? '' : String(value);
      input.onchange = () => onChange(input.value === '' ? null : Number(input.value));
      label.append(input); parent.append(label); return input;
    }
    function renderResult() {
      const words = w(), p = profile(), names = resourceNames();
      result.replaceChildren(node('h3', '', words.result));
      const estimate = CityProfile.estimate(p, meta, table, engines);
      if (estimate.state !== 'ready') {
        result.append(node('p', estimate.state === 'invalidLevels' ? 'warn' : '', words[estimate.state]));
        if (estimate.invalid) result.append(node('p', '', estimate.invalid.map(buildingName).join(' · ')));
        return;
      }
      const {plan, assumed, lower, current} = estimate;
      const incomplete = plan.missing.length > 0 || plan.cycles.length > 0;
      result.append(node('p', 'cpRange', fmt(p.levels.main) + ' → ' + fmt(p.target)));
      if (!plan.steps.length) result.append(node('p', '', words.complete));
      if (incomplete) result.append(node('p', 'warn', words.partial));
      if (plan.review.length) result.append(node('p', 'warn', words.note));
      for (const [keys, key] of [[assumed, 'assumed'], [lower, 'lower']]) {
        if (keys.length) result.append(node('p', 'cpNotice', words[key] + ' ' + keys.map(k => buildingName(k) + ' ' + fmt(current[k] || 0)).join(' · ')));
      }
      const grid = node('div', 'cpBudget');
      for (const [i, line] of CityProfile.budget(plan, p.stock).entries()) {
        if (i === 5 && line.cost === 0 && !incomplete) continue;
        const card = node('div', 'cpResource'); card.dataset.cityResource = String(i);
        card.append(node('h4', '', names[i]));
        const missing = !incomplete && line.cost === 0 ? words.enough : line.have === null ? words.enterStock : incomplete ? (line.missing > 0 ? '≥ ' + fmt(line.missing) : words.unknownTotal) : line.missing === 0 ? words.enough : fmt(line.missing);
        for (const [title, value] of [[words.cost, (incomplete ? '≥ ' : '') + fmt(line.cost)], [words.have, line.have === null ? '—' : fmt(line.have)], [words.missing, missing]]) {
          const row = node('div', 'line'); row.append(node('span', '', title), node('strong', '', value)); card.append(row);
        }
        grid.append(card);
      }
      result.append(grid);
      if (plan.steps.length) {
        const details = node('details', 'cpSequence'), list = node('ol');
        details.append(node('summary', '', words.sequence));
        for (const step of plan.steps) list.append(node('li', '', buildingName(step.k) + ' → ' + fmt(step.l)));
        details.append(list); result.append(details);
      }
      result.append(node('p', 'cpHint', words.note));
    }
    function backupText() { return JSON.stringify(CityProfile.validate(data, meta), null, 2); }
    function showText() {
      fileRequest++; pending = null;
      transfer.replaceChildren();
      const label = node('label', 'cpField', w().backupText); textArea = node('textarea', 'cpBackupText');
      textArea.readOnly = true; textArea.value = backupText(); textArea.dir = 'ltr'; label.append(textArea);
      message = node('p', 'cpHint'); message.setAttribute('role', 'status');
      transfer.append(label, button(w().copy, async () => {
        try { await navigator.clipboard.writeText(textArea.value); message.textContent = w().copied; }
        catch { textArea.focus(); textArea.select(); message.textContent = w().copyManual; }
      }), message);
    }
    function download() {
      const url = URL.createObjectURL(new Blob([backupText()], {type: 'application/json'}));
      const a = node('a'); a.href = url; a.download = 'AOZ-my-city-' + new Date().toISOString().slice(0, 10) + '.json';
      root.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
      showText();
    }
    async function importFile(file) {
      const request = ++fileRequest; pending = null; transfer.replaceChildren();
      try {
        if (!file || file.size > 100000) throw new Error('city-size');
        const imported = CityProfile.parse(await file.text(), meta);
        if (request !== fileRequest) return;
        pending = imported; transfer.append(node('p', '', w().importReady));
        const actions = node('div', 'cpActions');
        actions.append(button(w().apply, () => {
          if (!pending) return;
          data = pending; save(); render();
          if (status === 'saved') { message.textContent = w().imported; message.closest('details').open = true; }
        }), button(w().cancel, () => { pending = null; fileRequest++; transfer.replaceChildren(); }));
        transfer.append(actions);
      } catch {
        if (request === fileRequest) transfer.append(node('p', 'warn', w().importInvalid));
      }
    }
    function render() {
      fileRequest++; pending = null;
      const words = w(), p = profile(), section = node('section', 'cpPanel');
      const hero = node('div', 'cpHero');
      hero.append(node('div', 'cpBrand', 'AOZ COMMUNITY HUB'), node('h2', '', words.title), node('p', '', words.lead));
      section.append(hero);
      const games = node('div', 'cpActions');
      for (const game of CityProfile.games) {
        const b = button(game === 'global' ? 'Global' : 'China V3', () => { data.version = game; save(); render(); });
        b.dataset.cityGame = game; b.setAttribute('aria-pressed', String(data.version === game)); games.append(b);
      }
      section.append(games);
      saveLabel = node('p', 'cpStatus'); saveLabel.setAttribute('role', 'status'); section.append(saveLabel); labelStatus();
      section.append(node('p', 'cpHint', words.local));
      if (data.version === 'v3') section.append(node('p', 'cpNotice', words.v3));
      const hall = node('div', 'cpFields');
      select(hall, words.hall, 'main', [[null, words.unknown], ...Array.from({length: meta.main.max}, (_, i) => [i + 1, fmt(i + 1)])], p.levels.main, v => { CityProfile.setLevel(p, 'main', v, meta); save(); render(); });
      const min = p.levels.main || 1;
      select(hall, words.target, 'target', Array.from({length: meta.main.max - min + 1}, (_, i) => [min + i, fmt(min + i)]), p.target, v => { p.target = v; save(); renderResult(); });
      section.append(hall);
      const buildings = node('details', 'cpBuildings'); buildings.open = p.levels.main === null;
      buildings.append(node('summary', '', words.levels), node('p', 'cpHint', words.levelsHint));
      const fields = node('div', 'cpFields');
      for (const k of Object.keys(meta).filter(k => k !== 'main')) {
        const opts = [[null, words.unknown], [0, words.notBuilt], ...Array.from({length: meta[k].max}, (_, i) => i + 1).filter(n => k !== 'workshop' || n >= 13).map(n => [n, fmt(n)])];
        select(fields, buildingName(k), k, opts, p.levels[k], v => { CityProfile.setLevel(p, k, v, meta); save(); renderResult(); });
      }
      buildings.append(fields); section.append(buildings);
      const resources = node('details', 'cpStock'); resources.open = true;
      resources.append(node('summary', '', words.stock), node('p', 'cpHint', words.stockHint));
      const inputs = node('div', 'cpFields');
      resourceNames().forEach((name, i) => {
        const label = node('label', 'cpField', name), input = node('input');
        input.type = 'text'; input.inputMode = 'numeric'; input.maxLength = 24; input.placeholder = '—'; input.value = p.stock[i];
        input.dataset.cityStock = String(i);
        const error = node('small', 'warn'); error.id = 'cityStockError' + i; error.hidden = true;
        input.setAttribute('aria-describedby', error.id);
        input.oninput = () => {
          const value = CityProfile.normalizeStock(input.value);
          input.setCustomValidity(value === null ? w().invalidStock : '');
          input.setAttribute('aria-invalid', String(value === null));
          error.hidden = value !== null; error.textContent = value === null ? w().invalidStock : '';
          if (value === null) return;
          p.stock[i] = value; save(); renderResult();
        };
        label.append(input, error); inputs.append(label);
      });
      resources.append(inputs); section.append(resources);
      result = node('div', 'cpResult'); section.append(result); renderResult();
      const backup = node('details', 'cpTransfer'); backup.append(node('summary', '', words.backup));
      const actions = node('div', 'cpActions'), file = node('input');
      file.type = 'file'; file.accept = '.json,application/json'; file.hidden = true;
      file.onchange = () => { const selected = file.files[0]; file.value = ''; if (selected) importFile(selected); };
      actions.append(button(words.export, download), button(words.showCopy, showText), button(words.import, () => file.click()));
      transfer = node('div', 'cpImport'); message = node('p', 'cpHint'); message.setAttribute('role', 'status');
      backup.append(actions, file, transfer, message); section.append(backup);
      root.replaceChildren(section);
    }
    render();
    return Object.freeze({render});
  }
  return Object.freeze({install});
})();
