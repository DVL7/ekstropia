# Logical Content Model

## Status

- Created: `01-09-2026`
- Last updated: `10-09-2026`
- Version: `2.0`


## Purpose

Dokument definiuje semantykę danych Ekstropii. Nie opisuje konkretnego schematu TypeScript ani tabel SQL.

Model ma być zgodny z rozróżnieniem z dokumentacji produktowej:

- warstwy Atlasu A0–A4 opisują rolę bytu w modelu świata,
- hierarchia `System / Concept → Section → Article` organizuje treść,
- relacje wiedzy są niezależne od hierarchii plików i od renderera grafu.

## Core rules

### Stable ID and slug are different

Każda encja merytoryczna ma stabilny `id` oraz, jeśli posiada stronę publiczną, `slug`.

`id`:

- jest używany przez relacje i walidację,
- nie zmienia się po zmianie tytułu lub URL,
- nie powinien zależeć od pozycji encji w grafie.

`slug`:

- służy do routingu,
- może ulec zmianie redakcyjnej,
- wymaga redirectu z poprzedniego adresu.

### One-way containment

Hierarchię zapisujemy od dziecka do rodzica.

Nie przechowujemy równocześnie ręcznie:

- `system.sections[]` i `section.systemId`,
- `section.articles[]` i `article.sectionId`.

Listy rodziców są wyliczane z encji dzieci.

### Relations have one canonical record

Relacja między dwoma bytami jest zapisywana raz.

Listy takie jak:

- prerequisite'y artykułu,
- related topics,
- upstream/downstream,
- krawędzie grafu systemowego,

są widokami wyliczanymi z modelu `Relation`.

### Public route is derived

Route wynika z typu encji i slugu. Nie powinien być ręcznie powtarzany w wielu plikach.

Wyjątek stanowią węzły Atlasu bez własnej publicznej treści, które mogą nie mieć route.

## Entity: AtlasNode

Węzeł globalnego Atlasu.

```text
id
title
layer: A0 | A1 | A2 | A3 | A4
kind: formal-science | natural-science | system | gateway
summary
status
targetId?
displayOrder?
```

`targetId` wskazuje publiczny byt reprezentowany przez węzeł, np. `system:*`, `concept:*` albo `gateway:*`.

Węzeł może istnieć jako `planned` bez publicznej strony.

## Entity: System

Pełny system A2 lub A3.

```text
id
title
slug
atlasNodeId
atlasLayer: A2 | A3
summary
scope
status
coverage: planned | in-progress | core-complete
lastReviewed
aliases[]
startHere[]
redirectFrom[]
```

`startHere[]` jest świadomie kuratorskie i może wskazywać wybrane publiczne encje. Lista działów jest wyliczana.

## Entity: Concept

Treść podstawowa A0/A1 używana przez wiele systemów.

```text
id
title
slug
atlasNodeId?
atlasLayer: A0 | A1
summary
scope
status
lastReviewed
aliases[]
redirectFrom[]
```

Concept może pozostać wyłącznie węzłem globalnej mapy do czasu powstania realnej treści.

Jeżeli rośnie, może posiadać działy i artykuły przy użyciu tego samego modelu hierarchii co system.

## Entity: Section

Logiczny fragment systemu lub conceptu.

```text
id
title
slug
parentId: system:* | concept:*
summary
learningGoal
status
lastReviewed?
aliases[]
redirectFrom[]
```

Lista artykułów jest wyliczana.

## Entity: Article

Kanoniczne wyjaśnienie pojedynczego zagadnienia.

```text
id
title
slug
summary
status
lastReviewed
contextId: system:* | concept:*
sectionId?
aliases[]
keywords[]
changeSensitivity: low | medium | high
redirectFrom[]
furtherReading[]
```

Jeżeli `sectionId` istnieje, dział musi należeć do tego samego `contextId`.

Artykuł może należeć bezpośrednio do conceptu bez działu, jeżeli zakres conceptu jest zbyt mały, aby uzasadnić dodatkową warstwę nawigacji.

Prerequisite'y, related topics i powiązania z narzędziami są wyprowadzane z relacji.

## Entity: Gateway

Mini-system A4 prowadzący od codziennego doświadczenia do istniejących elementów Atlasu.

```text
id
title
slug
atlasNodeId
summary
status
lastReviewed
entryQuestion
paths[]
aliases[]
redirectFrom[]
```

`paths[]` są kuratorskie. Każdy krok zawiera:

```text
targetId
questionOrLabel
reason?
order?
```

Gateway może linkować do systemu, conceptu, działu, artykułu lub narzędzia.

## Entity: Tool

Interaktywne narzędzie lub model poznawczy.

```text
id
title
slug?
summary
learningGoal
status
fallbackDescription
standalone: boolean
lastReviewed?
```

Jeżeli `standalone = true`, tool może mieć publiczny route. Powiązania z artykułami i działami są relacjami, nie kopiowanymi listami po obu stronach.

## Entity: Source

Wielokrotnie używalne źródło researchu lub cytowania.

```text
id
title
kind?
authorOrInstitution?
url?
identifier?
publishedAt?
accessedAt?
sourceTier?: A | B | C
notes?
```

`identifier` może przechowywać np. DOI, RFC, ISBN lub numer normy.

Bibliografia artykułu powinna wynikać z rzeczywistych markerów cytowań w treści. `Further reading` pozostaje osobną, kuratorską listą.

## Entity: Relation

Relacja jest niezależnym rekordem wiedzy.

```text
id?
from
to
scope: global | system | section
type
label?
showIn[]?
```

### Direction convention

W relacjach kierunkowych `from → to` oznacza, że element źródłowy jest logicznie wcześniejszy, składowy lub wspierający wobec elementu docelowego.

Przykłady:

- `A --prerequisite--> B` — A warto rozumieć przed B,
- `A --component-of--> B` — A jest częścią B,
- `A --foundation-for--> B` — A jest istotną podbudową B.

Ta konwencja jest zgodna z kierunkiem globalnej mapy Atlasu.

### Global relation

MVP używa jednego typu globalnego:

```text
foundation-for
```

Jego znaczenie odpowiada definicji global edge z `docs/public/product/atlas-map.md`.

### Local relation types

Początkowy zestaw:

```text
prerequisite
component-of
related
```

`related` jest semantycznie symetryczne w UI. Nie należy dodawać kolejnych typów, dopóki nie istnieje dla nich rzeczywista potrzeba poznawcza i sposób prezentacji.

## Publication states

Wspólny model stanu:

```text
planned
researching
draft
review
published
needs-review
archived
```

UI publiczne nie musi ujawniać wszystkich stanów roboczych.

`published` oznacza, że treść przeszła wymagany review.

`needs-review` może pozostać publiczne, ale powinno być świadomie obsłużone przez proces utrzymania.

## Derived data

Z modelu źródłowego można wyliczać m.in.:

- działy systemu lub conceptu,
- artykuły działu,
- prerequisite'y i related topics,
- relacje odwrotne,
- graf systemowy i lokalny,
- bibliografię artykułu, działu i systemu,
- pokrycie systemu,
- search documents,
- orphan detection,
- redirects manifest,
- sitemap.

Dane wyliczalne nie powinny być ręcznie synchronizowane w kilku miejscach.

## Required invariants

Walidacja całego modelu powinna zapewniać:

1. globalną unikalność stabilnych `id`,
2. unikalność route w obrębie serwisu,
3. istnienie każdego `parentId`, `contextId`, `sectionId`, `targetId` i endpointu relacji,
4. zgodność `section.parentId` z `article.contextId`,
5. brak cykli `prerequisite`,
6. brak niejednoznacznych duplikatów relacji,
7. poprawny kierunek globalnych `foundation-for`,
8. brak opublikowanych sierot,
9. poprawność identyfikatorów cytowanych źródeł,
10. brak konfliktów redirectów z aktywnymi route.
