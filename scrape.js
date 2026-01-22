const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://www.hotstar.com/in/sports/cricket/tournaments/india-vs-new-zealand", {
    waitUntil: "networkidle"
  });

  await page.waitForTimeout(5000);

  const data = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll("img").forEach(img => {
      const title = img.alt || img.title || "";
      const src = img.src;
      if (title && src) {
        items.push({ title, image: src });
      }
    });
    return items;
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
