# 01 - Project Setup

In this section, you'll fork the repository, clone it to your machine, and set up your development environment.

---

## Step 1: Fork the Repository

1. Go to the repository on GitHub
2. Click the **Fork** button in the top-right corner
3. Select your GitHub account as the destination
4. Wait for the fork to complete

You now have your own copy of the repository under your GitHub account.

---

## Step 2: Clone Your Fork

1. Open your terminal
2. Run the following command (replace `YOUR-USERNAME` with your GitHub username):

```bash
git clone https://github.com/YOUR-USERNAME/inter-workshop.git
```

3. Navigate into the project folder:

```bash
cd inter-workshop
```

---

## Step 3: Create Your Branch

1. Create a new branch using the format `lastname/pokedex-pull-request`:

```bash
git checkout -b dela-cruz/pokedex-pull-request
```

2. Replace `dela-cruz` with your actual last name (use lowercase and hyphens for spaces)

### Branch Naming Examples

| Your Name | Branch Name |
|-----------|-------------|
| Juan Dela Cruz | `dela-cruz/pokedex-pull-request` |
| Maria Santos | `santos/pokedex-pull-request` |
| John Smith | `smith/pokedex-pull-request` |

---

## Step 4: Install Dependencies

1. Run the following command to install all packages:

```bash
npm install
```

2. Wait for the installation to complete

This reads `package.json` and installs all required packages into `node_modules/`.

### What Gets Installed

**Production Dependencies:**

| Package | Purpose |
|---------|---------|
| `express` | Web framework for handling HTTP requests |
| `ejs` | Template engine for rendering HTML |
| `axios` | HTTP client for API requests |
| `dotenv` | Load environment variables from `.env` file |

**Development Dependencies:**

| Package | Purpose |
|---------|---------|
| `nodemon` | Auto-restart server on file changes |
| `jest` | Testing framework |
| `supertest` | HTTP testing library |
| `eslint` | Code linting (find errors/issues) |
| `prettier` | Code formatting |

---

## Step 5: Set Up Environment Variables

1. Copy the example environment file:

**Mac/Linux:**
```bash
cp .env.example .env
```

**Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

2. The `.env` file now contains:

```env
PORT=3000
NODE_ENV=development
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
DEFAULT_PAGE_LIMIT=20
MAX_SEARCH_LIMIT=1000
```

---

## Step 6: Create Project Directories

1. Create the directories for your application code:

**Mac/Linux:**
```bash
mkdir -p src/config src/routes src/controllers src/services src/repositories src/views/partials public/css
```

**Windows (Command Prompt):**
```cmd
mkdir src\config src\routes src\controllers src\services src\repositories src\views\partials public\css
```

**Windows (PowerShell):**
```powershell
mkdir src/config, src/routes, src/controllers, src/services, src/repositories, src/views/partials, public/css
```

2. Verify your project structure looks like this:

```
inter-workshop/
├── .github/              # CI/CD workflow (pre-configured)
├── docs/                 # Documentation
│   └── guide/            # This tutorial
├── public/               # Static assets (you created this)
│   └── css/
├── src/                  # Your application code (you created this)
│   ├── config/
│   ├── controllers/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── views/
│       └── partials/
├── tests/                # Test files (pre-configured)
├── .env                  # Your environment variables
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── jest.config.js
├── package.json
└── package-lock.json
```

---

## Step 7: Verify Setup

1. Check Node.js is installed:

```bash
node --version
```

2. Check npm packages are installed:

```bash
npm list --depth=0
```

3. Check you're on your branch:

```bash
git branch
```

You should see your branch name highlighted (e.g., `* dela-cruz/pokedex-pull-request`).

---

## Available npm Scripts

The `package.json` is already configured with these scripts:

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Run the app in production |
| `dev` | `npm run dev` | Run with auto-reload (development) |
| `test` | `npm test` | Run tests with coverage report |
| `lint` | `npm run lint` | Check code for errors |
| `lint:fix` | `npm run lint:fix` | Auto-fix linting errors |
| `format` | `npm run format` | Format code with Prettier |
| `format:check` | `npm run format:check` | Check if code is formatted |

> **Note:** You don't need to modify `package.json`. Everything is already set up for you.

---

## Step 8: Commit Your Progress

1. Stage all your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "chore: set up project structure and environment

Full Name: D***** ******* ****** Franco
Umindanao: d.franco.******@umindanao.edu.ph"
```
```cmd
git commit -m "chore: set up project structure and environment" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Your development environment is ready! In the next section, we'll learn about the architecture pattern we're using.

Next: [02 - Understanding Architecture](./02-understanding-architecture.md)
