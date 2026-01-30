# 03 - Configuration

In this section, we'll set up our application's configuration. Good configuration management makes your app flexible and secure.

---

## Why Configuration Matters

Configuration separates settings from code:
- **Different environments** (development vs production) can use different settings
- **Sensitive data** (API keys, passwords) stay out of your code
- **Easy changes** without modifying code

---

## Step 1: Understand Environment Variables

Environment variables are settings stored outside your code. They're loaded at runtime.

Your `.env` file (created in the previous section) contains:

```env
PORT=3000
NODE_ENV=development
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
DEFAULT_PAGE_LIMIT=20
MAX_SEARCH_LIMIT=1000
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | 3000 | Which port the server runs on |
| `NODE_ENV` | development | Environment mode (development/production) |
| `POKEAPI_BASE_URL` | https://pokeapi.co/api/v2 | Base URL for Pokemon API |
| `DEFAULT_PAGE_LIMIT` | 20 | Pokemon per page |
| `MAX_SEARCH_LIMIT` | 1000 | Maximum Pokemon to search through |

---

## Step 2: Create the Config File

1. Create a new file `src/config/index.js`

2. Add the following code:

```javascript
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  // Server settings
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // PokeAPI settings
  pokeapi: {
    baseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2'
  },

  // Pagination settings
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 20,
    maxSearchLimit: parseInt(process.env.MAX_SEARCH_LIMIT, 10) || 1000
  }
};
```

3. Save the file

---

## Step 3: Understand the Code

### Import dotenv

```javascript
import dotenv from 'dotenv';
```

The `dotenv` package reads your `.env` file and loads variables into `process.env`.

### Load the variables

```javascript
dotenv.config();
```

This line reads the `.env` file. After this, you can access variables like `process.env.PORT`.

### Export the config object

```javascript
export const config = {
  port: process.env.PORT || 3000,
  // ...
};
```

We create a structured object with all our settings. The `||` operator provides fallback values if variables aren't set.

### Parse numbers

```javascript
defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 20,
```

Environment variables are always strings. We use `parseInt()` to convert them to numbers:
- `10` is the radix (base 10)
- `|| 20` provides a fallback if parsing fails

---

## Step 4: Test the Configuration

1. Create a temporary test file `test-config.js` in the project root:

```javascript
import { config } from './src/config/index.js';

console.log('Configuration loaded:');
console.log(JSON.stringify(config, null, 2));
```

2. Run the test:

```bash
node test-config.js
```

3. You should see output like:

```json
{
  "port": 3000,
  "nodeEnv": "development",
  "pokeapi": {
    "baseUrl": "https://pokeapi.co/api/v2"
  },
  "pagination": {
    "defaultLimit": 20,
    "maxSearchLimit": 1000
  }
}
```

4. Delete the test file after verifying:

**Mac/Linux:**
```bash
rm test-config.js
```

**Windows (Command Prompt):**
```cmd
del test-config.js
```

**Windows (PowerShell):**
```powershell
Remove-Item test-config.js
```

---

## Step 5: Using the Config

Here's how other files will use the config:

```javascript
// In any file that needs configuration
import { config } from './config/index.js';

// Use the settings
console.log(`Server running on port ${config.port}`);
console.log(`API URL: ${config.pokeapi.baseUrl}`);
console.log(`Items per page: ${config.pagination.defaultLimit}`);
```

---

## Best Practices

### 1. Always Use Fallback Values

```javascript
// Good - has fallback
port: process.env.PORT || 3000

// Bad - might be undefined
port: process.env.PORT
```

### 2. Never Commit `.env`

The `.gitignore` already includes:
```
.env
.env.local
.env.*.local
```

### 3. Provide an Example File

The `.env.example` file shows other developers what variables they need without exposing real values.

---

## Summary

| File | Purpose |
|------|---------|
| `.env` | Store environment variables (not committed) |
| `.env.example` | Template showing required variables |
| `src/config/index.js` | Load and organize configuration |

---

## Step 6: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add application configuration

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

```cmd
git commit -m "chore: add application configuration" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

With configuration set up, let's build the repository layer - the part that talks to PokeAPI.

Next: [04 - Building the Repository Layer](./04-building-the-repository.md)
