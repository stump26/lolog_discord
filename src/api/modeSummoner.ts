import axios from 'axios';
import { RichEmbed } from 'discord.js';
import { LOLOG_BACKEND } from '../config';

type leagueEntryDTO = {
  leagueId: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  queueType: string;
  wins: number;
  losses: number;
};

export type SummonerInfo = {
  id: string;
  name: string;
  profileIconId: String;
  summonerLevel: number;
  leagueStatus: [leagueEntryDTO];
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

const getSummonerInfo = async (name: string) => {
  console.log('TCL: name', name);

  // Get enscripted summonor ID.
  const summonerDTOResult = await axios({
    url: LOLOG_BACKEND,
    method: 'post',
    data: {
      query: `
        query($summonerName:String!){
          getSummonerDTO(summonerName:$summonerName){
            id
            name
            summonerLevel
            accountId
            profileIconId
          }
        }
      `,
      variables: { summonerName: encodeURIComponent(name) },
    },
  });
  console.log('TCL: getSummonerInfo -> summonerDTOResult', summonerDTOResult);
  if (summonerDTOResult.data.data === null) {
    console.log(summonerDTOResult.data.errors);
    return null;
  } else {
    const summonerDTO = summonerDTOResult.data.data.getSummonerDTO;
    // console.log('TCL: summonerDTO', summonerDTO);

    // Get League Info
    const leagueEntryDTOResult = await axios({
      url: LOLOG_BACKEND,
      method: 'post',
      data: {
        query: `
        query($encryptedSummonerId:String!){
          getLeagueEntryDTO(encryptedSummonerId:$encryptedSummonerId){
            leagueId
            tier
            rank
            leaguePoints
            queueType
            wins
            losses
          }
        }
      `,
        variables: { encryptedSummonerId: summonerDTO.id },
      },
    });

    let summonerLeagueStatus: [leagueEntryDTO] = leagueEntryDTOResult.data.data.getLeagueEntryDTO;
    // unranked summoner returned []
    if (Object.keys(summonerLeagueStatus).length === 0) {
      summonerLeagueStatus = [
        {
          leagueId: '00000000-0000-0000-0000-000000000000',
          tier: 'UNRANKED',
          queueType: '',
          rank: '',
          leaguePoints: 0,
          wins: 0,
          losses: 0,
        },
      ];
    }

    const SummonerDataResult: SummonerInfo = {
      id: summonerDTO.id,
      name: summonerDTO.name,
      profileIconId: summonerDTO.profileIconId,
      summonerLevel: summonerDTO.summonerLevel,
      leagueStatus: summonerLeagueStatus,
    };

    return SummonerDataResult;
  }
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
          name: `${summonerData.leagueStatus[0].queueType}`,
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
      ],
      footer: {
        text: '자세한정보 Click  `Powered by Blitz.gg`',
      },
    });
    return resultEmbed;
  }
};

export default modeSummoner;
