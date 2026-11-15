// Sign-in gate and cloud sync. Runs after index.html's scripts (module scripts are deferred).
const V = "10.12.2", BASE = `https://www.gstatic.com/firebasejs/${V}/`;
const cfg = window.FIREBASE_CONFIG;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

if (!cfg) {
  window.boot(null);
} else {
  start().catch(e => {
    $("#app").innerHTML = `<div class="auth card"><b>Couldn't start sign-in</b><p class="small muted">${esc(e.message || e)}</p><p class="small muted">You need to be online the first time you open the app.</p><button class="primary" onclick="location.reload()">Try again</button></div>`;
  });
}

async function start() {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(BASE + "firebase-app.js"), import(BASE + "firebase-auth.js"), import(BASE + "firebase-firestore.js")
  ]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  let db;
  try { db = F.initializeFirestore(app, { localCache: F.persistentLocalCache() }); }
  catch (e) { db = F.getFirestore(app); }
  const admins = (window.ADMIN_EMAILS || []).map(e => e.toLowerCase());
  const userDoc = uid => F.doc(db, "users", uid);

  let timer = null, pending = null, current = null;
  const flush = () => {
    clearTimeout(timer); timer = null;
    if (!pending || !current) return;
    const m = pending; pending = null;
    F.setDoc(userDoc(current.uid), {
      name: current.name || "", email: current.email || "",
      mem: JSON.parse(JSON.stringify(m)), updatedAt: F.serverTimestamp()
    }, { merge: true }).catch(e => console.warn("Cloud save failed", e));
  };
  addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });

  window.Cloud = {
    signOut: async () => { flush(); await A.signOut(auth); },
    listUsers: async () => {
      const snap = await F.getDocs(F.collection(db, "users"));
      return snap.docs.map(d => {
        const x = d.data();
        return { uid: d.id, name: x.name, email: x.email, mem: x.mem, updatedAt: x.updatedAt && x.updatedAt.toMillis ? x.updatedAt.toMillis() : null };
      });
    }
  };

  A.onAuthStateChanged(auth, async u => {
    if (!u) { flush(); current = null; window.setCloudSave(null); return renderLogin(); }
    $("#app").innerHTML = `<p class="muted" style="text-align:center;margin-top:60px">Loading your progress&hellip;</p>`;
    current = { uid: u.uid, email: u.email, name: u.displayName || (u.email || "").split("@")[0],
                admin: !!u.email && u.emailVerified && admins.includes(u.email.toLowerCase()) };
    let cloud = null;
    try { const s = await F.getDoc(userDoc(u.uid)); if (s.exists()) cloud = s.data().mem || null; }
    catch (e) { console.warn("Using this device's copy; cloud read failed", e); }
    window.setCloudSave(m => { pending = m; clearTimeout(timer); timer = setTimeout(flush, 1500); });
    window.boot(current, cloud);
    flush(); // make sure a profile exists right away
  });

  function renderLogin(mode = "in", msg = "") {
    const up = mode === "up", reset = mode === "reset";
    $("#modal").innerHTML = "";
    $("#app").innerHTML = `
    <div class="auth">
      <h1>ISC2 ISSAP Practice</h1>
      <p class="sub">${reset ? "We'll email you a link to reset your password." : up ? "Create an account to save your scores and progress." : "Sign in to pick up where you left off."}</p>
      <form class="card" id="f">
        ${up ? `<label class="small">Name<input class="fld" id="nm" autocomplete="name" required></label>` : ""}
        <label class="small">Email<input class="fld" id="em" type="email" autocomplete="email" required></label>
        ${reset ? "" : `<label class="small">Password<input class="fld" id="pw" type="password" minlength="6" autocomplete="${up ? "new-password" : "current-password"}" required></label>`}
        <div class="err" id="err">${esc(msg)}</div>
        <button class="primary" style="width:100%" id="go">${reset ? "Send reset link" : up ? "Create account" : "Sign in"}</button>
        ${!reset && window.GOOGLE_SIGN_IN ? `<button type="button" id="gg" style="width:100%;margin-top:8px">Continue with Google</button>` : ""}
      </form>
      <div class="row small" style="justify-content:space-between">
        ${up || reset ? `<button class="link" data-m="in">Back to sign in</button>` : `<button class="link" data-m="up">Create an account</button><button class="link" data-m="reset">Forgot password?</button>`}
      </div>
    </div>`;
    document.querySelectorAll("[data-m]").forEach(b => b.onclick = () => renderLogin(b.dataset.m));
    const fail = e => { $("#err").textContent = nice(e); $("#go").disabled = false; };
    $("#f").onsubmit = async ev => {
      ev.preventDefault(); $("#go").disabled = true; $("#err").textContent = "";
      const em = $("#em").value.trim();
      try {
        if (reset) { await A.sendPasswordResetEmail(auth, em); renderLogin("in", "Check your email for a reset link."); }
        else if (up) {
          const c = await A.createUserWithEmailAndPassword(auth, em, $("#pw").value);
          await A.updateProfile(c.user, { displayName: $("#nm").value.trim() });
          if (current && current.uid === c.user.uid) { current.name = c.user.displayName; F.setDoc(userDoc(current.uid), { name: current.name }, { merge: true }).catch(() => {}); window.render(); }
          A.sendEmailVerification(c.user).catch(() => {});
        } else await A.signInWithEmailAndPassword(auth, em, $("#pw").value);
      } catch (e) { fail(e); }
    };
    if ($("#gg")) $("#gg").onclick = async () => {
      try { await A.signInWithPopup(auth, new A.GoogleAuthProvider()); }
      catch (e) {
        if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") A.signInWithRedirect(auth, new A.GoogleAuthProvider());
        else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") fail(e);
      }
    };
  }
}

function nice(e) {
  const c = (e && e.code) || "";
  if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c)) return "Email or password is incorrect.";
  if (c.includes("email-already-in-use")) return "There's already an account with that email. Sign in instead.";
  if (c.includes("weak-password")) return "Use a password of at least 6 characters.";
  if (c.includes("invalid-email")) return "That email address doesn't look right.";
  if (c.includes("too-many-requests")) return "Too many attempts. Wait a minute and try again.";
  if (c.includes("network-request-failed")) return "You're offline. Connect and try again.";
  if (c.includes("operation-not-allowed")) return "This sign-in method isn't enabled in Firebase yet.";
  return (e && e.message) || "Something went wrong.";
}
