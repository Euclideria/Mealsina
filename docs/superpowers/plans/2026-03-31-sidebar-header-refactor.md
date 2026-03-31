# Sidebar Header Refactor - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refaire le header de la sidebar pour afficher le logo Mealsina, supprimer le dropdown "Create team", et transformer le bouton en toggle pour collapse/expand la sidebar.

**Architecture:**
- Remplacer le `TeamSwitcher` (DropdownMenu avec flèches) par un bouton simple qui affiche le logo Mealsina
- Au clic → appelle `toggleSidebar()` de `useSidebar()` pour collapse/expand
- Plus de dropdown, plus de "Create team", plus de "Health Dashboard"

**Tech Stack:** React, shadcn sidebar, Tailwind CSS

---

## Task 1: Refaire TeamSwitcher en SidebarHeaderButton

**Files:**
- Modify: `src/components/layout/team-switcher.tsx`

**Changes:**

1. Supprimer les imports inutilisés:
   - `ChevronsUpDown`, `Plus`
   - `DropdownMenu*` components
   - `DropdownMenuShortcut`

2. Garder uniquement:
   - `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`
   - `useSidebar` hook

3. Nouveau composant `TeamSwitcher`:
   - Plus de DropdownMenu
   - Plus de state `activeTeam`
   - Au clic → `toggleSidebar()`
   - Affiche le logo Mealsina (image) + texte "Mealsina"
   - Supprime le champ `plan` (Health Dashboard)

```typescript
// NOUVEAU team-switcher.tsx
import { useSidebar } from '@/components/ui/sidebar'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function TeamSwitcher({}: { teams?: { name: string; logo: string; plan: string }[] }) {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          onClick={toggleSidebar}
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <img
            src='/Mealsina_logo.png'
            alt='Mealsina'
            className='h-8 w-8 rounded-lg object-contain'
          />
          <span className='truncate font-semibold'>Mealsina</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
```

**Steps:**
- [ ] **Step 1:** Read `src/components/layout/team-switcher.tsx`
- [ ] **Step 2:** Rewrite as described above
- [ ] **Step 3:** Verify `npm run build` passes
- [ ] **Step 4:** Commit with message: "refactor: simplify TeamSwitcher to sidebar toggle button"

---

## Task 2: Nettoyer sidebar-data.ts (optionnel)

**Files:**
- Modify: `src/components/layout/data/sidebar-data.ts`

**Changes:**

Dans `teams`, garder la structure mais le `plan` n'est plus utilisé (on peut le laisser pour pas casser d'autres imports, ou le supprimer).

```typescript
teams: [
  {
    name: 'Mealsina',
    logo: '/Mealsina_logo.png',  // URL au lieu de React component
    plan: '',  // Plus affiché, peut rester vide
  },
],
```

Note: `logo` dans sidebar-data n'est plus utilisé car TeamSwitcher utilise maintenant directement `/Mealsina_logo.png`.

**Steps:**
- [ ] **Step 1:** Read `src/components/layout/data/sidebar-data.ts`
- [ ] **Step 2:** Optionnel - nettoyer le champ `plan` ou le laisser
- [ ] **Step 3:** Commit (si modifié): "chore: update sidebar-data teams structure"

---

## Task 3: Vérifier l'import de TeamSwitcher

**Files:**
- Check: `src/components/layout/app-sidebar.tsx`

**Changes:**

Vérifier que `TeamSwitcher` est toujours importé et utilisé. Si TeamSwitcher est renommé ou si l'import change, ajuster `app-sidebar.tsx`.

**Steps:**
- [ ] **Step 1:** Read `src/components/layout/app-sidebar.tsx`
- [ ] **Step 2:** Vérifier que TeamSwitcher est toujours utilisé correctement
- [ ] **Step 3:** Build et tester manuellement (collapse/expand fonctionne)

---

## Verification

- [ ] `npm run build` - build passe
- [ ] La sidebar header affiche le logo Mealsina
- [ ] Le texte "Health Dashboard" n'apparaît plus
- [ ] Les flèches (ChevronsUpDown) ont disparu
- [ ] Au clic sur le header → la sidebar se collapse/expand
- [ ] Plus de dropdown "Create team"

---

## Notes Importantes

1. **Le logo** - On utilise `/Mealsina_logo.png` qui est déjà dans `public/` et servi statiquement.

2. **`toggleSidebar()`** - Fonctionne pour:
   - Desktop: toggle entre expanded/collapsed (icone-only)
   - Mobile: ouvre/ferme le drawer

3. **Pas de breaking changes** - `sidebar-data.ts` n'a pas besoin d'être modifiérigoureusement tant que `teams` garde sa structure. Le composant `TeamSwitcher` ne lit plus `teams` de toute façon.

4. **commit séparé** - Chaque task = son propre commit pour rollback facile.
