# Livesport Summer Internship Recruitment task

Tato malá aplikace vznikla ze zadání tasku pro ověření znalostí kandidáta (neboli mě) při výběrovém řízení na letní stáž v Livesportu

## Jak spustit

```bash
git clone git@github.com:maruzek/livesport-task.git
# git clone https://github.com/maruzek/livesport-task.git
cd livesport-task
pnpm i
pnpm dev
# pnpm dev --host
```

## Cíle

1. Ověřit znalosti kandidáta
2. Implementovat jednoduchou aplikaci na vyhledávaní entit - soutěže, týmy, hráči, pomocí Livesport Search Service API

## Požadavky

### Funkční požadavky

- [x] 2 obrazovky - výpis výsledků a detail
- [x] Výpis bude obsahovat titulek (např. Výsledky), vyhledávací pole, tlačítko pro vyhledání a list výsledků
- [x] Vyhledávání musí mít možnost filtrace dle typu entity (viz parametry API):
  - všechny typy - id 1,2,3,4
  - pouze soutěže - id 1
  - pouze participanti - id 2,3,4
- [x] Aplikace bude vhodně zobrazovat stav stahování dat - loading
- [x] V případě jakékoliv chyby - nedostupný internet, serverová chyba, … se zobrazí alert s příslušnou zprávou a tlačítkem s akcí “Obnovit”
- [x] Každý řádek musí zobrazovat minimálně:
  - název entity - např. Arsenal FC, Roger Federer, a pod.
  - logo/fotku, případně placeholder jestli chybí
- [x] Každý řádek bude navigovat na detail
- [x] Detail bude obsahovat titulek s názvem entity, větší fotku/logo/placeholder, zemi soutěže/týmu/hráče, dle uvážení další dostupné informace

### Nefunkční požadavky

- [x] Komponentu vyhledávacího pole implementuj sám, na ostatní UI prvky můžeš použít komponentovou knihovnu dle uvážení.
- [x] Pro práci s daty využít Promises popřípadě async/await
- [x] Logiku pokrýt testy (rád bych viděl jeden na komponentu, který ověří chová a obsah
      UI prvku a jeden asynchronní na logiku stahování dat)
- [x] Využít git a práci průběžně a logicky commitovat

### API požadavky

- [x] lang-id: 1 (celá aplikace je v angličtině)
- [x] project-id: 602
- [x] project-type-id: 1
- [x] sport-ids: 1,2,3,4,5,6,7,8,9
- [x] type-ids: 1,2,3,4 (podle filteru)
- [x] q

- [x] u obrázků “variantTypeId”=15 (mimo vlajek států)
- [x] Pokud obrázek v dané variantě pro soutěž či participanta nenajdu v response, zobrazím nějaký placeholder

### Error handling

Apikace zobrazuje příslušnou chybovou hlášku v případě, že dojde k chybě. Konkrétně zobrazí unikátní hlášku pro následující HTTP status kódy:

- [x] 400
- [x] 422
- [x] 503
- [x] 401
- [x] 403
- [x] 404
- [x] 500
- [x] 503

## Bonusové funkce přidané mnou

- [x] Možnost přidávat a odebírat entity do oblíbených. Vše se ukládá do localStorage

## Použité Technologie

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
