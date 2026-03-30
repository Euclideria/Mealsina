# Mealsina API Documentation

**Base URL:** `http://localhost:8000`
**Version:** v1
**Authentication:** Tous les endpoints (sauf `/auth/login`) nécessitent le header `Authorization: Bearer <access_token>`

---

## Table des Matières

1. [Authentification](#1-authentification)
2. [Repas](#2-repas-meals)
3. [Humeur](#3-humeur-moods)
4. [Garmin](#4-garmin)
5. [Bilans Sanguins](#5-bilans-sanguins-blood-tests)
6. [Traitements](#6-traitements-treatments)
7. [Maladies](#7-maladies-illness)
8. [Objectifs de Santé](#8-objectifs-de-santé-health-goals)
9. [KPIs](#9-kpis)
10. [Chat IA](#10-chat-ia)
11. [Admin API](#11-admin-api)
12. [Profil Personnel](#12-profil-personnel)

---

## 1. Authentification

**Prefix:** `/api/v1/auth`

### POST /login
**Connexion pour obtenir les tokens d'accès.**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"moi","password":"admin123"}'
```

**Réponse (200):**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

---

### POST /refresh
**Renouveler le token d'accès.**

```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Authorization: Bearer <refresh_token>"
```

---

### GET /me
**Obtenir les informations de l'utilisateur connecté.**

```bash
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer <access_token>"
```

**Réponse (200):**
```json
{
  "id": 1,
  "email": "moi",
  "preferences": {
    "auto_approve_low_risk": true,
    "auto_approve_treatment_intake": true,
    "auto_approve_meal": true,
    "treatment_reminder_enabled": true,
    "daily_report_enabled": true,
    "theme": "system",
    "units": "metric",
    "language": "fr",
    "share_analytics": false
  }
}
```

---

## 2. Repas (Meals)

**Prefix:** `/api/v1/meals`

### POST /analyze
**Analyser une photo de repas avec IA (Gemini + USDA).**

```bash
curl -X POST http://localhost:8000/api/v1/meals/analyze \
  -H "Authorization: Bearer <token>" \
  -F "file=@repas.jpg" \
  -F "description=Déjeuner équilibré"
```

**Réponse (200):**
```json
{
  "meal_id": 1,
  "meal": {
    "photo_path": "/uploads/meals/abc123.jpg",
    "items": [
      {"name": "Poulet grillé", "estimated_grams": 150, "confidence": 0.95},
      {"name": "Riz blanc", "estimated_grams": 120, "confidence": 0.90}
    ],
    "nutrients": {
      "macros": {
        "calories": 550,
        "protein_grams": 35,
        "carbs_grams": 60,
        "fat_grams": 18,
        "fiber_grams": 3,
        "sugar_grams": 2,
        "sodium_mg": 800
      }
    },
    "analyzed_at": "2026-03-29T12:00:00"
  },
  "daily_total": {
    "calories": 550,
    "protein_grams": 35,
    "carbs_grams": 60,
    "fat_grams": 18,
    "fiber_grams": 3,
    "sugar_grams": 2,
    "sodium_mg": 800
  }
}
```

---

### GET /daily/{date}
**Obtenir tous les repas d'une journée.**

```bash
curl http://localhost:8000/api/v1/meals/daily/2026-03-29 \
  -H "Authorization: Bearer <token>"
```

**Réponse (200):**
```json
{
  "date": "2026-03-29",
  "meals": [...],
  "total": {
    "calories": 2100,
    "protein_grams": 120,
    "carbs_grams": 250,
    "fat_grams": 70,
    "fiber_grams": 25,
    "sugar_grams": 40,
    "sodium_mg": 3500
  }
}
```

---

### GET /nutrition-history
**Historique nutritionnel sur une période.**

```bash
curl "http://localhost:8000/api/v1/meals/nutrition-history?period=week" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Défaut | Values |
|-------|------|--------|--------|
| period | string | week | `week` (7j), `month` (30j), `90days` (90j) |

---

## 3. Humeur (Moods)

**Prefix:** `/api/v1/moods`

### POST /
**Créer une entrée d'humeur.**

```bash
curl -X POST http://localhost:8000/api/v1/moods \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "motivation": 7,
    "anxiety": 3,
    "focus": 8,
    "libido": 6,
    "notes": "Bonne journée productive"
  }'
```

**Réponse (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "timestamp": "2026-03-29T08:30:00",
  "motivation": 7,
  "anxiety": 3,
  "focus": 8,
  "libido": 6,
  "notes": "Bonne journée productive",
  "created_at": "2026-03-29T08:30:00"
}
```

---

### GET /
**Obtenir les humeurs d'une journée avec moyennes.**

```bash
curl "http://localhost:8000/api/v1/moods?date_str=2026-03-29" \
  -H "Authorization: Bearer <token>"
```

**Réponse (200):**
```json
{
  "date": "2026-03-29",
  "entries": [...],
  "daily_averages": {
    "motivation": 7.5,
    "anxiety": 2.8,
    "focus": 7.2,
    "libido": 6.0
  }
}
```

---

### GET /averages
**Moyennes d'humeur sur une période.**

```bash
curl "http://localhost:8000/api/v1/moods/averages?period=week" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Défaut |
|-------|------|--------|
| period | string | today | `today`, `week`, `month`, `90days` |

---

## 4. Garmin

**Prefix:** `/api/v1/garmin`

### GET /data
**Données Garmin pour graphiques (tous les jours d'un coup).**

```bash
curl "http://localhost:8000/api/v1/garmin/data?period=week" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Values |
|-------|------|--------|
| period | string | `today`, `week`, `month`, `90days` |

**Réponse (200):**
```json
{
  "period": "week",
  "start_date": "2026-03-23",
  "end_date": "2026-03-29",
  "days_count": 7,
  "data": [
    {
      "date": "2026-03-29",
      "resting_heart_rate": 52,
      "avg_heart_rate": 72,
      "heart_rate_variability_ms": 45,
      "sleep_score": 85,
      "total_sleep_minutes": 420,
      "deep_sleep_minutes": 90,
      "rem_sleep_minutes": 100,
      "body_battery": 80,
      "stress_level": 25,
      "steps": 8500,
      "calories_burned": 2400,
      "weight_kg": 78.5,
      "training_readiness": 88
    }
  ]
}
```

---

### GET /logs
**Logs de synchronisation Garmin (paginé).**

```bash
curl "http://localhost:8000/api/v1/garmin/logs?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### GET /status
**Statut de la dernière synchronisation.**

```bash
curl http://localhost:8000/api/v1/garmin/status \
  -H "Authorization: Bearer <token>"
```

**Réponse (200):**
```json
{
  "last_sync_date": "2026-03-29",
  "last_sync_status": "success",
  "last_sync_error": null,
  "last_data_date": "2026-03-29"
}
```

---

## 5. Bilans Sanguins (Blood Tests)

**Prefix:** `/api/v1/blood-tests`

### POST /upload
**Upload un PDF de bilan sanguin (extraction automatique IA).**

```bash
curl -X POST http://localhost:8000/api/v1/blood-tests/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@bilan-sanguin.pdf"
```

**Réponse (201):**
```json
{
  "id": 1,
  "test_date": "2026-03-15",
  "parameters_count": 24,
  "message": "Blood test uploaded successfully"
}
```

---

### GET /
**Lister les bilans sanguins (paginé).**

```bash
curl "http://localhost:8000/api/v1/blood-tests/?limit=10&offset=0" \
  -H "Authorization: Bearer <token>"
```

---

### GET /{id}
**Détail d'un bilan + interprétation IA automatique.**

```bash
curl http://localhost:8000/api/v1/blood-tests/1 \
  -H "Authorization: Bearer <token>"
```

**Réponse (200):**
```json
{
  "id": 1,
  "test_date": "2026-03-15",
  "lab_name": "Labo Paris",
  "file_path": "/uploads/blood_tests/abc.pdf",
  "raw_text": "...",
  "parameters_json": {
    "Fer": {"value": 120, "unit": "µg/L", "reference_min": 60, "reference_max": 160, "is_abnormal": false},
    "Vitamine D": {"value": 25, "unit": "ng/mL", "reference_min": 30, "reference_max": 100, "is_abnormal": true}
  },
  "interpretation_md": "# Analyse du Bilan Sanguin\n\n## Résumé...\n",
  "created_at": "2026-03-15T10:00:00",
  "notes": null
}
```

---

### GET /{id}/pdf
**Télécharger le PDF original.**

```bash
curl http://localhost:8000/api/v1/blood-tests/1/pdf \
  -H "Authorization: Bearer <token>" \
  -o bilan.pdf
```

---

## 6. Traitements (Treatments)

**Prefix:** `/api/v1/treatments`

### POST /
**Créer un traitement.**

```bash
curl -X POST http://localhost:8000/api/v1/treatments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Créatine",
    "dosage_amount": 5,
    "dosage_unit": "g",
    "frequency": "once_daily",
    "duration_days": 90,
    "started_at": "2026-03-01",
    "reason": "Prise de masse",
    "notes": "À prendre avant l'entraînement"
  }'
```

**Réponse (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Créatine",
  "description": null,
  "dosage_amount": 5.0,
  "dosage_unit": "g",
  "frequency": "once_daily",
  "duration_days": 90,
  "is_indeterminate": false,
  "started_at": "2026-03-01T00:00:00",
  "ended_at": "2026-05-30T00:00:00",
  "is_terminated": false,
  "reason": "Prise de masse",
  "notes": "À prendre avant l'entraînement",
  "created_at": "2026-03-01T10:00:00",
  "updated_at": null,
  "is_archived": false
}
```

---

### GET /active
**Lister les traitements actifs (paginé).**

```bash
curl "http://localhost:8000/api/v1/treatments/active?page=1&limit=30" \
  -H "Authorization: Bearer <token>"
```

---

### GET /archived
**Lister les traitements archivés.**

```bash
curl "http://localhost:8000/api/v1/treatments/archived?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### GET /{id}
**Détail d'un traitement.**

```bash
curl http://localhost:8000/api/v1/treatments/1 \
  -H "Authorization: Bearer <token>"
```

---

### PUT /{id}
**Modifier un traitement (ou archiver avec `is_terminated=true`).**

```bash
curl -X PUT http://localhost:8000/api/v1/treatments/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Nouvelle posologie", "is_terminated": true}'
```

---

### DELETE /{id}
**Supprimer un traitement.**

```bash
curl -X DELETE http://localhost:8000/api/v1/treatments/1 \
  -H "Authorization: Bearer <token>"
```

---

## 7. Maladies (Illness)

**Prefix:** `/api/v1/illness`

### POST /
**Créer une entrée maladie.**

```bash
curl -X POST http://localhost:8000/api/v1/illness \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grippe",
    "description": "Influenza",
    "severity": 4,
    "started_at": "2026-03-29T08:00:00",
    "notes": "Fièvre et fatigue"
  }'
```

**Réponse (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Grippe",
  "description": "Influenza",
  "severity": 4,
  "status": "active",
  "started_at": "2026-03-29T08:00:00",
  "ended_at": null,
  "notes": "Fièvre et fatigue",
  "source": "manual",
  "created_at": "2026-03-29T10:00:00",
  "symptoms": []
}
```

---

### GET /active
**Lister les maladies actives.**

```bash
curl "http://localhost:8000/api/v1/illness/active?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### GET /archived
**Lister les maladies archivées (guéries, chroniques).**

```bash
curl "http://localhost:8000/api/v1/illness/archived?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

### GET /{id}
**Détail d'une maladie avec ses symptômes.**

```bash
curl http://localhost:8000/api/v1/illness/1 \
  -H "Authorization: Bearer <token>"
```

---

### POST /{id}/symptoms
**Ajouter un symptôme à une maladie.**

```bash
curl -X POST http://localhost:8000/api/v1/illness/1/symptoms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symptom": "Fièvre",
    "severity": 4,
    "location": "corps entier",
    "notes": "38.5°C"
  }'
```

---

### PUT /{id}/resolve
**Marquer une maladie comme guérie.**

```bash
curl -X PUT http://localhost:8000/api/v1/illness/1/resolve \
  -H "Authorization: Bearer <token>"
```

---

### DELETE /{id}
**Supprimer une maladie.**

```bash
curl -X DELETE http://localhost:8000/api/v1/illness/1 \
  -H "Authorization: Bearer <token>"
```

---

## 8. Objectifs de Santé (Health Goals)

**Prefix:** `/api/v1/health-goals`

### POST /
**Créer un objectif de santé (texte libre).**

```bash
curl -X POST http://localhost:8000/api/v1/health-goals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Être plus masculin le matin",
    "deadline": "2026-06-01",
    "notes": "Faire plus de sport, mieux manger"
  }'
```

**Réponse (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "objective": "Être plus masculin le matin",
  "is_active": true,
  "is_archived": false,
  "started_at": "2026-03-29T12:00:00",
  "ended_at": null,
  "deadline": "2026-06-01",
  "notes": "Faire plus de sport, mieux manger",
  "created_at": "2026-03-29T12:00:00",
  "updated_at": null
}
```

---

### GET /
**Lister les objectifs (10 par page).**

```bash
curl "http://localhost:8000/api/v1/health-goals?page=1&status=active" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Défaut | Values |
|-------|------|--------|--------|
| page | int | 1 | >= 1 |
| status | string | active | `active`, `archived` |

**Réponse (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "objective": "Être plus masculin le matin",
    "is_active": true,
    "is_archived": false,
    "started_at": "2026-03-29T12:00:00",
    "ended_at": null,
    "deadline": "2026-06-01",
    "notes": "Faire plus de sport",
    "created_at": "2026-03-29T12:00:00",
    "updated_at": null
  }
]
```

---

### PUT /{id}
**Modifier un objectif.**

```bash
curl -X PUT http://localhost:8000/api/v1/health-goals/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Nouvelles notes"}'
```

---

### DELETE /{id}
**Supprimer un objectif.**

```bash
curl -X DELETE http://localhost:8000/api/v1/health-goals/1 \
  -H "Authorization: Bearer <token>"
```

---

## 9. KPIs

**Prefix:** `/api/v1/kpi`

### GET /
**Obtenir les scores KPI (bien-être).**

```bash
curl "http://localhost:8000/api/v1/kpi?period=week" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Défaut | Values |
|-------|------|--------|--------|
| period | string | today | `today`, `week`, `month`, `90days` |

**Réponse (200) - période > today:**
```json
{
  "period": "week",
  "start_date": "2026-03-23",
  "end_date": "2026-03-29",
  "days_count": 7,
  "data": [
    {
      "date": "2026-03-29",
      "scores": {
        "sleep_quality": 85.5,
        "recovery": 78.0,
        "activity": 72.3,
        "stress": 45.2,
        "nutrition": 68.0,
        "masculinity": 75.0,
        "overall_wellness": 73.0
      }
    }
  ]
}
```

---

## 10. Chat IA

**Prefix:** `/api/v1/ai`

### POST /chat
**Chat avec l'IA ULTIMATE (streaming SSE).**

```bash
curl -X POST http://localhost:8000/api/v1/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Comment va ma santé aujourd'\''hui?", "stream": false}'
```

**Request body:**
```json
{
  "message": "string",
  "stream": true | false  // default: true
}
```

**Si stream=false, réponse (200):**
```json
{
  "type": "content",
  "content": "Selon vos données..."
}
```

**Si stream=true, réponse (200):** Stream SSE avec events:
- `{"type": "content", "content": "..."}`
- `{"type": "tool_call", "content": "read_personal_rag"}`
- `{"type": "tool_result", "content": "..."}`
- `{"type": "pending_action", "action_id": 1, "tool": "create_treatment"}`
- `{"type": "done", "content": "..."}`

---

### POST /validate-action/{action_id}
**Valider ou rejeter une action en attente.**

```bash
curl -X POST http://localhost:8000/api/v1/ai/validate-action/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "notes": "OK pour moi"}'
```

**Request body:**
```json
{
  "approved": true | false,
  "notes": "string | null"
}
```

---

### GET /pending-actions
**Lister les actions en attente de validation.**

```bash
curl http://localhost:8000/api/v1/ai/pending-actions \
  -H "Authorization: Bearer <token>"
```

---

## 11. Admin API

**Prefix:** `/api/v1/admin`

### GET /api-stats
**Statistiques des coûts API (style Portkey).**

```bash
curl "http://localhost:8000/api/v1/admin/api-stats?period=month" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Défaut | Values |
|-------|------|--------|--------|
| period | string | day | `day`, `week`, `month`, `90days` |

**Réponse (200):**
```json
{
  "total_cost_usd": 12.50,
  "period": "month",
  "by_service": {
    "chat": 5.00,
    "meal_analysis": 3.50,
    "kpi_computation": 2.00,
    "blood_test": 1.50,
    "web_search": 0.50
  },
  "by_day": [
    {"date": "2026-03-29", "cost": 12.50}
  ]
}
```

---

### GET /api-logs
**Logs détaillés des appels API (paginé).**

```bash
curl "http://localhost:8000/api/v1/admin/api-logs?page=1&limit=20&service=chat" \
  -H "Authorization: Bearer <token>"
```

**Query params:**
| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| page | int | 1 | >= 1 |
| limit | int | 20 | 1-100 |
| service | string | null | `chat`, `meal_analysis`, `kpi_computation`, `blood_test`, `web_search` |

**Réponse (200):**
```json
{
  "items": [
    {
      "timestamp": "2026-03-29T10:30:00",
      "service": "chat",
      "provider": "dashscope",
      "model": "qwen-plus",
      "input_tokens": 1500,
      "output_tokens": 500,
      "cost_usd": 0.012,
      "latency_ms": 1200,
      "status": "success"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8
}
```

---

### GET /api-limits
**Voir les limites de spending configurées.**

```bash
curl http://localhost:8000/api/v1/admin/api-limits \
  -H "Authorization: Bearer <token>"
```

**Réponse (200):**
```json
{
  "daily": {"limit_amount_usd": 10.0, "enabled": true},
  "weekly": null,
  "monthly": null
}
```

---

### PUT /api-limits
**Définir une limite de spending.**

```bash
curl -X PUT http://localhost:8000/api/v1/admin/api-limits \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"limit_type": "daily", "limit_amount_usd": 10.0, "enabled": true}'
```

**Request body:**
```json
{
  "limit_type": "daily" | "weekly" | "monthly",
  "limit_amount_usd": 0.0,
  "enabled": true | false
}
```

---

## Résumé des Endpoints

| Méthode | Path | Description |
|---------|------|-------------|
| POST | `/api/v1/auth/login` | Connexion |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/auth/me` | Utilisateur courant |
| POST | `/api/v1/meals/analyze` | Analyser repas |
| GET | `/api/v1/meals/daily/{date}` | Repas par jour |
| GET | `/api/v1/meals/nutrition-history` | Historique nutrition |
| POST | `/api/v1/moods` | Créer humeur |
| GET | `/api/v1/moods` | Humeur par jour |
| GET | `/api/v1/moods/averages` | Moyennes humeur |
| GET | `/api/v1/garmin/data` | Données Garmin |
| GET | `/api/v1/garmin/logs` | Logs sync Garmin |
| GET | `/api/v1/garmin/status` | Statut Garmin |
| POST | `/api/v1/blood-tests/upload` | Upload bilan PDF |
| GET | `/api/v1/blood-tests/` | Lister bilans |
| GET | `/api/v1/blood-tests/{id}` | Détail bilan |
| GET | `/api/v1/blood-tests/{id}/pdf` | Télécharger PDF |
| POST | `/api/v1/treatments` | Créer traitement |
| GET | `/api/v1/treatments/active` | Traitements actifs |
| GET | `/api/v1/treatments/archived` | Traitements archivés |
| GET | `/api/v1/treatments/{id}` | Détail traitement |
| PUT | `/api/v1/treatments/{id}` | Modifier traitement |
| DELETE | `/api/v1/treatments/{id}` | Supprimer traitement |
| POST | `/api/v1/illness` | Créer maladie |
| GET | `/api/v1/illness/active` | Maladies actives |
| GET | `/api/v1/illness/archived` | Maladies archivées |
| GET | `/api/v1/illness/{id}` | Détail maladie |
| POST | `/api/v1/illness/{id}/symptoms` | Ajouter symptôme |
| PUT | `/api/v1/illness/{id}/resolve` | Guérir maladie |
| DELETE | `/api/v1/illness/{id}` | Supprimer maladie |
| POST | `/api/v1/health-goals` | Créer objectif |
| GET | `/api/v1/health-goals` | Lister objectifs |
| PUT | `/api/v1/health-goals/{id}` | Modifier objectif |
| DELETE | `/api/v1/health-goals/{id}` | Supprimer objectif |
| GET | `/api/v1/kpi` | Scores KPI |
| POST | `/api/v1/ai/chat` | Chat IA |
| POST | `/api/v1/ai/validate-action/{id}` | Valider action |
| GET | `/api/v1/ai/pending-actions` | Actions en attente |
| GET | `/api/v1/admin/api-stats` | Stats coûts API |
| GET | `/api/v1/admin/api-logs` | Logs API |
| GET | `/api/v1/admin/api-limits` | Limites spending |
| PUT | `/api/v1/admin/api-limits` | Définir limite |
| POST | `/api/v1/profile` | Créer profil |
| GET | `/api/v1/profile` | Voir profil |
| PUT | `/api/v1/profile` | Modifier profil |

---

## 12. Profil Personnel

**Prefix:** `/api/v1/profile`

### POST /
**Créer ou mettre à jour le profil personnel.** Un seul profil par utilisateur.

```bash
curl -X POST http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Reza",
    "lastname": "Mohammadi",
    "birthdate": "1990-01-15",
    "height_cm": 178,
    "weight_kg": 75,
    "origin": "Iran",
    "father_history": "diabete type 2, hypertension",
    "mother_history": "hypothyroidisme",
    "periods": {
      "2020-2022": "Covid long + appendicite operée",
      "2018-2019": "Burnout pro severre",
      "2015-2016": "Fracture tibia"
    },
    "notes": "Objectif: perte de poids 5kg"
  }'
```

**Réponse (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "firstname": "Reza",
  "lastname": "Mohammadi",
  "birthdate": "1990-01-15",
  "age": 36,
  "height_cm": 178,
  "weight_kg": 75.0,
  "origin": "Iran",
  "father_history": "diabete type 2, hypertension",
  "mother_history": "hypothyroidisme",
  "periods": {
    "2020-2022": "Covid long + appendicite operée",
    "2018-2019": "Burnout pro severre",
    "2015-2016": "Fracture tibia"
  },
  "notes": "Objectif: perte de poids 5kg",
  "created_at": "2026-03-29T10:00:00",
  "updated_at": "2026-03-29T10:00:00"
}
```

| Champ | Type | Description |
|-------|------|-------------|
| firstname | string? | Prénom |
| lastname | string? | Nom de famille |
| birthdate | string? | Date de naissance (YYYY-MM-DD). L'âge est calculé automatiquement |
| height_cm | int? | Taille en cm (100-250) |
| weight_kg | float? | Poids en kg (30-300) |
| origin | string? | Pays/region d'origine |
| father_history | string? | Antécédents médicaux du père |
| mother_history | string? | Antécédents médicaux de la mère |
| periods | dict? | Périodes marquantes: `{"2020-2022": "description"}` |
| notes | string? | Notes libres additionnelles |

---

### GET /
**Récupérer le profil personnel de l'utilisateur.**

```bash
curl http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer <token>"
```

**Réponse (200):** Même format que POST.

**Erreur (404):** `"Profil non trouvé. Créez un profil avec POST."`

---

### PUT /
**Modifier le profil personnel.** Les champs non fournis ne sont pas modifiés (partial update).

```bash
curl -X PUT http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"weight_kg": 72, "notes": "Perte de 3kg depuis Janvier"}'
```

**Réponse (200):** Même format que POST.

**Note:** Chaque modification crée une nouvelle entrée dans le RAG pour que l'IA puisse suivre l'évolution du profil.
