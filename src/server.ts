import Discord from 'discord.js';

import { BOT_TOKEN } from './config';
import lologClient from './api/lologClient';

console.log('Ping Pong to bot');
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
    case /^l!/.test(content):
      lologClient(content);
      message.channel.send('hello lolog');
      break;
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(BOT_TOKEN);
