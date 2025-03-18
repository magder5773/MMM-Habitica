# MMM-Habitica

A Magic Mirror module for displaying Habitica stats.

## Installation

1. Navigate to your MagicMirror's `modules` folder:

```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:

```bash
git clone https://github.com/magder5773/MMM-Habitica.git
```

3. Add the module to your `config/config.js` file:

```javascript
{
  module: "MMM-Habitica",
  position: "left_right",
  config: {
    updateInterval: 300000, // optional, defaults to 5 minutes
    userId: "your-habitica-user-id",
    apiToken: "your-habitica-api-token"
  }
}
```

## Configuration

| Option           | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `updateInterval` | How often to update stats in milliseconds (default: 300000) |
| `userId`         | Your Habitica User ID                                       |
| `apiToken`       | Your Habitica API Token                                     |

## Finding Your Credentials

1. Log into [Habitica](https://habitica.com)
2. Go to Settings → API
3. Your User ID and API Token will be displayed there

## Features

- Displays health, experience, and mana bars
- Shows current level and character class
- Displays gold amount
- Updates automatically every 5 minutes (configurable)
- Responsive design that fits well with Magic Mirror
