import Discord from 'discord.js';
import mongoose from 'mongoose';

import lologClient, { callUsageMsg } from './api/lologClient';
import { BOT_TOKEN, MONGO_URL, DATABASE_NAME } from './config';

console.log('TCL: (`${MONGO_URL}/${DATABASE_NAME}`', `mongodb://${MONGO_URL}/${DATABASE_NAME}`);
// mongodb Configure
mongoose.connect(`mongodb://${MONGO_URL}/${DATABASE_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
mongoose.connection.once('open', () => {
  console.log('✅MongoDB Connected');
});

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // Check the cmd
  const { content } = message;
  switch (true) {
    case content === 'ping':
      message.channel.send('Pong! `' + Math.floor(client.ping) + ' ms`');
      break;
    case content === 'lolog':
      message.channel.sendEmbed(callUsageMsg());
      break;
    case /^l[a-z]?\!/.test(content):
      lologClient(content, message);
      break;
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(BOT_TOKEN);
