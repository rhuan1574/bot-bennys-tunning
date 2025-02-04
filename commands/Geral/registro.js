const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    category: 'Geral',
    data: new SlashCommandBuilder()
    .setName('registro')
    .setDescription('Comando utilizado para disparar uma embed de registro.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle('Registro Automático')
        .setDescription('Bem vindo ao sistema de registro automático da Bennys Tunnins, para se registrar corretamente, clique no botão abaixo e siga os pasos a seguir.')
        .setColor('Aqua')
        .setImage('https://i.ibb.co/VLf3zFq/capital-ryze-28e375f7c0d3f2b8bc17170034205320-1024-1024-removebg-preview.png')

        const button = new ButtonBuilder()
        .setCustomId('registro')
        .setLabel('Registrar')
        .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
        .addComponents(button)

        interaction.reply({embeds: [embed], components: [row]})
    }
}