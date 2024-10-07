const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js'); // Importar diretamente o Client, os Intents e o EmbedBuilder
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const config = require("./config.json");

client.on("ready", () => {
    console.log("Bot is online!");
});

client.on("guildCreate", () => {
    console.log("Joined a new guild!");
    
});

client.on("guildDelete", guild => {
    console.log(`Left ${guild.name}!`);
});

// Lista de comandos
const comandos = [
    { name: 'ping', description: 'Check bot latency' },
    { name: 'roll', description: 'Roll a die with a number of sides' },
];

// Função para gerar o embed com a lista de comandos
function getCommandListEmbed() {
    const embed = new EmbedBuilder()
        .setTitle('Command List')
        .setColor('#0B192C');

    // Adicionar comandos à descrição
    const commandList = comandos
        .map((comando) => `**${comando.name}**: ${comando.description}`)
        .join('\n'); // Corrigido de '/n' para '\n'

    embed.setDescription(commandList);
    return embed;
}

client.on("messageCreate", async message => {
   
    if (message.author.bot) return;
    if (!message.guild) return;
    // Verifica se a mensagem começa com o prefixo configurado
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase(); // Extrai o comando

    if (comando === "ping") {
        const m = await message.channel.send("Pong!");
        m.edit(`Pong! Latência: ${m.createdTimestamp - message.createdTimestamp}ms`);
    }


    if (comando === "roll") {
        const rollPattern = /(\d+)d(\d+)/; 
        const match = args[0].match(rollPattern); 
    
        if (match) {
            const numDice = parseInt(match[1]); 
            const numSides = parseInt(match[2]); 
    
           
            if (!isNaN(numDice) && numDice >= 1 && !isNaN(numSides) && numSides >= 1) {
                let results = [];
                let total = 0;
                for (let i = 0; i < numDice; i++) {
                    const roll = Math.floor(Math.random() * numSides) + 1;
                    results.push(roll);
                    total += roll;
                }
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('🎲 Dice Roll')
                    .setDescription(`You rolled: ${results.join(', ')} (Total: ${total}) on ${numDice}d${numSides}`)
                    .setTimestamp();
    
                message.channel.send({ embeds: [embed] }); // Envia a mensagem embed
            } else {
                message.channel.send('Please choose a valid number of dice and sides (greater than 0).');
            }
        } else {
            message.channel.send('Correct usage: !roll [number of dice]d[number of sides]');
        }
    }
    
    
    
    
    
    
    
    
    
    

    // Comando para exibir a lista de comandos disponíveis
    if (comando === "help") {
        const embed = getCommandListEmbed();
        message.channel.send({ embeds: [embed] });
    }
});

client.login(config.token);






