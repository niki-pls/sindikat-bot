const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { getCommands } = require('./utils/utils.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
    ],
});

client.commands = new Collection();

getCommands().forEach(command => {
    client.commands.set(command.metadata.name, command);
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        return interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

client.login(token);
