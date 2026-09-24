# Družinski kodeks – vprašalnik

Spletni vprašalnik za pripravo družinskega kodeksa (pravila o gospodinjstvu, kuhanju, skupnem času, odnosih, zasebnosti, zaslonih in denarju).

**Spletna stran:** https://alesluznar1976.github.io/druzinski-kodeks/

## Kako deluje
- Vsak član (Aleš, Martina, Živa, Ema) se prijavi s svojim imenom in PIN-om, ki ga določi Aleš (v kodi so shranjeni le zgoščeni).
- Odgovori se sproti shranjujejo v brskalniku, zato lahko izpolnjevanje prekineš in nadaljuješ.
- Ob koncu se odgovori pošljejo po e-pošti (ali kopirajo/prenesejo).
- Zavihek **Pregled odgovorov** prikaže odgovore vseh članov drug ob drugem; prejete odgovore se vanj prilepi.

Stran je čisto statična (GitHub Pages), brez strežnika in baze – odgovori se nikamor ne pošiljajo samodejno.

## Datoteke
- `index.html` – celotna aplikacija (ena datoteka)

## Samodejno shranjevanje odgovorov na GitHub
Odgovori se shranjujejo v zaseben repozitorij **druzinski-kodeks-odgovori** prek posrednika
(Google Apps Script), ker javna stran ne sme vsebovati GitHub žetona.

Nastavitev (enkrat):
1. GitHub → Settings → Developer settings → Fine-grained tokens → nov žeton:
   samo repozitorij `druzinski-kodeks-odgovori`, dovoljenje **Contents: Read and write**.
2. script.google.com → nov projekt → prilepi `posrednik/Code.gs`.
3. Nastavitve projekta → Lastnosti skripta → `GITHUB_TOKEN` = žeton iz 1. koraka.
4. Uvedi → Nova uvedba → Spletna aplikacija (Izvajaj kot: Jaz, Dostop: Vsi) → kopiraj URL `…/exec`.
5. URL vpiši v `index.html` v konstanto `SAVE_URL`.

Če `SAVE_URL` ni nastavljen, stran ponudi pošiljanje po e-pošti.
