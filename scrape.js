const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.hotstar.com/in/sports/cricket/tournaments/india-vs-new-zealand",
    { waitUntil: "networkidle" }
  );

  await page.waitForTimeout(6000);

  const data = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('img[alt]').forEach(img => {
      const title = img.getAttribute("alt")?.trim();
      const src = img.getAttribute("src");

      if (!title || !src) return;

      // Filter: only Hotstar content images
      if (!src.includes("img") || !src.includes("hotstar")) return;

      // Filter logo
      if (title.toLowerCase().includes("hotstar")) return;

      items.push({
        title,
        image: src
      });
    });

    return items;
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
