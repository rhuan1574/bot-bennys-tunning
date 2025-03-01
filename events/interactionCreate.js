const {
  Events,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  WebhookClient,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Collection,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const ItemIlegal = require("../database/itemlegal"); // Importa o modelo
const {
  webhookReciboId,
  webhookReciboToken,
  tagMembers,
  webhookLogReciboId,
  webhookLogReciboToken,
  webhookLogRegistroId,
  webhookLogRegistroToken,
  webhookLogReciboIlegalId,
  webhookLogReciboIlegalToken,
} = require("../config.json");
const webhookClientRecibo = new WebhookClient({
  id: webhookReciboId,
  token: webhookReciboToken,
});
const webhookClientLog = new WebhookClient({
  id: webhookLogReciboId,
  token: webhookLogReciboToken,
});
const webhookClientRegistro = new WebhookClient({
  id: webhookLogRegistroId,
  token: webhookLogRegistroToken,
});

const webhookClientReciboIlegal = new WebhookClient({
  id: webhookLogReciboIlegalId,
  token: webhookLogReciboIlegalToken,
});
const tunagem = [
  {
    label: "Motor 1 🔧",
    description: "Motor Nível 1",
    value: "motor_1",
  },
  {
    label: "Motor 2 🔧",
    description: "Motor Nível 2",
    value: "motor_2",
  },
  {
    label: "Motor 3 🔧",
    description: "Motor Nível 3",
    value: "motor_3",
  },
  {
    label: "Motor 4 🔧",
    description: "Motor Nível 4",
    value: "motor_4",
  },
  {
    label: "Transmissão 1 ⚙️",
    description: "Transmissão Nível 1",
    value: "transmissao_1",
  },
  {
    label: "Transmissão 2 ⚙️",
    description: "Transmissão Nível 2",
    value: "transmissao_2",
  },
  {
    label: "Transmissão 3 ⚙️",
    description: "Transmissão Nível 3",
    value: "transmissao_3",
  },
  {
    label: "Transmissão 4 ⚙️",
    description: "Transmissão Nível 4",
    value: "transmissao_4",
  },
  {
    label: "Freio 1 ⛔",
    description: "Freio Nível 1",
    value: "freio_1",
  },
  {
    label: "Freio 2 ⛔",
    description: "Freio Nível 2",
    value: "freio_2",
  },
  {
    label: "Freio 3 ⛔",
    description: "Freio Nível 3",
    value: "freio_3",
  },
  { label: "Turbo 💨", description: "Turbo Boost", value: "turbo" },
  {
    label: "Suspensão 1 🏎️",
    description: "Suspensão Nível 1",
    value: "suspensao_1",
  },
  {
    label: "Suspensão 2 🏎️",
    description: "Suspensão Nível 2",
    value: "suspensao_2",
  },
  {
    label: "Suspensão 3 🏎️",
    description: "Suspensão Nível 3",
    value: "suspensao_3",
  },
  {
    label: "Suspensão 4 🏎️",
    description: "Suspensão Nível 4",
    value: "suspensao_4",
  },
  {
    label: "Suspensão 5 🏎️",
    description: "Suspensão Nível 5",
    value: "suspensao_5",
  },
  {
    label: "Blindagem 20% 💎",
    description: "Blindagem 20%",
    value: "blindagem_20",
  },
  {
    label: "Blindagem 40% 💎",
    description: "Blindagem 40%",
    value: "blindagem_40",
  },
  {
    label: "Blindagem 60% 💎",
    description: "Blindagem 60%",
    value: "blindagem_60",
  },
  {
    label: "Blindagem 80% 💎",
    description: "Blindagem 80%",
    value: "blindagem_80",
  },
  {
    label: "Blindagem 100% 💎",
    description: "Blindagem 100%",
    value: "blindagem_100",
  },
];

const itensIlegais = [
  {
    label: "Drogas 🚬",
    description: "Para catalogar drogas compradas ou vendidas",
    value: "drogas",
  },
  {
    label: "Armas 🔫",
    description: "Para catalogar armas compradas ou vendidas",
    value: "armas",
  },
  {
    label: "Munição 🔫",
    description: "Motor Nível 1",
    value: "motor_1",
  },
  {
    label: "Placas 🪧",
    description: "Para catalogar placas vendidas",
    value: "placas",
  },
  {
    label: "MasterPick 🪛",
    description: "Para catalogar MasterPick vendidos",
    value: "masterpick",
  },

  {
    label: "Itens Ilegais 📦",
    description: "Para catalogar itens ilegais comprados",
    value: "itens_ilegais",
  },
  {
    label: "Dinheiro Sujo 💸",
    description: "Para catalogar dinheiro sujo",
    value: "dinheiro_sujo",
  },
];

const tipoItens = [
  { label: "AK-47", value: "ak-47" },
  { label: "M-TAR", value: "m-tar" },
  { label: "G3", value: "g3" },
  { label: "Five-Seven", value: "five-seven" },
  { label: "Thompson", value: "thompson" },
  { label: "Munição 5mm", value: "municao-5mm" },
  { label: "Munição 9mm", value: "municao-9mm" },
  { label: "Munição 762mm", value: "municao-762mm" },
  { label: "Farinha", value: "farinha" },
  { label: "Meta", value: "meta" },
  { label: "Erva", value: "Erva" },
  { label: "Skunk", value: "skunk" },
  { label: "Rapé", value: "rape" },
  { label: "Lança-perfume", value: "lanca-perfume" },
  { label: "Viagra", value: "viagra" },
  { label: "Balinha", value: "balinha" },
  { label: "Flipper MK1", value: "flipper-mk1" },
  { label: "Flipper MK2", value: "flipper-mk2" },
  { label: "Flipper MK3", value: "flipper-mk3" },
  { label: "Flipper MK4", value: "flipper-mk4" },
  { label: "Flipper MK5", value: "flipper-mk5" },
  { label: "Chave de Ouro", value: "chave-de-ouro" },
  { label: "Chave de Platina", value: "chave-de-platina" },
];
let description;
// Caminho para o arquivo JSON que armazenará os canais criados
const CHANNELS_FILE = path.resolve(__dirname, "channels.json");

// Função para carregar os canais do arquivo JSON
function loadChannels() {
  if (fs.existsSync(CHANNELS_FILE)) {
    try {
      const data = fs.readFileSync(CHANNELS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao carregar o arquivo channels.json:", error);
    }
  }
  return {};
}

// Função para salvar os canais no arquivo JSON
function saveChannels(data) {
  try {
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(data, null, 4), "utf8");
  } catch (error) {
    console.error("Erro ao salvar o arquivo channels.json:", error);
  }
}

// Carrega os canais criados do arquivo JSON
const createdChannels = loadChannels();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const replyContent = {
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyContent);
        } else {
          await interaction.reply(replyContent);
        }
      }
      return;
    }

    // Processa botões
    if (interaction.isButton()) {
      const { customId } = interaction;

      if (customId === "canal") {
        const modal = new ModalBuilder()
          .setCustomId("modal-canal")
          .setTitle("Criação de Canal");

        const input = new TextInputBuilder()
          .setCustomId("nome_canal")
          .setLabel("Insira o nome do canal:")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(input));
        await interaction.showModal(modal);
      } else if (customId === "depositar") {
        const modal = new ModalBuilder()
          .setCustomId("modal_depositar")
          .setTitle("Depositar Itens");

        const inputs = [
          "ferro",
          "aluminio",
          "cobre",
          "borracha",
          "plastico",
        ].map((item) =>
          new TextInputBuilder()
            .setCustomId(item)
            .setLabel(`${item.charAt(0).toUpperCase() + item.slice(1)}:`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        );

        modal.addComponents(
          ...inputs.map((input) => new ActionRowBuilder().addComponents(input))
        );

        await interaction.showModal(modal);
      } else if (customId === "registro") {
        const roleName = "🧰 | Membro Benny's"; // Nome do cargo
        const member = interaction.member; // Obtém o membro que usou a interação

        // Verifica se o usuário já tem o cargo
        const role = member.roles.cache.find((r) => r.name === roleName);

        if (role) {
          return await interaction.reply({
            content:
              "Não foi possível se registrar, pois você já possui o cargo de Membro.",
            flags: 64,
          });
        }

        // Se o usuário não tem o cargo, mostra o modal diretamente
        const modal = new ModalBuilder()
          .setCustomId("modal-registro")
          .setTitle("Registro do Usuário");

        const inputs = [
          {
            id: "nome_prsn",
            label: "Nome do personagem (iniciais em maiúscula):",
          },
          { id: "id_prsn", label: "ID do personagem:" },
          {
            id: "nome",
            label: "Seu nome real (iniciais em maiúscula):",
          },
          {
            id: "nome_indicacao",
            label: "Nome de quem indicou (iniciais em maiúscula):",
          },
        ].map(({ id, label }) =>
          new TextInputBuilder()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        );

        modal.addComponents(
          ...inputs.map((input) => new ActionRowBuilder().addComponents(input))
        );

        // Mostra o modal (não precisa de `deferReply()` nem `editReply()`)
        await interaction.showModal(modal);
      } else if (!interaction.client.selectedItems) {
        interaction.client.selectedItems = {};
      }
      if (!interaction.client.selectedItems) {
        interaction.client.selectedItems = {};
      }

      let selectedServicesGlobal = []; // Armazena globalmente as opções selecionadas
      let descriptionEmbed = "";

      // Evento de seleção de serviços
      if (customId === "recibo") {
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("tunagem_menu")
          .setMinValues(1)
          .setMaxValues(6)
          .setPlaceholder("Selecione até 6 serviços...")
          .addOptions(
            tunagem.map((item) =>
              new StringSelectMenuOptionBuilder()
                .setLabel(item.label)
                .setDescription(item.description)
                .setValue(item.value)
            )
          );

        const buttonConfirma = new ButtonBuilder()
          .setCustomId("confirmar")
          .setLabel("Confirmar")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✅");

        const rowSelect = new ActionRowBuilder().addComponents(selectMenu);
        const rowButton = new ActionRowBuilder().addComponents(buttonConfirma);

        const embed = new EmbedBuilder()
          .setTitle("Serviços Selecionados")
          .setDescription("Nenhum serviço selecionado ainda.")
          .setColor("#0099ff");

        await interaction.reply({
          embeds: [embed],
          components: [rowSelect, rowButton],
          flags: 64,
        });

        const filter = (i) =>
          (i.customId === "tunagem_menu" || i.customId === "confirmar") &&
          i.user.id === interaction.user.id;

        const componentCollector =
          interaction.channel.createMessageComponentCollector({
            filter,
            time: 30_000,
          });

        componentCollector.on("collect", async (i) => {
          if (i.customId === "tunagem_menu") {
            selectedServicesGlobal = i.values; // Atualiza as seleções globalmente

            descriptionEmbed =
              selectedServicesGlobal
                .map(
                  (value) =>
                    tunagem.find((item) => item.value === value)?.label ||
                    "Serviço desconhecido"
                )
                .join("\n") || "Nenhum serviço selecionado.";

            const updatedEmbed = new EmbedBuilder()
              .setTitle("Serviços Selecionados")
              .setDescription(descriptionEmbed)
              .setColor("#0099ff");

            await i.update({
              embeds: [updatedEmbed],
              components: [rowSelect, rowButton],
            });
          }

          // Evento de confirmação
          if (i.customId === "confirmar") {
            await i.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Recibo Confirmado!")
                  .setDescription(
                    `Serviços confirmados:\n${descriptionEmbed}\n\nAgora, envie uma imagem de comprovante neste canal. Você tem 2 minutos.`
                  )
                  .setColor("#00ff00"),
              ],
              components: [],
            });

            const filter = (m) =>
              m.author.id === interaction.user.id && m.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({
              filter,
              time: 120_000,
            });

            collector.on("collect", async (message) => {
              const attachment = message.attachments.first(); // Pega a primeira imagem enviada

              if (attachment) {
                const embedRecebido = new EmbedBuilder()
                  .setTitle("Comprovante gerado com sucesso!")
                  .setDescription(`Serviços realizados:\n${descriptionEmbed}`)
                  .setImage(attachment.url)
                  .setFooter({
                    text: `Gerado por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                  })
                  .setColor("#00ff00")
                  .setTimestamp();

                await interaction.followUp({
                  content: "Imagem recebida com sucesso!",
                  embeds: [embedRecebido],
                  flags: 64,
                });
                webhookClientRecibo.send({
                  embeds: [embedRecebido],
                });
                webhookClientLog.send({
                  embeds: [embedRecebido],
                });

                // Espera 5 segundos antes de apagar a mensagem
                setTimeout(() => {
                  message.delete().catch(console.error); // Apaga a mensagem com a imagem
                }, 10000);
                collector.stop();
              } else {
                await interaction.followUp({
                  content:
                    "❌ Nenhuma imagem foi enviada. Envie uma imagem de comprovante neste canal.",
                  flags: 64,
                });
              }
            });

            collector.on("end", (collected, reason) => {
              if (collected.size === 0) {
                interaction.followUp({
                  content: "Tempo esgotado! Nenhuma imagem foi enviada.",
                  flags: 64,
                });
              }
            });
          }
        });
      }
      // Variável modalDrogas deve ser declarada antes para evitar erro
      const modalDrogas = new ModalBuilder()
        .setCustomId("catalogar_itens")
        .setTitle("📦 Catalogar Itens Ilegais");

      const inputQuantidade = new TextInputBuilder()
        .setCustomId("quantidade_itens")
        .setLabel("📊 Quantidade de Itens:")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const inputTipo = new TextInputBuilder()
        .setCustomId("tipo_item")
        .setLabel("📌 Tipo de Item:")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modalDrogas.addComponents(
        new ActionRowBuilder().addComponents(inputQuantidade),
        new ActionRowBuilder().addComponents(inputTipo)
      );

      let selectedServicesGlobalBau = []; // Armazena globalmente as opções selecionadas

      if (customId === "reciboBau") {
        const selectMenuBau = new StringSelectMenuBuilder()
          .setCustomId("itens_ilegais_menu")
          .setMinValues(1)
          .setMaxValues(6)
          .setPlaceholder("Selecione até 6 serviços...")
          .addOptions(
            itensIlegais.map((item) =>
              new StringSelectMenuOptionBuilder()
                .setLabel(item.label)
                .setDescription(item.description)
                .setValue(item.value)
            )
          );

        const buttonConfirma = new ButtonBuilder()
          .setCustomId("confirmar_bau")
          .setLabel("Confirmar")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✅")
          .setDisabled(true); // Inicialmente desativado

        const rowSelect = new ActionRowBuilder().addComponents(selectMenuBau);
        const rowButton = new ActionRowBuilder().addComponents(buttonConfirma);

        await interaction.reply({
          content: "🔍 **Escolha os itens ilegais que deseja catalogar:**",
          components: [rowSelect, rowButton],
          flags: 64,
        });

        const selectedItems = new Map();

        const filter = (i) =>
          ["itens_ilegais_menu", "confirmar_bau"].includes(i.customId) &&
          i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 30_000,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "itens_ilegais_menu") {
            selectedItems.set(interaction.user.id, i.values);

            const descriptionEmbedBau = i.values.length
              ? i.values
                  .map(
                    (value) =>
                      itensIlegais.find((item) => item.value === value)
                        ?.label || "Serviço desconhecido"
                  )
                  .join("\n")
              : "Nenhum serviço selecionado.";

            const updatedEmbed = new EmbedBuilder()
              .setTitle("📜 Itens Ilegais Selecionados")
              .setDescription(`🛠 **Itens Escolhidos:**\n${descriptionEmbedBau}`)
              .setColor("#0099ff");

            const updatedButton = new ButtonBuilder()
              .setCustomId("confirmar_bau")
              .setLabel("Confirmar")
              .setStyle(ButtonStyle.Success)
              .setEmoji("✅")
              .setDisabled(i.values.length === 0); // Habilita se houver seleção

            const rowButtonUpdated = new ActionRowBuilder().addComponents(
              updatedButton
            );

            await i.update({
              embeds: [updatedEmbed],
              components: [rowSelect, rowButtonUpdated],
            });
          } else if (i.customId === "confirmar_bau") {
            const selectedServices = selectedItems.get(interaction.user.id);

            if (!selectedServices || selectedServices.length === 0) {
              return i.reply({
                content:
                  "❌ **Nenhum item ilegal foi selecionado.** Selecione pelo menos um item antes de confirmar.",
                flags: 64,
              });
            }

            console.log("🔹 Exibindo modal...");
            await i.showModal(modalDrogas);
            console.log("✅ Modal exibido com sucesso!");

            const modalFilter = (modalI) =>
              modalI.customId === "catalogar_itens" &&
              modalI.user.id === i.user.id;

            i.awaitModalSubmit({ filter: modalFilter, time: 120_000 })
              .then(async (modalInteraction) => {
                console.log("✅ Modal submetido com sucesso!");

                const qtd =
                  modalInteraction.fields.getTextInputValue("quantidade_itens");
                const tipo =
                  modalInteraction.fields.getTextInputValue("tipo_item");

                console.log(`📦 Quantidade: ${qtd}, Tipo: ${tipo}`);

                const item = itensIlegais.find(
                  (it) => it.value === selectedServices[0]
                );

                const attachment = modalInteraction.attachments?.first(); // Verifica se há imagem anexada

                const embedRecebido = new EmbedBuilder()
                  .setTitle("✅ Comprovante gerado com sucesso!")
                  .setDescription(
                    `📦 **Itens Catalogados:**\n${selectedServices
                      .map(
                        (s) =>
                          `- ${
                            itensIlegais.find((it) => it.value === s)?.label
                          }`
                      )
                      .join("\n")}`
                  )
                  .setColor("#00ff00")
                  .setTimestamp()
                  .setFooter({
                    text: `Gerado por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                  });

                if (attachment) embedRecebido.setImage(attachment.url);

                // Criar novo documento no banco
                const novoItem = new ItemIlegal({
                  userId: interaction.user.id,
                  item: item?.label || "Desconhecido",
                  quantidade: parseInt(qtd, 10),
                  tipo: tipo,
                });

                await novoItem
                  .save()
                  .then(() => console.log("✅ Item salvo no MongoDB!"))
                  .catch((err) =>
                    console.error("❌ Erro ao salvar no MongoDB:", err)
                  );

                await webhookClientReciboIlegal.send({
                  content: `${interaction.user} catalogou um item ilegal! 🚨`,
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Green")
                      .setTitle("📜 Item Ilegal Catalogado")
                      .addFields([
                        {
                          name: "📌 Item",
                          value: item?.label || "Desconhecido",
                        },
                        { name: "📊 Quantidade", value: qtd },
                        { name: "📦 Tipo", value: tipo },
                      ])
                      .setFooter({
                        text: `Catalogado por ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL(),
                      })
                      .setTimestamp(),
                  ],
                });

                await modalInteraction.reply({
                  content: "✅ **Item catalogado com sucesso!**",
                  flags: 64,
                });
              })
              .catch(() => {
                i.followUp({
                  content:
                    "⏳ **Tempo esgotado!** O modal foi fechado sem resposta.",
                  flags: 64,
                });
              });
          }
        });
      }
    }

    // Processa modais
    if (interaction.isModalSubmit()) {
      const { customId } = interaction;

      if (customId === "modal-canal") {
        const nomeCanal = interaction.fields.getTextInputValue("nome_canal");
        const guild = interaction.guild;

        if (!guild) {
          await interaction.reply({
            content:
              "Não foi possível criar o canal porque o servidor não foi identificado.",
            flags: 64,
          });
          return;
        }

        const categoryId = "1324201838190399488"; // Substitua pelo ID da sua categoria
        const category = guild.channels.cache.get(categoryId);

        if (!category) {
          await interaction.reply({
            content: "❌ Não foi possível encontrar a categoria especificada.",
            flags: 64,
          });
          return;
        }

        try {
          const existingChannel = guild.channels.cache.find(
            (channel) => channel.name === `📁・${nomeCanal}`
          );

          if (existingChannel) {
            createdChannels[interaction.user.id] = existingChannel.id;
            saveChannels(createdChannels);
            await interaction.reply({
              content: `📁 O canal "${existingChannel.name}" já existe.`,
              flags: 64,
            });
            return;
          }

          const canal = await guild.channels.create({
            name: `📁・farm-${nomeCanal}`,
            type: 0,
            topic: "Canal criado via interação de botão",
            reason: `Solicitado por ${interaction.user.tag}`,
            parent: category.id,
            permissionOverwrites: [
              {
                id: interaction.user.id,
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
              },
              {
                id: guild.roles.everyone.id,
                deny: ["ViewChannel"],
              },
              {
                id: guild.roles.cache.find(
                  (role) => role.name === "🧰 | Gerente"
                )?.id,
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
              },
            ],
          });

          createdChannels[interaction.user.id] = canal.id;
          saveChannels(createdChannels);

          await interaction.reply({
            content: `📁 Canal "${canal.name}" criado com sucesso!`,
            flags: 64,
          });
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "❌ Ocorreu um erro ao criar o canal.",
            flags: 64,
          });
        }
      } else if (customId === "modal_depositar") {
        const inputs = ["ferro", "aluminio", "cobre", "borracha", "plastico"];
        const values = inputs.map((input) => ({
          name: input.charAt(0).toUpperCase() + input.slice(1),
          value: interaction.fields.getTextInputValue(input),
          inline: true,
        }));

        const userChannelId = createdChannels[interaction.user.id];

        if (userChannelId) {
          const canal = interaction.guild.channels.cache.get(userChannelId);

          if (canal) {
            const embed = new EmbedBuilder()
              .setColor("#00FFFF")
              .setTitle("📦 Itens Depositados")
              .setDescription("Itens enviados com sucesso para o depósito.")
              .addFields(values)
              .setFooter({
                text: `Depositado por ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTimestamp();

            await canal.send({ embeds: [embed] });

            await interaction.reply({
              content: "✅ Itens depositados com sucesso no canal criado!",
              flags: 64,
            });
          } else {
            await interaction.reply({
              content: "❌ Não foi possível encontrar o canal criado.",
              flags: 64,
            });
          }
        } else {
          await interaction.reply({
            content:
              "❌ Nenhum canal associado à sua interação foi encontrado.",
            flags: 64,
          });
        }
      } else if (customId === "modal-registro") {
        await interaction.deferReply({ flags: 64 });

        const nomeRegistro = interaction.fields.getTextInputValue("nome_prsn");
        const idRegistro = interaction.fields.getTextInputValue("id_prsn");
        const nomeReal = interaction.fields.getTextInputValue("nome");
        const nomeIndicacao =
          interaction.fields.getTextInputValue("nome_indicacao");
        const membro = interaction.guild.members.cache.get(interaction.user.id);

        if (!membro) {
          return interaction.editReply({
            content: "❌ Membro não encontrado no servidor.",
          });
        }

        try {
          await membro.setNickname(`${nomeRegistro} | ${idRegistro}`);
        } catch (error) {
          console.error(error);
          return interaction.editReply({
            content:
              "❌ Não foi possível alterar o apelido. Verifique minhas permissões.",
          });
        }

        const cargo = interaction.guild.roles.cache.find(
          (role) => role.name === "🧰 | Membro Benny's"
        );

        if (cargo) {
          try {
            await membro.roles.add(cargo);
          } catch (error) {
            console.error(error);
            return interaction.editReply({
              content: "❌ Não foi possível atribuir o cargo.",
            });
          }
        }

        interaction.editReply({
          content: `✅ O apelido foi atualizado para: ${nomeRegistro} | ${idRegistro} e recebeu o cargo de 🧰 | Membro Benny's`,
        });

        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("Novo Registro de Usuário")
          .setImage(
            "https://i.ibb.co/CBVRkXJ/BENNYS-TUNING-removebg-preview.png"
          )
          .addFields([
            { name: "Nome do Personagem", value: nomeRegistro },
            { name: "ID do Personagem", value: idRegistro },
            { name: "Nome Real", value: nomeReal },
            { name: "Nome de Indicação", value: nomeIndicacao },
          ])
          .setFooter({
            text: `Registrado por ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });

        webhookClientRegistro.send({
          content: tagMembers ? `${membro} foi registrado!` : "",
          embeds: [embed],
        });
      } else if (customId === "itens_ilegais_menu") {
        const selectedServices = interaction.values;
        interaction.client.selectedItems[interaction.user.id] =
          selectedServices;

        await interaction.reply({
          content: "✅ Itens ilegais selecionados com sucesso!",
          flags: 64,
        });
      } else if (customId === "modal-drogas") {
        const itemIlegal = interaction.fields.getTextInputValue("item_ilegal");

        // 🛑 Verificar se é um número válido
        if (isNaN(itemIlegal) || parseInt(itemIlegal) <= 0) {
          return interaction.reply({
            content:
              "❌ Insira um número válido para a quantidade de itens ilegais.",
            flags: 64,
          });
        }

        const selectedServices =
          interaction.client.selectedItems[interaction.user.id];

        if (!selectedServices || selectedServices.length === 0) {
          return interaction.reply({
            content: "❌ Nenhum item ilegal foi selecionado.",
            flags: 64,
          });
        }

        const item = itensIlegais.find((i) => i.value === selectedServices[0]);

        if (!item) {
          return interaction.reply({
            content: "❌ Item ilegal não encontrado.",
            flags: 64,
          });
        }

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Item Ilegal Catalogado")
          .addFields([
            { name: "Item", value: item.label },
            { name: "Quantidade", value: itemIlegal },
          ])
          .setFooter({
            text: `Catalogado por ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        webhookClientReciboIlegal.send({
          content: `${interaction.user} catalogou um item ilegal!`,
          embeds: [embed],
        });

        await interaction.reply({
          content: "✅ Item ilegal catalogado com sucesso!",
          flags: 64,
        });
      }
    }
  },
};
