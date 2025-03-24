const { WebhookClient } = require('discord.js');
const config = require('../config.json');

class WebhookManager {
    constructor() {
        this.webhooks = new Map();
        this.initializeWebhooks();
    }

    initializeWebhooks() {
        const webhookConfigs = [
            {
                name: 'recibo',
                id: config.webhookReciboId,
                token: config.webhookReciboToken
            },
            {
                name: 'log',
                id: config.webhookLogReciboId,
                token: config.webhookLogReciboToken
            },
            {
                name: 'registro',
                id: config.webhookLogRegistroId,
                token: config.webhookLogRegistroToken
            },
            {
                name: 'reciboIlegal',
                id: config.webhookLogReciboIlegalId,
                token: config.webhookLogReciboIlegalToken
            }
        ];

        for (const webhookConfig of webhookConfigs) {
            try {
                if (!webhookConfig.id || !webhookConfig.token) {
                    console.error(`⚠️ Webhook ${webhookConfig.name} não está configurado corretamente.`);
                    continue;
                }

                const webhook = new WebhookClient({
                    id: webhookConfig.id,
                    token: webhookConfig.token
                });

                this.webhooks.set(webhookConfig.name, webhook);
                console.log(`✅ Webhook ${webhookConfig.name} configurado com sucesso!`);
            } catch (error) {
                console.error(`❌ Erro ao configurar webhook ${webhookConfig.name}:`, error);
            }
        }
    }

    getWebhook(name) {
        return this.webhooks.get(name);
    }

    async sendMessage(webhookName, content) {
        const webhook = this.getWebhook(webhookName);
        if (!webhook) {
            throw new Error(`Webhook ${webhookName} não encontrado ou não configurado.`);
        }

        try {
            return await webhook.send(content);
        } catch (error) {
            console.error(`Erro ao enviar mensagem para webhook ${webhookName}:`, error);
            throw error;
        }
    }

    async sendToAllWebhooks(content) {
        const promises = [];
        for (const [name, webhook] of this.webhooks) {
            promises.push(
                this.sendMessage(name, content)
                    .catch(error => console.error(`Erro ao enviar para ${name}:`, error))
            );
        }
        return Promise.allSettled(promises);
    }

    isWebhookConfigured(name) {
        const webhook = this.getWebhook(name);
        return !!(webhook && webhook.token && webhook.id);
    }

    destroyWebhooks() {
        for (const [name, webhook] of this.webhooks) {
            try {
                webhook.destroy();
                console.log(`Webhook ${name} destruído com sucesso.`);
            } catch (error) {
                console.error(`Erro ao destruir webhook ${name}:`, error);
            }
        }
        this.webhooks.clear();
    }
}

module.exports = new WebhookManager(); 