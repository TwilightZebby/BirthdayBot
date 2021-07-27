const Discord = require('discord.js');
const { client } = require('../constants.js');


module.exports = {
    name: 'birthday',
    description: `Main Birthday Slash Command`,
    
    // Cooldown is in seconds
    cooldown: 60,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    /**
     * Returns data to be used for registering the Slash Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = this.description;
        data.options = [
            {
                type: 'SUB_COMMAND',
                name: 'set',
                description: 'Set/Edit the Month and Day your Birthday is on so you can receive the Birthday Role',
                options: [
                    {
                        type: 'STRING',
                        name: 'month',
                        description: 'The Month your Birthday is in',
                        required: true,
                        choices: [
                            { name: "January", value: "0" },
                            { name: "February", value: "1" },
                            { name: "March", value: "2" },
                            { name: "April", value: "3" },
                            { name: "May", value: "4" },
                            { name: "June", value: "5" },
                            { name: "July", value: "6" },
                            { name: "August", value: "7" },
                            { name: "September", value: "8" },
                            { name: "October", value: "9" },
                            { name: "November", value: "10" },
                            { name: "December", value: "11" }
                        ]
                    },
                    {
                        type: 'INTEGER',
                        name: 'date',
                        description: 'The Date of your Birthday',
                        required: true
                        // Can't use pre-set choices for the Date as Discord only allows a max of 25 choices per option, and there are up to 31 days in a month!
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'remove',
                description: 'Remove your saved Birthday from the Bot, stopping you from receiving the Birthday Role'
            }
        ];

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction) {

        let subCommandName = slashInteraction.options.getSubCommand(false);

        // Catch for no sub command
        if ( !subCommandName )
        {
            return await slashInteraction.reply({ content: `Please let TwilightZebby#1955 know if you see this error, as it means that I was not able to see the Sub-Command used!`, ephemeral: true });
        }
        // Birthday Set Sub-Command
        else if ( subCommandName === "set" )
        {
            return await slashInteraction.reply({ content: `Birthday Set Slash Sub-Command test successful!` });
        }
        // Birthday Remove Sub-Command
        else if ( subCommandName === "remove" )
        {
            return await slashInteraction.reply({ content: `Birthday Remove Slash Sub-Command test successful!` });
        }

    }
}
