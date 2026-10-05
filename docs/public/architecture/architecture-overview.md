# Architecture Overview

## Status

- Created: `01-09-2026`
- Last updated: `24-09-2026`
- Version: `2.1`

## Purpose

Dokument opisuje architekturę Ekstropii na poziomie wystarczającym do utrzymania spójności produktu bez wiązania publicznej dokumentacji z detalami pojedynczych plików implementacji.

Architektura wynika bezpośrednio z modelu produktu:

- treść jest główną wartością,
- każda strona publiczna musi działać jako samodzielne wejście,
- graf jest modelem danych i dodatkową warstwą nawigacji,
- interaktywność ma wzmacniać zrozumienie, a nie warunkować dostęp do treści,
- projekt jest rozwijany przez jedną osobę i powinien mieć niski koszt operacyjny.

## Architectural thesis

MVP jest **statycznie generowanym serwisem content-first**. Treść i relacje są wersjonowane w Git, walidowane podczas builda i publikowane jako gotowy HTML, CSS, SVG oraz niewielkie skrypty klienckie ładowane tylko tam, gdzie są potrzebne.

Klasyczny backend aplikacyjny i baza danych nie są częścią MVP, ponieważ obecny produkt nie wymaga kont, prywatnego stanu użytkownika, komentarzy, panelu redakcyjnego ani danych aktualizowanych w czasie rzeczywistym.

## Architectural drivers

### Content first

Treść powinna być łatwa do:

- pisania i review,
- wersjonowania,
- walidowania,
- przenoszenia między technologiami,
- indeksowania przez wyszukiwarki,
- ponownego użycia w różnych widokach produktu.

Wiedza merytoryczna nie powinna być ukryta w komponentach UI ani w kodzie renderującym.

### Zero-context entry

Artykuł, dział, system, concept lub gateway musi być użyteczny po wejściu bezpośrednio z wyszukiwarki lub linku.

Podstawowa treść strony powstaje po stronie builda. JavaScript nie jest wymagany do przeczytania materiału, poznania jego kontekstu ani przejścia do innych treści.

### Graph as data

Relacje są częścią modelu wiedzy, a nie ręcznie narysowaną dekoracją.

Z tych samych danych mogą powstawać:

- globalna mapa Atlasu,
- lokalne grafy systemu, conceptu, gatewaya, działu i artykułu,
- odesłania do innych kontekstów (lista na końcu artykułu),
- wejścia gatewayów,
- podpięcia narzędzi,
- walidacja sierot i błędnych odwołań.

Renderer grafu nie jest źródłem prawdy.

### Progressive enhancement

Każda funkcja istotna dla zrozumienia lub nawigacji ma podstawową reprezentację w HTML.

Grafy, dialog wyszukiwania, filtry i narzędzia interaktywne mogą używać JavaScriptu, ale ich brak nie może powodować utraty kluczowej informacji.

### Low operational burden

Architektura unika infrastruktury, której produkt jeszcze nie potrzebuje.

Domyślnie preferowane są:

- build-time zamiast runtime,
- pliki zamiast bazy danych,
- hosting statyczny zamiast stale działającej aplikacji serwerowej,
- mechanizmy platformowe zamiast własnych usług operacyjnych.

### Portability

Model treści nie zależy od konkretnego renderera grafu, hostingu ani biblioteki UI.

Zmiana frameworka powinna wymagać przede wszystkim przepisania warstwy renderującej, a nie migracji znaczenia treści i relacji.

## System topology

```text
Git repository
│
├── content entities        Markdown, hierarchia w strukturze katalogów
├── content index           YAML (rejestr id, historia slugów)
├── structured data         YAML / JSON
├── atlas nodes             src/data/atlas.yaml
├── relations               src/data/relations/
└── source catalogue        src/content/sources/
        │
        ▼
build pipeline
├── schema validation
├── cross-reference validation
├── derived navigation and graph views
├── static page rendering
├── graph layout and SVG rendering
└── search indexing
        │
        ▼
static deployment
├── HTML
├── CSS
├── SVG / images
├── Pagefind index
└── optional client-side islands
```

## Source of truth

### Content entities

Kanoniczna treść systemów, conceptów, działów, artykułów, gatewayów i opisów narzędzi jest przechowywana w plikach treści.

### Relations

Relacje grafowe tworzą jeden logiczny model relacji. Każda relacja ma jeden zapis: w strukturze katalogów, w linku w treści albo w pliku w `src/data/`. Widoki grafów i list są z niego wyprowadzane.

Nie należy ręcznie utrzymywać tej samej relacji w dwóch miejscach.

Zakres MVP (szczegóły: `graph-model.md`):

| Relacja | Zapis |
| :--- | :--- |
| `foundation-for` (globalna mapa) | `src/data/atlas.yaml` |
| `component-of` (hierarchia) | wyliczana ze struktury katalogów |
| `explains` (odesłanie do innego kontekstu) | wyliczana z linków w treści |
| `illustrates` (podpięcie narzędzia) | `src/data/relations/` |

`prerequisite` i `related` nie wchodzą do MVP.

### Containment

Hierarchia treści jest zapisana wyłącznie w strukturze katalogów, np.:

- dział to katalog z `index.md` wewnątrz katalogu systemu, conceptu lub gatewaya,
- artykuł to plik w katalogu działu albo, w concepcie i gatewayu, bezpośrednio w katalogu kontekstu.

Encje nie wskazują rodzica we frontmatterze. Rodzic, kontekst oraz listy działów i artykułów są danymi wyliczanymi. Szczegóły: `content-model.md`.

### Routes

Stabilny `id` encji i publiczny `slug` są różnymi pojęciami.

- `id` identyfikuje wiedzę i relacje; jest nadawany raz przy tworzeniu encji i zapisywany we frontmatterze,
- `slug` identyfikuje publiczny adres; jest wyliczany z nazwy pliku lub katalogu,
- zmiana slugu nie zmienia `id`,
- poprzedni adres powinien otrzymać redirect; historię slugów prowadzi indeks treści.

Konwencja slugów: `docs/public/product/information-architecture.md`. Skrypty utrzymujące `id` i indeks treści: `content-tooling.md`.

## Rendering model

Domyślnym trybem jest static site generation.

Strona może użyć komponentu klienckiego, gdy użytkownik rzeczywiście musi:

- zmienić stan widoku,
- filtrować lub wyszukiwać bez przeładowania,
- manipulować parametrem narzędzia,
- skupić wycinek grafu.

Interaktywność nie jest domyślnym modelem aplikacji.

## Graph architecture

### Global graph

Globalna mapa ma mało węzłów i stałą semantykę krawędzi zdefiniowaną w `docs/public/product/atlas-map.md`.

Kierunek jest zawsze:

> `A → B` oznacza, że **A jest istotną podbudową działania lub zrozumienia B**.

Implementacja nie może odwracać tej semantyki.

### System and local graphs

Graf systemu to graf lokalny na stronie systemu. Graf lokalny może używać ograniczonego zestawu typów relacji. Typ relacji istnieje tylko wtedy, gdy ma czytelne znaczenie dla użytkownika i jest używany przez UX. Zawartość grafu dla każdego typu strony: `graph-model.md`, **Local graph**.

### Rendering

Preferowany model MVP:

1. dane relacji są walidowane,
2. layout jest liczony podczas builda,
3. build generuje deterministyczny SVG,
4. klient może dodać focus i filtrowanie,
5. obok grafu istnieje pełna reprezentacja tekstowa.

Dla większych grafów można użyć biblioteki layoutującej podczas builda bez wysyłania jej do przeglądarki.

## Search architecture

Wyszukiwarka powinna indeksować wszystkie publiczne typy treści, nie tylko artykuły.

Indeks powinien wspierać:

- język polski,
- aliasy i terminy angielskie,
- filtrowanie według typu encji,
- kontekst systemu lub conceptu,
- stabilne publiczne URL.

MVP nie wymaga serwera wyszukiwania. Indeks może być generowany po buildzie i ładowany statycznie.

## Build validation

Build lub CI powinien blokować publikację co najmniej przy:

- duplikacie stabilnego `id`,
- duplikacie publicznego route,
- relacji lub linku w treści do nieistniejącej encji,
- linku w treści w obrębie własnego kontekstu albo do nieopublikowanej encji,
- niepoprawnym położeniu pliku treści w strukturze katalogów,
- niezgodności indeksu treści ze stanem plików,
- nieistniejącym źródle cytowania,
- opublikowanej stronie bez wymaganych metadata,
- opublikowanej stronie merytorycznej będącej sierotą,
- redirectzie kolidującym z aktywnym route.

Martwe linki zewnętrzne powinny być kontrolowane okresowo, ale chwilowa niedostępność zewnętrznego serwera nie powinna automatycznie blokować każdego deployu.

## Security and privacy

MVP nie powinno przechowywać prywatnych danych użytkownika po stronie aplikacji.

Jeżeli używana jest analityka, preferowane są rozwiązania:

- agregujące dane,
- bezprofilowe,
- bez potrzeby logowania użytkownika,
- o możliwie małej powierzchni prawnej i operacyjnej.

## Evolution boundary

Backend należy dodać dopiero wtedy, gdy pojawi się funkcja posiadająca trwały stan użytkownika lub wymagająca logiki serwerowej, np.:

- konto,
- zakładki lub postęp czytania synchronizowany między urządzeniami,
- komentarze,
- prywatny panel redakcyjny,
- API z autoryzacją,
- dane aktualizowane poza cyklem builda.

Dodanie backendu powinno być zmianą addytywną. Publiczna treść nadal może pozostać generowana statycznie.

## Architecture non-goals for MVP

- aplikacja SPA jako główny model renderowania,
- baza danych dla samej treści,
- własny CMS,
- runtime graph layout bez potrzeby produktowej,
- ciężki framework UI dla stron czytelniczych,
- mikroserwisy,
- własny system auth,
- infrastruktura wymagająca stałej obsługi tylko po to, by publikować Markdown.
