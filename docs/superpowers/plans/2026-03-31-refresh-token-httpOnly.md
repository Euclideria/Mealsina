# Refresh Token avec httpOnly Cookie - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter le refresh token automatique avec httpOnly cookie pour le frontend Mealsina. Le backend已经开始 à utiliser httpOnly cookies pour le refresh_token. Le frontend doit s'adapter.

**Architecture:**
- Login → Server set `refresh_token` httpOnly cookie + returns `{ access_token }` in body
- API calls → `access_token` attached via Authorization header (from non-httpOnly cookie)
- On 401 → Call `/auth/refresh` (browser auto-sends httpOnly cookie), get new `access_token`, retry

**Tech Stack:** React, TanStack Query, Zustand, Fetch API

---

## Task 1: Modifier apiClient pour supporter le refresh automatique

**Files:**
- Modify: `src/lib/api-client.ts`

**Changes:**
1. Ajouter une méthode `_refreshAccessToken()` qui appelle `POST /auth/refresh`
2. Ajouter une méthode `_isRefreshing` flag pour éviter les appels simultanés
3. Modifier `get()`, `post()`, `put()`, `delete()` pour intercepter les 401
4. Sur 401, attendre le refresh, puis retry la requête originale

```typescript
// src/lib/api-client.ts

let _isRefreshing = false
let _refreshPromise: Promise<string> | null = null

async function _refreshAccessToken(): Promise<string> {
  const response = await fetch(buildUrl('/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // httpOnly cookie automatically sent by browser
  })

  if (!response.ok) {
    // Refresh token expired or invalid - force logout
    useAuthStore.getState().auth.reset()
    window.location.href = '/sign-in'
    throw new Error('Session expired')
  }

  const result = await response.json()
  const newToken = result.access_token

  // Store new access token
  useAuthStore.getState().auth.setAccessToken(newToken)

  return newToken
}

async function _fetchWithRefresh<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const response = await fetch(url, options)

  if (response.status === 401 && !options.headers?.['x-refreshing']) {
    if (!_isRefreshing) {
      _isRefreshing = true
      _refreshPromise = _refreshAccessToken()
    }

    try {
      await _refreshPromise
      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${useAuthStore.getState().auth.accessToken}`,
          'x-refreshing': 'true',
        },
      }).then(handleResponse<T>)
    } finally {
      _isRefreshing = false
      _refreshPromise = null
    }
  }

  return handleResponse<T>(response)
}
```

**Steps:**
- [ ] **Step 1:** Read current `src/lib/api-client.ts`
- [ ] **Step 2:** Add refresh logic to apiClient
- [ ] **Step 3:** Test: verify `npm run build` passes
- [ ] **Step 4:** Commit

---

## Task 2: Mettre à jour UserAuthForm pour ne plus extraire refresh_token

**Files:**
- Modify: `src/features/auth/sign-in/components/user-auth-form.tsx`

**Changes:**
- Supprimer `const refreshToken = result.refresh_token` (le backend met le refresh_token dans un httpOnly cookie, plus besoin de l'extraire du body)

**Steps:**
- [ ] **Step 1:** Read `src/features/auth/sign-in/components/user-auth-form.tsx`
- [ ] **Step 2:** Remove `result.refresh_token` extraction (line 69-70 area)
- [ ] **Step 3:** Verify build passes
- [ ] **Step 4:** Commit

---

## Task 3: Ajouter /auth/logout endpoint (optionnel mais recommandé)

**Files:**
- Modify: `src/lib/api-client.ts`

**Changes:**
- Ajouter `logout()` method qui appelle `POST /auth/logout` (.server clear httpOnly cookie)

```typescript
async logout(): Promise<void> {
  await fetch(buildUrl('/auth/logout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  useAuthStore.getState().auth.reset()
}
```

**Steps:**
- [ ] **Step 1:** Add logout method to apiClient
- [ ] **Step 2:** Verify build passes
- [ ] **Step 3:** Commit

---

## Task 4: Vérifier que auth-store.ts fonctionne correctement avec le refresh

**Files:**
- Modify: `src/stores/auth-store.ts`
- Modify: `src/features/auth/sign-in/components/user-auth-form.tsx` (logout call)

**Changes:**
- Vérifier que `setAccessToken` met à jour le cookie (non-httpOnly) où apiClient lit
- Ajouter logout sur le bouton déconnexion existant

**Steps:**
- [ ] **Step 1:** Read `src/stores/auth-store.ts` et `src/components/layout/authenticated-layout.tsx` pour trouver le bouton logout
- [ ] **Step 2:** Vérifier le flow logout actuel
- [ ] **Step 3:** Si pas de logout, ajouter un call `apiClient.logout()` sur le bouton
- [ ] **Step 4:** Verify build passes
- [ ] **Step 5:** Commit

---

## Verification

- [ ] `npm run dev` - l'app démarre
- [ ] `npm run build` - build passe
- [ ] Login fonctionne et redirige vers dashboard
- [ ] Quand access_token expire, le refresh automatique fonctionne
- [ ] Logout efface le cookie httpOnly et redirige vers /sign-in

---

## Notes Importantes

1. **Le httpOnly cookie** - Le browser envoie automatiquement le cookie sur `/auth/refresh`. JavaScript ne peut pas lire ce cookie (c'est le but), mais le browser le gère tout seul.

2. **Race condition** - Si plusieurs requêtes reçoivent 401 en même temps, on ne veut appeler /auth/refresh qu'une fois. D'où le flag `_isRefreshing` et `_refreshPromise`.

3. **Backend requis** - Le backend doit:
   - `POST /auth/login` → `Set-Cookie: refresh_token=xxx; HttpOnly; Secure; SameSite=Strict` + `body: { access_token }`
   - `POST /auth/refresh` → utilise le cookie httpOnly, retourne `{ access_token }`
   - `POST /auth/logout` → `Set-Cookie: refresh_token=; max-age=0`
