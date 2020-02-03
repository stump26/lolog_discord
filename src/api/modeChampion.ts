import { RichEmbed, Attachment, MessageEmbedImage } from 'discord.js';

import { LOL_CLIENT_VERSION } from '../config';
import ChampionHintImgModel from '../mongo/ChampionHintImgModel';
import chamNameJson from './krChampion.json';

const chamNameKRtoEN = (nameKR: string): string | undefined => {
  const result = chamNameJson.find(cham => {
    return cham.KR.includes(nameKR);
  });
  return result?.EN;
};

const searchChampionHint = async (enChamName: string): Promise<Attachment[]> => {
  const hints = await ChampionHintImgModel.findOne({ name: enChamName }).exec();
  // console.log('TCL: hints', hints);
  if (!hints) {
    throw new Error('DB find Error');
  }
  const runeHintImgBuffer = hints?.runeHint;
  const itemAndSpellHintImgBuffer = hints?.itemAndSpellHint;

  const resultImg = [];
  resultImg.push(new Attachment(runeHintImgBuffer, 'runeHint.jpg'));
  resultImg.push(new Attachment(itemAndSpellHintImgBuffer, 'itemAndSpellHint.jpg'));

  return resultImg;
};

const modeChampion = async (chamName: string): Promise<RichEmbed> => {
  const nonSpaceName = chamName.replace(/\s/gi, '');
  const enChamName = chamNameKRtoEN(nonSpaceName);

  // Wrong Champion name
  if (!enChamName) {
    const errorEmbed: RichEmbed = new RichEmbed({
      color: 0xff2020,
      title: 'Wrong Champion Name !!!',
    });
    return errorEmbed;
  }

  const HintImgs = await searchChampionHint(enChamName);

  const resultEmbed: RichEmbed = new RichEmbed({
    color: 0x0099ff,
    title: `${chamName} | ${enChamName}`,
    thumbnail: {
      url: `http://ddragon.leagueoflegends.com/cdn/${LOL_CLIENT_VERSION}/img/champion/${enChamName}.png`,
    },
    url: `https://blitz.gg/lol/champions/${enChamName}`,
    footer: {
      text: '자세한정보 Click  `Powered by Blitz.gg`',
    },
  });
  resultEmbed.attachFiles(HintImgs);

  return resultEmbed;
};

export default modeChampion;
