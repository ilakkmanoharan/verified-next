# Verified — Learn & Get Hired

A Next.js app for software engineers to build profiles, take assessments, and get discovered by employers. This repo implements **Plan 1**: Firebase Auth, Firestore, Storage, and core pages (Home, Signup, Login, Profile, Public Profile).

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Firebase**
   - Create or use the Firebase project **verified-next** (see `private/firebase-details.md`).
   - In [Firebase Console](https://console.firebase.google.com):
     - Enable **Authentication** → Email/Password and Google.
     - Create a **Firestore** database (Native mode).
     - Enable **Storage**.
   - Copy `.env.local.example` to `.env.local` and fill in your Firebase config:
     ```bash
     cp .env.local.example .env.local
     ```
     Get values from Project settings → General → Your apps.

3. **Deploy security rules** (optional but recommended)
   - Firestore: `firebase deploy --only firestore:rules` (after `firebase init` and placing `firestore.rules`).
   - Storage: `firebase deploy --only storage` (use `storage.rules` in your project).

## Run

- **Development:** `npm run dev`
- **Production build:** `npm run build` then `npm start`

## Implemented (Plan 1)

- **Auth:** Email/password and Google sign-up and sign-in via Firebase Auth; `AuthContext` with `onAuthStateChanged`.
- **Firestore:** `users` and `profiles` collections; helpers in `lib/firebase/firestore.ts`; security rules in `firestore.rules`.
- **Storage:** Avatar upload at `users/{uid}/avatar`; helpers in `lib/firebase/storage.ts`; rules in `storage.rules`.
- **Pages:**
  - **Home (`/`):** Landing for guests; welcome + “Edit profile” for logged-in users.
  - **Signup (`/signup`):** Email + optional display name, password, confirm password, “Sign up with Google”; creates user and profile in Firestore, redirects to `/profile`.
  - **Login (`/login`):** Email/password and Google; ensures user/profile exist, redirects to `/`.
  - **Profile (`/profile`):** Protected; edit headline, bio, visibility, experience, education, projects, certifications, skills, links; avatar upload.
  - **Public profile (`/profile/[userId]):** Read-only view when visibility is public or unlisted.

See `private/plan1.md` and `private/specification1.md` for full spec and schema.
