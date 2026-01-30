# 08 - Building Views with EJS

Views are the HTML templates that display data to users. We use EJS (Embedded JavaScript) as our template engine.

---

## What is EJS?

EJS lets you embed JavaScript in HTML:

```html
<!-- Regular HTML -->
<h1>Hello World</h1>

<!-- EJS with dynamic content -->
<h1>Hello <%= userName %></h1>
```

---

## EJS Syntax

| Syntax | Purpose | Example |
|--------|---------|---------|
| `<%= %>` | Output (escaped) | `<%= pokemon.name %>` |
| `<%- %>` | Output (unescaped) | `<%- include('header') %>` |
| `<% %>` | JavaScript logic | `<% if (condition) { %>` |

---

## Step 1: Create the Header Partial

1. Create a new file `src/views/partials/header.ejs`

2. Add this code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokedex</title>
  <link rel="stylesheet" href="/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="pokedex-container">
    <header class="pokedex-header">
      <div class="header-left">
        <div class="big-light"></div>
        <div class="small-lights">
          <div class="small-light red"></div>
          <div class="small-light yellow"></div>
          <div class="small-light green"></div>
        </div>
      </div>
      <a href="/" class="logo-link">
        <h1 class="logo">Pokedex</h1>
      </a>
    </header>
```

3. Save the file

---

## Step 2: Create the Footer Partial

1. Create a new file `src/views/partials/footer.ejs`

2. Add this code:

```html
    <footer class="pokedex-footer">
      <p>Data provided by <a href="https://pokeapi.co/" target="_blank">PokeAPI</a></p>
    </footer>
  </div>
</body>
</html>
```

3. Save the file

---

## Step 3: Create the Index Page

1. Create a new file `src/views/index.ejs`

2. Add this code:

```html
<%- include('partials/header') %>

<main class="main-content">
  <div class="search-section">
    <form action="/search" method="GET" class="search-form">
      <div class="search-input-wrapper">
        <input
          type="text"
          name="q"
          placeholder="Search Pokemon by name or ID..."
          value="<%= searchQuery %>"
          class="search-input"
        >
        <button type="submit" class="search-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </form>

    <div class="type-filter">
      <label>Filter by Type:</label>
      <div class="type-buttons">
        <a href="/" class="type-btn <%= selectedType === '' ? 'active' : '' %>">All</a>
        <% types.forEach(type => { %>
          <a href="/type/<%= type.name %>" class="type-btn type-<%= type.name %> <%= selectedType === type.name ? 'active' : '' %>">
            <%= type.displayName %>
          </a>
        <% }); %>
      </div>
    </div>
  </div>

  <% if (searchQuery) { %>
    <div class="search-results-info">
      <p>Found <%= totalCount %> result(s) for "<%= searchQuery %>"</p>
      <a href="/" class="clear-search">Clear search</a>
    </div>
  <% } %>

  <% if (selectedType) { %>
    <div class="search-results-info">
      <p>Showing <%= totalCount %> <%= selectedType %> type Pokemon</p>
      <a href="/" class="clear-search">Show all</a>
    </div>
  <% } %>

  <div class="pokemon-grid">
    <% if (pokemon && pokemon.length > 0) { %>
      <% pokemon.forEach(poke => { %>
        <a href="/pokemon/<%= poke.name %>" class="pokemon-card type-bg-<%= poke.types[0] %>">
          <div class="pokemon-id">#<%= String(poke.id).padStart(3, '0') %></div>
          <div class="pokemon-image">
            <img src="<%= poke.image || poke.sprite %>" alt="<%= poke.displayName %>" loading="lazy">
          </div>
          <h3 class="pokemon-name"><%= poke.displayName %></h3>
          <div class="pokemon-types">
            <% poke.types.forEach(type => { %>
              <span class="type-badge type-<%= type %>"><%= type %></span>
            <% }); %>
          </div>
        </a>
      <% }); %>
    <% } else { %>
      <div class="no-results">
        <p>No Pokemon found</p>
      </div>
    <% } %>
  </div>

  <% if (!searchQuery && totalPages > 1) { %>
    <div class="pagination">
      <% if (hasPrevPage) { %>
        <a href="<%= selectedType ? `/type/${selectedType}?page=${currentPage - 1}` : `/?page=${currentPage - 1}` %>" class="page-btn">
          &laquo; Previous
        </a>
      <% } %>

      <span class="page-info">Page <%= currentPage %> of <%= totalPages %></span>

      <% if (hasNextPage) { %>
        <a href="<%= selectedType ? `/type/${selectedType}?page=${currentPage + 1}` : `/?page=${currentPage + 1}` %>" class="page-btn">
          Next &raquo;
        </a>
      <% } %>
    </div>
  <% } %>
</main>

<%- include('partials/footer') %>
```

3. Save the file

---

## Step 4: Create the Pokemon Detail Page

1. Create a new file `src/views/pokemon.ejs`

2. Add this code:

```html
<%- include('partials/header') %>

<main class="main-content">
  <a href="/" class="back-btn">&larr; Back to Pokedex</a>

  <div class="pokemon-detail type-bg-<%= pokemon.types[0] %>">
    <div class="pokemon-detail-header">
      <div class="pokemon-detail-id">#<%= String(pokemon.id).padStart(3, '0') %></div>
      <h1 class="pokemon-detail-name"><%= pokemon.displayName %></h1>
      <p class="pokemon-genus"><%= pokemon.genus %></p>
    </div>

    <div class="pokemon-detail-content">
      <div class="pokemon-detail-left">
        <div class="pokemon-detail-image">
          <img src="<%= pokemon.image || pokemon.sprite %>" alt="<%= pokemon.displayName %>">
        </div>

        <div class="pokemon-types-detail">
          <% pokemon.types.forEach(type => { %>
            <span class="type-badge type-<%= type %>"><%= type %></span>
          <% }); %>
        </div>
      </div>

      <div class="pokemon-detail-right">
        <div class="pokemon-description">
          <h3>Description</h3>
          <p><%= pokemon.description %></p>
        </div>

        <div class="pokemon-info-grid">
          <div class="info-item">
            <span class="info-label">Height</span>
            <span class="info-value"><%= pokemon.height %> m</span>
          </div>
          <div class="info-item">
            <span class="info-label">Weight</span>
            <span class="info-value"><%= pokemon.weight %> kg</span>
          </div>
          <div class="info-item">
            <span class="info-label">Capture Rate</span>
            <span class="info-value"><%= pokemon.captureRate %></span>
          </div>
          <div class="info-item">
            <span class="info-label">Base Happiness</span>
            <span class="info-value"><%= pokemon.baseHappiness %></span>
          </div>
        </div>

        <div class="pokemon-abilities">
          <h3>Abilities</h3>
          <div class="abilities-list">
            <% pokemon.abilities.forEach(ability => { %>
              <span class="ability-badge <%= ability.isHidden ? 'hidden-ability' : '' %>">
                <%= ability.name %><%= ability.isHidden ? ' (Hidden)' : '' %>
              </span>
            <% }); %>
          </div>
        </div>

        <div class="pokemon-stats">
          <h3>Base Stats</h3>
          <% pokemon.stats.forEach(stat => { %>
            <div class="stat-row">
              <span class="stat-name"><%= stat.name %></span>
              <div class="stat-bar-container">
                <div class="stat-bar" data-width="<%= Math.min(stat.value / 255 * 100, 100) %>"></div>
              </div>
              <span class="stat-value"><%= stat.value %></span>
            </div>
          <% }); %>
        </div>
      </div>
    </div>
  </div>
</main>

<script>
  document.querySelectorAll('.stat-bar').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
</script>

<%- include('partials/footer') %>
```

3. Save the file

---

## Step 5: Create the Error Page

1. Create a new file `src/views/error.ejs`

2. Add this code:

```html
<%- include('partials/header') %>

<main class="main-content">
  <div class="error-container">
    <div class="error-pokeball">
      <div class="pokeball-top"></div>
      <div class="pokeball-center"></div>
      <div class="pokeball-bottom"></div>
    </div>
    <h1 class="error-title"><%= message %></h1>
    <p class="error-message"><%= error %></p>
    <a href="/" class="back-home-btn">Back to Pokedex</a>
  </div>
</main>

<%- include('partials/footer') %>
```

3. Save the file

---

## Step 6: Verify Your Views

You should now have these files:

```
src/views/
├── index.ejs           # Home page
├── pokemon.ejs         # Detail page
├── error.ejs           # Error page
└── partials/
    ├── header.ejs      # Page header
    └── footer.ejs      # Page footer
```

---

## Understanding EJS Patterns

### Including Partials

```html
<%- include('partials/header') %>
```

### Outputting Variables

```html
<h1><%= pokemon.displayName %></h1>
```

### Loops

```html
<% pokemon.forEach(poke => { %>
  <div><%= poke.name %></div>
<% }); %>
```

### Conditionals

```html
<% if (searchQuery) { %>
  <p>Searching for: <%= searchQuery %></p>
<% } %>
```

---

## Step 7: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "feat: add EJS view templates

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

```cmd
git commit -m "chore: add EJS view templates" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Now let's add CSS to make everything look great!

Next: [09 - Styling with CSS](./09-styling.md)
