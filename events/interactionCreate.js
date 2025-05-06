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

// Sistema de armazenamento local
const DATA_FILE = path.join(__dirname, '../data/items.json');

// Função para carregar dados
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { items: [] };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return { items: [] };
  }
}

// Função para salvar dados
function saveData(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

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

// Função melhorada para verificar webhook
function verificarWebhook() {
  try {
    if (!webhookLogReciboIlegalId || !webhookLogReciboIlegalToken) {
      console.error("Configurações do webhook ausentes no config.json");
      return false;
    }

    if (!webhookClientReciboIlegal) {
      console.error("Webhook não foi inicializado corretamente");
      return false;
    }

    if (!webhookClientReciboIlegal.token || !webhookClientReciboIlegal.id) {
      console.error("Token ou ID do webhook inválidos");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao verificar webhook:", error);
    return false;
  }
}

// Inicialização do webhook com verificação
let webhookClientReciboIlegal;
try {
  webhookClientReciboIlegal = new WebhookClient({
    id: webhookLogReciboIlegalId,
    token: webhookLogReciboIlegalToken
  });
  
  if (verificarWebhook()) {
    console.log("✅ Webhook de itens ilegais configurado com sucesso!");
  }
} catch (error) {
  console.error("❌ Erro ao inicializar webhook:", error);
}

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

const { TIMEOUTS, ROLES, CHANNELS } = require('../constants/items');
const WebhookManager = require('../utils/webhooks');
const DatabaseManager = require('../utils/database');
const UIComponents = require('../utils/uiComponents');

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

// Funções auxiliares
const createServiceSelectMenu = (tunagem) => {
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
};

const createConfirmButton = () => {
  return new ButtonBuilder()
    .setCustomId("confirmar")
    .setLabel("Confirmar")
    .setStyle(ButtonStyle.Success)
    .setEmoji("✅");
};

const createEmbed = ({ title, description, color }) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color);
};

const handleServiceSelection = async (interaction, selectedServices, tunagem, rows) => {
  const description = selectedServices
    .map(value => tunagem.find(item => item.value === value)?.label || "Serviço desconhecido")
    .join("\n") || "Nenhum serviço selecionado.";

  const updatedEmbed = createEmbed({
    title: "Serviços Selecionados",
    description,
    color: "#0099ff"
  });

  await interaction.update({
    embeds: [updatedEmbed],
    components: rows
  });
};

const handleImageSubmission = async (message, interaction, selectedServices, deleteDelay) => {
  const attachment = message.attachments.first();
  if (!attachment) {
    await interaction.followUp({
      content: "❌ Nenhuma imagem foi enviada. Envie uma imagem de comprovante neste canal.",
      flags: 64
    });
    return;
  }

  const embedRecebido = createEmbed({
    title: "Comprovante gerado com sucesso!",
    description: `Serviços realizados:\n${selectedServices.join("\n")}`,
    color: "#00ff00"
  })
  .setImage(attachment.url)
  .setFooter({
    text: `Gerado por ${interaction.user.tag}`,
    iconURL: interaction.user.displayAvatarURL()
  })
  .setTimestamp();

  // Envia confirmações e registros
  await Promise.all([
    interaction.followUp({ content: "Imagem recebida com sucesso!", embeds: [embedRecebido], flags: 64 }),
    webhookClientRecibo.send({ embeds: [embedRecebido] }),
    webhookClientLog.send({ embeds: [embedRecebido] })
  ]);

  // Agenda a deleção da mensagem
  setTimeout(() => message.delete().catch(console.error), deleteDelay);
};

// Constantes
const TIMEOUT_INTERACTION = 60_000;
const TIMEOUT_MODAL = 120_000;

// Configurações do Modal
const createItemModal = () => {
  const modal = new ModalBuilder()
    .setCustomId("catalogar_itens")
    .setTitle("📦 Catalogar Itens Ilegais");

  const inputs = {
    quantidade: new TextInputBuilder()
      .setCustomId("quantidade_itens")
      .setLabel("📊 Quantidade de Itens:")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder("Digite apenas números"),

    tipo: new TextInputBuilder()
      .setCustomId("tipo_item")
      .setLabel("📌 Tipo de Item:")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder("Ex: Drogas, Armas, etc")
  };

  return modal.addComponents(
    new ActionRowBuilder().addComponents(inputs.quantidade),
    new ActionRowBuilder().addComponents(inputs.tipo)
  );
};

// Componentes UI
const createUIComponents = () => {
  const selectMenu = new StringSelectMenuBuilder()
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

  const confirmButton = new ButtonBuilder()
    .setCustomId("confirmar_bau")
    .setLabel("Confirmar")
    .setStyle(ButtonStyle.Success)
    .setEmoji("✅")
    .setDisabled(true);

  return {
    rows: [
      new ActionRowBuilder().addComponents(selectMenu),
      new ActionRowBuilder().addComponents(confirmButton)
    ],
    updateButton: (disabled = false) => 
      confirmButton.setDisabled(disabled)
  };
};

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
      // Handler para o botão de recibo
      if (customId === "recibo") {
        try {
          const TIMEOUT_MENU = 30_000;
          const TIMEOUT_IMAGE = 120_000;
          const DELETE_DELAY = 10_000;

          // Criação dos componentes UI
          const selectMenu = createServiceSelectMenu(tunagem);
          const buttonConfirma = createConfirmButton();
          
          // Função que faltava para criar as action rows
          const rows = [
            new ActionRowBuilder().addComponents(selectMenu),
            new ActionRowBuilder().addComponents(buttonConfirma)
          ];

          const initialEmbed = new EmbedBuilder()
            .setTitle("Serviços Selecionados")
            .setDescription("Nenhum serviço selecionado ainda.")
            .setColor("#0099ff");

          // Envia mensagem inicial
          await interaction.reply({
            embeds: [initialEmbed],
            components: rows,
            flags: 64
          });

          // Filtro para o coletor
          const filter = (i) => 
            (i.customId === "tunagem_menu" || i.customId === "confirmar") &&
            i.user.id === interaction.user.id;

          // Configura coletor
          const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: TIMEOUT_MENU
          });

          let selectedServices = [];
          let servicesDescription = "";

          collector.on("collect", async (i) => {
            if (i.customId === "tunagem_menu") {
              selectedServices = i.values;
              servicesDescription = selectedServices
                .map(value => tunagem.find(item => item.value === value)?.label || "Serviço desconhecido")
                .join("\n");

              const updatedEmbed = new EmbedBuilder()
                .setTitle("Serviços Selecionados")
                .setDescription(servicesDescription)
                .setColor("#0099ff");

              await i.update({
                embeds: [updatedEmbed],
                components: rows
              });
            }

            if (i.customId === "confirmar") {
              const confirmEmbed = new EmbedBuilder()
                .setTitle("Recibo Confirmado!")
                .setDescription(`Serviços confirmados:\n${servicesDescription}\n\nAgora, envie uma imagem de comprovante neste canal. Você tem 2 minutos.`)
                .setColor("#00ff00");

              await i.update({
                embeds: [confirmEmbed],
                components: []
              });

              const imageFilter = (m) => 
                m.author.id === interaction.user.id && 
                m.attachments.size > 0;

              const imageCollector = interaction.channel.createMessageCollector({
                filter: imageFilter,
                time: TIMEOUT_IMAGE
              });

              imageCollector.on("collect", async (message) => {
                const attachment = message.attachments.first();
                if (attachment) {
                  const receiptEmbed = new EmbedBuilder()
                    .setTitle("Comprovante gerado com sucesso!")
                    .setDescription(`Serviços realizados:\n${servicesDescription}`)
                    .setImage(attachment.url)
                    .setFooter({
                      text: `Gerado por ${interaction.user.tag}`,
                      iconURL: interaction.user.displayAvatarURL()
                    })
                    .setColor("#00ff00")
                    .setTimestamp();

                  await interaction.followUp({
                    content: "Imagem recebida com sucesso!",
                    embeds: [receiptEmbed],
                    flags: 64
                  });

                  await Promise.all([
                    webhookClientRecibo.send({ embeds: [receiptEmbed] }),
                    webhookClientLog.send({ embeds: [receiptEmbed] })
                  ]);

                  setTimeout(() => {
                    message.delete().catch(console.error);
                  }, DELETE_DELAY);

                  imageCollector.stop();
                }
              });

              imageCollector.on("end", (collected) => {
                if (collected.size === 0) {
                  interaction.followUp({
                    content: "Tempo esgotado! Nenhuma imagem foi enviada.",
                    flags: 64
                  });
                }
              });
            }
          });

        } catch (error) {
          console.error("Erro no processamento do recibo:", error);
          await interaction.followUp({
            content: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
            flags: 64
          });
        }
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

// Funções auxiliares
async function handleMenuSelection(interaction, selectedItems) {
  selectedItems = interaction.values;
  
  const descriptionEmbed = createItemsEmbed(selectedItems);
  const updatedButton = new ButtonBuilder()
    .setCustomId("confirmar_bau")
    .setLabel("Confirmar")
    .setStyle(ButtonStyle.Success)
    .setEmoji("✅")
    .setDisabled(!selectedItems.length);

  const components = [
    new ActionRowBuilder().addComponents(interaction.message.components[0].components[0]),
    new ActionRowBuilder().addComponents(updatedButton)
  ];

  await interaction.update({
    embeds: [descriptionEmbed],
    components
  });
}

async function handleConfirmation(i, selectedItems, interaction) {
  let modalResponse = null;
  
  try {
    if (!selectedItems || selectedItems.length === 0) {
      return await i.reply({
        content: "❌ **Selecione pelo menos um item ilegal.**",
        ephemeral: true
      });
    }

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

    modal.addComponents(
      new ActionRowBuilder().addComponents(quantidadeInput),
      new ActionRowBuilder().addComponents(tipoInput)
    );

    await i.showModal(modal);

    modalResponse = await i.awaitModalSubmit({
      filter: (modalInteraction) => 
        modalInteraction.customId === "catalogar_itens" && 
        modalInteraction.user.id === i.user.id,
      time: 120_000
    }).catch(() => null);

    if (!modalResponse) {
      return await i.followUp({
        content: "⏳ **Tempo esgotado!** Tente novamente.",
        ephemeral: true
      });
    }

    // Processar dados do modal
    const quantidade = parseInt(
      modalResponse.fields.getTextInputValue("quantidade_itens").trim().replace(/\D/g, ''),
      10
    );
    const tipo = modalResponse.fields.getTextInputValue("tipo_item").trim();

    // Validações
    if (isNaN(quantidade) || quantidade <= 0 || quantidade > 999999) {
      return await modalResponse.reply({
        content: "❌ **Quantidade inválida! Digite um número entre 1 e 999999.**",
        ephemeral: true
      });
    }

    if (!tipo || tipo.length < 1 || tipo.length > 50) {
      return await modalResponse.reply({
        content: "❌ **Tipo de item inválido! Digite entre 1 e 50 caracteres.**",
        ephemeral: true
      });
    }

    // Preparar dados para salvar
    const itemsToSave = selectedItems.map(value => {
      const itemInfo = itensIlegais.find(i => i.value === value);
      if (!itemInfo) {
        throw new Error(`Item não encontrado: ${value}`);
      }
      
      return {
        userId: interaction.user.id,
        userName: interaction.user.tag,
        item: itemInfo.label,
        quantidade: quantidade,
        tipo: tipo,
        timestamp: new Date(),
        guildId: interaction.guildId
      };
    });

    // Salvar no banco de dados com retry
    let savedItems = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries && !savedItems) {
      try {
        savedItems = await Promise.all(
          itemsToSave.map(async (item) => {
            const newItem = new ItemIlegal(item);
            return await newItem.save();
          })
        );
        break;
      } catch (dbError) {
        console.error(`Tentativa ${retryCount + 1} falhou:`, dbError);
        retryCount++;
        if (retryCount === maxRetries) {
          throw dbError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    // Criar embed de sucesso
    const successEmbed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("✅ Itens Catalogados com Sucesso")
      .addFields([
        {
          name: "📦 Itens",
          value: itemsToSave.map(item => `• ${item.item}`).join('\n'),
          inline: true
        },
        {
          name: "📊 Quantidade",
          value: quantidade.toString(),
          inline: true
        },
        {
          name: "📝 Tipo",
          value: tipo,
          inline: true
        }
      ])
      .setFooter({
        text: `Registrado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    // Primeiro, enviar resposta ao usuário
    await modalResponse.reply({
      content: "✅ **Itens catalogados com sucesso!**",
      embeds: [successEmbed],
      ephemeral: true
    });

    // Depois, tentar enviar para o webhook com verificações
    if (webhookClientReciboIlegal) {
      try {
        // Verificar se o webhook está configurado corretamente
        if (!webhookClientReciboIlegal.token || !webhookClientReciboIlegal.id) {
          console.error("Webhook não configurado corretamente. Token ou ID ausente.");
          return;
        }

        // Tentar enviar para o webhook
        await webhookClientReciboIlegal.send({
          embeds: [successEmbed]
        }).catch(async (webhookError) => {
          console.error("Erro ao enviar para webhook:", webhookError);
          
          // Notificar administrador sobre o problema com o webhook
          try {
            const adminChannel = interaction.guild.channels.cache.find(
              channel => channel.name === "📦-recebimento-de-carga" || channel.name === "bot-logs"
            );
            
            if (adminChannel) {
              await adminChannel.send({
                content: "⚠️ **Erro no Webhook de Itens Ilegais**\nPor favor, verifique as configurações do webhook.",
                ephemeral: true
              });
            }
          } catch (notifyError) {
            console.error("Erro ao notificar admin:", notifyError);
          }
        });
      } catch (webhookError) {
        console.error("Erro crítico no webhook:", webhookError);
      }
    } else {
      console.error("Webhook não inicializado");
    }

  } catch (error) {
    console.error("Erro ao processar catalogação:", error);
    
    let errorMessage = "❌ **Erro ao salvar os dados. Tente novamente.**";
    if (error.code === 11000) {
      errorMessage = "❌ **Este item já foi catalogado recentemente.**";
    } else if (error.name === "ValidationError") {
      errorMessage = "❌ **Dados inválidos. Verifique as informações e tente novamente.**";
    } else if (error.code === "WebhookTokenUnavailable") {
      errorMessage = "❌ **Erro interno do sistema. Um administrador foi notificado.**";
      console.error("Erro de token do webhook:", error);
    }

    try {
      if (modalResponse && !modalResponse.replied) {
        await modalResponse.reply({
          content: errorMessage,
          ephemeral: true
        });
      } else if (i && !i.replied) {
        await i.followUp({
          content: errorMessage,
          ephemeral: true
        });
      }
    } catch (replyError) {
      console.error("Erro ao enviar mensagem de erro:", replyError);
    }
  }
}

function validateModalInputs(modalResponse) {
  const quantidade = parseInt(
    modalResponse.fields.getTextInputValue("quantidade_itens").replace(/,/g, ""),
    10
  );
  const tipo = modalResponse.fields.getTextInputValue("tipo_item");

  return { quantidade, tipo };
}

async function saveItemsToDatabase(selectedItems, quantidade, tipo, interaction) {
  const data = loadData();
  const newItems = selectedItems.map(value => {
    const item = itensIlegais.find(i => i.value === value);
    return {
      id: Date.now().toString(),
      userId: interaction.user.id,
      userName: interaction.user.tag,
      item: item.label,
      quantidade,
      tipo,
      timestamp: new Date().toISOString()
    };
  });
  
  data.items.push(...newItems);
  saveData(data);
  return newItems;
}

function createItemsEmbed(selectedItems) {
  const itemsList = selectedItems
    .map(value => {
      const item = itensIlegais.find(i => i.value === value);
      return item ? `• ${item.label}` : null;
    })
    .filter(Boolean)
    .join("\n");

  return new EmbedBuilder()
    .setTitle("📜 Itens Ilegais Selecionados")
    .setDescription(itemsList || "Nenhum item selecionado.")
    .setColor(itemsList ? "#0099ff" : "#ff0000")
    .setTimestamp()
    .setFooter({ text: "Selecione os itens desejados e clique em Confirmar" });
}

async function handleError(interaction) {
  const errorMessage = {
    content: "❌ **Ocorreu um erro ao processar sua solicitação.**\nTente novamente ou contate um administrador se o erro persistir.",
    ephemeral: true
  };

  try {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply(errorMessage);
    } else {
      await interaction.followUp(errorMessage);
    }
  } catch (e) {
    console.error("Erro ao enviar mensagem de erro:", e);
  }
}

function updateUIComponents(rows, selectedItems) {
  const confirmButton = new ButtonBuilder()
    .setCustomId("confirmar_bau")
    .setLabel("Confirmar")
    .setStyle(ButtonStyle.Success)
    .setEmoji("✅")
    .setDisabled(!selectedItems.length);

  return [
    rows[0], // Mantém o menu de seleção
    new ActionRowBuilder().addComponents(confirmButton)
  ];
}
