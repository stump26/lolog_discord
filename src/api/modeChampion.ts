import { RichEmbed, Attachment } from 'discord.js';
import mongoose from 'mongoose';

import { LOL_CLIENT_VERSION } from '../config';
import ChampionHintImgModel from '../mongo/ChampionHintImgModel';
import dynamicChamNamesModels, { ChampionNames } from '../mongo/ChampionNamesModel';

const chamNameKRtoEN = async (
  model: mongoose.Model<ChampionNames>,
  nameKR: String,
): Promise<String | undefined> => {
  await model.find({});
  const result = await model.findOne({ KR: nameKR }).exec();
  console.log('TCL: result', result);
  return result?.EN;
};

const addChamAlias = async (
  model: mongoose.Model<ChampionNames>,
  [chamNameKR, newAlias]: string[],
) => {
  try {
    const updateResult = await model.findOneAndUpdate(
      { KR: chamNameKR },
      { $push: { KR: newAlias } },
      { new: true },
    );
    console.log('TCL: updateResult', updateResult);

    const doneEmbed: RichEmbed = new RichEmbed({
      color: 0x0099ff,
      title: 'Configure done.',
      description: `${chamNameKR}:${updateResult?.KR.toString()}`,
    });
    return doneEmbed;
  } catch (e) {
    const errEmbed: RichEmbed = new RichEmbed({
      color: 0xff2020,
      title: 'Fail to save.',
      description: `${chamNameKR}!=${newAlias}`,
    });
    return errEmbed;
  }
};

const searchChampionHint = async (enChamName: String): Promise<Attachment[]> => {
  const hints = await ChampionHintImgModel.findOne({ name: enChamName }).exec();

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

const modeChampion = async (chamName: String, dicoUserID: String): Promise<RichEmbed> => {
  const errorEmbed: RichEmbed = new RichEmbed({
    color: 0xff2020,
    title: 'Wrong Champion Name !!!',
    description: '별명 설정법 : lc! set [챔피언 명]=[new별명]',
  });
  const nonSpaceName = chamName.replace(/\s/gi, '');
  const eachUsersModel = await dynamicChamNamesModels(dicoUserID);
  if (nonSpaceName.slice(0, 3) === 'set') {
    const assignmentCMD = nonSpaceName.slice(3).split('=');
    console.log('TCL: 대입식 에러;');
    // 대입식이 잘못된경우 에러.
    if (!assignmentCMD[1]) {
      return errorEmbed;
    }
    console.log('TCL: assignmentCMD', assignmentCMD);
    return await addChamAlias(eachUsersModel, assignmentCMD);
  }
  const enChamName = await chamNameKRtoEN(eachUsersModel, nonSpaceName);

  // Wrong Champion name
  if (!enChamName) {
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
