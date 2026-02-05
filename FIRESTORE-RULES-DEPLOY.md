# Deploy Firestore rules to fix "Missing or insufficient permissions"

The app needs these rules in your Firebase project. If you see **FirebaseError: Missing or insufficient permissions** on `/profile`, the rules in Firebase are likely still default (deny all).

## Steps

1. Open **[Firebase Console](https://console.firebase.google.com)** → select project **verified-next**.
2. In the left sidebar, go to **Build** → **Firestore Database**.
3. Open the **Rules** tab.
4. Replace the entire rules editor content with the rules below.
5. Click **Publish**.

## Rules to paste

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /profiles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId
        || (resource != null && (resource.data.visibility == 'public' || resource.data.visibility == 'unlisted'));
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

After publishing, refresh your app and try the profile page again.
