import { RichEmbed, Attachment, MessageEmbedImage } from 'discord.js';

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
  console.log('TCL: searchChampionHint -> hints', hints);
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
  console.log('TCL: HintImgs', HintImgs);

  const resultEmbed: RichEmbed = new RichEmbed({
    color: 0x0099ff,
    title: `${chamName} | ${enChamName}`,
  });
  resultEmbed.attachFiles(HintImgs);

  return resultEmbed;
};

export default modeChampion;
