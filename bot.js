const Eris = require("eris");
const config = require("./config.json")
const bot = new Eris(config.token);
const { StatsD } = require('node-dogstatsd');
const ddog = new StatsD();


const options = {
  '1': {
    description: 'Patreon/Lootbox issues or questions',
    message: () => `**__Patreon Perks__**\n\nMake sure you have your Discord linked with your Patreon.\nIf you haven't, You can do that by going to the Apps section from your user settings:\n**<https://www.patreon.com/settings/apps>**\nAfter successfully doing so, you will have the donor roles.\n\nTo link with Dank Memer to get the bot perks, go to a place where you can run bot commands, and run \`pls link\`.\nThe process might take some time, So don't worry if it does. Once it is linked your pledge should appear at the bottom when you do pls profile.\n\n\`pls redeem\` and you'll be given your lootbox(es) - cooldown of 3 days.\n\`pls pserver add\` in the server where you want to add perks if your pledge is high enough.\n\n**__Lootboxes__**\n- If you purchased lootboxes, they will generally arrive within 5 minutes to your inventory (\`pls inventory\`).\n- If they aren't there after 48 hours, verify on our website that you were logged into the correct account.\n\n**If this still doesn't answer your question about Patreon or Lootboxes**\n\nPlease visit the FAQ on our website: **<https://dankmemer.lol/faq>**\nOr you can go back to the help-desk channel and select the last item on the list to talk to a moderator.`,
  },
  '2': {
    description: 'Help with setting up the bot',
    message: () => `**We have a YouTube playlist**: <https://www.youtube.com/playlist?list=PLVYqhnJuxTsMeTtUvBph5huv46B8phNHh>\n\n**We have a FAQ page**: <https://dankmemer.lol/faq>\n\nIf you are still having issues, or neither of those options are advanced enough for what you are trying to accomplish, you can go back to the help-desk channel and select the last item on the list to talk to a moderator.`,
  },
  '3': {
    description: 'Bot ban, bot blacklist, or server ban questions',
    message: () => `**To appeal any type of ban, you may visit our website**: **https://dankmemer.lol/appeals**\n(*Make sure you're logged in to be able to submit*)\n\nWe read all appeals within a week. If you have not heard back after that time period, it is likely denied. You are able to appeal again if you'd like.\nIf this doesn't answer your question, you can go back to the help-desk channel and select the last item on the list to talk to a moderator.\n\n**__Please Note__**: Moderators *don't* have access to your personal data on the bot, so they cannot see reasons for your ban. You either broke server rules, or bot rules listed at <https://dankmemer.lol/rules>`
  },
  '4': {
    description: 'Non-Issue related Dank Memer questions.',
    message: () => `**Our support is not for these types of questions.**\n\nDue to the mass influx of these types of questions, we employ an attitude of "try it and see". Our support channel is for advanced issues, bugs, etc.\n\nIf you are unable to figure out what your question might be, it might get a response from our dedicated subreddit users: https://www.reddit.com/r/dankmemer/`,
  },
  '5': {
    description: 'Having an issue with Dank Memer, seems like a bug.',
    message: () => `First, make sure whatever "bug" you are experiencing isn't an intended change posted in the last few posts of <#599044275291947016>. That channel contains all of our update notes.\n\nIf it is not, please go back to the help-desk channel and select the last option to speak with a support staff member.`,
  },
  '6': {
    description: 'Dank Memer Community Server',
    message: () => `**This server is for Dank Memer BOT SUPPORT. We do not answer questions about the community server.**\n\n— If it is a question about the server, ask the staff team within the server.\n— If you are trying to appeal a server ban, just select the "support server" option from the appeals page at **<https://dankmemer.lol/appeals>**`,
  },
  '7': {
    description: 'Report someone for breaking rules.',
    message: () => `**To report someone for breaking our rules, please visit https://dankmemer.lol/reports**\n\nTo add proof for your report:\n— Upload it to any server or imgur\n— Copy the image link, and paste it in your report\n**Note: You'll need to log into website to submit the form.**\n\nFull list of rules: <https://dankmemer.lol/rules>`,
  },
  '8': {
    description: 'How to get updates messages in your server.',
    message: () => 'Our channel, <#599044275291947016>, is an announcement channel. There is a follow button on the channel when you visit it.\n\nTo learn more, please visit this Discord article: https://support.discord.com/hc/en-us/articles/360028384531-Channel-Following-FAQ',
  },
  '9': {
    description: 'Update and Status Pings',
    custom: async (msg) => {
      const hasRole = msg.member.roles.includes(config.pingRole)
      if (hasRole) {
        msg.member.removeRole(config.pingRole, 'Help-Desk role removal');
      } else {
        msg.member.addRole(config.pingRole, 'Help Desk role addition');
      }
      const dmChannel = await bot.getDMChannel(msg.author.id);
      try {
        await dmChannel.createMessage(`I have **${hasRole ? 'removed' : 'given you'}** the update role. You will **${hasRole ? 'no longer get' : 'now get'}** a ping for updates.`);
      } catch (_) {
        return `I have **${hasRole ? 'removed' : 'given you'}** the update role. You will **${hasRole ? 'no longer get' : 'now get'}** a ping for updates.`;
      }
    }
  },
  '10': {
    description: 'General Inquiries',
    custom: async (msg) => {
      const hasRole = msg.member.roles.includes(config.supportRole)
      msg.member.addRole(config.supportRole, 'needs supportive people in their life');
      const dmChannel = await bot.getDMChannel(msg.author.id);
      try {
        if (hasRole) {
          await dmChannel.createMessage(`You already have access to <#${config.supportChannel}>`)
        } else {
          await dmChannel.createMessage(`I have given you access to <#${config.supportChannel}>`);
        }
      } catch (_) {
        return `${msg.member.author} I have given you access to <#${config.supportChannel}>`;
      }
    }
  },
};

bot.on("messageCreate", async (msg) => {
  if (msg.channel.id === config.supportChannelID) { // Help Desk Section
    if (msg.author.bot) {
      return null;
    }
    const option = options[msg.content.split(' ')[0]];
    await msg.delete();
    if (!option) {
      ddog.increment(`support-invalid`)
      return null;
    }
    ddog.increment(`support-${msg.content}`)

    if (option.custom) {
      const out = await option.custom(msg);
      if (out) {
        const prompt = await msg.channel.createMessage(out);
        setTimeout(() => prompt.delete(), 8000);
        return null;
      }
      return null;
    }

    try {
      const dmChannel = await bot.getDMChannel(msg.author.id);
      const prompt = await dmChannel.createMessage(option.message());
      if (option.deleteDM) {
        setTimeout(() => prompt.delete(), 8000);
      }
    } catch (_) {
      const warning = await msg.channel.createMessage(
        option.onDmsClosed?.() ?? `Your DMs must be open for me to help you ${msg.author.mention}`
      );
      setTimeout(() => warning.delete(), 8000);
    }
  } else if (msg.channel.id === config.lotteryChannelID) {
    msg.crosspost();
    ddog.increment(`dmc-lotteryPublished`);
  } else if (msg.channel.id === config.saleChannelID) {
    msg.crosspost();
    ddog.increment(`dmc-salePublished`);
  } else if (msg.channel.id === config.prestigeChannelID) {
    if (!msg.content) {
      return msg.delete()
    }
    const filter = msg.content.split(' ')[2] === 'Congratulations' && msg.author.id === '270904126974590976';
    if (!filter) {
      setTimeout(() => msg.delete(), 3000); // delete msgs after 3s so they see the confirmation prompt
    }
    return null;
  } else {
    if (msg.author.bot || msg.channel.guild.id !== config.dmcID) {
      return null;
    }
    if (msg.mentions.length >= 1 && msg.mentions[0].id === config.ownerID) {
      if (msg.member.roles.includes(config.staffRoleID)) return null;
      msg.channel.createMessage({
        content: 'Imagine pinging mel, read the rules next time.',
        messageReferenceID: msg.id,
        allowedMentions: {
          repliedUser: true
        }
      });
      bot.createMessage(config.modLog, `**${msg.author.username}#${msg.author.discriminator}** (\`${msg.author.id}\`) was kicked for pinging Melmsie.`)
      setTimeout(() => msg.member.kick('pinged mel'), 3000); // kick after 3 seocnds so that they see the reply
      ddog.increment(`dmc-pingKicked`)
    } else if (msg.channel.id === config.dmcGeneralChannelID) {
      if (msg.content.toLowerCase().startsWith('pls') && !msg.member.roles.includes(config.staffRoleID)) {
        msg.delete();
      }
    } else {
      return null;
    }
  }
});

bot.on("ready", () => {
  console.log("Ready!");
});

bot.connect();