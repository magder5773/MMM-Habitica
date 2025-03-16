# MMM-Habitica

A Magic Mirror module for displaying Habitica stats.

## Installation

1. Navigate to your MagicMirror's `modules` folder:
```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:
```bash
git clone https://github.com/yourusername/MMM-Habitica.git
```

3. Create a `.env` file in your MagicMirror root directory:
```bash
HABITICA_USER_ID=your-user-id
HABITICA_API_TOKEN=your-api-token
```

4. Add the module to your `config/config.js` file:
```javascript
{
  module: "MMM-Habitica",
  position: "top_right",
  config: {
    updateInterval: 30000 // optional, defaults to 30 seconds
  }
}
```

## Configuration
| Option | Description |
|--------|-------------|
| `updateInterval` | How often to update stats in milliseconds (default: 30000) |