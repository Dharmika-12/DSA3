# Multi-Pattern Search Engine — Aho–Corasick

DSA college project. React + Vite frontend for searching many patterns at once in the SMS Spam Collection dataset, with a step-by-step Aho–Corasick visualizer.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## Pages

| Page | Purpose |
|---|---|
| Dashboard | Dataset, messages loaded, pattern count, matches, occurrences, status |
| Search Dataset | Comma-separated patterns, Build Automaton, Search Dataset, results and positions |
| Visualizer | Interactive trie construction → failure links → text scanning → matches (Start / Previous / Next Step / Reset) |
| Analytics | Pattern frequency bars, spam vs ham split, statistics |
| Matches | Message ID, pattern, position, message, with text / pattern / label filters |

## What is real and what is demo

- **Search, Analytics and Matches use a demo data layer** (`src/services/mock.js`). It loads `public/spam.csv` and does a simple `indexOf` scan. **It is not Aho–Corasick.**
- **The Visualizer** (`src/lib/trace.js`) generates a teaching trace of Aho–Corasick for a tiny example so you can step through it. It is not used to search the dataset.
- **The real algorithm will be implemented in the Java backend.**

## Where the Java backend connects

Everything goes through **`src/services/api.js`**. Components never call `fetch` directly.

1. Run your Java server (default expected: `http://localhost:8080`; change in `vite.config.js` proxy).
2. Copy `.env.example` to `.env` (sets `VITE_USE_MOCK=false`).
3. Implement these endpoints:

| Function | Endpoint | Response |
|---|---|---|
| `getDatasetInfo()` | `GET /api/dataset` | `{ name, count }` |
| `buildAutomaton(patterns)` | `POST /api/automaton/build` `{patterns}` | `{ patternCount, nodeCount, buildMs }` |
| `searchDataset(patterns)` | `POST /api/search` `{patterns}` | `{ patterns, matchedMessages, totalOccurrences, executionMs, matches:[{id, pattern, position, message, label}] }` |
| `getAnalytics()` | `GET /api/analytics` | `{ frequency:[{pattern,count}], spamMatches, hamMatches, avgPosition }` |

Enable CORS on the Java side if you set `VITE_API_URL` instead of using the Vite proxy.

## Structure

```
src/
  App.jsx                state + navigation
  services/api.js        API layer (swap mock for Java here)
  services/mock.js       demo data (not Aho–Corasick)
  lib/trace.js           visualizer step generator (teaching example)
  components/            Dashboard, SearchPanel, Visualizer, Analytics, MessageTable
public/spam.csv          SMS Spam Collection
```
