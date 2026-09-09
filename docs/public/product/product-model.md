# Product Model

## Status

- Created: `18-08-2026`
- Last updated: `09-09-2026`
- Version: `2.0`

## Purpose

Ten dokument definiuje **jakiego rodzaju elementy istnieją w produkcie**. Jest pomostem między wizją produktu, contentem, UX i modelem danych.

Najważniejsze rozróżnienie:

- **globalny Atlas** opisuje relacje między różnymi rodzajami bytów,
- **system** jest samodzielnym obszarem treści z własnymi działami i artykułami,
- **artykuł** jest jednostką wyjaśnienia, a nie automatycznie węzłem globalnej mapy.

## Product entities

### Atlas

Najwyższy poziom produktu. Zawiera globalną mapę, wyszukiwarkę i wejścia do wszystkich opublikowanych treści.

### Atlas node

Węzeł globalnej mapy. Może reprezentować jeden z kilku typów elementów i **nie oznacza pojedynczego artykułu**.

Każdy węzeł posiada:

- stabilny identyfikator,
- nazwę,
- warstwę A0–A4,
- typ elementu,
- krótki opis,
- status publikacji,
- relacje z innymi węzłami,
- opcjonalny docelowy route.

### Formal science — A0 

Wybrane zagadnienie podstawowe potrzebne do zrozumienia systemów. 

`A0` **nie próbują być pełnym kursem matematyki, logiki itd.** Zawiera tylko taki zakres, jaki jest potrzebny systemom Atlasu.

### Natural science — A1

`A1` również nie musi mieć hierarchii pełnego systemu. Dotyczy mniej abstrakcyjnych zagadnień niż A0. 

Przykład: `Fizyka`, `Chemia`, `Biologia`.

### System — A2 / A3

Pełnoprawny obszar Atlasu posiadający własną strukturę treści.

`A2` Zawiera systemy które składają się na utworzenie systemów `A3`. Przykład:

> Elektronika `A2`, Oprogramowanie `A2` → Komputer `A3`

> Mechanika i maszyny `A2`, Materiały `A2`, Pomiar i optyka `A2` → Budownictwo `A3`

System składa się z:

`System → Działy → Artykuły → opcjonalne Tools / Visualizations`

System ma wyjaśniać **podstawowy model działania całości**, nie tylko zbierać tematy należące do podobnej branży.

> Systemy `A3` mogą zawierać większą ilość systemów niższego poziomu niż wymienione przypadki. Takie połączenia krystalizują się na etapie researchu i pisania konkretnego systemu.

### Section

Logiczny fragment systemu grupujący artykuły według mechanizmu, funkcji lub części systemu.

Dział nie powinien być wyłącznie etykietą katalogową. Powinien posiadać własny cel poznawczy i odpowiadać na pytanie: **jaki fragment systemu użytkownik rozumie po ukończeniu tego działu?**

### Article

Kanoniczna jednostka wyjaśnienia jednego zagadnienia lub mechanizmu.

Artykuł może mieć relacje z artykułami w tym samym lub innym systemie. Nie musi występować jako węzeł globalnej mapy.

### Gateway — A4

Punkt wejścia zaczynający od codziennego obiektu, miejsca lub doświadczenia.

Gateway jest **mini-systemem kuratorskim**, nie pełnym systemem domenowym. Zawiera własny kontekst i narrację, ale przede wszystkim łączy istniejące elementy Atlasu.

Gateway może linkować bezpośrednio do:

- systemu,
- działu,
- artykułu,
- concept page A0/A1,
- narzędzia lub wizualizacji.

Przykład: `Dom` może prowadzić do budownictwa, energetyki, wody, Internetu, odpadów.

### Tool

Interaktywne narzędzie pomagające zrozumieć konkretny mechanizm, relację, skalę albo zachowanie.

Tool może być:

- osadzony w artykule,
- przypisany do działu,
- samodzielną stroną, jeśli ma wystarczającą wartość i kontekst.

> Tools może zostać ujednolicone do jednego z powyższych na etapie budowy.

### Visualization

Diagram, animacja, mapa, wykres lub inna reprezentacja niebędąca wyłącznie tekstem.

### Source

Bibliografia która ma być pod napisanym artykułem. Model implementacyjny może być prosty, ale źródło powinno być możliwe do ponownego wykorzystania i audytu.

## Content hierarchy vs atlas layers

Te dwie struktury nie mogą być ze sobą mylone.

### Global atlas layers

`A0 → A1 → A2 → A3 → A4`

Opisują **rolę bytu w modelu świata**.

### System content hierarchy

`System → Section → Article`

Opisuje **organizację treści wewnątrz systemu**.

Artykuły mogą mieć własne relacje grafowe niezależnie od globalnej mapy.

## Canonical vs contextual content

### Canonical content

Materiał będący głównym miejscem wyjaśnienia zagadnienia.

Przykład: artykuł „DNS” w systemie Internet.

### Contextual content

Krótkie przypomnienie lub zastosowanie zagadnienia w innym miejscu.

Gateway `Smartfon` może wyjaśnić rolę DNS w jednym akapicie, ale powinien linkować do kanonicznego artykułu zamiast duplikować pełne wyjaśnienie.

## Completeness

### Atlas completeness

Atlas jako całość **nie ma binarnego stanu complete/incomplete**. Ma poziom pokrycia.

### System completeness

System można oznaczyć jako `core-complete`, gdy:

- użytkownik może zrozumieć jego główne funkcje,
- są opisane kluczowe komponenty i przepływy,
- istotne prerequisite'y są wyjaśnione lub podlinkowane,
- nie ma znanych luk uniemożliwiających podstawowe zrozumienie,
- źródła i powiązania są kompletne.

Nie oznacza to pokrycia specjalistycznych detali.

## Publication states

Logiczny model statusu:

- `planned` — istnieje w modelu, brak treści,
- `researching` — trwa research,
- `draft` — treść istnieje roboczo,
- `review` — gotowe do weryfikacji,
- `published` — publiczne,
- `needs-review` — opublikowane, ale wymaga ponownej weryfikacji,
- `archived` — historyczne / nieaktywne.

Implementacja może używać prostszego zestawu, jeśli produkt tego wymaga.

## What the product deliberately does not model

Globalny Atlas nie musi odwzorowywać:

- wszystkich interakcji między systemami,
- pełnej hierarchii nauk,
- wszystkich organizacji i branż,
- każdego obiektu codziennego świata,
- wszystkich relacji przyczynowych.

Model ma być **wyjaśniający**, nie ontologicznie kompletny.
