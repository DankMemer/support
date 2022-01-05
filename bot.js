const Eris = require("eris");
const config = require("./config.json");
const bot = new Eris(config.token);
const { StatsD } = require("node-dogstatsd");
const ddog = new StatsD();
const options = require("./options");

bot.on("interactionCreate", async (interaction) => {
  if (interaction.channel.id === config.supportChannel) {
    // Help Desk Section
    const option = options[interaction.data.values[0]];
    if (!option) {
      return ddog.increment(`support-invalid`);
    }
    ddog.increment(`support-${interaction.data.values[0]}`);
    await interaction.acknowledge();

    if (option.custom) {
      await option.custom(interaction);
    }

    try {
      const dmChannel = await bot.getDMChannel(interaction.member.id);
      await dmChannel.createMessage(option.message());
    } catch (_) {
      return interaction.createFollowup({
        content:
          option.onDmsClosed?.() ??
          `Your DMs must be open for me to help you ${interaction.member.mention}`,
        flags: 64,
      });
    }
  }
});

bot.on("ready", () => {
  console.log(`${bot.user.username} is ready!`);
});

bot.connect();
