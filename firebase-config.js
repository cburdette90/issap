// Sign-in and cloud profiles.
//
// Leave FIREBASE_CONFIG as null to run with no accounts (progress stays in the
// browser, as before). Paste your Firebase web app config here to require
// sign-in and save each user's progress to Firestore. See README for setup.
// This config is not a secret; firestore.rules is what protects the data.
window.FIREBASE_CONFIG = null;
/* Example:
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  appId: "1:123:web:abc"
};
*/

// Emails that get the "All users" progress view. Must match isAdmin() in
// firestore.rules (the rules are what actually enforce it).
window.ADMIN_EMAILS = [];

// Show "Continue with Google" (enable the Google provider in Firebase first).
window.GOOGLE_SIGN_IN = true;
