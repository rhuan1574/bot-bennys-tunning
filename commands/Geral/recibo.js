const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    category: "Geral",
    data: new SlashCommandBuilder()
        .setName('recibo') // Nome do comando em minúsculas
        .setDescription('Comando para startar bot de registro'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Aqua')
            .setAuthor({ name: 'BENNYS TUNNING' }) // Corrigido o método setAuthor
            .setTitle('Recibo de Tunagem Bennys Tunning')
            .setDescription('Recibo de tunagem Bennys Tunning. Clique nos botões abaixo para iniciar o processo.')
            .setImage('https://i.ibb.co/VLf3zFq/capital-ryze-28e375f7c0d3f2b8bc17170034205320-1024-1024-removebg-preview.png');

        const button = new ButtonBuilder()
            .setCustomId('recibo')
            .setLabel('Gerar Recibo')
            .setStyle(ButtonStyle.Success);


        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed], // Incluindo o embed na resposta
            components: [row],
        });
    }
};
