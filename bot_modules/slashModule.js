// LIBRARY IMPORTS
const Discord = require('discord.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');


/*
 * type list:
 * 1 = SubCommand
 * 2 = SubCommandGroup
 * 3 = String
 * 4 = Integer
 * 5 = Boolean
 * 6 = User
 * 7 = Channel
 * 8 = Role
*/

// THIS MODULE
module.exports = {

    /**
     * Registers the Ping Slash Command
     * 
     * @param {Discord.Guild} guild 
     */
    async RegisterPing(guild) {

        // Data
        const data = {};
        data.name = "ping";
        data.description = "Test if the Bot responds";

        client.api.applications(client.user.id).guilds(guild.id).commands().post({data});

    },

















    /**
     * Registers the birthday Slash Command
     * 
     * @param {Discord.Guild} guild 
     */
    async RegisterBirthday(guild) {

        // Data
        const data = {};
        data.name = "birthday";
        data.description = "Add or edit your birthday for the Birthday Role";
        data.options = new Array();

        const firstOption = {};
        firstOption.name = "month";
        firstOption.description = "Month your Birthday is in (eg: june, december, etc)";
        firstOption.type = 3; // String
        firstOption.required = true;
        /*firstOption.choices = [
            { name: "January", value: "january" },
            { name: "February", value: "february" },
            { name: "March", value: "march" },
            { name: "April", value: "april" },
            { name: "May", value: "may" },
            { name: "June", value: "june" },
            { name: "July", value: "july" },
            { name: "August", value: "august" },
            { name: "September", value: "september" },
            { name: "October", value: "october" },
            { name: "November", value: "november" },
            { name: "December", value: "december" },
        ];*/

        data.options.push(firstOption);


        const secondOption = {};
        secondOption.name = "day";
        secondOption.description = "The day of the month your Birthday is on (eg: 5, 31, 26, etc)";
        secondOption.type = 4; // Integer
        secondOption.required = true;
        /*secondOption.choices = [
            { name: "1", value: 1 },
            { name: "2", value: 1 },
            { name: "3", value: 1 },
            { name: "4", value: 1 },
            { name: "5", value: 1 },
            { name: "6", value: 1 },
            { name: "7", value: 1 },
            { name: "8", value: 1 },
            { name: "9", value: 1 },
            { name: "10", value: 1 },
            { name: "11", value: 1 },
            { name: "12", value: 1 },
            { name: "13", value: 1 },
            { name: "14", value: 1 },
            { name: "15", value: 1 },
            { name: "16", value: 1 },
            { name: "17", value: 1 },
            { name: "18", value: 1 },
            { name: "19", value: 1 },
            { name: "20", value: 1 },
            { name: "21", value: 1 },
            { name: "22", value: 1 },
            { name: "23", value: 1 },
            { name: "24", value: 1 },
            { name: "25", value: 1 },
            { name: "26", value: 1 },
            { name: "27", value: 1 },
            { name: "28", value: 1 },
            { name: "29", value: 1 },
            { name: "30", value: 1 },
            { name: "31", value: 1 }
        ];*/

        data.options.push(secondOption);

        client.api.applications(client.user.id).guilds(guild.id).commands().post({data});

    },








































    /**
     * Registers the Slash Commands within Discord's Slash Command API
     * 
     * @param {Discord.Guild} guild 
     * @param {String} [command]
     */
    async RegisterCommands(guild, command) {

        if ( command ) {

            // specific command was given, register just that one
            switch (command) {

                case "ping":
                    return await this.RegisterPing(guild);



                case "birthday":
                    return await this.RegisterBirthday(guild);



                default:
                    break;

            }

        }
        else {

            // Register all
            await this.RegisterPing(guild);
            await this.RegisterBirthday(guild);

        }


        return;

    },











    /**
     * Removes the Slash Commands from the Slash Command API when we don't need them in the Guild anymore
     * 
     * @param {Discord.Guild} guild 
     * @param {String} [command]
     */
    async DeleteCommands(guild, command) {

        let cachedCommands = await client.api.applications(client.user.id).guilds(guild.id).commands().get();


        if ( command ) {

            // Just a specific command
            let temp = cachedCommands.find(element => element.name === command);
            client.api.applications(client.user.id).guilds(guild.id).commands(temp.id).delete();

        }
        else {

            // Go through and remove all the commands
            for (let i = 0; i < cachedCommands.length; i++) {
                client.api.applications(client.user.id).guilds(guild.id).commands(cachedCommands[i].id).delete();
            }

        }

        return;

    },

















    /**
     * Responds to a Slash Command Interaction
     * 
     * @param {*} eventData
     * @param {Number} type Response Type. 3 = w/ MSG Eat Input; 4 = w/ MSG show Input; 5 = w/out MSG show Input
     * @param {String} [message]
     * @param {Discord.MessageEmbed} [embed]
     * @param {*} [allowedMentions]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Callback(eventData, type, message, embed, allowedMentions) {
        /* 
        * RESPONSE TYPES
        * 1 = Pong                        = ACK a ping
        * 2 = ACK                         = ACK a command without sending a message, eating the Input
        * 3 = ChannelMessage              = ACK a command, respond with a message, eat Input
        * 4 = ChannelMessageWithSource    = ACK a command, respond with a message, show Input
        * 5 = ACKWithSource               = ACK a command without sending message, show Input
        */

        
        let data;

        if ( message == undefined ) {

            data = {
                "type": `${type}`
            };

        }
        else {

            data = {
                "type": `${type}`,
                "data": {
                    "tts": false,
                    "content": message,
                    "embeds": embed == undefined ? [] : [embed],
                    "allowed_mentions": allowedMentions == undefined ? [] : allowedMentions
                }
            };

        }


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    },



































    /**
     * Responds to a Slash Command Interaction using Ephemeral Messages (only the User can see)
     * 
     * @param {*} eventData
     * @param {Number} type Response Type. 3 = w/ MSG Eat Input; 4 = w/ MSG show Input; 5 = w/out MSG show Input
     * @param {String} message
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async CallbackEphemeral(eventData, type, message) {
        /* 
        * RESPONSE TYPES
        * 1 = Pong                        = ACK a ping
        * 2 = ACK                         = ACK a command without sending a message, eating the Input
        * 3 = ChannelMessage              = ACK a command, respond with a message, eat Input
        * 4 = ChannelMessageWithSource    = ACK a command, respond with a message, show Input
        * 5 = ACKWithSource               = ACK a command without sending message, show Input
        */


        let data = {
            "type": `${type}`,
            "data": {
                "tts": false,
                "content": message,
                "embeds": [],
                "allowed_mentions": [],
                "flags": 64
            }
        };


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    }

};
