# Information Architecture

## Status

- Created: `18-08-2026`
- Last updated: `09-09-2026`
- Version: `2.0`

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
- prerequisite'y spoza systemu,
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
| **Artykuł** | /a/ | /a/recursive-resolution/|
| **Punkt wejścia** | /gateway/ | /gateway/smartfon/|
| **Narzędzie** | /tool/ | /tool/traceroute-symulator/|
| **Fundamenty** | /concept/ | /concept/mathematics/

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
