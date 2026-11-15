# ISSAP Practice Exam

An offline-capable practice app for the ISC2 ISSAP (Information Systems Security Architecture Professional) exam, built like the ENSLD app.

- **500 original scenario questions**, weighted to the ISC2 ISSAP exam outline:

  | Domain | Weight | Bank | Per full exam |
  |---|---|---|---|
  | 1. Architect for Governance, Compliance and Risk Management | 17% | 85 | 21 |
  | 2. Security Architecture Modeling | 15% | 75 | 19 |
  | 3. Infrastructure Security Architecture | 21% | 105 | 26 |
  | 4. Identity and Access Management (IAM) Architecture | 16% | 80 | 20 |
  | 5. Architect for Application Security | 13% | 65 | 16 |
  | 6. Security Operations Architecture | 18% | 90 | 23 |

- **Full practice exam**: 125 questions, 3-hour timer, flag and review, scored at the end (the real pass mark is 700/1000, so aim for 75%+ here).
- **5-question test**: timed (7 min), scored at the end.
- **Quick practice / domain drills / missed questions**: 5, 10, 20, 50, or all at a time, unseen questions first, explanation after each answer.
- Progress is saved in the browser, with backup and restore as copy-paste text.
- **Optional accounts**: turn on sign-in and every user's scores and progress save to a cloud profile that follows them across devices. Admins get an "All users" view with each person's accuracy, questions seen, per-domain breakdown, and exam history. See [Accounts](#accounts-optional).
- Installable as a home-screen app (PWA) and works offline after the first load.

Questions use the ISC2 style: long scenarios that ask for the BEST, FIRST, or MOST appropriate action from an architect's and management point of view. Every question has an explanation covering why the distractors are wrong. Option lengths are balanced so the longest answer is not a giveaway.

## Files

- `index.html`: the app
- `bank/d1.js` to `bank/d6.js`: the question bank, one file per domain (`{id, d, q, o, a, e}`; `a` is the index of the correct option, and options are shuffled at display time)
- `sw.js`, `manifest.webmanifest`, `icon-*.png`: offline support and app install
- `auth.js`, `firebase-config.js`, `firestore.rules`: optional sign-in and cloud profiles

Host it with GitHub Pages (Settings → Pages → deploy from branch) or open `index.html` from any static web server.

## Accounts (optional)

Out of the box the app has no sign-in and progress stays in the browser. To put a sign-in page in front of it and save each user's progress, connect a free Firebase project (no server needed; it works on GitHub Pages):

1. Go to [console.firebase.google.com](https://console.firebase.google.com), **Add project** (Analytics can be off).
2. **Build → Authentication → Get started.** Enable **Email/Password**, and **Google** if you want "Continue with Google".
3. **Authentication → Settings → Authorized domains:** add your site's domain (e.g. `yourname.github.io`).
4. **Build → Firestore Database → Create database** (production mode, any region).
5. **Firestore → Rules:** paste in `firestore.rules`, replace `you@example.com` with your admin email(s), and **Publish**.
6. **Project settings → Your apps → Web (`</>`)**: register an app and copy the `firebaseConfig` object.
7. In `firebase-config.js`, set `window.FIREBASE_CONFIG` to that object and put the same admin email(s) in `window.ADMIN_EMAILS`. Set `GOOGLE_SIGN_IN = false` if you didn't enable Google.

Once that's deployed, opening the app shows the sign-in page. Each user gets one Firestore document (`users/{uid}`) holding their name, email, per-question stats, and exam history. Users can only read and write their own; admin emails (which must be verified, and Google sign-ins always are) can read everyone's through **All users** on the home screen. Progress that was already in a browser before accounts were turned on is moved into the first account created on that device.

Anyone with the link can create an account. To restrict that, turn off sign-ups (Authentication → Settings → User actions) and add users yourself under Authentication → Users.

The Firebase web config isn't a secret; the security rules are what protect the data. Firebase's free tier is far more than a study group needs.

Questions are original study material, not exam dumps.
