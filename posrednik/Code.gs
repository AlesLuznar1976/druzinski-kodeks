/**
 * Posrednik za shranjevanje odgovorov na GitHub.
 * Spletna stran (GitHub Pages) pošlje odgovore sem, skript pa jih z GitHub žetonom
 * zapiše v zaseben repozitorij AlesLuznar1976/druzinski-kodeks-odgovori.
 *
 * NASTAVITEV (enkrat):
 *  1. script.google.com → Nov projekt → prilepi to kodo.
 *  2. Nastavitve projekta (zobnik) → Lastnosti skripta → dodaj:
 *       GITHUB_TOKEN = <fine-grained PAT z dovoljenjem Contents: Read and write
 *                       samo za repozitorij druzinski-kodeks-odgovori>
 *  3. Uvedi → Nova uvedba → Spletna aplikacija:
 *       Izvajaj kot: Jaz; Kdo ima dostop: Vsi
 *  4. Kopiraj URL spletne aplikacije (…/exec) in ga vpiši v index.html (SAVE_URL).
 */
const OWNER = 'AlesLuznar1976';
const REPO  = 'druzinski-kodeks-odgovori';
const ALLOWED = ['ales', 'martina', 'ziva', 'ema'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || d.kodeks !== 1 || ALLOWED.indexOf(d.id) < 0) return out({ ok: false, error: 'neveljavni podatki' });

    const stamp = Utilities.formatDate(new Date(), 'Europe/Ljubljana', "yyyy-MM-dd_HH-mm");
    const json = JSON.stringify(d, null, 2);
    const msg = 'Odgovori: ' + d.name + ' (' + stamp + ')';

    putFile('odgovori/arhiv/' + d.id + '-' + stamp + '.json', json, msg);
    putFile('odgovori/' + d.id + '.json', json, msg);
    putFile('odgovori/' + d.id + '.md', d.text || json, msg);
    return out({ ok: true, stamp: stamp });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() { return out({ ok: true, info: 'posrednik deluje' }); }

function putFile(path, content, message) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN ni nastavljen');
  const url = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + path;
  const headers = { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' };

  let sha = null;
  const get = UrlFetchApp.fetch(url, { headers: headers, muteHttpExceptions: true });
  if (get.getResponseCode() === 200) sha = JSON.parse(get.getContentText()).sha;

  const body = { message: message, content: Utilities.base64Encode(content, Utilities.Charset.UTF_8) };
  if (sha) body.sha = sha;
  const res = UrlFetchApp.fetch(url, { method: 'put', headers: headers, contentType: 'application/json', payload: JSON.stringify(body), muteHttpExceptions: true });
  if (res.getResponseCode() >= 300) throw new Error('GitHub ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200));
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
