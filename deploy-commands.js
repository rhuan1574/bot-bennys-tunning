require('dotenv').config(); // Carregar variáveis de ambiente no início do arquivo

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Variáveis de ambiente
const clientId = '1320336788555825172';
const guildId = '1292973664869814377';
const token = 'MTMyMDMzNjc4ODU1NTgyNTE3Mg.GI5dzW.VBkusZgIWY4jLgtx13TaCbyWVh2i_nD1Pnx98I'; // Alterei para usar diretamente do .env

// Verifica se todas as variáveis estão definidas
if (!clientId || !guildId || !token) {
	console.error(
		"Erro: Variáveis de ambiente CLIENT_ID, GUILD_ID ou DISCORD_TOKEN não foram definidas."
	);
	process.exit(1); // Interrompe a execução se variáveis estiverem faltando
}

const commands = [];
// Pega todas as pastas de comandos do diretório "commands"
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] O comando em ${filePath} está faltando as propriedades "data" ou "execute".`
			);
		}
	}
}

// Instância do REST
const rest = new REST().setToken(token);

// Deploy dos comandos
(async () => {
	try {
		console.log(`Iniciando o registro de ${commands.length} comandos de aplicação (/)...`);

		// Registro dos comandos para a guilda
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands }
		);

		console.log(`Comandos registrados com sucesso! Total: ${data.length}.`);
	} catch (error) {
		console.error('Erro ao registrar comandos:', error);
	}
})();
