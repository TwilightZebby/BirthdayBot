// LIBRARIES
const fs = require("fs");
const Discord = require("discord.js");


// GLOBAL STUFF
const { client } = require("./constants.js");
const { CONFIG, TOKEN, ErrorLogChannelID, ErrorLogGuildID, Dr1fterXGuildID, TestBirthdayRoleID, Dr1fterXBirthdayRoleID, TestSocialChannelID, Dr1fterXSocialChannelID } = require("./config.js");


// MAPS / COLLECTIONS
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCooldowns = new Discord.Collection();


// BRING IN TEXT COMMANDS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for ( const file of commandFiles )
{
    const tempCMD = require(`./commands/${file}`);
    client.commands.set(tempCMD.name, tempCMD);
}


// BRING IN SLASH COMMANDS
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for ( const file of slashCommandFiles )
{
    const tempSlash = require(`./slashCommands/${file}`);
    client.slashCommands.set(tempSlash.name, tempSlash);
}








/******************************************************************************* */

// READY EVENT
client.once('ready', () => {

    client.user.setPresence({
        status: 'online'
    });

    // Refreshes the status
    setInterval(() => {
        client.user.setPresence({
            status: 'online'
        });
    }, 1.08e+7);

    console.log("I am ready!");


    // Timer loop thingy for giving and revoking of the Birthday Role
    setInterval(async () => {

        const dateCheckJSON = require('./hiddenJsonFiles/dateCheck.json');
        const birthdayDatesJSON = require('./hiddenJsonFiles/birthdayDates.json');

        let timeNow = new Date(Date.now());
        let nowMonth = timeNow.getMonth();
        let nowDate = timeNow.getDate();

        if ( dateCheckJSON["lastCheckedDate"] === nowDate )
        {
            // It's still the same day, do nothing
            delete timeNow, nowMonth, nowDate;
            return;
        }
        else
        {
            // *****New day, sort out roles
            let birthdayStore = Object.values(birthdayDatesJSON);
            let guild = await client.guilds.fetch({ guild: ErrorLogGuildID });
            /**
             * @type {Discord.TextChannel}
             */
            let socialChannel = await guild.channels.fetch(TestSocialChannelID);

            // First, check to see if there were any for yesterday, and revoke Birthday Role from them
            let yesterdayBirthdays = birthdayStore.filter(birthObj => birthObj.birthMonth === dateCheckJSON["lastCheckedMonth"] && birthObj.birthDate === dateCheckJSON["lastCheckedDate"]);
            if ( !yesterdayBirthdays.length || yesterdayBirthdays.length === 0 )
            {
                // There are none stored for yesterday, so move on to today!
            }
            else
            {
                // There are some stored for yesterday, so revoke Birthday Role!
                for ( const yesterBirth of yesterdayBirthdays )
                {
                    let birthMember = await guild.members.fetch(yesterBirth.userID);
                    await birthMember.roles.remove(TestBirthdayRoleID);
                }
            }



            // Check for today
            let todayBirthdays = birthdayStore.filter(birthObj => birthObj.birthMonth === nowMonth && birthObj.birthDate === nowDate);
            if ( !todayBirthdays.length || todayBirthdays.length === 0 )
            {
                // There are none stored for today, so move on!
            }
            else
            {
                for ( const todayBirth of todayBirthdays )
                {
                    let birthMember = await guild.members.fetch(todayBirth.userID);

                    let embed = new Discord.MessageEmbed().setColor('RED')
                    .setTitle(`BIRTHDAY TIME!`)
                    .setDescription(`Happy Birthday **\<\@${birthMember.user.id}\>** (**${birthMember.user.username}#${birthMember.user.discriminator}**)!\nYou have just been given the \<\@\&${TestBirthdayRoleID}\> role for the next 24 hours!\n\nEveryone <:ayaya:545260084012253186> in chat!`)
                    .setThumbnail("https://media0.giphy.com/media/E5jCN5tsN21Ec/giphy.gif")
                    .setTimestamp(timeNow);
                    
                    await birthMember.roles.add(TestBirthdayRoleID)
                    .then(async () => {
                        await socialChannel.send({ embeds: [embed] });
                    });

                    delete embed;
                }
            }



            // FINALLY, change the "lastChecked" stuff to be today, ready for tomorrow
            dateCheckJSON["lastCheckedDate"] = nowDate;
            dateCheckJSON["lastCheckedMonth"] = nowMonth;

            fs.writeFile('./hiddenJsonFiles/dateCheck.json', JSON.stringify(dateCheckJSON, null, 4), async (err) => {
                if (err)
                {
                    return await ErrorModule.LogCustom(err, `Attempted writing to ./hiddenJsonFiles/dateCheck.json: `);
                }
            });

            return;
        }

    }, 300000);

});



















/******************************************************************************* */

// DEBUGGING AND ERROR LOGGING
const ErrorModule = require('./modules/errorLog.js');


// Warnings
process.on('warning', (warning) => {
    console.warn(warning);
    return;
});

client.on('warn', (warning) => {
    console.warn(warning);
    return;
});







// Unhandled Promise Rejections
process.on('unhandledRejection', async (error) => {
    await ErrorModule.LogCustom(error, `Unhandled Promise Rejection: `);
    return;
});








// Discord Errors
client.on('error', async (error) => {
    await ErrorModule.LogCustom(error, `Discord Error: `);
    return;
});






// Discord Rate Limit
client.on('rateLimit', async (rateLimitInfo) => {
    await ErrorModule.LogMessage(`Discord Ratelimit: \n\`\`\`Timeout: ${rateLimitInfo.timeout} \nLimit: ${rateLimitInfo.limit} \nMethod: ${rateLimitInfo.method} \nPath: ${rateLimitInfo.path} \nRoute: ${rateLimitInfo.route} \nGlobal: ${rateLimitInfo.global}\`\`\``);
    return;
});































/******************************************************************************* */
// MESSAGE CREATE EVENT (when a new message is sent)

const TextCommandHandler = require('./modules/textCommandHandler.js');

client.on('messageCreate', async (message) => {
    
    // Prevent other Bots and System stuff from triggering this Bot
    if ( message.author.bot || message.system || message.author.system ) { return; }

    // Ignore DM Messages
    if ( message.channel instanceof Discord.DMChannel ) { return; }

    // Prevent Discord Outages from crashing or breaking the Bot
    if ( !message.guild.available ) { return; }











    // Command Handler
    let textCommandSuccess = await TextCommandHandler.Main(message);
    if ( textCommandSuccess === false )
    {
        // No command prefix detected, so not a command
        return;
    }
    else if ( textCommandSuccess !== false && textCommandSuccess !== true )
    {
        // Command failed or otherwise
        return;
    }
    else
    {
        // Command successful
        return;
    }

});





























/******************************************************************************* */
// INTERACTION CREATE EVENT (when a Slash Command, Button, Select Menu is used)

const SlashCommandHandler = require('./modules/slashCommandHandler.js');
const ButtonHandler = require('./modules/buttonHandler.js');
const SelectMenuHandler = require('./modules/selectMenuHandler.js');

client.on('interactionCreate', async (interaction) => {

    if ( interaction.isCommand() )
    {
        // Is a Slash Command
        return await SlashCommandHandler.Main(interaction);
    }
    else if ( interaction.isButton() )
    {
        // Is a Button Component
        return await ButtonHandler.Main(interaction);
    }
    else if ( interaction.isSelectMenu() )
    {
        // Is a Select Menu (aka Dropdown)
        return await SelectMenuHandler.Main(interaction);
    }
    else
    {
        // Is neither of the three above types
        return;
    }

});



























/******************************************************************************* */

client.login(TOKEN);
