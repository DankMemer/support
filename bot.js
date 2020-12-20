const Eris = require("eris");
const config = require("./config.json")
var bot = new Eris(config.token);
const { StatsD } = require('node-dogstatsd');
const ddog= new StatsD();


const options = {
    '1': {
      description: 'Patreon/Lootbox issues or questions',
      message: () => `**__Patreon Perks__**
      Make sure you have your Discord linked with your Patreon.
      If you haven't, You can do that by going to the Apps section from your user settings.
      <https://www.patreon.com/settings/apps>
      After successfully doing so, you will have the donor roles.
      
      To link with Dank Memer to get the bot perks, go to a place where you can run bot commands, and run \`pls link\`.
      The process might take some time, So don't worry if it does. Once it is linked your pledge should appear at the bottom when you do pls profile.
      
      \`pls redeem\` and you'll be given your lootbox(es) - cooldown of 3 days.
      \`pls pserver add\` in the server where you want to add perks if your pledge is high enough
      
**__Lootboxes__**
      If you purchased lootboxes, they will generally arrive within 5 minutes to your inventory (\`pls inventory\`).
      If they aren't there after 48 hours, verify on our website that you were logged into the correct account.
      
      **If this still doesn't answer your question about Patreon or Lootboxes**
      Please visit the FAQ on our website: <https://dankmemer.lol/faq>

      Or you can go back to the help-desk channel and select the last item on the list to talk to a moderator.`,
    },
    '2': {
      description: 'Help with setting up the bot',
      message: () => `**We have a YouTube playlist**: <https://www.youtube.com/playlist?list=PLVYqhnJuxTsMeTtUvBph5huv46B8phNHh>

**We have a FAQ page**: <https://dankmemer.lol/faq>

      If you are still having issues, or neither of those options are advanced enough for what you are trying to accomplish, you can go back to the help-desk channel and select the last item on the list to talk to a moderator.`,
    },
    '3': {
      description: 'Bot ban, bot blacklist, or server ban questions',
      message: () => `**To appeal any type of ban, you may visit our website**: https://dankmemer.lol/appeals (Make sure you're logged in to be able to sumbit)
      
      We read all appeals within a week. If you have not heard back after that time period, it is likely denied. You are able to appeal again if you'd like.
      
      If this doesn't answer your question, you can go back to the help-desk channel and select the last item on the list to talk to a moderator.
      (Moderators don't have access to your personal data on the bot, so they cannot see reasons for your ban. You either broke server rules, or bot rules listed at <https://dankmemer.lol/rules>)`
    },
    '4': {
      description: 'Non-Issue related Dank Memer questions.',
      message: () => `**Our support is not for these types of questions.**
      
      Due to the mass influx of these types of questions, we employ an attitude of "try it and see". Our support channel is for advanced issues, bugs, etc.
      
      If you are unable to figure out what your question might be, it might get a response from our dedicated subreddit users: https://www.reddit.com/r/dankmemer/`,
    },
    '5': {
      description: 'Having an issue with Dank Memer, seems like a bug.',
      message: () => `First, make sure whatever "bug" you are experiencing isn't an intended change posted in the last few posts of <#599044275291947016>. That channel contains all our update notes.\n\nIf it is not, please go back to the help-desk channel and select the last option to speak with a support staff member.`,
    },
    '6': {
      description: 'Dank Memer Community Server',
      message: () => `**This server is for Dank Memer BOT SUPPORT. We do not answer questions about the community server.**
      
      If you are trying to appeal a ban, just select the "support server" option from the appeals page at <https://dankmemer.lol/appeals>.
      If it is a question about the server, as the staff team within the server.`,
    },
    '7': {
      description: 'Report someone for breaking rules.',
      message: () => `**To report someone from breaking our rules (<https://dankmemer.lol/rules>)**
      
      Please visit https://dankmemer.lol/reports.
      
NOTE: You must be signed in to submit a report, and to include images you must send them as links in the report.
      To get someone's ID, follow this video: <https://www.youtube.com/watch?v=6dqYctHmazc>`,
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
        msg.member.addRole(config.supportRole, 'needs supportive people in their life');
        const dmChannel = await bot.getDMChannel(msg.author.id);
        try {
          await dmChannel.createMessage(`I have **${hasRole ? 'removed' : 'given you'}** the update role. You will **${hasRole ? 'no longer get' : 'now get'}** a ping for updates.`);
        } catch (e) {
          return `I have **${hasRole ? 'removed' : 'given you'}** the update role. You will **${hasRole ? 'no longer get' : 'now get'}** a ping for updates.`;
        }
      }
    },
    '10': {
      description: 'General Inquiries',
      custom: async (msg) => {
        msg.member.addRole(config.supportRole, 'needs supportive people in their life');
        const dmChannel = await bot.getDMChannel(msg.author.id);
        try {
          await dmChannel.createMessage(`I have given you access to <#${config.supportChannel}>`);
        } catch (e) {
          return `${msg.member.author} I have given you access to <#${config.supportChannel}>`;
        }
      }
    },
  };
  
  bot.on("messageCreate", async (msg) => {
    if (msg.author.bot || msg.channel.id !== config.channelID) {
      return;
    }
  
    const option = options[msg.content];
    await msg.delete();
    if (!option) {
      ddog.increment(`support-invalid`)
      return;
    }
    ddog.increment(`support: ${option.description}`)
  
    if (option.custom) {
      const out = await option.custom(msg);
      if (out) {
        const prompt = await msg.channel.createMessage(out);
        setTimeout(() => prompt.delete(), 8000);
        return;
      }
      return;
    }
  
    try {
      const dmChannel = await bot.getDMChannel(msg.author.id);
      const prompt = await dmChannel.createMessage(option.message());
      if (option.deleteDM) {
        setTimeout(() => prompt.delete(), 8000);
      }
    } catch (_) {
      let warning = await msg.channel.createMessage(
        option.onDmsClosed?.() || `Your DMs must be open for me to help you ${msg.author.mention}`
      );
      setTimeout(() => warning.delete(), 8000);
    }
  });

  bot.on("ready", () => {
    console.log("Ready!");
});
  
  bot.connect();