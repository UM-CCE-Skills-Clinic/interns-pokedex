# 10 - Testing

The repository includes pre-written tests to verify your application works correctly. If all tests pass, your app is built properly!

---

## Step 1: Run the Tests

1. Open your terminal in the project directory

2. Run the test command:

```bash
npm test
```

3. Wait for the tests to complete

---

## Step 2: Check the Results

### If All Tests Pass

You should see output like this:

```
 PASS  tests/pokemonService.test.js
 PASS  tests/api.test.js

Test Suites: 2 passed, 2 total
Tests:       25 passed, 25 total
```

**All tests passing means your app is built correctly!**

---

### If Tests Fail

You'll see output showing which tests failed:

```
 FAIL  tests/api.test.js
  ● Pokemon API Endpoints › GET /api/pokemon › should return pokemon list

    Expected: 200
    Received: 500
```

This means something is wrong with your code. Check:

1. **File names** - Are all files named correctly?
2. **File locations** - Are files in the correct folders?
3. **Exports** - Did you export all functions?
4. **Typos** - Check for spelling mistakes in your code

---

## Step 3: Fix Failing Tests

1. Read the error message to find which test failed

2. The test name tells you what's broken:
   - `GET /api/pokemon` → Check your routes and controllers
   - `getPokemonDetails` → Check your service layer
   - `Failed to fetch` → Check your repository layer

3. Fix the issue in your code

4. Run tests again:

```bash
npm test
```

5. Repeat until all tests pass

---

## Step 4: Run Code Quality Checks

1. Check for linting errors:

```bash
npm run lint
```

2. If there are errors, fix them automatically:

```bash
npm run lint:fix
```

3. Check code formatting:

```bash
npm run format:check
```

4. If formatting is wrong, fix it:

```bash
npm run format
```

---

## Step 5: Verify Everything Passes

1. Run all checks together:

```bash
npm run lint && npm run format:check && npm test
```

2. All commands should complete without errors

3. If everything passes, your app is ready!

---

## Step 6: Commit Your Progress

1. Stage your changes:

```bash
git add .
```

2. Commit with the conventional format:

```bash
git commit -m "test: verify all tests pass

Full Name: Juan Dela Cruz
Umindanao: juan.delacruz@email.com"
```

```cmd
git commit -m "chore: verify all tests pass" -m "Full Name: D***** ******* ****** Franco" -m "Umindanao: d.franco.******@umindanao.edu.ph"
```

3. Replace the name and email with your own information

---

## What's Next?

Let's put it all together and run the application!

Next: [11 - Running the App](./11-running-the-app.md)
