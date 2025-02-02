const { log } = require("console");
const {
  Events,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  WebhookClient,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const { webhookId, webhookToken, tagMembers } = require("../config.json");
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });


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

      if (customId === "recibo") {
        if (customId === "recibo") {
          const services = {
              motor_1: "Motor 1 🔧",
              motor_2: "Motor 2 🔧",
              motor_3: "Motor 3 🔧",
              motor_4: "Motor 4 🔧",
              transmissao_1: "Transmissão 1 ⚙️",
              transmissao_2: "Transmissão 2 ⚙️",
              transmissao_3: "Transmissão 3 ⚙️",
          };
      
          const selectedServices = new Map(); // Adicionando o Map() para armazenar seleções por usuário
      
          const buttons = Object.keys(services).map(service =>
              new ButtonBuilder()
                  .setLabel(services[service])
                  .setCustomId(service)
                  .setStyle(service.includes("transmissao") ? ButtonStyle.Danger : ButtonStyle.Success)
          );
      
          const row1 = new ActionRowBuilder().addComponents(buttons.slice(0, 4));
          const row2 = new ActionRowBuilder().addComponents(buttons.slice(4));
      
          const embed = new EmbedBuilder()
              .setTitle("Serviços Selecionados")
              .setDescription("Nenhum serviço selecionado ainda.")
              .setColor("#0099ff");
      
          const message = await interaction.reply({
              content: "Selecione os serviços feitos:",
              components: [row1, row2],
              embeds: [embed],
              ephemeral: true,
          });
      
          const collector = message.createMessageComponentCollector({ time: 60000 });
      
          collector.on("collect", async (i) => {
              if (!services[i.customId]) return;
      
              const userId = i.user.id;
              const userSelections = selectedServices.get(userId) || [];
      
              if (userSelections.includes(services[i.customId])) {
                  userSelections.splice(userSelections.indexOf(services[i.customId]), 1);
              } else {
                  userSelections.push(services[i.customId]);
              }
      
              selectedServices.set(userId, userSelections);
      
              embed.setDescription(userSelections.length ? userSelections.join("\n") : "Nenhum serviço selecionado ainda.");
      
              await i.update({ embeds: [embed] });
          });
      
          collector.on("end", () => {
              message.edit({ components: [] });
          })
      } else if (customId === "users") {
        // Obtendo os valores selecionados
        const selectedValues = interaction.values;

        if (!selectedValues.length) {
          return await interaction.reply({
            content: "❌ Você não selecionou nenhum item.",
            flags: 64,
          });
        }

        // Função para mapear valores para descrições (substitua por sua lógica)
        const getItemLabel = (value) => {
          const responseMessages = {
            motor_1: "Motor Nível 1",
            motor_2: "Motor Nível 2",
            motor_3: "Motor Nível 3",
            motor_4: "Motor Nível 4",
            transmissao_1: "Transmissão Nível 1",
            transmissao_2: "Transmissão Nível 2",
            transmissao_3: "Transmissão Nível 3",
            freio_1: "Freio Nível 1",
            freio_2: "Freio Nível 2",
            freio_3: "Freio Nível 3",
            turbo: "Turbo",
            suspensao_1: "Suspensão Nível 1",
            suspensao_2: "Suspensão Nível 2",
            suspensao_3: "Suspensão Nível 3",
            suspensao_4: "Suspensão Nível 4",
            suspensao_5: "Suspensão Nível 5",
            blindagem_20: "Blindagem 20%",
            blindagem_40: "Blindagem 40%",
            blindagem_60: "Blindagem 60%",
            blindagem_80: "Blindagem 80%",
            blindagem_100: "Blindagem 100%",
          };
          return responseMessages[value] || value; // Retorna a descrição ou o valor original
        };

        const selectedItems = selectedValues.map(getItemLabel).join("\n• ");

        // Armazena os itens apenas para o usuário específico
        interaction.client.selectedItems[interaction.user.id] = selectedItems;

        await interaction.update({
          content: `✅ Você selecionou:\n• ${selectedItems}`,
          components: [], // Remove os componentes para evitar interações repetidas
        });
      } else if (customId === "confirmar") {
      } else if (customId === "refazer") {
        await interaction.reply({
          content: "🔄 Por favor, refaça sua seleção.",
          flags: 64,
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
        const nomeRegistro = interaction.fields.getTextInputValue("nome_prsn");
        const nomeReal = interaction.fields.getTextInputValue("nome");
        const nomeIndicacao =
          interaction.fields.getTextInputValue("nome_indicacao");
        const idRegistro = interaction.fields.getTextInputValue("id_prsn");

        const membro = interaction.guild.members.cache.get(interaction.user.id);

        if (membro) {
          try {
            await membro.setNickname(`${nomeRegistro} | ${idRegistro}`);
            await interaction.reply({
              content: `✅ O apelido foi atualizado para: ${nomeRegistro} | ${idRegistro} e recebeu o cargo de 🧰 | Membro Benny's`,
              flags: 64,
            });
          } catch (error) {
            console.error(error);
            await interaction.reply({
              content:
                "❌ Não foi possível alterar o apelido. Verifique minhas permissões.",
              flags: 64,
            });
          }
        } else {
          await interaction.reply({
            content: "❌ Membro não encontrado no servidor.",
            flags: 64,
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
            await interaction.reply({
              content: "❌ Não foi possível atribuir o cargo.",
              flags: 64,
            });
          }
        }

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

        webhookClient.send({
          content: tagMembers ? `${membro} foi registrado!` : "",
          embeds: [embed],
        });
      }
    }
  },
};
