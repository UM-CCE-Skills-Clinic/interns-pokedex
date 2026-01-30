# 04 - Building the Repository Layer

The repository layer is responsible for fetching data from external sources. In our case, it talks to the PokeAPI.

---

## What is a Repository?

A repository is like a librarian:
- You ask for a book (data)
- The librarian knows where to find it (API endpoint)
- They retrieve and give it to you (return data)

Other parts of your app don't need to know HOW data is fetched - they just ask the repository.

---

## Step 1: Understand PokeAPI

Before we write code, let's understand the API we're using.

### Key Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/pokemon` | List all Pokemon | `/pokemon?limit=20&offset=0` |
| `/pokemon/{name}` | Get Pokemon details | `/pokemon/pikachu` |
| `/pokemon-species/{name}` | Get species info | `/pokemon-species/pikachu` |
| `/type` | List all types | `/type` |
| `/type/{name}` | Pokemon by type | `/type/electric` |

### Example API Response

When we call `/pokemon/pikachu`:

```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "types": [
    { "type": { "name": "electric" } }
  ],
  "stats": [
    { "base_stat": 35, "stat": { "name": "hp" } },
    { "base_stat": 55, "stat": { "name": "attack" } }
  ],
  "sprites": {
    "front_default": "https://..."
  }
}
```

---

## Step 2: Create the Repository File

1. Create a new file `src/repositories/pokemonRepository.js`

2. Add the imports at the top:

```javascript
import axios from 'axios';
import { config } from '../config/index.js';

// Get the base URL from config
const { baseUrl: BASE_URL } = config.pokeapi;
```

3. Save the file

---

## Step 3: Add getAllPokemon Function

1. Add this function to fetch a paginated list of Pokemon:

```javascript
/**
 * Fetch a paginated list of all Pokemon
 * @param {number} limit - Number of Pokemon to fetch
 * @param {number} offset - Starting position
 * @returns {Promise<Object>} - List of Pokemon with count
 */
export const getAllPokemon = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon list: ${error.message}`);
  }
};
```

2. Save the file

---

## Step 4: Add getPokemonByNameOrId Function

1. Add this function to fetch a single Pokemon:

```javascript
/**
 * Fetch a single Pokemon by name or ID
 * @param {string|number} nameOrId - Pokemon name or ID
 * @returns {Promise<Object|null>} - Pokemon data or null if not found
 */
export const getPokemonByNameOrId = async (nameOrId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`
    );
    return response.data;
  } catch (error) {
    // Return null for 404 (not found) instead of throwing
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Pokemon: ${error.message}`);
  }
};
```

2. Save the file

---

## Step 5: Add getPokemonSpecies Function

1. Add this function to fetch species data (for descriptions):

```javascript
/**
 * Fetch Pokemon species data (for descriptions)
 * @param {string|number} nameOrId - Pokemon name or ID
 * @returns {Promise<Object|null>} - Species data or null if not found
 */
export const getPokemonSpecies = async (nameOrId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pokemon-species/${nameOrId.toString().toLowerCase()}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Pokemon species: ${error.message}`);
  }
};
```

2. Save the file

---

## Step 6: Add searchPokemon Function

1. Add this function to search Pokemon by name:

```javascript
/**
 * Search Pokemon by name
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to search through
 * @returns {Promise<Object>} - Filtered Pokemon list
 */
export const searchPokemon = async (query, limit = config.pagination.maxSearchLimit) => {
  try {
    // Fetch all Pokemon up to the limit
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset: 0 }
    });

    // Filter by name locally
    const allPokemon = response.data.results;
    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    return {
      count: filtered.length,
      results: filtered
    };
  } catch (error) {
    throw new Error(`Failed to search Pokemon: ${error.message}`);
  }
};
```

2. Save the file

---

## Step 7: Add Type Functions

1. Add these functions to work with Pokemon types:

```javascript
/**
 * Fetch all Pokemon types
 * @returns {Promise<Array>} - List of types
 */
export const getPokemonTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/type`);
    return response.data.results;
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon types: ${error.message}`);
  }
};

/**
 * Fetch all Pokemon of a specific type
 * @param {string} typeName - Type name (e.g., "electric")
 * @returns {Promise<Array|null>} - List of Pokemon or null if type not found
 */
export const getPokemonByType = async (typeName) => {
  try {
    const response = await axios.get(`${BASE_URL}/type/${typeName.toLowerCase()}`);
    // Extract just the Pokemon info from the nested structure
    return response.data.pokemon.map((p) => p.pokemon);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Pokemon by type: ${error.message}`);
  }
};
```

2. Save the file

---

## Step 8: Verify Your Complete File

Your `src/repositories/pokemonRepository.js` should now look like this:

```javascript
import axios from 'axios';
import { config } from '../config/index.js';

const { baseUrl: BASE_URL } = config.pokeapi;

export const getAllPokemon = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon list: ${error.message}`);
  }
};

export const getPokemonByNameOrId = async (nameOrId) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Pokemon: ${error.message}`);
  }
};

export const getPokemonSpecies = async (nameOrId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pokemon-species/${nameOrId.toString().toLowerCase()}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Pokemon species: ${error.message}`);
  }
};

export const searchPokemon = async (query, limit = config.pagination.maxSearchLimit) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset: 0 }
    });

    const allPokemon = response.data.results;
    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );

    return {
      count: filtered.length,
      results: filtered
    };
  } catch (error) {
    throw new Error(`Failed to search Pokemon: ${error.message}`);
  }
};

export const getPokemonTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/type`);
    return response.data.results;
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon types: ${error.message}`);
  }
};

export const getPokemonByType = async (typeName) => {
  try {
    const response = await axios.get(`${BASE_URL}/type/${typeName.toLowerCase()}`);
    return response.data.pokemon.map((p) => p.pokemon);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Pokemon by type: ${error.message}`);
  }
};
```

---

## Understanding the Code

### Using Axios

```javascript
// Simple GET
const response = await axios.get('https://api.example.com/data');

// GET with query parameters
const response = await axios.get('https://api.example.com/data', {
  params: { limit: 10, page: 1 }
});
// Results in: https://api.example.com/data?limit=10&page=1
```

### Error Handling

```javascript
try {
  const response = await axios.get(url);
  return response.data;
} catch (error) {
  if (error.response?.status === 404) {
    return null; // Not found is OK
  }
  throw error; // Other errors bubble up
}
```

---

## Summary

| Function | Purpose | Returns |
|----------|---------|---------|
| `getAllPokemon(limit, offset)` | Get paginated list | `{ count, results }` |
| `getPokemonByNameOrId(nameOrId)` | Get single Pokemon | Pokemon object or `null` |
| `getPokemonSpecies(nameOrId)` | Get species data | Species object or `null` |
| `searchPokemon(query)` | Search by name | `{ count, results }` |
| `getPokemonTypes()` | List all types | Array of types |
| `getPokemonByType(typeName)` | Pokemon by type | Array or `null` |

---

## Step 9: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add pokemon repository for API calls

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

```cmd
git commit -m "chore: add pokemon repository for API calls" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Now that we can fetch data, let's create the service layer to transform it.

Next: [05 - Building the Service Layer](./05-building-the-service.md)
