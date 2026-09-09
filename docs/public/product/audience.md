# Audience

## Status

- Created: `18-08-2026`
- Last updated: `09-09-2026`
- Version: `2.1`

## Goal

Dokument określa odbiorców wystarczająco precyzyjnie, aby podejmować decyzje o języku, głębokości treści, strukturze artykułów i UX.

## Primary audience

### Curious generalist

Polskojęzyczny użytkownik w wieku orientacyjnie `16+`, który chce **zrozumieć**, a nie wyłącznie znaleźć krótką definicję.

Typowe cechy:

- ma ogólną wiedzę szkolną,
- nie musi posiadać specjalistycznego przygotowania,
- często trafia z wyszukiwarki na konkretny problem lub pojęcie,
- ceni prosty język i dobrą strukturę,
- jest skłonny wejść głębiej, jeśli widzi sens kolejnego kroku,
- oczekuje nowoczesnej, szybkiej i czytelnej witryny,
- chce wiedzieć, skąd pochodzi informacja,
- może znać angielski, ale nie powinno to być warunkiem korzystania z produktu.

### Primary scenario

> „Chcę zrozumieć, jak działa rzecz, o której słyszę albo z której korzystam, bez studiowania całej dziedziny i bez składania obrazu z kilkunastu przypadkowych stron.”

## Secondary audiences

### Students

Osoby potrzebujące intuicyjnego modelu przed wejściem w podręczniki, wykłady lub dokumentację techniczną.

Atlas może być dobrym punktem startowym, ale nie powinien sugerować, że zastępuje materiał akademicki lub zawodowy.

### Teachers and educators

Osoby szukające zrozumiałych modeli, analogii, diagramów i źródeł do tematów spoza własnej specjalizacji.

### Curious professionals

Specjaliści chcący szybko odświeżyć podstawy innej domeny albo zrozumieć system sąsiadujący z ich kompetencjami.

## Explicit non-audiences

Produkt nie jest projektowany przede wszystkim dla:

- ekspertów oczekujących kompletności publikacji akademickiej,
- osób szukających wiadomości i bieżących komentarzy,
- użytkowników oczekujących porad zawodowych, medycznych, prawnych lub inwestycyjnych,
- osób zainteresowanych wyłącznie krótkimi ciekawostkami,
- użytkowników oczekujących pełnego kursu z ćwiczeniami i certyfikacją.

## Jobs to be done

1. Kiedy trafiam na nieznane zagadnienie, chcę zrozumieć jego istotę bez konieczności sprawdzania co drugiego terminu na innych stronach.
2. Kiedy rozumiem już jedno pojęcie, chcę zobaczyć jego miejsce w większym systemie, aby zbudować spójny model zamiast zapamiętać izolowany fakt.
3. Kiedy chcę wejść głębiej w temat, chcę mieć jasno wskazane prerequisite'y, tematy powiązane i źródła.
4. Kiedy trafiam bezpośrednio z wyszukiwarki, chcę móc korzystać z artykułu bez znajomości struktury Atlasu.
5. Kiedy eksploruję system, chcę mieć zarówno wizualną mapę, jak i zwykłą, przewidywalną nawigację.
6. Kiedy czytam informację, chcę móc ocenić jej źródła i aktualność bez wykonywania dodatkowego researchu tylko po to, by zaufać stronie.
7. Kiedy temat jest skomplikowany, chcę zobaczyć diagram lub interakcję tylko wtedy, gdy naprawdę ułatwia zrozumienie.

## Entry modes

### Search-first

`Wyszukiwarka → Artykuł → kontekst systemu → kolejny temat`

To prawdopodobnie najczęstsze wejście dla nowych użytkowników i powinno być traktowane jako scenariusz pierwszej klasy.

### Atlas-first

`Homepage / Explorer → globalna mapa → system → dział → artykuł`

Dla użytkownika zainteresowanego eksploracją.

### Gateway-first

`Punkt wejścia A4 → mini-system → system / dział / artykuł`

Dla użytkownika, który zaczyna od obiektu lub doświadczenia codziennego.

### Direct link

`Link z social media / polecenie → dowolna strona`

Każda publiczna strona musi mieć wystarczający kontekst, aby nie wymagała wejścia od homepage.

## Desired behaviors

Po wartościowej sesji użytkownik powinien mieć możliwość:

- przejścia do logicznie powiązanego tematu,
- powrotu do mapy systemu lub Atlasu,
- sprawdzenia źródeł,
- zapisania lub udostępnienia konkretnego materiału,
- użycia narzędzia, jeśli wzmacnia ono zrozumienie,
- powrotu w przyszłości do innego systemu.

Nie  każda sesja powinna być długa.

## Content depth assumptions

### Wymagana wiedza

Domyślnie: ogólna wiedza szkolna i codzienne doświadczenie.

Jeśli artykuł wymaga wcześniejszego pojęcia:

- krótko przypomina niezbędną intuicję,
- linkuje do kanonicznego wyjaśnienia,
- nie blokuje użytkownika obowiązkową sekwencją.

### Definicje

Termin definiujemy, jeśli:

- nie jest powszechny,
- ma w danej domenie precyzyjne znaczenie inne od potocznego,
- błędne zrozumienie terminu zaburza dalszy tekst.

### Matematyka

Wzory są dozwolone, gdy realnie pomagają rozumieć mechanizm lub skalę. Intuicja powinna poprzedzać formalizm.

Jeżeli interaktywna zmiana parametrów lepiej pokazuje sens wzoru, można dodać tool lub prostą kontrolkę.

> Odnosi się do wzorów poza dedykowanymi `concept page` jakimi są matematyka i fizyka.

### Jednostki

Używamy poprawnych symboli jednostek. Rozwinięcie nazwy może pojawiać się w treści, tooltipie lub glosariuszu, ale rozwiązanie musi działać również bez hover.

### Terminy angielskie

Jeśli angielska nazwa jest branżowym standardem, można ją zachować. Przy pierwszym użyciu należy podać polski sens lub krótkie wyjaśnienie, jeśli termin nie jest oczywisty.

## Accessibility assumption

„Curious generalist” obejmuje również użytkowników:

- na małych ekranach,
- korzystających z klawiatury,
- powiększających tekst,
- bez hover,
- z ograniczoną możliwością interpretacji złożonego grafu.

Dlatego żaden krytyczny fragment wiedzy ani nawigacji nie może istnieć wyłącznie w interaktywnym grafie.
