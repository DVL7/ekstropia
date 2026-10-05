# Content Tooling

## Status

- Created: `24-09-2026`
- Last updated: `05-10-2026`
- Version: `1.0`

## Purpose

Dokument opisuje skrypty, które tworzą, synchronizują i walidują pliki w `src/content/`, oraz wspólną logikę, z której korzystają one i build Astro. Jest specyfikacją do implementacji: opisuje zachowanie, wejścia, wyjścia i przypadki błędów.

Semantykę danych (typy encji, położenie plików, format `id`, slug, kontrakt frontmattera) definiuje `content-model.md`. W razie konfliktu obowiązuje `content-model.md`.

## Principles

- **Autor pisze treść, skrypty pilnują struktury.** Autor nie wpisuje ręcznie niczego, co da się wyliczyć (`content-model.md`, **Frontmatter contract**).
- **Skrypty nie przepisują istniejących plików `.md`.** Jedynym plikiem, który skrypty modyfikują, jest indeks treści. `new-entry` tworzy nowy plik, ale nigdy nie nadpisuje istniejącego.
- **Build niczego nie zapisuje.** `validate-content` i build Astro tylko czytają. Jeśli stan plików nie zgadza się z indeksem, build kończy się błędem z instrukcją, który skrypt uruchomić.
- **Wspólna logika w jednym miejscu.** Klasyfikacja ścieżek (typ, slug, kontekst, dział) jest jedną funkcją używaną przez skrypty, walidator i strony Astro.
- **Czyste funkcje + cienka warstwa I/O.** Logika (klasyfikacja, wyliczanie `id`, wyliczanie nowego indeksu, sprawdzanie niezmienników) działa na danych w pamięci i jest testowana jednostkowo. Odczyt i zapis plików jest osobno.
- **Deterministyczny wynik.** Ten sam stan plików daje identyczny indeks (posortowane klucze, stały format YAML), żeby diff w Git pokazywał tylko realne zmiany.
- **Błąd = kod wyjścia różny od zera** i komunikat wskazujący plik oraz regułę. Skrypty nie korzystają z sieci.

## Overview

| Komponent | Uruchamianie | Czyta | Zapisuje |
| :--- | :--- | :--- | :--- |
| wspólna biblioteka | importowana | — | — |
| `new-entry` | `npm run new -- <type> <path>` | treść, indeks | nowy plik treści, indeks |
| `sync-content` | `npm run sync` | treść, indeks, pliki relacji (ostrzeżenia) | indeks |
| `validate-content` | `npm run validate:content`, część `build` | treść, indeks, `src/data/` | nic |

Typowy przebieg pracy:

1. `npm run new -- article systems/internet/dns/dns-resolution` tworzy plik z `id` i szkieletem frontmattera.
2. Autor pisze treść. Może przenosić pliki i zmieniać ich nazwy.
3. Po zmianie nazwy lub przeniesieniu: `npm run sync`, który aktualizuje indeks i historię redirectów.
4. `npm run verify` (w tym `validate-content`) przed commitem.

## Shared library

Sugerowane położenie: `src/lib/content/`, bo z tej samej logiki korzysta build Astro (strony, graf, route). Skrypty w `scripts/` importują ją stamtąd.

### `classifyPath(relPath)`

Wejście: ścieżka względem `src/content/`, z separatorem `/` (np. `systems/internet/dns/dns-resolution.md`).

Wyjście przy poprawnym położeniu:

```text
type         system | concept | gateway | section | article | tool | source
root         systems | concepts | gateways | tools | sources
name         string            # nazwa katalogu (kontenery) lub pliku bez rozszerzenia
slug         string | null     # null dla source
contextPath  string | null     # np. "systems/internet" dla section i article
sectionPath  string | null     # np. "systems/internet/dns" dla article w dziale
format       string | null     # katalog formatu dla source, np. "standards"
```

Grupa porządkowa w `tools/` i `sources/<f>/` jest pomijana: nie trafia do wyniku.

Reguły klasyfikacji: tabela w `content-model.md`, **File layout is the hierarchy**. Funkcja zwraca błąd (nie rzuca wyjątku bez opisu) dla:

- nieznanego katalogu `<root>`,
- położenia spoza tabeli (np. artykuł bezpośrednio w systemie, za głęboko),
- source bez katalogu formatu albo w nieznanym katalogu formatu,
- złego rozszerzenia (`.md` w `sources/`, `.yaml` poza `sources/`),
- segmentu ścieżki niezgodnego z kebab-case.

Funkcja nie sprawdza, czy pliki nadrzędne istnieją. To zadanie walidatora, który zna cały zbiór plików.

Dla toola klasyfikacja zwraca slug z nazwy pliku zawsze, bo nie zna frontmattera. O tym, czy tool ma route, decyduje dopiero pole `standalone`.

### `pathToId(relPath)`

Wylicza `id` w formacie `typ:ścieżka`, a dla toola i source `typ:nazwa-pliku` (`content-model.md`, **Stable ID and slug are different**). Używana **wyłącznie** przez `new-entry` przy tworzeniu encji. Walidator i build nigdy nie porównują `id` z bieżącą ścieżką poza prefiksem typu.

Przykłady (muszą być przypadkami testowymi):

```text
systems/internet/index.md                  → system:internet
systems/internet/dns/index.md              → section:internet/dns
systems/internet/dns/dns-resolution.md     → article:internet/dns/dns-resolution
concepts/mathematics/logarithm.md          → article:mathematics/logarithm
gateways/smartphone/camera/index.md        → section:smartphone/camera
tools/traceroute.md                        → tool:traceroute
tools/networking/traceroute.md             → tool:traceroute
sources/standards/rfc/rfc-1034.yaml        → source:rfc-1034
sources/web/cloudflare-what-is-dns.yaml    → source:cloudflare-what-is-dns
```

> Ścieżka w `id` nie zawiera katalogu `<root>`, więc `section:internet/dns` może powstać zarówno z `systems/internet/dns/`, jak i z `concepts/internet/dns/`. Z tego samego powodu dwa pliki `rfc-1034.yaml` w różnych grupach dałyby to samo `id`. Takie kolizje są wykrywane przez indeks i kończą się błędem; autor wybiera wtedy inną nazwę.

### `routeFor(type, slug)`

Mapuje typ i slug na route zgodnie z tabelą w `content-model.md`, **Public route is derived**. Jedyne miejsce w kodzie, które zna prefiksy route. Korzystają z niego linki, sitemapa, walidator (unikalność route) i generowanie redirectów.

### `loadContent()`

Czyta wszystkie pliki z `src/content/` (`fast-glob`, `gray-matter` dla `.md`, `yaml` dla `.yaml`) i zwraca listę:

```text
path          ścieżka względem src/content/
classification wynik classifyPath albo błąd
id            wartość z frontmattera (może brakować)
data          pozostały frontmatter
```

Pomija pliki niebędące treścią: indeks treści, `LICENSE` i pliki zaczynające się od `_`.

### `readIndex()` / `writeIndex(index)`

Odczyt i zapis indeksu treści. `writeIndex` sortuje klucze i zapisuje stały format.

### `schemas.ts` and `rules.ts`

Model frontmattera jest rozdzielony na dwa pliki:

- `schemas.ts` opisuje wyłącznie kształt danych: pola, typy, enumy i wymagalność. Ma się czytać jak deklaracja modelu z `content-model.md`.
- `rules.ts` zawiera reguły zależne od kilku pól jednego pliku, zapisane jako zwykłe funkcje (predykat i opis błędu), bez zależności od Zoda. Przykład: `hasReviewDate` i `reviewDateError` dla niezmiennika 15.

`schemas.ts` importuje regułę i podpina ją przez `.refine()` do **schematu końcowego** encji, a nie do grupy pól. Grupy pól są składane w warianty przez rozłożenie `.shape`, a to kopiuje same pola: refine podpięty do grupy by przepadł.

Reguła jest funkcją, więc `validate-content` i testy mogą ją wywołać bezpośrednio, bez parsowania przez schemat.

## Content index

Plik: `src/content/_index.lock.yaml`. Commitowany. Edytowany tylko przez skrypty.

Indeks pełni trzy role naraz:

- rejestr wszystkich `id`, które kiedykolwiek istniały (unikalność i zakaz ponownego użycia),
- pamięć poprzedniego stanu plików, dzięki której `sync-content` wykrywa zmianę nazwy,
- źródło manifestu redirectów.

Format:

```yaml
article:internet/dns/dns-resolution:
  path: systems/internet/dns/dns-resolution.md
  slug: dns-resolution
  redirectFrom: [resolving-dns]
section:internet/dns:
  path: systems/internet/dns/index.md
  slug: dns
  redirectFrom: []
source:rfc-1034:
  path: sources/standards/rfc/rfc-1034.yaml
article:internet/old-topic:
  path: systems/internet/dns/old-topic.md
  slug: old-topic
  redirectFrom: []
  retired: true
```

Reguły:

- kluczem jest `id`,
- `slug` i `redirectFrom` występują tylko dla encji z publicznym route,
- `redirectFrom` zawiera poprzednie slugi tej samej encji, bez prefiksu route (prefiks wynika z typu),
- rekord nigdy nie jest usuwany; usunięta encja dostaje `retired: true` i zachowuje ostatni `path`, `slug` i `redirectFrom`.

## Script: new-entry

Wywołanie:

```text
npm run new -- <type> <path>
```

- `<type>`: `system`, `concept`, `gateway`, `section`, `article`, `tool`, `source`,
- `<path>`: ścieżka względem `src/content/`, bez `/index.md` i bez rozszerzenia.

Przykłady:

```text
npm run new -- system  systems/internet
npm run new -- section systems/internet/dns
npm run new -- article systems/internet/dns/dns-resolution
npm run new -- article concepts/mathematics/logarithm
npm run new -- tool    tools/networking/traceroute
npm run new -- source  sources/standards/rfc/rfc-1034
```

Typ jest podawany jawnie, bo samo położenie bywa niejednoznaczne: `concepts/mathematics/algebra` może być działem albo artykułem bez działu.

Kroki:

1. Zbuduj docelową ścieżkę pliku (`index.md` dla system/concept/gateway/section, `.md` dla article/tool, `.yaml` dla source).
2. `classifyPath`: błąd, jeśli położenie jest niepoprawne albo typ z położenia różni się od `<type>`.
3. Sprawdź, czy istnieje `index.md` kontekstu i (dla artykułu w dziale) działu. Brak = błąd z podpowiedzią, który `new-entry` uruchomić najpierw.
4. Błąd, jeśli plik docelowy już istnieje.
5. Wylicz `id` przez `pathToId`.
6. Błąd, jeśli `id` jest w indeksie (aktywne lub wycofane).
7. Błąd, jeśli route (`routeFor`) koliduje z aktywnym slugiem lub z `redirectFrom` innej encji o tym samym prefiksie.
8. Utwórz plik ze szkieletem: `id` oraz pola wymagane dla typu (`content-model.md`, **Entity**), `status: planned`, pozostałe pola puste do uzupełnienia. Wariant pól wynika z położenia (`content-model.md`, **Scope and entryQuestion**): dział w gatewayu dostaje `entryQuestion` zamiast `scope`, artykuł w gatewayu dostaje `entryQuestion`, a artykuł poza gatewayem żadnego z tych pól. Dział i artykuł dostają `order` równe liczbie rodzeństwa + 1, czyli miejsce na końcu (`content-model.md`, **Reading order**). Szkielet nie zawiera `lastReviewed`; autor wpisuje je przy przejściu do statusu `review`. Source dostaje pola swojego formatu (`content-model.md`, **Entity: Source**).
9. Dopisz rekord do indeksu.

Jeśli którykolwiek krok zakończy się błędem, skrypt nie tworzy pliku ani nie zmienia indeksu.

## Script: sync-content

Wywołanie: `npm run sync`. Idempotentny: drugie uruchomienie bez zmian w plikach nie zmienia indeksu.

Wejście: `loadContent()` i obecny indeks. Łączenie odbywa się po `id` z frontmattera, nie po ścieżce.

Przed jakąkolwiek zmianą skrypt przerywa z błędem, gdy:

- plik ma niepoprawne położenie (`classifyPath`),
- plik nie ma `id`,
- dwa pliki mają to samo `id`,
- prefiks `id` różni się od typu z położenia,
- plik ma `id` oznaczone w indeksie jako `retired`.

Przypadki dla każdego pliku treści:

| Sytuacja | Działanie |
| :--- | :--- |
| `id` nie ma w indeksie | dodaj rekord (plik utworzony bez `new-entry`; format `id` musi być poprawny) |
| zmienił się `path`, slug ten sam | zaktualizuj `path` (przeniesienie, bez redirectu) |
| zmienił się slug | dopisz stary slug do `redirectFrom`, zapisz nowy slug i `path` |
| nowy slug jest już w `redirectFrom` tej encji | usuń go z `redirectFrom` (powrót do poprzedniej nazwy) |
| bez zmian | nic |

Dla rekordów indeksu bez pliku: ustaw `retired: true`.

Po wyliczeniu nowego indeksu skrypt sprawdza unikalność route i konflikty redirectów (jak `validate-content`) i zapisuje indeks tylko wtedy, gdy nie ma błędów. Na koniec wypisuje podsumowanie: dodane, przeniesione, przemianowane (stary → nowy slug), wycofane.

> Logika przypadków z tabeli powinna być czystą funkcją `(index, entries) → { index, changes, errors }`. To ją testujemy; odczyt i zapis plików jest osobno.

### Relation file warnings

Po zapisie indeksu skrypt czyta pliki w `src/data/relations/` i wypisuje **ostrzeżenie** (nie błąd, kod wyjścia bez zmian), gdy położenie pliku relacji nie odpowiada ścieżce encji `to` jego rekordów według konwencji z `graph-model.md` (**Relation file convention**), np. po przeniesieniu artykułu. Ostrzeżenie podaje obecną i oczekiwaną ścieżkę pliku. Skrypt nie przenosi plików relacji.

Położenie pliku relacji nie ma znaczenia w modelu, więc `validate-content` go nie sprawdza.

## Script: validate-content

Wywołanie: `npm run validate:content`, uruchamiany też jako pierwszy krok `npm run build`. Tylko czyta. Zbiera wszystkie błędy i wypisuje je razem, a nie przerywa na pierwszym.

Sprawdzenia, z odwołaniem do niezmienników z `content-model.md`:

| Sprawdzenie | Niezmiennik |
| :--- | :--- |
| każdy plik ma poprawne położenie według `classifyPath` | 4 |
| każdy dział i artykuł ma `index.md` kontekstu, a artykuł w dziale także `index.md` działu | 4 |
| `id` istnieje, ma format `typ:ścieżka`, prefiks zgadza się z typem z położenia | 4 |
| `id` jest unikalne i nie jest oznaczone jako `retired` | 1 |
| nazwy plików są unikalne w obrębie `tools/` i w obrębie `sources/` (niezależnie od grup) | 9 |
| `order` w obrębie rodzeństwa to dokładnie `1…n`: komunikat wskazuje luki i powtórzone numery | 14 |
| brak pól spoza kontraktu frontmattera | 12 |
| indeks zgadza się z plikami: każdy plik ma rekord z tym samym `path` i `slug`, każdy aktywny rekord ma plik | 13 |
| unikalność route w obrębie prefiksu | 2 |
| żaden `redirectFrom` nie pokrywa się z aktywnym route o tym samym prefiksie | 10 |
| `targetId`, endpointy relacji, cytowane źródła i cele linków w treści istnieją; cel linku jest opublikowany, spoza własnego kontekstu i dozwolonego typu (`graph-model.md`, **Link syntax**) | 3, 9 |
| relacje: brak duplikatów, poprawny kierunek `foundation-for` (cykle `prerequisite` poza MVP) | 5, 6, 7 |
| brak opublikowanych sierot | 8 |
| AtlasNode wskazuje kontekst z opublikowaną treścią | 11 |

Niezgodność indeksu (13) kończy się komunikatem: uruchom `npm run sync`.

Relacje i węzły Atlasu leżą w `src/data/` (`graph-model.md`, **Data location**); `loadContent` ich nie czyta. Sprawdzenia relacji (3, 5–7) i AtlasNode (11) opisuje `graph-model.md`, **Validation**. Walidator wykonuje je dopiero po zamknięciu otwartych pytań w tym dokumencie.

Walidacja pól frontmattera (typy, wymagane pola, enumy) należy do schematów kolekcji Astro. `validate-content` nie powtarza jej ręcznie. Jeśli potrzebuje tych reguł, importuje te same schematy.

## Astro integration

Build Astro korzysta z tej samej logiki, co skrypty:

- **Kolekcje**: kilka kolekcji z loaderem `glob()` nad jednym drzewem `src/content/`, rozdzielonych wzorcami ścieżek według typu z tabeli położeń. Działy i artykuły gatewayów mają osobne kolekcje, bo mają inny wariant pól (`content-model.md`, **Scope and entryQuestion**):

  | Kolekcja | Położenie | Schemat |
  | :--- | :--- | :--- |
  | `systems` | `systems/<x>/index.md` | `contextBase` + `scope`, `coverage` |
  | `concepts` | `concepts/<x>/index.md` | `contextBase` + `scope?`, `coverage` |
  | `gateways` | `gateways/<x>/index.md` | `contextBase` + `entryQuestion` |
  | `sections` | `systems/`, `concepts/`: `<x>/<y>/index.md` | `sectionBase` + `scope` |
  | `gatewaySections` | `gateways/<x>/<y>/index.md` | `sectionBase` + `entryQuestion` |
  | `articles` | artykuły w `systems/` i `concepts/` | `articleBase` |
  | `gatewayArticles` | artykuły w `gateways/` | `articleBase` + `entryQuestion` |
  | `tools` | `tools/**` | tool |
  | `standardSources` | `sources/standards/**` | `sourceBase` + `designation` |
  | `bookSources` | `sources/books/**` | `sourceBase` + `isbn?`, `publisher?`, `edition?` |
  | `paperSources` | `sources/papers/**` | `sourceBase` + `doi?`, `venue?` |
  | `reportSources` | `sources/reports/**` | `sourceBase` + `publisher?` |
  | `documentationSources` | `sources/documentation/**` | `sourceBase` + `url`, `accessedAt`, `version?` |
  | `webSources` | `sources/web/**` | `sourceBase` + `url`, `accessedAt` |

  Schematy bazowe są ścisłe, a warianty powstają przez rozszerzenie bazy, więc pole z niewłaściwego wariantu jest błędem schematu. Widoki potrzebujące wszystkich działów, artykułów lub źródeł łączą kolekcje przez helpery w `src/lib/content/` (np. wyszukanie źródła po `id` przy cytowaniu).

  Warunki zależne tylko od pól samego pliku są refine'ami w schemacie: `scope` w concepcie spoza `topic-bucket` oraz `lastReviewed` przy statusie `review`, `published` lub `needs-review` (niezmiennik 15). Logika reguł leży w `rules.ts`, a schemat tylko je podpina (**Shared library**, **`schemas.ts` and `rules.ts`**). `order` w schemacie to liczba całkowita ≥ 1. Ciągłość numeracji w rodzeństwie (niezmiennik 14) wymaga znajomości plików rodzeństwa, więc sprawdza ją `validate-content`.
- **Wzorce a walidacja**: plik, który nie pasuje do żadnego wzorca (np. artykuł bezpośrednio w systemie), nie trafia do żadnej kolekcji i Astro go pomija bez błędu. Dlatego `validate-content` sprawdza położenie wszystkich plików w `src/content/`, a nie tylko wpisów kolekcji.
- **`generateId: ({ data }) => String(data.id)`** w każdym `glob()`. Bez tego Astro tworzy `entry.id` ze ścieżki pliku.
- **Schematy ścisłe**: nieznane pole ma być błędem, a nie być usuwane po cichu (niezmiennik 12).
- **Slug i route**: strony wyliczają je z `entry.filePath` przez `classifyPath` i `routeFor`, nie z frontmattera.
- **Redirecty**: generowane z indeksu treści (`redirectFrom` wszystkich rekordów z route). Mechanizm (konfiguracja `redirects` w Astro lub plik redirectów po stronie hostingu) do ustalenia.

## Tests

Testy jednostkowe (Vitest) obejmują co najmniej:

- `classifyPath`: każdy wiersz tabeli położeń i każdy przypadek błędu,
- `pathToId`: przykłady z tego dokumentu,
- `routeFor`: każdy typ, brak route dla source i toola osadzonego,
- logikę `sync-content`: każdy wiersz tabeli przypadków, wycofanie, powrót do poprzedniej nazwy, idempotentność, ostrzeżenie o pliku relacji po przeniesieniu encji,
- sprawdzenia `validate-content` na małych zestawach danych w pamięci: kolizja `id`, ponowne użycie wycofanego `id`, kolizja route, konflikt redirectu, zła pozycja pliku, niezgodny prefiks `id`, ta sama nazwa pliku w dwóch grupach `sources/`, `order` z luką, z powtórzeniem i zaczynające się od innej wartości niż `1`, osobne numeracje działów i artykułów bez działu w jednym concepcie,
- schematy źródeł: poprawne i błędne `designation` (np. `1034` bez skrótu), `isbn`, `doi`, niepełne daty w `published`.

## Open questions

- Schematy i kolekcje dla `src/data/` (zależne od `graph-model.md`, **Open questions**).
- Mechanizm generowania redirectów na Cloudflare Workers.
- Zachowanie URL wycofanej encji: 404, 410 czy redirect do rodzica.
