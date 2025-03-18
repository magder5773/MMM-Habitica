Module.register('MMM-Habitica', {
  defaults: {
    updateInterval: 300000, // 300 seconds
    userId: '', // Habitica user ID
    apiToken: '', // Habitica API token
  },

  start: function () {
    Log.info('Starting module: ' + this.name);
    this.stats = {};
    this.loaded = false;
    this.getStats();
    this.scheduleUpdate();
  },

  getStyles: function () {
    return ['MMM-Habitica.css'];
  },

  scheduleUpdate: function () {
    setInterval(() => {
      this.getStats();
    }, this.config.updateInterval);
  },

  getStats: function () {
    const userId = this.config.userId;
    const apiToken = this.config.apiToken;

    if (!userId || !apiToken) {
      Log.error('Habitica credentials not configured in config.js!');
      return;
    }

    fetch('https://habitica.com/api/v3/user', {
      headers: {
        'x-api-user': userId,
        'x-api-key': apiToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const stats = data.data.stats;
        const level = stats.lvl;
        const nextLevelThreshold = stats.toNextLevel;
        const currentExp = Math.floor(stats.exp);
        const maxMana = stats.maxMP;
        const username = data.data.profile.name;

        this.stats = {
          health: {
            current: Math.floor(stats.hp),
            max: 50,
          },
          experience: {
            current: currentExp,
            max: nextLevelThreshold,
            toNextLevel: nextLevelThreshold - currentExp,
          },
          mana: {
            current: Math.floor(stats.mp),
            max: maxMana,
          },
          level: level,
          class: stats.class,
          gold: Math.floor(stats.gp),
        };

        this.username = username;
        this.loaded = true;
        this.updateDom();
      })
      .catch((err) => {
        Log.error('Error getting Habitica stats:', err);
      });
  },

  getDom: function () {
    const wrapper = document.createElement('div');
    wrapper.className = 'stats-container';

    if (!this.config.userId || !this.config.apiToken) {
      wrapper.innerHTML = 'Please configure Habitica credentials in config.js';
      return wrapper;
    }

    if (!this.loaded) {
      wrapper.innerHTML = 'Loading...';
      return wrapper;
    }

    // Character info
    const characterInfo = document.createElement('div');
    characterInfo.className = 'character-info';
    characterInfo.innerHTML = `
      <h1>${this.username || 'Unknown Adventurer'}</h1>
      <p>Level ${this.stats.level} ${this.stats.class}</p>
    `;
    wrapper.appendChild(characterInfo);

    // Stat bars
    const statBars = document.createElement('div');
    statBars.className = 'stat-bars';

    // Health bar
    const healthBar = this.createStatBar(
      'health',
      this.stats.health.current,
      this.stats.health.max,
      null
    );
    statBars.appendChild(healthBar);

    // Experience bar
    const expBar = this.createStatBar(
      'experience',
      this.stats.experience.current,
      this.stats.experience.max,
      `${this.stats.experience.toNextLevel} XP to next level`
    );
    statBars.appendChild(expBar);

    // Mana bar
    const manaBar = this.createStatBar(
      'mana',
      this.stats.mana.current,
      this.stats.mana.max,
      null
    );
    statBars.appendChild(manaBar);

    wrapper.appendChild(statBars);

    // Currency
    const currencyContainer = document.createElement('div');
    currencyContainer.className = 'currency-container';
    currencyContainer.innerHTML = `
      <div class="currency-item">
        <i class="fas fa-coins currency-icon"></i>
        <span class="currency-text">${Math.floor(this.stats.gold)}</span>
      </div>
    `;
    wrapper.appendChild(currencyContainer);

    return wrapper;
  },

  createStatBar: function (type, current, max, additionalInfo) {
    const percent = Math.min(100, Math.max(0, (current / max) * 100));
    const statBar = document.createElement('div');
    statBar.className = 'stat-bar';

    let html = `
      <div class="stat-icon ${type}"></div>
      <div class="bar-container">
        <div class="bar ${type}-bar" style="width: ${percent}%"></div>
      </div>
      <div class="stat-text">${current} / ${max}</div>
    `;

    if (additionalInfo) {
      html += `<div class="additional-info">${additionalInfo}</div>`;
    }

    statBar.innerHTML = html;
    return statBar;
  },
});