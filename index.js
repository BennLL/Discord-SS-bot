const puppeteer = require("puppeteer");
const { Client, IntentsBitField, Message } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.username} is online.`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) {
    return;
  }

  // "-preview "
  if (msg.content.startsWith("-preview ")) {
    var site = msg.content.replace("-preview ", "");

    msg.reply("going to website...");

    goingSite(site);

    async function goingSite(link) {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      page.on("error", (err) => {
        console.error(err);
        const errorMsg = "An error occurred.";
        msg.channel.send(errorMsg);
      });

      page.on("pageerror", (err) => {
        console.error(err);
        const errorMsg = "An error occurred.";
        msg.channel.send(errorMsg);
      });

      try {
        await page.goto(link, {
          waitUntil: "networkidle2",
        });
        await page.evaluate(
          () => new Promise((resolve) => setTimeout(resolve, 3000))
        );
        await page.setViewport({ width: 1920, height: 1080 });
        await page.screenshot({ path: "ss.png" });
        // await page.screenshot({ path: "ss.png", fullPage: true });
        // ^^ for large screenshots

        await browser.close();
        msg.channel.send({ files: [{ attachment: "ss.png" }] });
      } catch (err) {
        const errorMsg = "An error occurred.";
        console.error(err);
        msg.channel.send(errorMsg);
        await browser.close();
      }
    }
  }
});

client.login(process.env.TOKEN);

// node index.js to start bot
// { files: [{ attachment: 'ss.png' }] }
