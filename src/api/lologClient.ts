import { RichEmbed, Message } from 'discord.js';

import getCham from './crawCampionDB';
import getSummonerInfo from './getSummoner';

const callUsageMsg = function(): RichEmbed {
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

const tierRead = function(tier: string, rank: string): string {
  if (tier === 'UNRANKED') {
    return 'default';
  }

  const lowerCaseTier = tier.toLowerCase();
  let arabicRank = '';

  switch (rank) {
    case 'I':
      arabicRank = '1';
      break;
    case 'II':
      arabicRank = '2';
      break;
    case 'III':
      arabicRank = '3';
      break;
    case 'IV':
      arabicRank = '4';
      break;
    case 'V':
      arabicRank = '5';
      break;
  }

  return `${lowerCaseTier}_${arabicRank}`;
};

const modeSummoner = async function(summonerName: string): Promise<RichEmbed> {
  // Call summoner's detail Info
  const summonerData = await getSummonerInfo(summonerName);
  // null : summoner name not exist.
  if (summonerData === null) {
    const failureEmbed: RichEmbed = new RichEmbed({
      color: 0xff2020,
      title: 'Summoner Not Founded !!!',
    });
    return failureEmbed;
  } else {
    console.log('TCL: lologClient -> summonerData', summonerData);

    const leagueTierEmblem = `https://opgg-static.akamaized.net/images/medals/${tierRead(
      summonerData.leagueStatus[0].tier,
      summonerData.leagueStatus[0].rank,
    )}.png`;
    const winRate =
      summonerData.leagueStatus[0].wins /
      (summonerData.leagueStatus[0].wins + summonerData.leagueStatus[0].losses);

    // Write discord embed message
    const resultEmbed: RichEmbed = new RichEmbed({
      color: 0x0099ff,
      author: {
        name: summonerData.name,
        icon_url: `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${summonerData.profileIconId}.jpg`,
      },
      title: summonerData.name,
      thumbnail: {
        url: leagueTierEmblem,
      },
      fields: [
        {
          name: '개인/2인 랭크',
          value: `${summonerData.leagueStatus[0].tier} ${summonerData.leagueStatus[0].rank}`,
          inline: true,
        },
        {
          name: '승/패',
          value: `${summonerData.leagueStatus[0].wins}/${
            summonerData.leagueStatus[0].losses
          }  (${Math.floor(winRate * 10000) / 100})`,
        },
        {
          name: 'points',
          value: `${summonerData.leagueStatus[0].leaguePoints}`,
          inline: true,
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
      ],
    });
    return resultEmbed;
  }
};
const lologClient = async (content: string, message: Message) => {
  console.log('TCL: content', content);

  const CMD = content.split('! ');

  switch (CMD[0]) {
    case 'ls':
      message.channel.sendEmbed(await modeSummoner(CMD[1]));
      break;
    case 'lc':
      break;
    default:
      message.channel.sendEmbed(callUsageMsg());
  }
};

export default lologClient;
