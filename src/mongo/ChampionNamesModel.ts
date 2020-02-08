import mongoose, { Schema } from 'mongoose';
import chamNameJson from '../krChampion.json';

export interface ChampionNames extends mongoose.Document {
  EN: String;
  KR: [String];
}

let dynamicModels: any = {};
const dynamicChamNamesModels = (userID: String): mongoose.Model<ChampionNames> => {
  const ChampionNamesSchema: Schema<ChampionNames> = new Schema({
    EN: String,
    KR: [String],
  });

  if (!(`ChamNames_${userID}` in dynamicModels)) {
    dynamicModels[`ChamNames_${userID}`] = mongoose.model(
      `ChamNames_${userID}`,
      ChampionNamesSchema,
      `ChamNames_${userID}`,
    );
    dynamicModels[`ChamNames_${userID}`].insertMany(chamNameJson);
  }
  return dynamicModels[`ChamNames_${userID}`];
};

export default dynamicChamNamesModels;
