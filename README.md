# ISSAP Practice Exam

An offline-capable practice app for the ISC2 ISSAP (Information Systems Security Architecture Professional) exam, built like the ENSLD app.

- **500 original scenario questions**, mapped to the ISC2 ISSAP exam outline effective August 1, 2025:

  | Domain | Weight | Bank | Per full exam |
  |---|---|---|---|
  | 1. Governance, Risk, and Compliance (GRC) | 21% | 133 | 26 |
  | 2. Security Architecture Modeling | 22% | 93 | 28 |
  | 3. Infrastructure and System Security Architecture | 32% | 176 | 40 |
  | 4. Identity and Access Management (IAM) Architecture | 25% | 98 | 31 |

- **Full practice exam**: 125 questions, 3-hour timer, flag and review, scored at the end (the real pass mark is 700/1000, so aim for 75%+ here).
- **5-question test**: timed (7 min), scored at the end.
- **Quick practice / domain drills / missed questions**: 5, 10, 20, 50, or all at a time, unseen questions first, explanation after each answer.
- Progress is saved in the browser, with backup and restore as copy-paste text.
- Installable as a home-screen app (PWA) and works offline after the first load.

Questions use the ISC2 style: long scenarios that ask for the BEST, FIRST, or MOST appropriate action from an architect's and management point of view. Every question has an explanation covering why the distractors are wrong. Option lengths are balanced so the longest answer is not a giveaway. Questions stay at architect level: options describe capabilities and patterns, not product settings or protocol fields.

## Files

- `index.html`: the app
- `bank/d1.js` to `bank/d4.js`: the question bank, one file per domain (`{id, d, q, o, a, e}`; `a` is the index of the correct option, and options are shuffled at display time)
- `sw.js`, `manifest.webmanifest`, `icon-*.png`: offline support and app install

Host it with GitHub Pages (Settings → Pages → deploy from branch) or open `index.html` from any static web server.

Questions are original study material, not exam dumps.
