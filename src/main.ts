import puppeteer from "puppeteer";

(async () => {
  try {
    const context = "coffee shop nearby";
    const coordinates = "14.6149716,120.965005";

    const URL = `https://www.google.com/maps/search/${context}/@${coordinates},17z/data=!3m1!4b1!5m1!1e4`;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: "networkidle2" });

    await page.setViewport({ width: 1280, height: 800 });

    await page.waitForSelector("body");
    a;

    // Scroll the container for a longer time
    await page.evaluate(async () => {
      const scrollContainer = document.querySelector(
        "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd"
      );

      if (scrollContainer) {
        let previousScrollHeight = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 3; // Adjust this number as needed

        while (scrollAttempts < maxScrollAttempts) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

          if (scrollContainer.scrollHeight === previousScrollHeight) {
            break; // Stop if no new content is loaded
          }

          previousScrollHeight = scrollContainer.scrollHeight;
          scrollAttempts++;
        }
      }
    });

    const coffeeShops = await page.evaluate(() => {
      const shops: any[] = [];
      const shopElements = document.querySelectorAll(
        "#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd > div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd > div"
      );

      // remove the first 2 elements of shopElements
      const parsedShopElements = Array.from(shopElements).slice(2);

      parsedShopElements.map((shopElement, index) => {
        if (index % 2 === 0) {
          const name =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div.NrDZNb > div.qBF1Pd.fontHeadlineSmall"
            )?.textContent || null;

          const rating =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div:nth-child(3) > div > span.e4rVHe.fontBodyMedium > span > span.MW4etd"
            )?.textContent || null;

          const reviewerCount =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div:nth-child(3) > div > span.e4rVHe.fontBodyMedium > span > span.UY7F9"
            )?.textContent || null;

          const address =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div:nth-child(4) > div:nth-child(1) > span:nth-child(2) > span:nth-child(2)"
            )?.textContent || null;

          const status =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div:nth-child(4) > div:nth-child(2) > span > span > span:nth-child(1)"
            )?.textContent || null;

          const closesAt =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div:nth-child(4) > div:nth-child(2) > span > span > span:nth-child(2)"
            )?.textContent || null;

          const perPersonPrice =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.y7PRA > div > div > div.UaQhfb.fontBodyMedium > div:nth-child(3) > div > span:nth-child(3) > span:nth-child(2)"
            )?.textContent || null;

          const url = shopElement.querySelector("div > a")?.getAttribute("href") || null;

          // extract coordinates from url
          // on 'https://www.google.com/maps/place/1128+Tea+and+Cafe+-+Herbosa+Tondo+Branch/data=!4m7!3m6!1s0x3397b598c944aba3:0xc40a3b11e7e89448!8m2!3d14.6181805!4d120.9669151!16s%2Fg%2F11ths9821j!19sChIJo6tEyZi1lzMRSJTo5xE7CsQ?authuser=0&hl=en&rclk=1'
          // the coordinates is [14.6181805, 120.9669151]
          const [latitude, longitude] = url?.match(/!8m2!3d([^!]+)!4d([^!]+)/)?.slice(1) || [
            null,
            null,
          ];

          const imageSrc =
            shopElement
              .querySelector(
                "div > div.bfdHYd.Ppzolf.OFBs3e > div.lI9IFe > div.SpFAAb > div > div.FQ2IWe.p0Hhde > img"
              )
              ?.getAttribute("src") || null;

          const serviceOptions =
            shopElement.querySelector(
              "div > div.bfdHYd.Ppzolf.OFBs3e > div.qty3Ue > div.n8sPKe.ccePVe"
            )?.textContent || null;

          // split serviceOptions by `·`
          const service = serviceOptions?.split("·") || null;

          shops.push({
            name,
            rating,
            reviewerCount,
            address,
            status,
            closesAt,
            perPersonPrice,
            url,
            latitude,
            longitude,
            imageSrc,
            service,
          });
        }
      });

      //   return shopElements.length;
      return { count: parsedShopElements.length / 2, shops };
    });

    console.log(coffeeShops);

    // await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
