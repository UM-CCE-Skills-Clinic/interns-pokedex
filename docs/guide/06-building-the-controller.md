# 06 - Building the Controller Layer

Controllers handle HTTP requests and responses. They're the bridge between your routes (URLs) and your services (business logic).

---

## What is a Controller?

Think of controllers as customer service representatives:
- They receive requests from customers (HTTP requests)
- They get the information needed (call services)
- They respond in the right format (HTML or JSON)

---

## Two Types of Controllers

Our app has two types of controllers:

| Type | Output | Use Case |
|------|--------|----------|
| **View Controllers** | HTML pages (via EJS) | Web browsers |
| **API Controllers** | JSON data | Mobile apps, other services |

---

## Step 1: Create the Controller File

1. Create a new file `src/controllers/pokemonController.js`

2. Add the import at the top:

```javascript
import * as pokemonService from '../services/pokemonService.js';
```

3. Save the file

---

## Step 2: Add getHomePage Controller

1. Add this controller for the home page:

```javascript
// ============================================
// VIEW CONTROLLERS (Return HTML via EJS)
// ============================================

/**
 * Home page - List all Pokemon with pagination
 */
export const getHomePage = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Fetch data from services
    const data = await pokemonService.getAllPokemon(page, limit);
    const types = await pokemonService.getPokemonTypes();

    // Render the index template
    res.render('index', {
      ...data,
      types,
      searchQuery: '',
      selectedType: ''
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Failed to load Pokemon',
      error: error.message
    });
  }
};
```

2. Save the file

---

## Step 3: Add getPokemonDetails Controller

1. Add this controller for the detail page:

```javascript
/**
 * Pokemon detail page
 */
export const getPokemonDetails = async (req, res) => {
  try {
    const { nameOrId } = req.params;
    const pokemon = await pokemonService.getPokemonDetails(nameOrId);

    if (!pokemon) {
      return res.status(404).render('error', {
        message: 'Pokemon not found',
        error: `No Pokemon found with name or ID: ${nameOrId}`
      });
    }

    res.render('pokemon', { pokemon });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Failed to load Pokemon details',
      error: error.message
    });
  }
};
```

2. Save the file

---

## Step 4: Add searchPokemon Controller

1. Add this controller for search results:

```javascript
/**
 * Search results page
 */
export const searchPokemon = async (req, res) => {
  try {
    const { q } = req.query;
    const types = await pokemonService.getPokemonTypes();
    const data = await pokemonService.searchPokemon(q);

    res.render('index', {
      ...data,
      types,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      searchQuery: q || '',
      selectedType: ''
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Search failed',
      error: error.message
    });
  }
};
```

2. Save the file

---

## Step 5: Add getPokemonByType Controller

1. Add this controller for type filtering:

```javascript
/**
 * Filter by type page
 */
export const getPokemonByType = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const types = await pokemonService.getPokemonTypes();
    const data = await pokemonService.getPokemonByType(type, page);

    if (!data) {
      return res.status(404).render('error', {
        message: 'Type not found',
        error: `No Pokemon type found: ${type}`
      });
    }

    res.render('index', {
      ...data,
      types,
      searchQuery: '',
      selectedType: type
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Failed to load Pokemon by type',
      error: error.message
    });
  }
};
```

2. Save the file

---

## Step 6: Add API Controllers

1. Add these controllers for JSON responses:

```javascript
// ============================================
// API CONTROLLERS (Return JSON)
// ============================================

/**
 * API: Get all Pokemon
 */
export const apiGetAllPokemon = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const data = await pokemonService.getAllPokemon(page, limit);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * API: Get Pokemon by name or ID
 */
export const apiGetPokemonDetails = async (req, res) => {
  try {
    const { nameOrId } = req.params;
    const pokemon = await pokemonService.getPokemonDetails(nameOrId);

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: `Pokemon not found: ${nameOrId}`
      });
    }

    res.json({ success: true, data: pokemon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * API: Search Pokemon
 */
export const apiSearchPokemon = async (req, res) => {
  try {
    const { q } = req.query;
    const data = await pokemonService.searchPokemon(q);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * API: Get all types
 */
export const apiGetTypes = async (req, res) => {
  try {
    const types = await pokemonService.getPokemonTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * API: Get Pokemon by type
 */
export const apiGetPokemonByType = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const data = await pokemonService.getPokemonByType(type, page);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: `Type not found: ${type}`
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

2. Save the file

---

## Step 7: Verify Your Complete File

Your controller file should have all these exported functions:
- `getHomePage`
- `getPokemonDetails`
- `searchPokemon`
- `getPokemonByType`
- `apiGetAllPokemon`
- `apiGetPokemonDetails`
- `apiSearchPokemon`
- `apiGetTypes`
- `apiGetPokemonByType`

---

## Understanding Key Patterns

### Request Object (req)

```javascript
req.params    // URL parameters: /pokemon/:nameOrId → { nameOrId: "pikachu" }
req.query     // Query string: ?page=2 → { page: "2" }
```

### Response Object (res)

```javascript
res.render('template', { data });  // Render HTML
res.json({ data });                // Send JSON
res.status(404).render('error');   // Set status + render
```

### Early Return Pattern

```javascript
if (!pokemon) {
  return res.status(404).render('error', { ... });
}
// Normal flow continues
res.render('pokemon', { pokemon });
```

---

## Summary

| Controller | Route | Returns |
|------------|-------|---------|
| `getHomePage` | GET / | HTML |
| `getPokemonDetails` | GET /pokemon/:nameOrId | HTML |
| `searchPokemon` | GET /search | HTML |
| `getPokemonByType` | GET /type/:type | HTML |
| `apiGetAllPokemon` | GET /api/pokemon | JSON |
| `apiGetPokemonDetails` | GET /api/pokemon/:nameOrId | JSON |
| `apiSearchPokemon` | GET /api/pokemon/search | JSON |
| `apiGetTypes` | GET /api/types | JSON |
| `apiGetPokemonByType` | GET /api/types/:type | JSON |

---

## Step 8: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add pokemon controllers for request handling

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```
```cmd
git commit -m "chore: add pokemon controllers for request handling" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Let's connect these controllers to URL routes!

Next: [07 - Building Routes](./07-building-the-routes.md)
