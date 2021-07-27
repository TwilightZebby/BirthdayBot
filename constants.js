/********************
 * Discord.js related
 ********************/

const Discord = require("discord.js"); //Bringing in Discord.js
exports.client = new Discord.Client({ intents: [ Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_INTEGRATIONS ] });
