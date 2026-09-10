# Architecture Decisions

## Status

- Created: `01-09-2026`
- Last updated: `10-09-2026`
- Version: `2.0`

## Purpose

Dokument zapisuje stabilne decyzje techniczne wpływające na publiczną architekturę Ekstropii.

## Decision principle

Decyzja techniczna jest uzasadniona, jeśli wspiera co najmniej jeden z celów produktu i nie dokłada nieproporcjonalnego kosztu utrzymania.

Preferencje kolejno:

1. poprawność modelu treści,
2. czytelność i dostępność dla użytkownika,
3. prostota utrzymania,
4. wydajność,
5. możliwość przyszłej migracji,
6. techniczna efektowność.

## T-001 — Web framework

**Status:** `CLOSED`

**Decision:** `Astro 7.x` z TypeScript i domyślnym statycznym renderowaniem.

**Rationale:**

- profil frameworka odpowiada serwisowi content-first,
- publiczny HTML powstaje bez zależności od JavaScriptu,
- interaktywne elementy mogą być dodawane jako izolowane islands,
- Content Collections zapewniają build-time loading, schema validation i typed queries,
- nie ma potrzeby modelu SPA ani pełnego runtime server rendering.

**Constraint:** nie dodawać frameworka komponentowego do całej aplikacji. React/Preact/Svelte może zostać użyty lokalnie dopiero wtedy, gdy konkretne narzędzie ma stan, którego prosty TypeScript nie obsługuje czytelnie.

## T-002 — Content storage

**Status:** `CLOSED`

**Decision:** Markdown jako domyślny format treści, MDX tylko dla materiałów wymagających osadzonego komponentu; metadata i dane strukturalne w repozytorium Git.

**Rationale:**

- naturalny review przez diff i pull request,
- brak CMS do utrzymania,
- dobra przenośność,
- możliwość walidacji podczas builda,
- zgodność z jednoosobowym workflow.

**Revisit when:** pojawi się wielu redaktorów nietechnicznych albo workflow wymagający uprawnień i draftów poza Git.

## T-003 — Graph renderer

**Status:** `CLOSED`

**Decision:** graf renderowany jako SVG z layoutem liczonym podczas builda.

Dla globalnej mapy preferowany jest własny deterministyczny layout warstwowy. Dla większego grafu systemu można użyć biblioteki layoutującej, np. ELK, wyłącznie podczas builda.

**Rationale:**

- model danych pozostaje niezależny od biblioteki,
- gotowy SVG jest indeksowalny i szybki,
- łatwiej zapewnić linki, focus i tekstowy fallback,
- layout nie zmienia się losowo między renderami.

**Rejected for MVP:** runtime force simulation, canvas jako jedyna reprezentacja, ciężka biblioteka graph UI wysyłana na każdą stronę.

## T-004 — Search

**Status:** `CLOSED`

**Decision:** Pagefind `1.5+` jako statyczny indeks wyszukiwania.

Preferowane jest rozpoczęcie od Pagefind Component UI lub jego API z własnym lekkim wrapperem, zależnie od tego, który wariant lepiej spełni docelowy model wyników.

**Required configuration:**

- `lang="pl"`,
- indeksowanie aliasów i terminów angielskich,
- metadata typu encji i kontekstu,
- filtry typu treści,
- brak rankingu opartego na świeżości.

**Progressive enhancement:** samo wyszukiwanie może korzystać z JavaScriptu, ale żadna opublikowana strona nie może być osiągalna wyłącznie przez wyszukiwarkę.

## T-005 — Hosting

**Status:** `CLOSED`

**Decision:** Cloudflare Workers Static Assets.

Statyczny build Astro jest publikowany jako assets bez wymagania Worker runtime.

**Rationale:**

- globalne statyczne delivery,
- niski koszt,
- proste custom domains i HTTPS,
- możliwość późniejszego dodania Worker runtime bez migracji hostingu,
- Git integration i preview deployments.

## T-006 — Analytics

**Status:** `CLOSED FOR MVP`

**Decision:** analityka nie może blokować launchu. Jeżeli zostanie włączona w MVP, użyć Cloudflare Web Analytics wyłącznie do agregatów ruchu i wydajności.

Nie wdrażać na starcie własnego profilu użytkownika ani rozbudowanego event trackingu.

**Revisit when:** pojawi się konkretne pytanie produktowe, którego nie da się rozstrzygnąć na podstawie agregatów, feedbacku i danych wyszukiwania.

## T-007 — Citation implementation

**Status:** `CLOSED`

**Decision:** każde istotne twierdzenie może wskazywać stabilny `source id`, a końcowa bibliografia strony jest wyliczana z użytych markerów.

Dokładna składnia autora jest detalem implementacji, ale musi:

- działać w zwykłym Markdown,
- nie wymagać ręcznej numeracji,
- walidować istnienie źródła,
- umożliwiać wielokrotne użycie jednego źródła,
- oddzielać `Sources` od `Further reading`.

## T-008 — URL structure

**Status:** `CLOSED`

**Decision:** zgodnie z `docs/public/product/information-architecture.md`:

```text
/system/[slug]
/section/[slug]
/a/[slug]
/gateway/[slug]
/tool/[slug]
/concept/[slug]
```

Dodatkowe strony produktu mogą ale nie muszą używać polskich adresów, np. `/szukaj` i `/o-projekcie`.

**Rules:**

- bez numerów A0–A4 w URL,
- bez dat publikacji,
- slug niezależny od pozycji w grafie,
- poprzednie slugi zachowane przez redirect,
- każdy publiczny materiał ma jedno canonical URL.

## T-009 — Typed local relations

**Status:** `CLOSED FOR MVP`

**Decision:** globalna mapa używa `foundation-for`; grafy lokalne zaczynają od trzech typów:

- `prerequisite`,
- `component-of`,
- `related`.

Nowy typ relacji można dodać dopiero, gdy:

1. jego znaczenie jest jednoznaczne,
2. użytkownik ma z niego korzyść,
3. UI potrafi je wyjaśnić bez rozbudowanej legendy.

## T-010 — Data ownership and derivation

**Status:** `CLOSED`

**Decision:** relacje i containment nie są duplikowane.

- hierarchia jest zapisywana od dziecka do rodzica,
- grafowa relacja ma jeden kanoniczny rekord,
- reverse links, listy dzieci, bibliografie i widoki grafu są wyliczane.

**Rationale:** zapobiega dryfowi danych wraz ze wzrostem Atlasu.

## T-011 — CI and deployment

**Status:** `CLOSED`

**Decision:** GitHub Actions odpowiada za testy i quality gates, a Cloudflare Workers Builds za build/deploy i preview z Git integration.

Branch `main` powinien być chroniony tak, aby zmiany trafiały do niego dopiero po przejściu wymaganych kontroli.

**Rationale:**

- brak sekretu deployowego w GitHub Actions,
- preview URL dla zmian,
- prosty rollback po stronie platformy,
- jasny podział między weryfikacją a publikacją.

## T-012 — Backend boundary

**Status:** `CLOSED FOR MVP`

**Decision:** brak backendu aplikacyjnego i PostgreSQL w MVP.

Gdy pojawi się trwały stan użytkownika lub inna rzeczywista potrzeba serwerowa, preferowaną ścieżką jest osobny API service, możliwy do zbudowania w ASP.NET Core + PostgreSQL bez przenoszenia publicznej treści z Git.

Dodanie backendu ma być addytywne, nie warunkiem działania istniejących stron.
