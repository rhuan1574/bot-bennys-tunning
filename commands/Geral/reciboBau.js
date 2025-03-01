const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  category: "Geral",
  data: new SlashCommandBuilder()
    .setName("recibobau")
    .setDescription(
      "Comando utilizado para disparar uma embed de recibo de bau."
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
          content: "Você não tem permissão para usar este comando.",
          ephemeral: true,
      });
  } else {
  const embedReciboBau = new EmbedBuilder()
  .setTitle('Recibo de Bau')
  .setDescription('Para gerar recibo somente clique em Gerar Recibo.') // Descrição do recibo
  .setColor('Aqua') // Cor do recibo
  

  const button = new ButtonBuilder()
  .setCustomId('reciboBau')
  .setLabel('Gerar Recibo')
  .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder()
  .addComponents(button);
  await interaction.reply({
    embeds: [embedReciboBau],
    components: [row],
  })
}
  },
};
