const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limpar')
        .setDescription('Limpa um número específico de mensagens no chat.')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens a serem limpas')
                .setRequired(true)),
    async execute(interaction) {
        // Verificar se o usuário tem permissão para gerenciar mensagens
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply('Você precisa de permissão para gerenciar mensagens.');
        }

        const quantidade = interaction.options.getInteger('quantidade');

        if (quantidade < 1 || quantidade > 100) {
            return interaction.reply('Por favor, forneça um número válido entre 1 e 100.');
        }

        try {
            // Deletar as mensagens
            await interaction.channel.bulkDelete(quantidade, true);
            interaction.reply({
                content: `${quantidade} mensagens foram deletadas com sucesso.`,
                flags: 64
            });
        } catch (error) {
            console.error(error);
            interaction.reply('Houve um erro ao tentar limpar as mensagens.');
        }
    },
};
