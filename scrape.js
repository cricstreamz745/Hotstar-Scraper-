const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let results = [];

  page.on("response", async (res) => {
    const url = res.url();
    if (url.includes("content") || url.includes("tray") || url.includes("collection")) {
      try {
        const json = await res.json();
        const items = JSON.stringify(json);

        const matches = items.match(/"title":"(.*?)".*?"image":"(.*?)"/g);
        if (matches) {
          matches.forEach(m => {
            const t = m.match(/"title":"(.*?)"/);
            const i = m.match(/"image":"(.*?)"/);
            if (t && i) {
              results.push({
                title: t[1],
                image: i[1]
              });
            }
          });
        }
      } catch {}
    }
  });

  await page.goto("https://www.hotstar.com/in/sports/cricket/tournaments/india-vs-new-zealand", {
    waitUntil: "networkidle"
  });

  await page.waitForTimeout(12000);

  // Remove duplicates
  const unique = [];
  const seen = new Set();
  for (const x of results) {
    const k = x.title + x.image;
    if (!seen.has(k)) {
      seen.add(k);
      unique.push(x);
    }
  }

  fs.writeFileSync("data.json", JSON.stringify(unique, null, 2));
  console.log("Saved:", unique.length);

  await browser.close();
})();
