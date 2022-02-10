const Eris = require('eris');
const config = require('./config.json');
const bot = new Eris(config.token);
const { StatsD } = require('node-dogstatsd');
const ddog = new StatsD();
const options = require('./options');

bot.on('interactionCreate', async (interaction) => {
	if (interaction.channel.id === config.helpDeskChannel) {
		// Help Desk Section
		const option = options[interaction.data.values[0]];
		if (!option) {
			return ddog.increment(`support-invalid`);
		}
		ddog.increment(`support-${interaction.data.values[0]}`);
		await interaction.acknowledge();

		if (option.custom) {
			return option.custom(interaction);
		}

		try {
			const dmChannel = await bot.getDMChannel(interaction.member.id);
			await dmChannel.createMessage(option.message());
			return interaction.createFollowup({
				content: 'Please check your DMs for more information.',
				flags: 64
			});
		} catch (_) {
			return interaction.createFollowup({
				content:
					option.onDmsClosed?.() ??
					`Your DMs must be open for me to help you`,
				flags: 64
			});
		}
	}
});

bot.on('ready', () => {
	console.log(`${bot.user.username} is ready!`);
});

bot.on('messageCreate', async (msg) => {
	if (
		msg.content.toLowerCase() === 'helpdesk post' &&
		msg.member?.roles.includes(config.serverMgmtRole)
	) {
		await bot.createMessage(config.helpDeskChannel, {
			embeds: [
				{
					title: 'Dank Memer Support | Help Desk',
					description:
						'Please choose an option from the select menu below if you need help.',
					footer: {
						text: 'If the interaction fails, try again in a bit.',
						icon_url: msg.channel.guild.dynamicIconURL()
					},
					color: 0x2ecc71
				}
			],
			components: [
				{
					type: 1,
					components: [
						{
							type: 3,
							custom_id: 'support_options',
							min_values: 0,
							max_values: 1,
							placeholder: 'Options',
							options: [
								{
									label: 'Patreon/Lootbox Questions',
									value: 'patreon',
									description:
										'Select this if you have issues or questions about Patreon.'
								},
								{
									label: 'Setting up the bot',
									value: 'setting_up',
									description:
										'Select this if you need help with setting up the bot.'
								},
								{
									label: 'Bot bans, blacklists or server bans',
									value: 'bans',
									description:
										'Questions regarding bot bans, blacklists or server bans.'
								},
								{
									label: 'Non-issue related Dank Memer questions',
									value: 'non_issues',
									description:
										"If you have a question that's not necessarily an issue."
								},
								{
									label: 'Bugs',
									value: 'bugs',
									description:
										"If you think you're experiencing a bug."
								},
								{
									label: 'Dank Memer Community Questions',
									value: 'dmc',
									description:
										'If you have a question about Dank Memer Community.'
								},
								{
									label: 'Bot Reports',
									value: 'reports',
									description:
										'If you want to report someone for breaking bot rules.'
								},
								{
									label: 'Get update messages in your server',
									value: 'update_messages',
									description:
										'If you want to know how to get updates in your server.'
								},
								{
									label: 'Get pings for updates',
									value: 'update_role',
									description:
										'If you would like the Bot Updates role.'
								},
								{
									label: 'General Inquiries',
									value: 'support_channel',
									description:
										"If you have a general inquiry that isn't answered here."
								}
							]
						}
					]
				}
			]
		});
		return msg.channel.createMessage(
			`Successfully posted the help message in <#${config.helpDeskChannel}>`
		);
	}
});

bot.connect();
