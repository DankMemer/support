const config = require('./config.json');

const options = {
	patreon: {
		description: 'Patreon/Lootbox issues or questions',
		message: () =>
			`**__Patreon Perks__**\n\nMake sure you have your Discord linked with your Patreon.\nIf you haven't, You can do that by going to the Apps section from your user settings:\n**<https://www.patreon.com/settings/apps>**\nAfter successfully doing so, you will have the donor roles.\n\nTo link with Dank Memer and get your bot perks, go to a place where you can run bot commands and run \`pls link\`. Go to the link it provides and log in to connect/link your account. ***You will need to do this once a month so that your perks are still available***, the process should be automatic and take only a few minutes of your time. If you upgraded your pledge and need to update your perks, you will need to re-link your account, you can do this by visiting **https://link.dankmemer.lol/** once again. You can see your tier at the bottom of your profile by running \`pls profile\`.\n\n\`pls redeem\` and you'll be given your lootbox(es) - cooldown of 7 days.\n\`pls pserver add\` in the server where you want to add perks if your pledge is high enough.\n\n**__Lootboxes__**\n- If you want to purchase lootboxes please visit: **https://dankmemer.lol/lootboxes**\n- If you purchased lootboxes, they will generally arrive within 5 minutes to your inventory (\`pls inventory\`).\n- If they aren't there after 48 hours, verify on our website that you were logged into the correct account.\n\n**If this still doesn't answer your question about Patreon or Lootboxes**\n\nPlease visit the FAQ on our website: **<https://dankmemer.lol/faq>**\nOr you can go back to the help-desk channel and select the last item on the list to talk to a moderator.`
	},
	setting_up: {
		description: 'Help with setting up the bot',
		message: () =>
			`**We have a YouTube playlist**: <https://www.youtube.com/playlist?list=PLVYqhnJuxTsMeTtUvBph5huv46B8phNHh>\n\n**We have a FAQ page**: <https://dankmemer.lol/faq>\n\nIf you are still having issues, or neither of those options are advanced enough for what you are trying to accomplish, you can go back to the help-desk channel and select the last item on the list to talk to a moderator.`
	},
	bans: {
		description: 'Bot ban, bot blacklist, or server ban questions',
		message: () =>
			`**To appeal any type of ban, you may visit our website**: **https://dankmemer.lol/appeals**\n(*Make sure you're logged in to be able to submit*)\n\nWe read all appeals within 2 weeks. If you have not heard back after that time period, it is likely denied. You are able to appeal again if you'd like.\nIf this doesn't answer your question, you can go back to the help-desk channel and select the last item on the menu to talk to a moderator.\n\n**__Please Note__**: Moderators *don't* have access to your personal data on the bot, so they cannot see reasons for your ban. You either broke server rules, or bot rules listed at https://dankmemer.lol/rules`
	},
	non_issues: {
		description: 'Non-Issue related Dank Memer questions.',
		message: () =>
			`**Our support is not for these types of questions.**\n\nDue to the mass influx of these types of questions, we employ an attitude of "try it and see". Our support channel is for advanced issues, bugs, etc.\n\nIf you are unable to figure out what your question might be, it might get a response from our dedicated subreddit users: https://www.reddit.com/r/dankmemer/`
	},
	bugs: {
		description: 'Having an issue with Dank Memer, seems like a bug.',
		message: () =>
			`First, make sure whatever "bug" you are experiencing isn't an intended change posted in the last few messages of <#599044275291947016>. That channel and our community blogs (**https://dankmemer.lol/community/blogs**) contain all of our update notes.\n\nIf it is not, please go back to the help-desk channel and select the last option to speak with a support staff member.`
	},
	dmc: {
		description: 'Dank Memer Community Server',
		message: () =>
			`**This server is for Dank Memer BOT SUPPORT. We do not answer questions about the community server.**\n\n— If it is a question about the server, ask the staff team within the server.\n— If you are trying to appeal a server ban, just select the "Community Server Ban" option from the appeals page at https://dankmemer.lol/appeals.`
	},
	reports: {
		description: 'Report someone for breaking rules.',
		message: () =>
			`**To report someone for breaking our rules, please visit https://dankmemer.lol/reports**\n\nTo add proof for your report:\n— Upload it to any server or imgur\n— Copy the image link, and paste it in your report\n**Note: You'll need to log into website to submit the form.**\n\nFull list of rules: https://dankmemer.lol/rules`
	},
	update_messages: {
		description: 'How to get updates messages in your server.',
		message: () =>
			'Our channel, <#599044275291947016>, is an announcement channel. There is a follow button on the channel when you visit it.\n\nTo learn more, please visit this Discord article: https://support.discord.com/hc/en-us/articles/360028384531-Channel-Following-FAQ'
	},
	update_role: {
		description: 'Update and Status Pings',
		custom: async (interaction) => {
			const hasRole = interaction.member.roles.includes(config.pingRole);
			if (hasRole) {
				await interaction.member.removeRole(
					config.pingRole,
					'Help-Desk role removal'
				);
			} else {
				await interaction.member.addRole(
					config.pingRole,
					'Help Desk role addition'
				);
			}
			const roleMessage = `I have **${
				hasRole ? 'removed' : 'given you'
			}** the update role. You will **${
				hasRole ? 'no longer get' : 'now get'
			}** a ping for updates.`;
			return interaction.createFollowup({
				content: roleMessage,
				flags: 64
			});
		}
	},
	support_channel: {
		description: 'General Inquiries',
		custom: async (interaction) => {
			const hasRole = interaction.member.roles.includes(
				config.supportRole
			);
			await interaction.member.addRole(
				config.supportRole,
				'needs supportive people in their life'
			);
			if (hasRole) {
				return interaction.createFollowup({
					content: `You already have access to <#${config.supportChannel}>`,
					flags: 64
				});
			} else {
				return interaction.createFollowup({
					content: `I have given you access to <#${config.supportChannel}>`,
					flags: 64
				});
			}
		}
	}
};

module.exports = options;
