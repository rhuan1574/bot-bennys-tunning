const fs = require('fs');
const path = require('path');
const { CHANNELS, ROLES } = require('../constants/items');

class ChannelManager {
    constructor() {
        this.channelsFile = path.resolve(__dirname, '../data/channels.json');
        this.channels = this.loadChannels();
    }

    loadChannels() {
        if (fs.existsSync(this.channelsFile)) {
            try {
                const data = fs.readFileSync(this.channelsFile, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                console.error('❌ Erro ao carregar o arquivo channels.json:', error);
            }
        }
        return {};
    }

    saveChannels() {
        try {
            fs.writeFileSync(this.channelsFile, JSON.stringify(this.channels, null, 4), 'utf8');
        } catch (error) {
            console.error('❌ Erro ao salvar o arquivo channels.json:', error);
        }
    }

    getUserChannel(userId) {
        return this.channels[userId];
    }

    setUserChannel(userId, channelId) {
        this.channels[userId] = channelId;
        this.saveChannels();
    }

    async createUserChannel(guild, userId, channelName) {
        try {
            const existingChannel = guild.channels.cache.find(
                channel => channel.name === `📁・${channelName}`
            );

            if (existingChannel) {
                this.setUserChannel(userId, existingChannel.id);
                return {
                    success: true,
                    channel: existingChannel,
                    message: `📁 O canal "${existingChannel.name}" já existe.`
                };
            }

            const newChannel = await guild.channels.create({
                name: `📁・farm-${channelName}`,
                type: 0,
                topic: 'Canal criado via interação de botão',
                reason: `Solicitado por ${guild.members.cache.get(userId)?.user.tag}`,
                parent: CHANNELS.CATEGORIA_ID,
                permissionOverwrites: [
                    {
                        id: userId,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    },
                    {
                        id: guild.roles.everyone.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: guild.roles.cache.find(role => role.name === ROLES.GERENTE)?.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    },
                ],
            });

            this.setUserChannel(userId, newChannel.id);
            return {
                success: true,
                channel: newChannel,
                message: `📁 Canal "${newChannel.name}" criado com sucesso!`
            };
        } catch (error) {
            console.error('❌ Erro ao criar canal:', error);
            return {
                success: false,
                error: error,
                message: '❌ Ocorreu um erro ao criar o canal.'
            };
        }
    }

    async deleteUserChannel(guild, userId) {
        const channelId = this.getUserChannel(userId);
        if (!channelId) return false;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            delete this.channels[userId];
            this.saveChannels();
            return false;
        }

        try {
            await channel.delete('Canal removido automaticamente');
            delete this.channels[userId];
            this.saveChannels();
            return true;
        } catch (error) {
            console.error('❌ Erro ao deletar canal:', error);
            return false;
        }
    }

    async cleanupUnusedChannels(guild) {
        const unusedChannels = [];
        for (const [userId, channelId] of Object.entries(this.channels)) {
            const channel = guild.channels.cache.get(channelId);
            if (!channel) {
                delete this.channels[userId];
                unusedChannels.push(channelId);
            }
        }
        
        if (unusedChannels.length > 0) {
            this.saveChannels();
            console.log(`🧹 Removidos ${unusedChannels.length} canais não utilizados do registro.`);
        }
    }
}

module.exports = new ChannelManager(); 