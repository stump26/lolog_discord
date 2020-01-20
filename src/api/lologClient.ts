import axios from 'axios';
import { LOLOG_BACKEND } from '../config';

const lologClient = async (content: string) => {
  console.log('TCL: content', content);
  const result = await axios({
    url: LOLOG_BACKEND,
    method: 'post',
    data: {
      query: `
        query($summonerName:String!){
          getSummonerDTO(summonerName:$summonerName){
            id
            name
            puuid
            summonerLevel
          }
        }
      `,
      variables: { summonerName: '%EA%B7%B8%EB%A3%A8%ED%84%B0%EA%B8%94' },
    },
  });
  console.log('TCL: lologClient -> result', result);
};

export default lologClient;
