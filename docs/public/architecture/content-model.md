# Logical Content Model

## Status

- Created: `01-09-2026`
- Last updated: `05-10-2026`
- Version: `3.0`


## Purpose

Dokument definiuje semantykę danych Ekstropii. Nie opisuje konkretnego schematu TypeScript.

Model ma być zgodny z rozróżnieniem z dokumentacji produktowej:

- warstwy Atlasu A0–A4 opisują rolę bytu w modelu świata,
- hierarchia `System / Concept / Gateway → Section → Article` organizuje treść,

Skrypty, które tworzą, synchronizują i walidują pliki w `src/content/`, opisuje `content-tooling.md`. Grafy, relacje i węzły Atlasu opisuje `graph-model.md`.

## Core rules

### File layout is the hierarchy

Struktura katalogów w `src/content/` jest jedynym źródłem prawdy o hierarchii treści. Encja nie zapisuje swojego rodzica we frontmatterze. Rodzic, kontekst i dział wynikają z położenia pliku.

```text
src/content/
├── systems/
│   └── internet/
│       ├── index.md                  # system
│       └── dns/
│           ├── index.md              # section
│           └── dns-resolution.md     # article w dziale
├── concepts/
│   └── mathematics/
│       ├── index.md                  # concept
│       ├── logarithm.md              # article bezpośrednio w concepcie
│       └── algebra/
│           ├── index.md              # section
│           └── linear-equation.md    # article w dziale
├── gateways/
│   └── smartphone/
│       ├── index.md                  # gateway
│       └── ...                       # jak w concepts/
├── tools/
│   └── networking/                   # grupa porządkowa (opcjonalna)
│       └── traceroute.md             # tool, poza hierarchią
└── sources/
    └── standards/                    # format źródła
        └── rfc/                      # grupa porządkowa (opcjonalna)
            └── rfc-1034.yaml         # source, poza hierarchią
```

Typ encji wynika z położenia pliku:

| Położenie (względem `src/content/`) | Typ |
| :--- | :--- |
| `systems/<x>/index.md` | system |
| `concepts/<x>/index.md` | concept |
| `gateways/<x>/index.md` | gateway |
| `<root>/<x>/<y>/index.md` | section w kontekście `<x>` = `<y>` |
| `<root>/<x>/<y>/<z>.md` | article w section `<y>` = `<z>` |
| `concepts/<x>/<z>.md`, `gateways/<x>/<z>.md` | article bezpośrednio w kontekście `<x>` = `<z>` |
| `tools/<z>.md`, `tools/<g>/<z>.md` | tool = `<z>` |
| `sources/<f>/<z>.yaml`, `sources/<f>/<g>/<z>.yaml` | source = `<z>` w formacie `<f>` |

`<root>` oznacza `systems`, `concepts` lub `gateways`. Każde inne położenie jest błędem walidacji, w szczególności:

- artykuł bezpośrednio w systemie (`systems/<x>/<z>.md`), bo system zawsze dzieli treść na działy,
- dział lub artykuł bez `index.md` w katalogu nadrzędnym,
- zagnieżdżenie głębsze niż `<root>/<x>/<y>/<z>.md`,
- source bez katalogu formatu (`sources/<z>.yaml`) albo w nieznanym katalogu formatu,
- zagnieżdżenie głębsze niż jedna grupa w `tools/` i w katalogu formatu źródła.

Katalogi w `tools/` i sources:

- `<f>` to **format źródła** i ma znaczenie: wyznacza schemat pliku (patrz **Entity: Source**). Dozwolone wartości: `standards`, `books`, `papers`, `reports`, `documentation`, `web`.
- `<g>` to **grupa porządkowa**, np. `sources/standards/rfc/`, `sources/documentation/mdn/`, `tools/networking/`. Nie ma żadnego znaczenia w modelu: nie wchodzi do `id` ani sluga, nie jest sprawdzana poza formatem nazwy i można ją dowolnie zmieniać. Grupa w `tools/` nie oznacza przynależności toola do systemu; podpięcia tooli żyją w plikach relacji.

Nazwy katalogów i plików są w kebab-case: małe litery ASCII, cyfry i pojedyncze myślniki (`^[a-z0-9]+(-[a-z0-9]+)*$`).

> Przeniesienie artykułu do innego działu to przeniesienie pliku. Przeniesienie działu do innego systemu to przeniesienie katalogu razem z artykułami. Żadne pole we frontmatterze nie wymaga wtedy edycji.

### Stable ID and slug are different

Każda encja ma stabilny `id`. Encja z publiczną stroną ma dodatkowo `slug`.

`id`:

- jest używany przez relacje, `targetId` i cytowania,
- ma format `typ:ścieżka`: typ w liczbie pojedynczej, ścieżka liczona od katalogu `<root>` (`systems/`, `concepts/`, `gateways/`), bez `/index.md` i bez rozszerzenia, z separatorem `/`,
- dla toola i source ma format `typ:nazwa-pliku`, bez katalogu formatu i grupy, bo te nie należą do tożsamości encji, a krótkie `id` jest wygodne w cytowaniach; nazwa pliku musi więc być unikalna w całym `tools/` i w całym `sources/`,
- jest generowany **raz**, przy tworzeniu encji, i zapisywany we frontmatterze,
- nigdy nie jest wyliczany ponownie: nie zmienia się po zmianie tytułu, nazwy pliku, położenia ani URL,
- nie może zostać użyty ponownie, także po usunięciu encji.

Przykłady:

```text
systems/internet/index.md                  → system:internet
systems/internet/dns/index.md              → section:internet/dns
systems/internet/dns/dns-resolution.md     → article:internet/dns/dns-resolution
concepts/mathematics/logarithm.md          → article:mathematics/logarithm
gateways/smartphone/index.md               → gateway:smartphone
tools/networking/traceroute.md             → tool:traceroute
sources/standards/rfc/rfc-1034.yaml        → source:rfc-1034
sources/books/tanenbaum-networks.yaml      → source:tanenbaum-networks
```

> Po przeniesieniu pliku ścieżka w `id` przestaje odpowiadać położeniu. To zamierzone: `id` opisuje miejsce narodzin encji, a nie jej obecne miejsce. Prefiks typu w `id` musi jednak zawsze zgadzać się z typem wynikającym z położenia. Zmiana typu (np. artykuł rozrasta się w dział) oznacza nową encję z nowym `id`, a stare `id` zostaje wycofane.

`slug`:

- służy do routingu,
- jest wyliczany z położenia i **nie jest zapisywany we frontmatterze**:
  - dla systemu, conceptu, gatewaya i działu: nazwa katalogu,
  - dla artykułu, samodzielnego toola: nazwa pliku bez rozszerzenia,
- nie zawiera prefiksu typu; prefiks route dodaje warstwa routingu (patrz **Public route is derived**),
- nie zależy od katalogów nadrzędnych, więc przeniesienie encji nie zmienia jej URL,
- zmienia się tylko przy zmianie nazwy pliku lub katalogu; poprzedni slug trafia wtedy do historii redirectów w indeksie treści (`content-tooling.md`).

### One-way containment

Hierarchia jest zapisana wyłącznie w strukturze katalogów. Nie przechowujemy we frontmatterze ani list dzieci (`system.sections[]`, `section.articles[]`), ani wskazań rodzica (`parentId`, `contextId`, `sectionId`).

Rodzic, kontekst, dział oraz przynależność działów i artykułów są wyliczane z położenia plików.

### Reading order

Działy i artykuły są czytane w ustalonej kolejności. Każdy dział i każdy artykuł ma pole `order`: swoją pozycję wśród rodzeństwa.

Rodzeństwo to:

- działy jednego systemu, conceptu lub gatewaya,
- artykuły jednego działu,
- artykuły leżące bezpośrednio w jednym concepcie lub gatewayu.

W concepcie i gatewayu działy i artykuły bez działu to dwie osobne numeracje.

Reguły, pilnowane przez walidację (niezmiennik 14):

- `order` jest liczbą całkowitą,
- numeracja w obrębie rodzeństwa zaczyna się od `1` i jest ciągła: `n` elementów ma dokładnie wartości `1…n`, bez luk i bez powtórzeń.

`new-entry` nadaje nowemu elementowi kolejny numer (`n + 1`). Wstawienie elementu w środek albo zmiana kolejności oznacza przenumerowanie rodzeństwa; walidacja wskaże każdą lukę i każdy powtórzony numer. Zmiana nazwy pliku ani przeniesienie nie wymagają żadnej edycji poza nadaniem `order` w nowym miejscu.

Concept `topic-bucket` też numeruje swoje działy i artykuły, ale widok może je wyświetlać alfabetycznie według `title`, bo taki concept nie jest zaplanowany do czytania od początku do końca.

> Kolejność jest zapisana w dzieciach, a nie jako lista slugów w rodzicu. Lista w rodzicu powtarzałaby nazwy plików, więc wymagałaby ręcznej poprawki przy każdym dodaniu i każdej zmianie nazwy dziecka, czyli przy najczęstszych operacjach.

### Relations have one canonical record

Relacja między dwoma bytami jest zapisywana raz, w plikach `.yaml` w `src/data/` (format i położenie: `graph-model.md`).

Nie zapisuje się w encjach list takich jak:

- prerequisite'y artykułu,
- related topics,
- upstream/downstream,
- krawędzie grafu systemowego,
- podpięcia narzędzi.

Są one wyliczane z rekordów relacji.

Hierarchia (system → dział → artykuł) nie jest relacją i nie trafia do plików relacji. Krawędzie hierarchii w grafie są wyliczane ze struktury katalogów.

### Public route is derived

Route wynika z typu encji i slugu, zgodnie z `docs/public/product/information-architecture.md` i decyzją T-008:

| Typ | Route |
| :--- | :--- |
| system | `/system/[slug]` |
| concept | `/concept/[slug]` |
| gateway | `/gateway/[slug]` |
| section | `/section/[slug]` |
| article | `/article/[slug]` |
| tool (`standalone: true`) | `/tool/[slug]` |

Source i tool osadzony (`standalone: false`) nie mają publicznego route.

Slug musi być unikalny w obrębie prefiksu route. Działy systemów, conceptów i gatewayów dzielą jeden prefiks `/section/`, a wszystkie artykuły prefiks `/article/`. Dwa pliki `overview.md` w różnych działach dałyby ten sam route, więc walidacja to odrzuca.

## Frontmatter contract

Frontmatter (a dla source: plik `.yaml`) zawiera wyłącznie dane, które **autor ustala i których nie da się wyliczyć** z położenia pliku, innych encji ani historii zmian. Wszystko, co można wyliczyć, jest wyliczane. Dane zapisane w dwóch miejscach prędzej czy później się rozjadą.

### What belongs in frontmatter

| Pole | Dlaczego we frontmatterze |
| :--- | :--- |
| `id` | Zamrożone przy tworzeniu. Po przeniesieniu pliku nie da się go odtworzyć z położenia, więc musi być zapisane. Wpisuje je skrypt, autor go nie edytuje. |
| `title`, `summary`, `aliases`, `keywords` | Decyzje redakcyjne o treści i wyszukiwaniu. |
| `scope`, `learningGoal`, `entryQuestion` | Decyzje redakcyjne o zakresie. |
| `status`, `coverage`, `changeSensitivity`, `lastReviewed` | Stan redakcyjny ustalany przez autora. |
| `order` | Kolejność czytania to decyzja redakcyjna; nie da się jej wyliczyć (**Reading order**). |
| `standalone`, `fallbackDescription` (tool) | Decyzja o sposobie prezentacji narzędzia. |
| pola bibliograficzne (source) | Dane opisujące źródło. |

### What does not belong in frontmatter

| Dane | Skąd pochodzą | Dlaczego nie we frontmatterze |
| :--- | :--- | :--- |
| typ encji | położenie pliku | Wynika jednoznacznie z katalogu; prefiks w `id` jest tylko sprawdzany. |
| format źródła | katalog formatu w `sources/` | Katalog i pole `format` opisywałyby to samo. |
| `slug` | nazwa pliku lub katalogu | Drugi zapis tej samej informacji rozjechałby się przy zmianie nazwy. |
| route | typ + slug | Patrz **Public route is derived**. |
| `parentId`, `contextId`, `sectionId` | katalogi nadrzędne | Hierarchia jest zapisana w strukturze katalogów. |
| przynależność i listy dzieci | wyliczane z katalogów | **One-way containment**. |
| `redirectFrom` | indeks treści | Historię slugów prowadzi skrypt porównujący stan plików z indeksem; autor nie musi jej pamiętać. |
| relacje, podpięcia tooli | pliki relacji | **Relations have one canonical record**. |
| węzeł Atlasu | osobna encja AtlasNode w `src/data/atlas.yaml` | Rola w globalnej mapie nie jest cechą treści (`graph-model.md`). |

Pole spoza kontraktu (np. ręcznie dopisany `slug` albo `sectionId`) jest błędem walidacji, a nie jest ignorowane po cichu.

## Schemas:

`Schemas` modelują poniższe zestawy treści. Z tych modeli wynikają przyszłe decyzje modelowe i walidacyjne. Listy pól poniżej zawierają wyłącznie pola zapisywane przez autora. Pola wyliczane są wymienione osobno przy każdej encji.

## Shared field groups

Encje o tej samej roli dzielą wspólny zestaw pól i różnią się tylko polami własnymi.

**Context fields**: wspólne dla systemu, conceptu i gatewaya, czyli encji, które są kontekstem działów i artykułów:

```text
id
title
aliases[]
summary
status
lastReviewed?
```

**Section fields**: wspólne dla każdego działu:

```text
id
title
aliases[]
summary
learningGoal
status
order
```

**Article fields**: wspólne dla każdego artykułu:

```text
id
title
aliases[]
keywords[]
summary
status
changeSensitivity: low | medium | high
order
lastReviewed?
```

### lastReviewed

`lastReviewed` to data ostatniego merytorycznego przeglądu: deklaracja autora, że na ten dzień treść jest zweryfikowana. Nie jest datą ostatniej edycji pliku, bo poprawka literówki nie jest review.

- pole jest opcjonalne, dopóki encja nie ma statusu `review`, `published` albo `needs-review`,
- przy przejściu do `review` autor wpisuje datę ręcznie; encja z jednym z tych trzech statusów bez `lastReviewed` jest błędem schematu (dział nie ma tego pola, bo jego aktualność wynika z artykułów),
- `needs-review` zachowuje datę poprzedniego przeglądu: status mówi, że treść wymaga ponownej weryfikacji, a data, kiedy sprawdzono ją ostatnio,
- po każdym kolejnym przeglądzie autor aktualizuje datę ręcznie,
- `new-entry` nie wpisuje tego pola do szkieletu.

Data ostatniej zmiany pliku, jeśli będzie potrzebna w UI, jest danymi wyliczanymi z historii Git i nie trafia do frontmattera.

### Scope and entryQuestion

`scope` i `entryQuestion` opisują zakres na dwa różne sposoby i nigdy nie występują razem:

- w systemie i concepcie zakres wyznacza `scope`: system, concept i ich działy mają `scope`, artykuły nie mają żadnego z tych pól, bo zakres sugeruje `title`,
- w gatewayu zakres wyznacza `entryQuestion` na każdym poziomie: gateway, jego działy i artykuły mają `entryQuestion` zamiast `scope`.

Kontekst działu lub artykułu wynika z położenia pliku, więc wariant (z `scope` albo z `entryQuestion`) też wynika z położenia. Pole z niewłaściwego wariantu jest polem spoza kontraktu.

> W implementacji grupy pól odpowiadają schematom bazowym (np. `contextBase`, `sectionBase`, `articleBase`), a warianty w gatewayu osobnym kolekcjom, żeby wymagalność pól wynikała ze schematu, a nie z dodatkowej walidacji.

## Entity: AtlasNode

Węzeł globalnego Atlasu. Plik: `src/data/atlas.yaml`, wszystkie węzły w jednym pliku (`graph-model.md`, **AtlasNode**).

```text
targetId
layer: A0 | A1 | A2 | A3 | A4
title?
summary
```

> `targetId` wskazuje publiczny byt reprezentowany przez węzeł, np. `system:*`, `concept:*` albo `gateway:*`, natomiast layer odpowiadający mu poziom warstwy. `title` to tekst widoczny w węźle; domyślnie jest nim `title` encji docelowej. `summary` ma 1–2 zdania i jest zwykle krótsze niż `summary` encji docelowej.

> Węzeł nie ma własnego `id`: identyfikuje go `targetId`, a jeden kontekst ma najwyżej jeden węzeł. Węzeł nie trafia do indeksu treści.

> AtlasNode zawsze wskazuje na system/concept/gateway. Muszą mieć one treść, tzn. Mieć pod sobą przynajmniej jeden section/article ze statusem published.

## Entity: System

Pełny system A2 lub A3. Plik: `systems/<x>/index.md`.

Context fields oraz:

```text
scope
coverage: planned | in-progress | core-complete
```

Wyliczane: `slug` (`<x>`), przynależność działów, historia redirectów.

> `aliases` przechowuje tablicę alternatywnych tytułów do wyszukiwarki, `scope` odpowiada na pytanie jaki jest zakres danego systemu (na jego podstawie określa się co ma być w systemie `Internet` a co trafić np. do `Łączność`). `status` jest redakcyjne.

## Entity: Concept

Treść podstawowa A0/A1 używana przez wiele systemów. Plik: `concepts/<x>/index.md`.

Context fields oraz:

```text
scope?
coverage: topic-bucket | planned | in-progress | core-complete
```

Wyliczane: `slug` (`<x>`), przynależność działów i artykułów, historia redirectów.

> Concept może pozostać `topic-bucket` czyli zbiornikiem na treść, co oznacza że nie jest zaplanowany jako całość i nie musi posiadać `scope`. Przy każdym innym `coverage` concept jest czytany jak system i `scope` jest wymagane. Natomiast posiada swój `atlasNode` tak jak system.

## Entity: Gateway

Mini-system A4 prowadzący od codziennego doświadczenia do istniejących elementów Atlasu. Plik: `gateways/<x>/index.md`.

Context fields oraz:

```text
entryQuestion
```

Wyliczane: `slug` (`<x>`), przynależność działów i artykułów, historia redirectów.

> Gateway jako mini-system może posiadać `section` i `articles`, ale w wariancie gatewayowym: odpowiadają na `entryQuestion` zamiast na `scope` (patrz **Scope and entryQuestion**). Ponadto w treści docelowo mają nakreślać kontekst i odsyłać do działów/artykułów z poprzednich warstw. Sam gateway zamiast scope ma odpowiadać na `entryQuestion` (np. Jak działa smartfon?).

## Entity: Section

Logiczny fragment systemu, conceptu lub gatewaya. Plik: `<root>/<x>/<y>/index.md`.

W systemie i concepcie (`systems/`, `concepts/`): Section fields oraz:

```text
scope
```

W gatewayu (`gateways/`): Section fields oraz:

```text
entryQuestion
```

Wyliczane: `slug` (`<y>`), kontekst (encja w `<root>/<x>/`), przynależność artykułów, historia redirectów.

> Każdy section powinien mieć własny `learningGoal`, który odpowiada na inne pytanie niż `scope` lub `entryQuestion`: zakres mówi, co dział obejmuje, a `learningGoal`, co czytelnik ma po nim rozumieć.

## Entity: Article

Kanoniczne wyjaśnienie pojedynczego zagadnienia. Plik: `<root>/<x>/<y>/<z>.md` albo, w concepcie i gatewayu, `<root>/<x>/<z>.md`.

W systemie i concepcie: tylko Article fields.

W gatewayu: Article fields oraz:

```text
entryQuestion
```

Wyliczane: `slug` (`<z>`), kontekst (encja w `<root>/<x>/`), dział (encja w `<root>/<x>/<y>/`, jeśli istnieje), historia redirectów.

> Artykuł w gatewayu odpowiada na dokładnie jedno `entryQuestion`. Poza gatewayem zakres treści sugeruje sam `title`. `keywords` zawiera słowa powiązane z treścią artykułu (a nie tytułem jak `aliases`). `changeSensitivity` określa ryzyko deaktualizacji danych. Później zależy od niego częstotliwość review artykułu.

> Artykuł może leżeć bezpośrednio w concepcie lub gatewayu, bez działu, jeżeli zakres jest zbyt mały, aby uzasadnić dodatkową warstwę nawigacji. W systemie artykuł zawsze należy do działu.

> Odesłania do innych kontekstów (`explains`) i powiązania z narzędziami są wyprowadzane z linków w treści i z relacji.

## Entity: Tool

Interaktywne narzędzie lub model poznawczy. Plik: `tools/<z>.md` albo `tools/<g>/<z>.md`.

```text
id
title
summary
status
learningGoal
fallbackDescription
standalone: boolean
lastReviewed?
```

Wyliczane: `slug` (`<z>`, tylko gdy `standalone = true`), historia redirectów.

> Jeżeli `standalone = true`, tool ma publiczny route na podstawie sluga. W przeciwnym wypadku jest on osadzony w layoucie.`fallbackDescription` jest opisem tego co udowadnia/przedstawia narzędzie. Domyślnie pozwala ono zastąpić narzędzie tym opisem. Podpięcie narzędzia pod system/concept/gateway/section/article to relacja `illustrates` w plikach relacji (`graph-model.md`).

## Entity: Source

Wielokrotnie używalne źródło researchu lub cytowania. Plik: `sources/<f>/<z>.yaml` albo `sources/<f>/<g>/<z>.yaml`. Source nie ma publicznego route.

Format źródła wynika z katalogu `<f>` i wyznacza zestaw pól. Nie ma pola `format` ani ogólnego pola identyfikatora: każdy format ma własne, nazwane pole identyfikatora, jeśli taki identyfikator w ogóle istnieje.

**Source fields**: wspólne dla każdego formatu:

```text
id
title
authors[]          # co najmniej jeden: osoba albo instytucja (np. IETF)
published?         # YYYY | YYYY-MM | YYYY-MM-DD
url?
notes?
```

Pola własne formatu:

| `<f>` | Co obejmuje | Pola własne |
| :--- | :--- | :--- |
| `standards` | normy i specyfikacje: RFC, ISO, IEEE, W3C, ITU | `designation` (wymagane) |
| `books` | książki i podręczniki | `isbn?`, `publisher?`, `edition?` |
| `papers` | artykuły naukowe, materiały konferencyjne, preprinty | `doi?`, `venue?` |
| `reports` | raporty instytucji, statystyki, white papers | `publisher?` |
| `documentation` | dokumentacja techniczna produktów i projektów | `url` (wymagane), `accessedAt` (wymagane), `version?` |
| `web` | artykuły i strony internetowe | `url` (wymagane), `accessedAt` (wymagane) |

Formaty identyfikatorów (niezmiennik 9):

- `designation`: skrót wydawcy normy i numer rozdzielone myślnikiem, wielkimi literami, np. `RFC-1034`, `ISO-8601`, `IEEE-802.11`. Numer bez skrótu (`1034`) jest niejednoznaczny, bo różne ciała normalizacyjne mają te same numery,
- `isbn`: ISBN-10 lub ISBN-13, z myślnikami albo bez,
- `doi`: `10.<prefiks>/<sufiks>`, bez `https://doi.org/`.

> `published` przyjmuje niepełną datę, bo dla książki czy normy znany jest często tylko rok; pełna data sugerowałaby precyzję, której nie ma. `accessedAt` jest wymagane dla źródeł, które zmieniają się pod tym samym adresem (dokumentacja, strony), żeby cytowanie wskazywało wersję, z której korzystano. `venue` to czasopismo lub konferencja. `authors` zastępuje jedno pole osoby lub instytucji, bo publikacje naukowe i książki mają zwykle wielu autorów.

> W implementacji Source fields odpowiadają schematowi bazowemu `sourceBase`, a każdy format osobnej kolekcji ze schematem `sourceBase` + pola własne formatu: `standardSources`, `bookSources`, `paperSources`, `reportSources`, `documentationSources`, `webSources` (tabela w `content-tooling.md`, **Astro integration**). Dzięki temu wymagalność pól wynika ze schematu, a nie z pola `format` w pliku. Cytowanie szuka źródła po `id` we wszystkich sześciu kolekcjach przez wspólny helper.

## Enum: Status

Pozwala określić stan redakcyjny.

```text
planned
researching
draft
review
published
needs-review
archived
```

## Relation types

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

Jego znaczenie odpowiada definicji global edge z `docs/public/product/atlas-map.md`. Występuje wyłącznie w globalnym grafie, między celami węzłów Atlasu, od niższej warstwy do wyższej (krawędź w obrębie jednej warstwy jest dozwolona).

### Local relation types

Początkowy zestaw:

```text
component-of      # wyliczany z katalogów
explains          # wyliczany z linków w treści
illustrates       # plik relacji
```

- `explains`: encja wskazana linkiem w treści jest kanonicznym wyjaśnieniem dla encji, która linkuje; linki prowadzą wyłącznie do innego kontekstu (`graph-model.md`, **Content references**),
- `illustrates` łączy wyłącznie tool (`from`) z treścią, do której należy (`to`).

`prerequisite` i `related` nie wchodzą do MVP (`graph-model.md`, **Deferred: prerequisite**). Nie należy dodawać kolejnych typów, dopóki nie istnieje dla nich rzeczywista potrzeba poznawcza i sposób prezentacji.

> Krawędzie `component-of` są wyliczane z hierarchii katalogów (artykuł → dział lub kontekst, dział → kontekst) i nie są zapisywane w plikach relacji.

## Derived data

Z modelu źródłowego można wyliczać m.in.:

- typ, slug i route encji,
- kontekst i dział encji,
- działy systemu, conceptu lub gatewaya,
- artykuły działu lub kontekstu,
- odesłania `explains` (z linków w treści) i ich listę na końcu artykułu,
- relacje odwrotne,
- graf systemowy i lokalny (w tym krawędzie hierarchii),
- bibliografię artykułu, działu i systemu,
- pokrycie systemu,
- search documents,
- wykrywanie sierot,
- redirects manifest (z indeksu treści),
- sitemap.

Dane wyliczalne nie powinny być ręcznie synchronizowane w kilku miejscach.

## Required invariants

Walidacja całego modelu powinna zapewniać:

1. globalną unikalność stabilnych `id`, łącznie z wycofanymi,
2. unikalność route w obrębie prefiksu route,
3. istnienie każdego `targetId`, endpointu relacji, cytowanego źródła i celu linku w treści; link w treści prowadzi wyłącznie do opublikowanej encji dozwolonego typu z innego kontekstu (`graph-model.md`, **Link syntax**),
4. poprawne położenie każdego pliku (tabela w **File layout is the hierarchy**) i zgodność prefiksu `id` z typem wynikającym z położenia,
5. brak cykli `prerequisite` (po wprowadzeniu typu; poza MVP),
6. brak niejednoznacznych duplikatów relacji,
7. poprawny kierunek globalnych `foundation-for`: oba końce mają węzeł Atlasu, a warstwa `from` nie jest wyższa niż warstwa `to`,
8. brak opublikowanych sierot,
9. poprawność identyfikatorów źródeł (`designation`, `isbn`, `doi`) i unikalność nazw plików w obrębie `tools/` oraz `sources/`,
10. brak konfliktów redirectów z aktywnymi route,
11. `atlasNode.targetId` wskazuje wyłącznie system, concept lub gateway, który ma pod sobą co najmniej jeden section lub article ze statusem `published`; jeden kontekst ma najwyżej jeden węzeł,
12. brak pól spoza kontraktu frontmattera,
13. zgodność indeksu treści ze stanem plików (`content-tooling.md`),
14. `order` w obrębie rodzeństwa jest ciągłą numeracją od `1`: `n` elementów ma dokładnie wartości `1…n`,
15. system, concept, gateway, artykuł i tool ze statusem `review`, `published` lub `needs-review` mają `lastReviewed`.
