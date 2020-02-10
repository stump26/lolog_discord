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
        name: '소환사 정보 조회',
        value: 'ls! < Summoner Name > 소환사의 리그 정보를 불러옵니다.',
      },
      {
        name: '챔피언 정보 조회',
        value: 'lc! < Champion Name > 챔피언의 세부정보를 불러옵니다.',
      },
      {
        name: '챔피언 별명 설정',
        value: '별명 설정법 : lc! set [챔피언 명]=[new별명]',
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
