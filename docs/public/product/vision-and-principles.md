# Vision and Product Principles

## Status

- Created: `18-08-2026`
- Last updated: `09-09-2026`
- Version: `2.0`

## Vision

> **Atlas ma być trwałą, rzetelną i przystępną mapą wiedzy o tym, jak działa współczesny świat.**

W perspektywie wielu lat produkt powinien zwiększać **pokrycie**, a nie gonić za sztucznym poczuciem „ukończenia”. Nawet po wstrzymaniu rozwoju opublikowane systemy powinny zachować wartość jako uporządkowane, źródłowe explainery.

Użytkownik wracający po wielu miesiącach powinien widzieć nie tylko nowe artykuły, lecz przede wszystkim kolejne fragmenty mapy połączone z już istniejącą wiedzą.

## Product principles

### 1. Context over isolated answers

Pojedynczy artykuł ma być użyteczny samodzielnie, ale Atlas powinien zawsze pokazywać, **gdzie ten artykuł znajduje się w większym modelu**.

Nie wystarczy odpowiedzieć „co to jest DNS?”. Produkt powinien również pokazać rolę DNS w Internecie, zależności i sensowne kierunki dalszej eksploracji.

### 2. Structure over feed

Podstawową organizacją produktu są relacje wiedzy, systemy, działy i tematy. Data publikacji nie jest głównym sposobem odkrywania treści.

Homepage, wyszukiwarka, globalna mapa, strony systemów i strony artykułów powinny być różnymi wejściami do tej samej struktury wiedzy.

### 3. Explain systems, not trivia

Temat kwalifikuje się do Atlasu, jeśli pomaga zrozumieć:

- mechanizm działania systemu,
- warunek jego działania,
- istotny komponent,
- przepływ zasobów lub informacji,
- ważną zależność między systemami,
- codzienny punkt wejścia prowadzący do tych mechanizmów.

### 4. Sources are part of the product

Źródła nie są technicznym dodatkiem na końcu strony. Są elementem wiarygodności produktu.

Treści powinny mieć jawne źródła, a użytkownik powinien móc odróżnić:

- fakt,
- uproszczenie dydaktyczne,
- przykład,
- interpretację autora,
- informację potencjalnie zmienną w czasie.

### 5. Progressive depth

Pierwszy kontakt z tematem powinien być intuicyjny. Głębsze szczegóły mogą pojawiać się dalej w artykule, w powiązanych artykułach lub źródłach.

Atlas nie wymaga od użytkownika przeczytania całej ścieżki od A0 do A4. Prerequisite'y mają pomagać, a nie blokować dostęp.

### 6. The graph is a model, not reality

Graf jest świadomie uproszczonym modelem służącym orientacji. Nie powinien próbować odwzorować każdej rzeczywistej relacji między systemami.

Każda widoczna krawędź musi mieć jasne znaczenie. Brak krawędzi nie oznacza braku wpływu w rzeczywistym świecie.

### 7. Multiple navigation paths

Graf nie może być jedynym sposobem nawigacji.

Każdy ważny obszar powinien być osiągalny również przez:

- zwykłe linki,
- breadcrumbs,
- listy działów i artykułów,
- wyszukiwarkę,
- powiązane tematy.

> To szczególnie ważne dla mobile, SEO i dostępności.

### 8. Visualization when it improves understanding

Diagram, mapa, animacja lub tool jest uzasadniony wtedy, gdy pomaga szybciej lub trafniej zrozumieć:

- strukturę,
- relację,
- przepływ,
- skalę,
- zachowanie systemu,
- zmianę parametru.

Jeśli tekst lub statyczny diagram robi to lepiej, należy wybrać prostsze rozwiązanie.

### 9. Evergreen first

Atlas nie konkuruje aktualnością. Priorytetem jest wiedza stabilna i fundamentalna.

Treści zmienne w czasie są dozwolone, jeśli są potrzebne do zrozumienia systemu, ale muszą mieć datę weryfikacji i jasny proces aktualizacji.

### 10. Small but complete

Lepiej mieć jeden system, który daje spójny model podstawowy, niż wiele systemów będących listą placeholderów.

„Complete” nie oznacza pełnej wiedzy eksperckiej. Oznacza brak istotnych luk w **podstawowym modelu działania systemu**.

### 11. One canonical explanation, many entry paths

To samo fundamentalne wyjaśnienie nie powinno być kopiowane do wielu gatewayów i systemów.

Gateway, artykuł lub dział może krótko przypomnieć pojęcie, ale powinien linkować do kanonicznego materiału, gdy temat wymaga szerszego wyjaśnienia.

### 12. Zero-context entry

Każdy artykuł powinien działać dla osoby, która trafiła na niego bez wcześniejszego korzystania z Atlasu.

Nie wolno wymagać „przejścia grafu od początku”. Niezbędne prerequisite'y należy streszczać i linkować.

### 13. Clear boundaries beat false completeness

Jeżeli temat wykracza poza zakres artykułu lub Atlasu, należy to zaartykułować. Lepsza jest jawna granica niż pozorna kompletność osiągnięta przez powierzchowne streszczenie.

### 14. Build to learn, not to show off

Nowe rozwiązanie techniczne powinno albo poprawiać produkt, albo rozwijać autora w obszarze, który nie zagraża krytycznej ścieżce użytkownika.

Techniczna efektowność nie jest uzasadnieniem dla pogorszenia dostępności, wydajności lub utrzymania.

## Anti-principles

Projekt aktywnie unika:

- clickbaitu,
- publikowania dla samej regularności,
- treści generowanych automatycznie bez researchu i odpowiedzialności autora,
- kopiowania Wikipedii lub parafrazowania jednego źródła,
- dekoracyjnych wizualizacji bez wartości poznawczej,
- sztucznego komplikowania grafu,
- gamifikacji odwracającej uwagę od wiedzy,
- wymuszania logowania,
- budowania funkcji technicznych bez potrzeby produktowej,
- traktowania czasu na stronie jako prostego odpowiednika jakości.
