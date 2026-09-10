# Public Documentation

## Status

- Created: `10-09-2026`
- Last updated: `10-09-2026`
- Version: `1.0`

## Purpose

Ten katalog zawiera dokumentację, która może być publikowana razem z repozytorium Ekstropii. Opisuje ona założenia produktu, publiczne kontrakty treści oraz stabilne decyzje architektoniczne.

## Structure

```text
docs/public/
├── product/        # wizja, odbiorcy, model produktu i information architecture
├── architecture/   # architektura, model danych i rejestr decyzji technicznych
├── content/        # publiczne zasady tworzenia i utrzymania treści
└── quality/        # checklisty jakości publikowanych materiałów
```

## Policy of visible 

Poszczególne foldery i dokumenty które domyślnie mają być publiczne, mogą pozostawać ukryte do czasu wykreowania spójnej wizji dokumentów lub realnego oddziaływania z zawartością lub kodem źródłowym.

## Source of truth

W przypadku konfliktu dokumentów obowiązuje kolejność:

1. `docs/public/product/` — intencja i model produktu,
2. `docs/public/architecture/` — sposób realizacji wymagań produktowych,
3. `docs/public/content/` — kontrakty redakcyjne,
4. `docs/internal/` — plany wykonawcze i notatki implementacyjne.

Dokument wewnętrzny nie może zmieniać założeń produktu bez równoczesnej aktualizacji odpowiedniego dokumentu publicznego.
