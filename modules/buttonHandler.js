const Discord = require('discord.js');
const fs = require('fs');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');

module.exports = {
    /**
     * Main function for the Button Handler
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     * 
     * @returns {Promise<*>} 
     */
    async Main(buttonInteraction)
    {
        // Feb 29th Birthday Confirmation
        if ( buttonInteraction.customId.includes("feb29") )
        {
            return await this.ConfirmFeb29(buttonInteraction);
        }

        return;
    },




    /**
     * For confirmation button when attempting to set Birthday as Feb 29th
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     */
    async ConfirmFeb29(buttonInteraction) {

        let birthdayJSON = require('../hiddenJsonFiles/birthdayDates.json');

        // Fetch user ID from button
        let originalUserID = buttonInteraction.customId.slice(6);

        // Just in case, check that User that pressed the button *is* the User setting their Birthday
        if ( originalUserID !== buttonInteraction.user.id )
        {
            return;
        }

        // Set the birthday
        birthdayJSON[originalUserID] = {
            userID: originalUserID,
            birthMonth: 1,
            birthDate: 29
        };

        // Write to JSON file
        fs.writeFile('./hiddenJsonFiles/birthdayDates.json', JSON.stringify(birthdayJSON, null, 4), async (err) => {
            if (err)
            {
                return await ErrorModule.LogCustom(err, `Attempted writing to ./hiddenJsonFiles/birthdayDates.json: `);
            }
        });


        return await buttonInteraction.update({ content: `✅ Successfully set your Birthday as February 29th!`, components: [] });
    }
}
