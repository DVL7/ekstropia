# Global Atlas Map

## Status

- Created: `18-08-2026`
- Last updated: `09-09-2026`
- Version: `2.0`

## Purpose

Globalna mapa jest makroskopowym modelem współczesnego świata. Ma pomagać odpowiedzieć na pytania:

- jakie rodzaje systemów tworzą współczesną cywilizację,
- na jakiej podbudowie się opierają,
- jak użytkownik może wejść do Atlasu od strony codziennego doświadczenia,
- gdzie znajduje się wybrany system względem innych.

Mapa nie jest pełną ontologią rzeczywistości.

## Layers

Termin **warstwa** zastępuje termin „poziom”, aby nie mieszać globalnej mapy z hierarchią `System → Dział → Artykuł`.

### A0 — Formal science

Wybrane podstawowe pojęcia potrzebne do rozumienia systemów:

- Logika
- Teoria informacji
- Matematyka
- Statystyka

A0 nie jest osobnym zestawem pełnych systemów. Zakres każdego węzła ma być ograniczony do tego, czego rzeczywiście potrzebują A1–A3.

### A1 — Natural science

Wybrane dyscypliny opisujące jak zachowuje się świat.

- Fizyka
- Chemia
- Biologia 
- Nauka o Ziemi

Nazwy części węzłów mogą zostać doprecyzowane bez zmiany roli warstwy.

### A2 — Technologie

Pełne systemy fizyczne i techniczne posiadające własne działy i artykuły:

- Oprogramowanie
- Elektronika
- Łączność
- Automatyka i sterowanie
- Pomiar i optyka
- Mechanika i maszyny
- Materiały
- Biotechnologia

### A3 — Infrastruktura

Pełne systemy użytkowe posiadające własne działy i artykuły:

- Internet i sieci
- Komputer
- Kosmos i satelity
- Produkcja przemysłowa
- Transport i logistyka
- Energetyka
- Budownictwo
- Woda i sanitacja
- Odpady i recykling
- Rolnictwo i żywność

### A4 — Punkty wejścia

Mini-systemy zaczynające od doświadczeń i obiektów bliskich użytkownikowi:

- Smartfon
- Dom
- Samochód
- Paczka
- Supermarket
- Szpital
- Fabryka
- Miasto

A4 jest **otwartym typem treści**, a nie zamkniętą taksonomią. Globalna mapa może zawsze pokazywać tylko niewielki zestaw reprezentatywnych gatewayów, nawet jeśli w produkcie istnieje ich więcej.

## Meaning of a global edge

Domyślna semantyka krawędzi globalnej:

> `A → B` oznacza, że **A jest istotną podbudową działania lub zrozumienia B** w modelu Atlasu.

Krawędź nie oznacza automatycznie:

- pełnej przyczynowości,
- relacji własności,
- przepływu pieniędzy,
- wpływu tylko w jednym kierunku,
- braku innych relacji, jeśli krawędzi nie narysowano.

Kierunek krawędzi służy głównie do orientacji i ścieżek prerequisite'ów.

## Selective graph principle

Świat zawiera liczne sprzężenia zwrotne. Globalna mapa nie powinna próbować ich wszystkich narysować.

Krawędź dodajemy, gdy spełnia co najmniej jeden warunek:

1. bez A trudno zrozumieć podstawowe działanie B,
2. B nie może realistycznie działać w swojej współczesnej formie bez A,
3. relacja pomaga użytkownikowi podjąć sensowną decyzję „co poznać wcześniej / gdzie wejść dalej”.

Krawędzie nie istnieją wyłącznie dlatego, że „A ma jakiś wpływ na B”.

## Cross-layer edges

Dopuszczalne są relacje pomijające warstwę, szczególnie do A4, jeśli pokazanie sztucznego węzła pośredniego pogarszałoby zrozumienie.

Przykład: `Elektronika → Smartfon`.

W UI relacja pomijająca warstwę może być wizualnie odróżniona.

## Graphs

Graf globalny i graf systemu mają różne zadania.

### Global graph

- ma mało węzłów,
- pokazuje orientację między domenami,
- używa jednej, prostej semantyki zależności,
- nie próbuje przedstawiać wszystkich artykułów.

### System graph

- zawiera działy i artykuły,
- może mieć dokładniejsze, potencjalnie typowane relacje,
- służy eksploracji konkretnego systemu.

### Local graph

- zawiera zazwyczaj pojedynczy dział i artykuły wokół niego,
- stanowi wycinek z `system graph`
- może być rozszerzony o kontekst, czyli odniesienia danych artykułów z działu do tematów zawartych w `A0-A1` i pokazaniu ich w grafie.


