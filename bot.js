const Eris = require("eris");
const config = require("./config.json")
var bot = new Eris(config.token);


const options = {
    '1': {
      description: 'gamble tips',
      message: () => 'it\'s rigged melmsie rigged it',
    },
    '2': {
      description: 'support',
      custom: (msg) => {
        msg.member.addRole(config.supportRole, 'needs supportive people in their life');
        bot.createMessage(config.supportRole, `hey get support here or not idc ${msg.author.mention}`);
        return `here is your support role ${msg.author.mention}`;
      }
    },
    '3': {
      description: 'bot down',
      message: () => 'we know fuck off my god',
      dmMessage: (msg) => `open your fucking dms idiot thats where im helping u not here in this channel ${msg.author.mention}`,
    },
    '4': {
      description: 'feedback requests',
      message: () => 'no feedback needed, this is a perfect bot',
    }
  };
  
  bot.on("messageCreate", async (msg) => {
    if (msg.author.bot || msg.channel.id !== config.channelID) {
      return;
    }
  
    const option = options[msg.content];
    if (!option) {
      await msg.delete();
      return;
    }
  
    if (option.custom) {
      const out = await option.custom(msg);
      if (out) {
        const prompt = await msg.channel.createMessage(out);
        setTimeout(() => prompt.delete(), 8000);
        return;
      }
    }
  
    try {
      const dmChannel = await bot.getDMChannel(msg.author.id);
      const prompt = await dmChannel.createMessage(option.message());
      setTimeout(() => prompt.delete(), 8000);
    } catch (_) {
      msg.channel.createMessage(
        option.onDmsClosed?.() || `open your fucking dms idiot thats where im helping u not here in this channel ${msg.author.mention}`
      );
    }
  });
  
  bot.connect();