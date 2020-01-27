import axios from 'axios';
import { Message } from 'discord.js';

import getCham from './crawCampionDB';
import getSummoner from './getSummoner';

const lologClient = async (content: string, message: Message) => {
  console.log('TCL: content', content);

  const CMD = content.split(' ');
  getSummoner(CMD[1]);
};

export default lologClient;
