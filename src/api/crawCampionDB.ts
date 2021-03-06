import axios, { AxiosRequestConfig } from 'axios';

import { LOL_CLIENT_VERSION } from '../config';
const lolStaticCDN = 'http://ddragon.leagueoflegends.com/cdn';

export default async () => {
  const axiosConfig: AxiosRequestConfig = {
    method: 'get',
    url: `${lolStaticCDN}/${LOL_CLIENT_VERSION}/data/ko_KR/champion.json`,
  };

  const { data } = await axios(axiosConfig);
  return data;
};
