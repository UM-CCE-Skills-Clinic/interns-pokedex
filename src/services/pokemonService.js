import * as pokemonRepository from '../repositories/pokemonRepository.js';
import { config } from '../config/index.js';

const formatName = (name) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

const formatPokemonData = (pokemon, species = null) => {
  const description =
    species?.flavor_text_entries
      ?.find((entry) => entry.language.name === 'en')
      ?.flavor_text?.replace(/\f/g, ' ') || 'No description available.';

  const genus = species?.genera?.find((g) => g.language.name === 'en')?.genus || 'Unknown';

  return {
    id: pokemon.id,
    name: pokemon.name,
    displayName: formatName(pokemon.name),
    image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
    sprite: pokemon.sprites.front_default,
    types: pokemon.types.map((t) => t.type.name),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    abilities: pokemon.abilities.map((a) => ({
      name: formatName(a.ability.name),
      isHidden: a.is_hidden
    })),
    stats: pokemon.stats.map((s) => ({
      name: formatStatName(s.stat.name),
      value: s.base_stat
    })),
    description,
    genus,
    color: species?.color?.name || 'gray',
    captureRate: species?.capture_rate || 0,
    baseHappiness: species?.base_happiness || 0
  };
};

export const getPokemonDetails = async (nameOrId) => {
  const pokemon = await pokemonRepository.getPokemonByNameOrId(nameOrId);

  if (!pokemon) {
    return null;
  }

  let species = null;
  try {
    species = await pokemonRepository.getPokemonSpecies(pokemon.id);
  } catch {
    // Species data is optional
  }

  return formatPokemonData(pokemon, species);
};

export const getAllPokemon = async (page = 1, limit = config.pagination.defaultLimit) => {
  const offset = (page - 1) * limit;
  const data = await pokemonRepository.getAllPokemon(limit, offset);

  const pokemonWithDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const details = await getPokemonDetails(pokemon.name);
      return details;
    })
  );

  return {
    pokemon: pokemonWithDetails,
    totalCount: data.count,
    currentPage: page,
    totalPages: Math.ceil(data.count / limit),
    hasNextPage: offset + limit < data.count,
    hasPrevPage: page > 1
  };
};

export const searchPokemon = async (query) => {
  if (!query || query.trim().length === 0) {
    return { pokemon: [], totalCount: 0 };
  }

  // First try exact match
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

export const getPokemonTypes = async () => {
  const types = await pokemonRepository.getPokemonTypes();
  return types
    .filter((t) => t.name !== 'unknown' && t.name !== 'shadow')
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
    return null;
  }

  const offset = (page - 1) * limit;
  const paginatedList = pokemonList.slice(offset, offset + limit);

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
