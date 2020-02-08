import { RichEmbed, Message } from 'discord.js';

import modeSummoner from './modeSummoner';
import modeChampion from './modeChampion';

export const callUsageMsg = function(): RichEmbed {
  const usageMsg = '! Wrong values !';

  const usageEmbed: RichEmbed = new RichEmbed({
    color: 0xe0f05f,
    title: 'Usages',
    description: usageMsg,
    fields: [
      {
        name: 'ls! < Summoner Name >',
        value: '소환사의 리그 정보를 불러옵니다.',
      },
      {
        name: 'lc! < Champion Name >',
        value: '챔피언의 세부정보를 불러옵니다.',
      },
    ],
  });

  return usageEmbed;
};

const lologClient = async (content: string, message: Message) => {
  const CMD = content.split('! ');

  switch (CMD[0]) {
    case 'ls':
      message.channel.sendEmbed(await modeSummoner(CMD[1]));
      break;
    case 'lc':
      message.channel.sendEmbed(await modeChampion(CMD[1], message.member.user.id));
      break;
    default:
      message.channel.sendEmbed(callUsageMsg());
  }
};

export default lologClient;
