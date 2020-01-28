import axios from 'axios';
import { RichEmbed, Message } from 'discord.js';

import getCham from './crawCampionDB';
import getSummonerInfo from './getSummoner';

const lologClient = async (content: string, message: Message) => {
  console.log('TCL: content', content);

  const CMD = content.split(' ');
  const summonerData = await getSummonerInfo(CMD[1]);
  console.log('TCL: lologClient -> summonerData', summonerData);

  // Write discord embed message
  const resultEmbed: RichEmbed = new RichEmbed({
    color: 0x0099ff,
    author: {
      name: summonerData.name,
    },
    title: summonerData.name,
    fields: [
      {
        name: 'Regular field title',
        value: 'Some value here',
      },
      {
        name: '\u200b',
        value: '\u200b',
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true,
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true,
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true,
      },
    ],
  });

  message.channel.sendEmbed(resultEmbed);
};

export default lologClient;
