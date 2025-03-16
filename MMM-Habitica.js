Module.register("MMM-Habitica", {
  defaults: {
    updateInterval: 30000 // 30 seconds
  },

  start: function() {
    Log.info("Starting module: " + this.name);
    this.stats = {};
    this.loaded = false;
    this.getStats();
    this.scheduleUpdate();
  },

  getStyles: function() {
    return ["MMM-Habitica.css"];
  },

  scheduleUpdate: function() {
    setInterval(() => {
      this.getStats();
    }, this.config.updateInterval);
  },

  getStats: function() {
    const userId = process.env.HABITICA_USER_ID;
    const apiToken = process.env.HABITICA_API_TOKEN;

    fetch('https://habitica.com/api/v3/user?userFields=stats', {
      headers: {
        'x-api-user': userId,
        'x-api-key': apiToken
      }
    })
      .then(response => response.json())
      .then(data => {
        this.stats = {
          health: {
            current: Math.floor(data.data.stats.hp),
            max: 50
          },
          experience: {
            current: Math.floor(data.data.stats.exp),
            max: data.data.stats.toNextLevel
          },
          mana: {
            current: Math.floor(data.data.stats.mp),
            max: data.data.stats.maxMP
          },
          level: data.data.stats.lvl,
          class: data.data.stats.class,
          gold: Math.floor(data.data.stats.gp)
        };
        this.loaded = true;
        this.updateDom();
      })
      .catch(err => {
        Log.error("Error getting Habitica stats: " + err);
      });
  },

  getDom: function() {
    const wrapper = document.createElement("div");
    wrapper.className = "stats-container";

    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      return wrapper;
    }

    // Character info
    const characterInfo = document.createElement("div");
    characterInfo.className = "character-info";
    characterInfo.innerHTML = `
      <h1>magZeFierce</h1>
      <p>Level ${this.stats.level} ${this.stats.class}</p>
    `;
    wrapper.appendChild(characterInfo);

    // Stat bars
    const statBars = document.createElement("div");
    statBars.className = "stat-bars";

    // Health bar
    const healthBar = this.createStatBar(
      "health",
      this.stats.health.current,
      this.stats.health.max
    );
    statBars.appendChild(healthBar);

    // Experience bar
    const expBar = this.createStatBar(
      "experience",
      this.stats.experience.current,
      this.stats.experience.max
    );
    statBars.appendChild(expBar);

    // Mana bar
    const manaBar = this.createStatBar(
      "mana",
      this.stats.mana.current,
      this.stats.mana.max
    );
    statBars.appendChild(manaBar);

    wrapper.appendChild(statBars);

    // Currency
    const currencyContainer = document.createElement("div");
    currencyContainer.className = "currency-container";
    currencyContainer.innerHTML = `
      <div class="currency-item">
        <i class="fas fa-coins currency-icon"></i>
        <span class="currency-text">${Math.floor(this.stats.gold)}</span>
      </div>
    `;
    wrapper.appendChild(currencyContainer);

    return wrapper;
  },

  createStatBar: function(type, current, max) {
    const percent = (current / max) * 100;
    const statBar = document.createElement("div");
    statBar.className = "stat-bar";
    statBar.innerHTML = `
      <div class="stat-icon ${type}"></div>
      <div class="bar-container">
        <div class="bar ${type}-bar" style="width: ${percent}%"></div>
      </div>
      <div class="stat-text">${current} / ${max}</div>
    `;
    return statBar;
  }
});