# 05 - Building the Service Layer

The service layer contains your business logic. It takes raw data from repositories and transforms it into exactly what your application needs.

---

## What is a Service?

Think of a service as a chef:
- Raw ingredients come in (data from repository)
- The chef processes them (formatting, combining, calculating)
- A finished dish comes out (clean, usable data)

---

## Step 1: Understand the Data Transformation

The PokeAPI returns data like this:

```javascript
{
  name: "pikachu",
  height: 4,        // In decimeters!
  weight: 60,       // In hectograms!
  types: [
    { slot: 1, type: { name: "electric", url: "..." } }
  ]
}
```

But we want data like this:

```javascript
{
  name: "pikachu",
  displayName: "Pikachu",   // Capitalized!
  height: 0.4,              // In meters!
  weight: 6.0,              // In kilograms!
  types: ["electric"]        // Simple array!
}
```

---

## Step 2: Create the Service File

1. Create a new file `src/services/pokemonService.js`

2. Add the imports at the top:

```javascript
import * as pokemonRepository from '../repositories/pokemonRepository.js';
import { config } from '../config/index.js';
```

3. Save the file

---

## Step 3: Add Helper Functions

1. Add these helper functions for formatting:

```javascript
/**
 * Format Pokemon name for display
 * "mr-mime" → "Mr Mime"
 */
const formatName = (name) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format stat names for display
 */
const formatStatName = (name) => {
  const statNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
  };
  return statNames[name] || formatName(name);
};
```

2. Save the file

---

## Step 4: Add formatPokemonData Function

1. Add this function to transform raw data:

```javascript
/**
 * Transform raw Pokemon data into display-ready format
 */
const formatPokemonData = (pokemon, species = null) => {
  // Get English description from species data
  const description =
    species?.flavor_text_entries
      ?.find((entry) => entry.language.name === 'en')
      ?.flavor_text?.replace(/\f/g, ' ') || 'No description available.';

  // Get English genus (e.g., "Mouse Pokémon")
  const genus = species?.genera?.find((g) => g.language.name === 'en')?.genus || 'Unknown';

  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName: formatName(pokemon.name),

    // Get best available image
    image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
    sprite: pokemon.sprites.front_default,

    // Simplify types array
    types: pokemon.types.map((t) => t.type.name),

    // Convert units
    height: pokemon.height / 10, // decimeters → meters
    weight: pokemon.weight / 10, // hectograms → kilograms

    // Format abilities
    abilities: pokemon.abilities.map((a) => ({
      name: formatName(a.ability.name),
      isHidden: a.is_hidden
    })),

    // Format stats
    stats: pokemon.stats.map((s) => ({
      name: formatStatName(s.stat.name),
      value: s.base_stat
    })),

    // Add species data
    description,
    genus,
    color: species?.color?.name || 'gray',
    captureRate: species?.capture_rate || 0,
    baseHappiness: species?.base_happiness || 0
  };
};
```

2. Save the file

---

## Step 5: Add getPokemonDetails Function

1. Add this exported function:

```javascript
export const getPokemonDetails = async (nameOrId) => {
  // Get basic Pokemon data
  const pokemon = await pokemonRepository.getPokemonByNameOrId(nameOrId);

  if (!pokemon) {
    return null; // Not found
  }

  // Try to get species data (for descriptions)
  let species = null;
  try {
    species = await pokemonRepository.getPokemonSpecies(pokemon.id);
  } catch {
    // Species data is optional - continue without it
  }

  // Format and return
  return formatPokemonData(pokemon, species);
};
```

2. Save the file

---

## Step 6: Add getAllPokemon Function

1. Add this function with pagination:

```javascript
export const getAllPokemon = async (page = 1, limit = config.pagination.defaultLimit) => {
  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Get list of Pokemon
  const data = await pokemonRepository.getAllPokemon(limit, offset);

  // Fetch details for each Pokemon
  const pokemonWithDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const details = await getPokemonDetails(pokemon.name);
      return details;
    })
  );

  // Return with pagination info
  return {
    pokemon: pokemonWithDetails,
    totalCount: data.count,
    currentPage: page,
    totalPages: Math.ceil(data.count / limit),
    hasNextPage: offset + limit < data.count,
    hasPrevPage: page > 1
  };
};
```

2. Save the file

---

## Step 7: Add searchPokemon Function

1. Add this search function:

```javascript
export const searchPokemon = async (query) => {
  // Handle empty query
  if (!query || query.trim().length === 0) {
    return { pokemon: [], totalCount: 0 };
  }

  // First try exact match (faster)
  const exactMatch = await pokemonRepository.getPokemonByNameOrId(query);
  if (exactMatch) {
    const formatted = await getPokemonDetails(query);
    return {
      pokemon: formatted ? [formatted] : [],
      totalCount: formatted ? 1 : 0
    };
  }

  // If no exact match, search by partial name
  const searchResults = await pokemonRepository.searchPokemon(query);

  // Get details for first 20 results
  const pokemonWithDetails = await Promise.all(
    searchResults.results.slice(0, 20).map((pokemon) => {
      return getPokemonDetails(pokemon.name);
    })
  );

  return {
    pokemon: pokemonWithDetails.filter((p) => p !== null),
    totalCount: searchResults.count
  };
};
```

2. Save the file

---

## Step 8: Add Type Functions

1. Add these functions for working with types:

```javascript
export const getPokemonTypes = async () => {
  const types = await pokemonRepository.getPokemonTypes();

  return types
    // Remove special types
    .filter((t) => t.name !== 'unknown' && t.name !== 'shadow')
    // Format for display
    .map((t) => ({
      name: t.name,
      displayName: formatName(t.name)
    }));
};

export const getPokemonByType = async (
  typeName,
  page = 1,
  limit = config.pagination.defaultLimit
) => {
  const pokemonList = await pokemonRepository.getPokemonByType(typeName);

  if (!pokemonList) {
    return null; // Type not found
  }

  // Manual pagination (API returns all at once)
  const offset = (page - 1) * limit;
  const paginatedList = pokemonList.slice(offset, offset + limit);

  // Get details for this page
  const pokemonWithDetails = await Promise.all(
    paginatedList.map((pokemon) => {
      return getPokemonDetails(pokemon.name);
    })
  );

  return {
    pokemon: pokemonWithDetails.filter((p) => p !== null),
    type: typeName,
    totalCount: pokemonList.length,
    currentPage: page,
    totalPages: Math.ceil(pokemonList.length / limit),
    hasNextPage: offset + limit < pokemonList.length,
    hasPrevPage: page > 1
  };
};
```

2. Save the file

---

## Step 9: Verify Your Complete File

Your `src/services/pokemonService.js` should now have all these functions. Verify it matches the structure shown in the repository.

---

## Understanding Key Concepts

### Promise.all for Parallel Requests

```javascript
const pokemonWithDetails = await Promise.all(
  data.results.map(async (pokemon) => {
    return getPokemonDetails(pokemon.name);
  })
);
```

`Promise.all()` runs multiple async operations in parallel - much faster than sequential!

### Pagination Formula

```
Page 1: Items 1-20   (offset: 0)
Page 2: Items 21-40  (offset: 20)
Page 3: Items 41-60  (offset: 40)

Formula: offset = (page - 1) * limit
```

---

## Summary

| Function | Purpose | Returns |
|----------|---------|---------|
| `getPokemonDetails(nameOrId)` | Get formatted Pokemon data | Pokemon object or `null` |
| `getAllPokemon(page, limit)` | Paginated list with details | `{ pokemon, pagination... }` |
| `searchPokemon(query)` | Search by name | `{ pokemon, totalCount }` |
| `getPokemonTypes()` | List all types | Array of types |
| `getPokemonByType(type, page)` | Pokemon by type | `{ pokemon, pagination... }` |

---

## Step 10: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add pokemon service for business logic

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

```cmd
git commit -m "chore: add pokemon service for business logic" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Now let's build the controllers that use these services.

Next: [06 - Building the Controller Layer](./06-building-the-controller.md)
