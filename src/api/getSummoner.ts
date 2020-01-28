import axios from 'axios';

import { LOLOG_BACKEND } from '../config';

type leagueEntryDTO = {
  leagueId: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
};

export type SummonerInfo = {
  id: string;
  name: string;
  summonerLevel: number;
  leagueStatus: leagueEntryDTO;
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
          }
        }
      `,
      variables: { summonerName: encodeURIComponent(name) },
    },
  });
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
            wins
            losses
          }
        }
      `,
      variables: { encryptedSummonerId: summonerDTO.id },
    },
  });

  let summonerLeagueStatus: leagueEntryDTO = leagueEntryDTOResult.data.data.getLeagueEntryDTO;
  // unranked summoner returned []
  if (Object.keys(summonerLeagueStatus).length === 0) {
    summonerLeagueStatus = {
      leagueId: '00000000-0000-0000-0000-000000000000',
      tier: 'UNRANKED',
      rank: '',
      leaguePoints: 0,
      wins: 0,
      losses: 0,
    };
  }

  // //Get match info
  // const matchlistDTOResult = await axios({
  //   url: LOLOG_BACKEND,
  //   method: 'post',
  //   data: {
  //     query: `
  //       query($encryptedAccountId:String!, $from: Int, $to: Int){
  //         getMatchlistDTO(encryptedAccountId:$encryptedAccountId, from:$from, to:$to){
  //           matches{
  //             platformId
  //             gameId
  //             queue
  //             timestamp
  //             role
  //           }
  //           totalGames
  //           startIndex
  //           endIndex
  //         }
  //       }
  //     `,
  //     variables: { encryptedAccountId: summonerDTO.accountId, from: 1, to: 20 },
  //   },
  // });
  // console.log('TCL: matchlistDTOResult', matchlistDTOResult.data.data.getMatchlistDTO);

  const SummonerDataResult: SummonerInfo = {
    id: summonerDTO.id,
    name: summonerDTO.name,
    summonerLevel: summonerDTO.summonerLevel,
    leagueStatus: {
      ...summonerLeagueStatus,
    },
    // matchlistDTOResult:{
    //   ...matchlistDTOResult
    // }
  };

  return SummonerDataResult;
};

export default getSummonerInfo;
