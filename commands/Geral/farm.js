const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    category: "Geral",
    data: new SlashCommandBuilder()
        .setName("farm")
        .setDescription("Comando para iniciar o bot de farm"),
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({
                content: "Você não tem permissão para usar este comando.",
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: "BENNYS TUNNING" })
            .setTitle("Contador de Farm")
            .setDescription(
                'Bem-vindo ao bot de contagem do Farm!\n\nClique no botão "Criar Canal" para registrar sua pasta. Depois, clique em "Depositar" para registrar os itens.'
            )
            .setImage("https://i.ibb.co/VLf3zFq/capital-ryze-28e375f7c0d3f2b8bc17170034205320-1024-1024-removebg-preview.png");

        const button = new ButtonBuilder()
            .setCustomId("depositar")
            .setLabel("Depositar")
            .setStyle(ButtonStyle.Success);

        const button2 = new ButtonBuilder()
            .setCustomId("canal")
            .setLabel("Criar Canal")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button, button2);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
