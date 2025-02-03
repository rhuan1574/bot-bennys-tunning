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
  ComponentType,
  Collection,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const { webhookId, webhookToken, tagMembers } = require("../config.json");
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });
const { webhookReciboId, webhookReciboToken } = require("../config.json")

const collectorMessage = new Collection();
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
          { label: "Turbo 💨", description: " Turbo Boost", value: "turbo" },
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

        let selectedServices = []; // Lista para armazenar as seleções do usuário

        const embed = new EmbedBuilder()
          .setTitle("Serviços Selecionados")
          .setDescription("Nenhum serviço selecionado ainda.")
          .setColor("#0099ff");

        // Enviar a mensagem inicial com a embed e o menu de seleção
        await interaction.reply({
          embeds: [embed],
          components: [rowSelect],
          flags: 64
        });

        // Criar um coletor para capturar as seleções do menu suspenso
        const filter = (i) =>
          i.customId === "tunagem_menu" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 30_000,
        });

        collector.on("collect", async (i) => {
          // Adiciona as novas seleções à lista sem duplicar
          i.values.forEach((value) => {
            if (!selectedServices.includes(value)) {
              selectedServices.push(value);
            }
          });

          // Criar um novo embed com as opções selecionadas
          const updatedEmbed = new EmbedBuilder()
            .setTitle("Serviços Selecionados")
            .setDescription(
              selectedServices
                .map(
                  (value) =>
                    tunagem.find((item) => item.value === value)?.label || value
                )
                .join("\n")
            )
            .setColor("#0099ff");

          await i.update({
            embeds: [updatedEmbed],
            components: [rowSelect, rowButton],
            flags: 64
          });
        });

        collector.on("end", () => {
          console.log("Coletor encerrado.");
        });
      }

      else if (customId === "confirmar") {
        const embedConfirmado = new EmbedBuilder()
            .setTitle("Recibo gerado")
            .setDescription("Seu recibo foi gerado. Para enviar, selecione o botão abaixo e envie o print do comprovante.")
            .setColor('Aqua')
            .setTimestamp();
    
        const buttonImagem = new ButtonBuilder()
            .setCustomId("enviar_imagem")
            .setLabel("Enviar imagem")
            .setStyle(ButtonStyle.Success);
    
        const rowConfirmado = new ActionRowBuilder().addComponents(buttonImagem);
        
        await interaction.reply({
            embeds: [embedConfirmado],
            components: [rowConfirmado],
            flags: 64
        });
        if (customId === "enviar_imagem") {
          if (!interaction.channel) {
              return interaction.reply({ content: "Erro: Não consigo acessar este canal.", ephemeral: true });
          }
      
          // Verificar permissões do bot
          if (!interaction.channel.permissionsFor(interaction.client.user).has(['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'])) {
              return interaction.reply({ content: "❌ Não tenho permissões para ler mensagens neste canal.", ephemeral: true });
          }
      
          // Adiar a resposta para evitar erro de timeout
          await interaction.deferReply({ ephemeral: true });
      
          // Desabilitar o botão após clicar
          const buttonImagemDesativado = ButtonBuilder.from(interaction.message.components[0].components[0]).setDisabled(true);
          const rowAtualizado = new ActionRowBuilder().addComponents(buttonImagemDesativado);
      
          await interaction.editReply({
              content: "📤 Envie uma imagem neste canal.",
              components: [rowAtualizado],
          });
      
          // Filtro para capturar mensagens com anexos de imagem, embeds ou links diretos de imagem
          const filter = (m) => {
              const isAuthor = m.author.id === interaction.user.id;
              const hasImageAttachment = m.attachments.some(att => att.contentType?.startsWith("image/"));
              const hasImageEmbed = m.embeds.some(embed => embed.image || embed.thumbnail);
              const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
              const hasImageLink = imageUrlPattern.test(m.content);
      
              console.log("Mensagem recebida:", m.content);
              console.log("Anexos:", m.attachments.size);
              console.log("Embeds:", m.embeds.length);
      
              return isAuthor && (hasImageAttachment || hasImageEmbed || hasImageLink);
          };
      
          // Criando o coletor (expira em 2 minutos)
          const collector = interaction.channel.createMessageCollector({ filter, time: 120_000 });
      
          collector.on("collect", async (message) => {
              let imageUrl = null;
      
              // Verificar anexos de imagem
              if (message.attachments.size > 0) {
                  const attachment = message.attachments.first();
                  if (attachment.contentType?.startsWith("image/")) {
                      imageUrl = attachment.url;
                  } else {
                      await interaction.followUp({ content: "❌ O arquivo enviado não é uma imagem válida.", ephemeral: true });
                      return;
                  }
              }
              // Verificar embeds de imagem
              else if (message.embeds.length > 0) {
                  const imageEmbed = message.embeds.find(embed => embed.image || embed.thumbnail);
                  if (imageEmbed) {
                      imageUrl = imageEmbed.image?.url || imageEmbed.thumbnail?.url;
                  } else {
                      console.log("Embed encontrado, mas sem imagem ou thumbnail:", message.embeds);
                  }
              }
              // Verificar links diretos de imagem
              else {
                  const imageUrlPattern = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
                  const match = message.content.match(imageUrlPattern);
                  if (match) {
                      imageUrl = match[0];
                  }
              }
      
              if (imageUrl) {
                  console.log(`Imagem recebida: ${imageUrl}`);
                  await interaction.followUp({ content: "✅ Imagem recebida com sucesso! Seu recibo será enviado em breve!", ephemeral: true });
                  
                  collector.stop(); // Para o coletor após receber a imagem
                  
              }
          });
      
          collector.on("end", async (collected) => {
              if (collected.size === 0) {
                  await interaction.followUp({ content: "❌ Tempo esgotado. Nenhuma imagem foi enviada.", ephemeral: true });
              }
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
