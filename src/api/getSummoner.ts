import axios, { AxiosRequestConfig } from 'axios';

import { LOLOG_BACKEND } from '../config';

export default async (name: string) => {
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
  console.log('TCL: summonerDTO', summonerDTO);

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

  const summonerLeagueStatus = leagueEntryDTOResult.data.data.getLeagueEntryDTO;
  console.log('TCL: summonerLeagueStatus', summonerLeagueStatus);

  //Get match info
  const matchlistDTOResult = await axios({
    url: LOLOG_BACKEND,
    method: 'post',
    data: {
      query: `
        query($encryptedAccountId:String!, $from: Int, $to: Int){
          getMatchlistDTO(encryptedAccountId:$encryptedAccountId, from:$from, to:$to){
            matches{
              platformId
              gameId
              queue
              timestamp
              role
            }
            totalGames
            startIndex
            endIndex
          }
        }
      `,
      variables: { encryptedAccountId: summonerDTO.accountId, from: 1, to: 20 },
    },
  });
  console.log('TCL: matchlistDTOResult', matchlistDTOResult.data.data.getMatchlistDTO);
};
