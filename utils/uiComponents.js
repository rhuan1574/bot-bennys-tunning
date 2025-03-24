const { 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuOptionBuilder
} = require('discord.js');

const { tunagem, itensIlegais, TIMEOUTS } = require('../constants/items');

class UIComponents {
    static createServiceSelectMenu() {
        return new StringSelectMenuBuilder()
            .setCustomId("tunagem_menu")
            .setMinValues(1)
            .setMaxValues(6)
            .setPlaceholder("Selecione até 6 serviços...")
            .addOptions(
                tunagem.map(item => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(item.label)
                        .setDescription(item.description)
                        .setValue(item.value)
                )
            );
    }

    static createIllegalItemsMenu() {
        return new StringSelectMenuBuilder()
            .setCustomId("itens_ilegais_menu")
            .setMinValues(1)
            .setMaxValues(6)
            .setPlaceholder("Selecione até 6 itens...")
            .addOptions(
                itensIlegais.map(item => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(item.label)
                        .setDescription(item.description)
                        .setValue(item.value)
                )
            );
    }

    static createConfirmButton(customId = "confirmar", disabled = false) {
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel("Confirmar")
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅")
            .setDisabled(disabled);
    }

    static createItemModal() {
        const modal = new ModalBuilder()
            .setCustomId("catalogar_itens")
            .setTitle("📦 Catalogar Itens Ilegais");

        const quantidadeInput = new TextInputBuilder()
            .setCustomId("quantidade_itens")
            .setLabel("📊 QUANTIDADE DE ITENS:")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Digite apenas números")
            .setMinLength(1)
            .setMaxLength(6);

        const tipoInput = new TextInputBuilder()
            .setCustomId("tipo_item")
            .setLabel("📌 TIPO DE ITEM:")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Ex: Drogas, Armas, etc")
            .setMinLength(1)
            .setMaxLength(50);

        return modal.addComponents(
            new ActionRowBuilder().addComponents(quantidadeInput),
            new ActionRowBuilder().addComponents(tipoInput)
        );
    }

    static createSuccessEmbed({ title, description, fields, user }) {
        return new EmbedBuilder()
            .setColor("#00ff00")
            .setTitle(title)
            .setDescription(description)
            .addFields(fields)
            .setFooter({
                text: `Registrado por ${user.tag}`,
                iconURL: user.displayAvatarURL()
            })
            .setTimestamp();
    }

    static createErrorEmbed({ title, description }) {
        return new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    }

    static createCollectorOptions(userId, customIds) {
        return {
            filter: (i) => {
                if (i.user.id !== userId) {
                    i.reply({ 
                        content: "❌ Apenas quem iniciou a interação pode usar estes controles.", 
                        ephemeral: true 
                    });
                    return false;
                }
                return customIds.includes(i.customId);
            },
            time: TIMEOUTS.INTERACTION
        };
    }

    static createModalCollectorOptions(userId, customId) {
        return {
            filter: (modalInteraction) => 
                modalInteraction.customId === customId && 
                modalInteraction.user.id === userId,
            time: TIMEOUTS.MODAL
        };
    }

    static createUIComponents(type = 'illegal_items') {
        const selectMenu = type === 'illegal_items' 
            ? this.createIllegalItemsMenu()
            : this.createServiceSelectMenu();

        const confirmButton = this.createConfirmButton(
            type === 'illegal_items' ? 'confirmar_bau' : 'confirmar',
            true
        );

        return {
            rows: [
                new ActionRowBuilder().addComponents(selectMenu),
                new ActionRowBuilder().addComponents(confirmButton)
            ],
            updateButton: (disabled = false) => confirmButton.setDisabled(disabled)
        };
    }
}

module.exports = UIComponents; 