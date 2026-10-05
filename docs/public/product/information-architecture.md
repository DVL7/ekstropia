# Information Architecture

## Status

- Created: `18-08-2026`
- Last updated: `24-09-2026`
- Version: `2.1`

## Goal

IA ma pozwolić użytkownikowi korzystać z Atlasu zarówno jako z pojedynczego explainera, jak i jako z mapy wiedzy.

## Two independent structures

### 1. Global atlas structure

`Atlas → warstwy A0–A4 → węzły`

Ta struktura opisuje **miejsce bytu w obrazie świata**.

### 2. System content structure

`System → Section → Article`

Ta struktura opisuje **głębokość i organizację treści jednego systemu**.

Nie należy numerować drugiej struktury „poziomami 1/2/3”, ponieważ miesza się to z warstwami Atlasu.

## Primary public page types

### Homepage

Cel: wyjaśnić wartość Atlasu i dać trzy główne wejścia:

- wyszukiwarka,
- globalna mapa / Explorer,
- aktualnie dostępne systemy i gatewaye.

Homepage nie powinien wyglądać jak feed najnowszych publikacji.

### Explorer / Global map

Cel: orientacja między warstwami i systemami.

Wymagania:

- możliwość przejścia do wszystkich opublikowanych węzłów,
- możliwość skupienia ścieżki zależności,
- krótka legenda semantyki,
- odpowiednik listowy dla mobile i accessibility.

### System page

Cel: odpowiedzieć „co to za system, jak działa jako całość i jak jest zorganizowany?”.

Powinna zawierać:

- krótką definicję i scope,
- model systemu / overview,
- listę działów,
- graf systemu,
- kluczowe przepływy / zależności,
- sugerowane wejścia dla nowego użytkownika,
- status pokrycia systemu.

### Section page

Cel: zbudować model jednego fragmentu systemu i wprowadzić artykuły.

Powinna zawierać:

- cel poznawczy działu,
- krótki overview,
- artykuły w sugerowanej kolejności,
- lokalne relacje,
- graf lokalny,
- opcjonalny tool / visualization, jeśli któryś z artykułów również ma dedykowany tool / visualization to można zawrzeć linkowanie.
- źródła wspólne dla overview.

### Article page

Cel: wyjaśnić jedno zagadnienie i umieścić je w kontekście.

Powinna działać jako samodzielny landing page z wyszukiwarki.

### Gateway page

Cel: zacząć od konkretnego obiektu lub doświadczenia i odsłonić systemy, które umożliwiają jego działanie.

Gateway ma własną narrację, ale nie duplikuje pełnych wyjaśnień systemowych.

### Concept page A0/A1

Cel: wyjaśnić prerequisite potrzebny w wielu systemach.

Posiadają własny landing page, istnieją w strukturze dopiero gdy pojawi się pierwszy artykuł w danym Concept page. Działy i artykuły w concept page korzystają z tych samych landing pages jak systemy.

### Tool page

Opcjonalna samodzielna strona dla narzędzia, jeśli jego wartość i kontekst są większe niż osadzenie w artykule.

> Więcej w `product-model.md`

### Search page

Wyniki powinny obejmować wiele typów bytów, nie tylko artykuły.

### Sources / Bibliography

Może istnieć globalny widok źródeł, ale źródła przypisane do konkretnej treści muszą być dostępne bez przechodzenia do osobnego katalogu.

> Do rozważenia jest spis bibliografii po każdym dziale dla systemu. Jeśli artykuł jest pojedynczy z warstwy A0-A1, również powinien się znaleźć spis bibliografii obok niego.

### About

Opis celu, metodologii, autora, zasad źródłowych i ograniczeń Atlasu.

## Navigation layers

### Global navigation

Minimum:

- Atlas / Explorer,
- Systemy,
- Search,
- About.

Dokładny komponent nawigacji jest decyzją UX, nie ontologiczną.

### Context navigation

Na stronach systemu, działu i artykułu:

- breadcrumbs,
- link nadrzędny,
- lokalna mapa/lista,
- prerequisite'y,
- „powiązane” i/lub „co dalej”.

### Graph navigation

Graf jest dodatkowym sposobem eksploracji i reprezentacji kontekstu. Nie zastępuje zwykłych linków.

## URL requirements

Dokument nie narzuca finalnego schematu URL, ale wymaga:

- stabilnych i czytelnych slugów,
- nieuzależniania URL od pozycji w grafie,
- nieuzależniania URL od numeru warstwy,
- możliwości przenoszenia artykułu między działami bez utraty kanonicznego adresu lub z poprawnym redirectem,
- osobnych URL dla treści indeksowalnych w wyszukiwarce.

>Strategia routingu: 

| Model | Prefix | Example (with unique slug) |
| :--- | :--- | :--- |
| **System** | /system/ | /system/internet-and-networks/|
| **Dział** | /section/ | /section/dns/|
| **Artykuł** | /article/ | /article/recursive-resolution/|
| **Punkt wejścia** | /gateway/ | /gateway/smartphone/|
| **Narzędzie** | /tool/ | /tool/traceroute-simulator/|
| **Fundamenty** | /concept/ | /concept/mathematics/

### Slug convention

- Slug jest po angielsku, także dla treści pisanej po polsku. Angielskie nazwy są stabilniejsze (terminologia branżowa jest angielska) i nie mają problemu z diakrytykami. Polskie są tytuł, treść i aliasy, więc wyszukiwarka i czytelnik nie potrzebują angielskiego.
- Format: kebab-case, małe litery ASCII, cyfry i pojedyncze myślniki (`dns-resolution`, `tcp-handshake`).
- Slug nazywa temat, a nie jego miejsce: bez prefiksu typu (`/article/dns-resolution`, nie `/article/article-dns-resolution`), bez nazwy systemu lub działu, jeśli nie jest potrzebna do jednoznaczności.
- Slug jest unikalny w obrębie prefiksu. Wszystkie artykuły dzielą `/article/`, a wszystkie działy `/section/`, niezależnie od systemu, więc slug musi być jednoznaczny w całym Atlasie (`dns-caching`, nie `caching`).
- Slug wynika z nazwy pliku lub katalogu treści (`docs/public/architecture/content-model.md`). Zmiana slugu to zmiana nazwy pliku; poprzedni adres dostaje redirect.
- Strony produktu spoza modelu treści (np. wyszukiwarka, „o projekcie”) mogą używać polskich adresów (T-008).

## Orphan prevention

Żadna opublikowana strona merytoryczna nie powinna być sierotą.

Musi być osiągalna co najmniej przez jeden z mechanizmów:

- strukturę systemu,
- globalny Atlas,
- wyszukiwarkę,
- gateway,
- relacje z inną treścią.

## Cross-system content

Artykuł powinien mieć **jedno kanoniczne miejsce**, nawet jeśli jest użyteczny w wielu systemach.

Inne systemy linkują do niego lub zawierają krótkie streszczenie kontekstowe. Artykuł może mieć tylko jeden `Primary System`.
