# 07 - Building Routes

Routes connect URLs to controllers. They're the "address book" of your application.

---

## What is a Route?

When someone visits `http://localhost:3000/pokemon/pikachu`:
1. Express checks all routes
2. Finds the matching pattern (`/pokemon/:nameOrId`)
3. Calls the associated controller function

---

## Step 1: Create the Pokemon Routes File

1. Create a new file `src/routes/pokemonRoutes.js`

2. Add the imports at the top:

```javascript
import { Router } from 'express';
import * as pokemonController from '../controllers/pokemonController.js';

const router = Router();
```

3. Save the file

---

## Step 2: Add View Routes

1. Add these routes for HTML pages:

```javascript
// ============================================
// VIEW ROUTES (Return HTML)
// ============================================

// Home page - list all Pokemon
router.get('/', pokemonController.getHomePage);

// Search Pokemon
router.get('/search', pokemonController.searchPokemon);

// Filter by type
router.get('/type/:type', pokemonController.getPokemonByType);

// Pokemon detail page
router.get('/pokemon/:nameOrId', pokemonController.getPokemonDetails);
```

2. Save the file

---

## Step 3: Add API Routes

1. Add these routes for JSON responses:

```javascript
// ============================================
// API ROUTES (Return JSON)
// ============================================

// Get all Pokemon (paginated)
router.get('/api/pokemon', pokemonController.apiGetAllPokemon);

// Search Pokemon
router.get('/api/pokemon/search', pokemonController.apiSearchPokemon);

// Get single Pokemon
router.get('/api/pokemon/:nameOrId', pokemonController.apiGetPokemonDetails);

// Get all types
router.get('/api/types', pokemonController.apiGetTypes);

// Get Pokemon by type
router.get('/api/types/:type', pokemonController.apiGetPokemonByType);
```

2. Save the file

---

## Step 4: Export the Router

1. Add this at the end of the file:

```javascript
export default router;
```

2. Save the file

---

## Step 5: Verify Your pokemonRoutes.js

Your complete file should look like this:

```javascript
import { Router } from 'express';
import * as pokemonController from '../controllers/pokemonController.js';

const router = Router();

// View routes (EJS)
router.get('/', pokemonController.getHomePage);
router.get('/search', pokemonController.searchPokemon);
router.get('/type/:type', pokemonController.getPokemonByType);
router.get('/pokemon/:nameOrId', pokemonController.getPokemonDetails);

// API routes (JSON)
router.get('/api/pokemon', pokemonController.apiGetAllPokemon);
router.get('/api/pokemon/search', pokemonController.apiSearchPokemon);
router.get('/api/pokemon/:nameOrId', pokemonController.apiGetPokemonDetails);
router.get('/api/types', pokemonController.apiGetTypes);
router.get('/api/types/:type', pokemonController.apiGetPokemonByType);

export default router;
```

---

## Step 6: Create the Main Router

1. Create a new file `src/routes/index.js`

2. Add this code:

```javascript
import { Router } from 'express';
import pokemonRoutes from './pokemonRoutes.js';

const router = Router();

// Mount all Pokemon routes at root
router.use('/', pokemonRoutes);

export default router;
```

3. Save the file

---

## Understanding Route Patterns

### Static Routes

```javascript
router.get('/about', aboutController);
// Matches: /about
// Does NOT match: /about/team
```

### Dynamic Routes (Parameters)

```javascript
router.get('/pokemon/:nameOrId', pokemonController);
// Matches: /pokemon/pikachu, /pokemon/25
// Access via: req.params.nameOrId
```

### Route Order Matters!

More specific routes should come before generic ones:

```javascript
// CORRECT ORDER ✓
router.get('/api/pokemon/search', searchController);   // Specific first
router.get('/api/pokemon/:nameOrId', detailController); // Generic second

// WRONG ORDER ✗
router.get('/api/pokemon/:nameOrId', detailController); // Catches "search"!
router.get('/api/pokemon/search', searchController);     // Never reached!
```

---

## Route Reference

### View Routes (HTML)

| Method | Route | Controller | Description |
|--------|-------|------------|-------------|
| GET | `/` | `getHomePage` | Home page |
| GET | `/search` | `searchPokemon` | Search results |
| GET | `/type/:type` | `getPokemonByType` | Filter by type |
| GET | `/pokemon/:nameOrId` | `getPokemonDetails` | Detail page |

### API Routes (JSON)

| Method | Route | Controller | Description |
|--------|-------|------------|-------------|
| GET | `/api/pokemon` | `apiGetAllPokemon` | List Pokemon |
| GET | `/api/pokemon/search` | `apiSearchPokemon` | Search |
| GET | `/api/pokemon/:nameOrId` | `apiGetPokemonDetails` | Get one |
| GET | `/api/types` | `apiGetTypes` | List types |
| GET | `/api/types/:type` | `apiGetPokemonByType` | By type |

---

## Step 7: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add application routes

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

```cmd
git commit -m "chore: add application routes" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Now let's create the EJS templates to display our data!

Next: [08 - Building Views](./08-building-the-views.md)
