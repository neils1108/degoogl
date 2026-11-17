// Takes a homepage screenshot for every alternative and saves it to public/
// Usage (from your Astro project root):
//   npm i -D playwright && npx playwright install chromium
//   node screenshots.mjs
// Existing files are skipped, so screenshots you already have are left alone.
import { chromium } from "playwright";
import fs from "node:fs";

const sites = {
  // Google Search
  "bravesearch.png": "https://search.brave.com",
  "duckduckgo.png": "https://duckduckgo.com",
  "kagi.png": "https://kagi.com",
  "mojeek.png": "https://mojeek.com",
  "qwant.png": "https://qwant.com",
  "startpage.png": "https://www.startpage.com",

  // Gmail
  "fastmail.png": "https://fastmail.com",
  "mailbox.png": "https://mailbox.org",
  "mailcow.png": "https://mailcow.email",
  "posteo.png": "https://posteo.de",
  "protonmail.png": "https://proton.me/mail",
  "runbox.png": "https://runbox.com",
  "startmail.png": "https://www.startmail.com",
  "tuta.png": "https://tuta.com",

  // Google Photos
  "entephotos.png": "https://ente.io",
  "immich.png": "https://immich.app",

  // Google Chrome
  "brave.png": "https://brave.com",
  "helium.png": "https://helium.computer/",
  "librewolf.png": "https://librewolf.net",
  "firefox.png": "https://www.mozilla.org/firefox",
  "mullvad.png": "https://mullvad.net/browser",
  "tor.png": "https://www.torproject.org/download/",
  "vivaldi.png": "https://vivaldi.com",
  "zen.png": "https://zen-browser.app",
  "waterfox.png": "https://www.waterfox.net",

  // Google Drive
  "drime.png": "https://drime.cloud",
  "filen.png": "https://filen.io",
  "mega.png": "https://mega.io",
  "nextclouddrive.png": "https://nextcloud.com",
  "owncloud.png": "https://owncloud.com",
  "protondrive.png": "https://proton.me/drive",
  "seafile.png": "https://www.seafile.com",
  "sync.png": "https://www.sync.com",
  "tresorit.png": "https://tresorit.com",

  // Google Password Manager
  "1password.png": "https://www.1password.com",
  "2faspass.png": "https://2fas.com/",
  "aliasvault.png": "https://www.aliasvault.net",
  "bitwarden.png": "https://bitwarden.com",
  "keepassxc.png": "https://keepassxc.org",
  "passbolt.png": "https://www.passbolt.com",
  "protonpass.png": "https://proton.me/pass",
  "psono.png": "https://psono.com",
  "vaultwarden.png": "https://github.com/dani-garcia/vaultwarden",

  // Google Authenticator
  "2fasauth.png": "https://2fas.com/",
  "aegis.png": "https://getaegis.app/",
  "bitwardenauth.png": "https://bitwarden.com/products/authenticator/",
  "enteauth.png": "https://ente.io/auth/",

  // Gemini
  "claude.png": "https://claude.ai",
  "deepseek.png": "https://www.deepseek.com",
  "janai.png": "https://jan.ai",
  "mistralai.png": "https://mistral.ai",
  "qwen.png": "https://qwen.ai",

  // Google Calendar
  "baikal.png": "https://sabre.io/baikal/",
  "etesync.png": "https://www.etesync.com",
  "fossify.png": "https://www.fossify.org/apps/calendar/",
  "fruux.png": "https://fruux.com",
  "morgen.png": "https://www.morgen.so",
  "protoncalendar.png": "https://proton.me/calendar",
  "tutacalendar.png": "https://tuta.com/calendar",

  // Google Workspace
  "fileverse.png": "https://www.fileverse.io/",
  "infomaniak.png": "https://www.infomaniak.com/en/ksuite",
  "nextcloud.png": "https://nextcloud.com/hub/",
  "proton.png": "https://proton.me",
  "tutaworkspace.png": "https://tuta.com/business",

  // Google Maps
  "comaps.png": "https://www.comaps.app/",
  "herewego.png": "https://wego.here.com",
  "magicearth.png": "https://magicearth.com/",
  "mapy.com.png": "https://mapy.com/",
  "osmand.png": "https://osmand.net/",

  // Google Translate
  "libretranslate.png": "https://libretranslate.com/",
  "lingvatranslate.png": "https://github.com/TheDavidDelta/lingva-translate",
  "kagitranslate.png": "https://translate.kagi.com/",

  // Google Keep
  "joplin.png": "https://joplinapp.org/",
  "nextcloudnotes.png": "https://nextcloud.com",
  "notallyx.png": "https://github.com/Crustack/NotallyX",
  "obsidian.png": "https://obsidian.md/",
  "standardnotes.png": "https://standardnotes.com/",

  // Android
  "calyxos.png": "https://calyxos.org",
  "grapheneos.png": "https://grapheneos.org",
  "lineageos.png": "https://lineageos.org",
  "eos.png": "https://murena.io",
  "ubuntutouch.png": "https://ubports.com",

  // Google Play Store
  "aurorastore.png": "https://auroraoss.com",
  "fdroid.png": "https://f-droid.org",
};

fs.mkdirSync("public", { recursive: true });
const browser = await chromium.launch();
// 1400x1040 matches the 101:75 ratio of the screenshot box on the pages
const context = await browser.newContext({
  viewport: { width: 1400, height: 1040 },
  colorScheme: "dark",
});

const failed = [];
for (const [file, url] of Object.entries(sites)) {
  const out = `public/${file}`;
  if (fs.existsSync(out)) { console.log("skip", file); continue; }
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000); // let fonts/animations settle
    await page.screenshot({ path: out });
    console.log("ok  ", file);
  } catch (err) {
    console.log("FAIL", file, err.message.split("\n")[0]);
    failed.push(file);
  }
  await page.close();
}
await browser.close();
if (failed.length) console.log("\nRetake manually:", failed.join(", "));