# Graph Model

## Status

- Created: `24-09-2026`
- Last updated: `24-09-2026`
- Version: `1.0`

## Purpose

Dokument definiuje grafy Ekstropii: jakie widoki grafu istnieją, z jakich danych powstają oraz gdzie i w jakim formacie zapisujemy relacje i węzły Atlasu.

Powiązane dokumenty:

- `docs/public/product/atlas-map.md`: znaczenie globalnej mapy, warstw A0–A4 i krawędzi globalnej (nadrzędny wobec tego dokumentu),
- `docs/public/product/product-model.md`: węzeł Atlasu jako element produktu,
- `content-model.md`: encje, `id`, hierarchia w katalogach, niezmienniki,
- `content-tooling.md`: skrypty i walidacja.

> Kwestie odłożone na później wymienia sekcja **Open questions**.

## Graph views

Istnieją dwa grafy: **global graph** (Atlas) i **local graph**. „System graph” z `atlas-map.md` to local graph na stronie systemu, a nie osobny widok.

### Global graph

- węzły: AtlasNode (patrz **AtlasNode**),
- krawędzie: wyłącznie `foundation-for`,
- kierunek: od niższej warstwy do wyższej; krawędź w obrębie jednej warstwy jest dozwolona.

**Open:** wizualne przedstawienie krawędzi w obrębie jednej warstwy i krawędzi pomijających warstwę (`atlas-map.md`, **Cross-layer edges**).

### Local graph

Graf lokalny jest zawsze wycentrowany na encji bieżącej strony. Węzeł centralny jest podpisany jej `title`.

**Strona kontekstu** (systemu, conceptu lub gatewaya; `index.md` kontekstu). Wszystkie trzy typy pokazują graf tak samo:

- węzeł centralny: kontekst,
- wyłącznie hierarchia z katalogu tego kontekstu: kontekst ← działy ← artykuły, oraz artykuły bez działu (w concepcie i gatewayu),
- bez `explains`, `illustrates` i czegokolwiek spoza katalogu kontekstu.

**Strona działu:**

- węzeł centralny: dział,
- kontekst, do którego należy dział,
- sąsiednie działy: poprzedni i następny według `order`, bez ich artykułów,
- artykuły działu,
- bezpośrednie powiązania działu: `explains` z innych kontekstów i do nich, tools z `illustrates` do działu; w praktyce rzadkie.

**Strona artykułu:**

- węzeł centralny: artykuł,
- dział, do którego należy artykuł (dla artykułu bez działu: kontekst),
- artykuł poprzedni i następny według `order`, wyłącznie w obrębie tego samego rodzeństwa (`content-model.md`, **Reading order**): graf nie przechodzi do sąsiedniego działu i nie zawija numeracji; pierwszy artykuł nie ma poprzednika, ostatni nie ma następnika,
- bezpośrednie powiązania artykułu: `explains` w obu kierunkach (encje z innych kontekstów, do których artykuł linkuje, i treści, które linkują do artykułu), tools z `illustrates` do artykułu.

## Data location

Relacje i węzły Atlasu leżą poza `src/content/`, bo nie są encjami z plikiem-tożsamością:

```text
src/data/
├── atlas.yaml                               # węzły Atlasu + krawędzie foundation-for
└── relations/                               # relacje ustalane ręcznie
    └── systems/
        └── internet/
            └── dns/
                ├── index.yaml               # relacje do działu DNS
                └── dns-resolution.yaml      # relacje do artykułu
```

- w YAML-u są wyłącznie relacje ustalane ręcznie przez autora; w MVP jest to tylko `illustrates`; krawędzie wyliczalne (hierarchia, linki w treści) nie są zapisywane,
- walidacja sprawdza poprawność wszystkich rekordów łącznie, niezależnie od pliku, w którym leżą; położenie pliku relacji nie ma znaczenia w modelu,
- `classifyPath` i `loadContent` nie czytają `src/data/`.

### Relation file convention

Konwencja porządkowa, nie źródło prawdy:

- plik relacji odwzorowuje w całości ścieżkę encji `to` w `src/content/`, łącznie z katalogiem `<root>`, z rozszerzeniem `.yaml` zamiast `.md`: `systems/internet/dns/dns-resolution.md` → `relations/systems/internet/dns/dns-resolution.yaml`, `systems/internet/dns/index.md` → `relations/systems/internet/dns/index.yaml`,
- plik zawiera relacje, których `to` jest tą encją,
- tool jest zawsze `from` (`illustrates`), więc jego relacje leżą przy treści, do której należy,
- po przeniesieniu lub zmianie nazwy encji plik relacji nie przenosi się sam; `sync-content` zgłasza ostrzeżenie (`content-tooling.md`, **Relation file warnings**).

## AtlasNode

Plik: `src/data/atlas.yaml`, wszystkie węzły w jednym pliku.

```text
targetId           # system, concept albo gateway
layer: A0 | A1 | A2 | A3 | A4
title?             # tekst w węźle; domyślnie title encji docelowej
summary            # 1–2 zdania, krótsze niż summary encji docelowej
```

- węzeł nie ma własnego `id`; identyfikuje go `targetId`, a jeden kontekst ma najwyżej jeden węzeł,
- węzeł nie ma własnego route ani statusu; prowadzi do strony encji docelowej,
- węzeł nie trafia do indeksu treści; zamrożone `id` encji docelowej zapewnia stabilność klucza,
- `targetId` wskazuje encję, która ma pod sobą co najmniej jeden dział lub artykuł ze statusem `published` (`content-model.md`, niezmiennik 11).

**Open:** limit długości `summary` w schemacie.

## Relation record

Wspólny format rekordu relacji (lokalnej i `foundation-for`):

```yaml
- from: tool:traceroute
  type: illustrates
  to: article:internet/dns/dns-resolution
```

- `from → to` zgodnie z **Direction convention** w `content-model.md`,
- rekord nie ma dodatkowych pól,
- ten sam rekord zapisany dwa razy jest duplikatem (niezmiennik 6).

## Relation types

| Typ | Źródło danych | Końce |
| :--- | :--- | :--- |
| `foundation-for` | `atlas.yaml` | cele AtlasNode |
| `component-of` | wyliczany z katalogów | section → kontekst, article → section albo kontekst |
| `explains` | wyliczany z linków w treści | cel linku → encja linkująca, w różnych kontekstach |
| `illustrates` | `relations/` albo link w treści do toola z `standalone: true` | tool → system, concept, gateway, section, article |

Poza MVP: `prerequisite` i `related`.

### foundation-for

Krawędź globalnego grafu. Kierunek: `layer(from) ≤ layer(to)`. Warstwy służą głównie do zarządzania węzłami w globalnym grafie; relacje lokalne nie są ograniczane warstwami.

### component-of

Krawędzie hierarchii (kontekst ← dział ← artykuł) są wyliczane ze struktury katalogów podczas builda i pokazywane w grafie jako `component-of` (`content-model.md`, **One-way containment**). Nie są zapisywane w YAML-u.

### Content references (explains)

Treść odsyła do kanonicznych wyjaśnień zamiast powtarzać je w całości. Odesłanie jest linkiem w treści, tak jak cytowanie źródła, i jednocześnie jedynym zapisem krawędzi: build wylicza z linków krawędzie `explains`.

- `A --explains--> B`: B linkuje w treści do A, a A jest kanonicznym wyjaśnieniem tego, do czego B się odwołuje (kierunek zgodny z **Direction convention**),
- krawędzie powstają z linków w treści kontekstu, działu i artykułu, nie tylko w gatewayu,
- linki prowadzą wyłącznie do innego kontekstu; w obrębie własnego kontekstu kolejność czytania wyznacza `order` (`content-model.md`, **Reading order**), więc w MVP link wewnętrzny jest błędem walidacji,
- w gatewayu odesłania są podstawowym sposobem budowania treści: gateway, jego działy i artykuły nakreślają kontekst i odsyłają do niższych warstw,
- encja gatewaya nigdy nie jest celem linku z innej treści, więc nigdy nie jest `from` krawędzi `explains`,
- lista encji, do których artykuł linkuje, może być wyświetlona na końcu artykułu,
- link wskazuje encję po `id` (patrz **Link syntax**), żeby build mógł zbudować krawędź i sprawdzić, czy cel istnieje (niezmiennik 3).

### Link syntax

Linki do innych encji i cytowania źródeł mają jedną składnię:

```md
Adres zamienia się na IP dzięki mechanizmowi [[article:internet/dns/dns-resolution]].
Format rekordów opisuje [[source:rfc-1034]].
```

- zapis to wyłącznie `[[id]]`, bez własnego tekstu linku; w miejscu linku zawsze wyświetla się `title` celu,
- znaczenie linku wynika z prefiksu typu w `id`:

| Cel | Wynik w treści | Krawędź grafu |
| :--- | :--- | :--- |
| `system:`, `concept:`, `section:`, `article:` | link do route celu | `explains` |
| `tool:` z `standalone: true` | link do route toola | `illustrates` (tool → encja linkująca) |
| `source:` | `title` źródła jako znacznik cytowania; bibliografia strony wyliczana z użytych znaczników (T-007) | brak |

- `[[...]]` jest rozpoznawane przez plugin remark podczas builda; bez pluginu pozostaje czytelnym tekstem; wewnątrz bloków kodu nie jest interpretowane,
- znacznik źródła w MVP nie przyjmuje dodatkowych danych (strona, rozdział).

Błędy walidacji (niezmiennik 3):

- cel nie istnieje albo jest wycofany,
- cel ma status inny niż `published` (dotyczy encji ze statusem; source nie ma statusu),
- cel leży w tym samym kontekście co encja linkująca,
- cel jest gatewayem albo jego działem lub artykułem,
- cel jest toolem z `standalone: false` (brak route),
- to samo podpięcie toola zapisane jednocześnie linkiem i rekordem w `relations/` (duplikat, niezmiennik 6).

### illustrates

Wskazuje treść, do której należy tool. Notatki są wyłącznie w Markdown, więc tool nie jest osadzany w treści. Layout może go pokazać jako opcjonalny element strony, na podstawie tej relacji. Krawędź powstaje z rekordu w `relations/` albo z linku w treści do toola z `standalone: true` (**Link syntax**); tool osadzany (`standalone: false`) podpina się wyłącznie rekordem. Tool jest widoczny w local graph działu lub artykułu, do którego jest bezpośrednio podpięty, a nigdy w local graph kontekstu.

**Open:** sposób prezentacji toola w layoucie.

### Deferred: prerequisite

`prerequisite` (podbudowa: „A warto zrozumieć przed B”) nie wchodzi do MVP; jego rolę przejmuje `explains`. Wraca, jeśli w praktyce zabraknie rozróżnienia „przeczytaj najpierw” (kryteria T-009). Ustalenia na ten wypadek:

- ręczny rekord w `relations/`,
- końce: dział lub artykuł systemu albo conceptu; nigdy cały concept ani system,
- dozwolony w obrębie jednej warstwy, przeznaczony do powiązań między różnymi kontekstami.

## Validation

| Sprawdzenie | Niezmiennik (`content-model.md`) |
| :--- | :--- |
| endpointy relacji, `targetId` i cele linków w treści istnieją | 3 |
| link w treści: cel opublikowany, spoza własnego kontekstu, dozwolonego typu (**Link syntax**) | 3 |
| typ końców relacji zgodny z tabelą **Relation types** | 3 |
| brak duplikatów relacji | 6 |
| `foundation-for`: oba końce mają węzeł, `layer(from) ≤ layer(to)` | 7 |
| AtlasNode wskazuje kontekst z opublikowaną treścią; jeden węzeł na kontekst | 11 |

## Open questions

Odłożone na później (poza zakresem tego dokumentu na teraz):

- limit długości `summary` węzła (razem z limitami pozostałych pól),
- wizualizacja krawędzi w jednej warstwie i pomijających warstwę,
- prezentacja toola (`illustrates`) w layoucie.
