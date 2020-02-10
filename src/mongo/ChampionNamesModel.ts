import mongoose, { Schema } from 'mongoose';
import chamNameJson from '../krChampion.json';

export interface ChampionNames extends mongoose.Document {
  EN: String;
  KR: [String];
}

const ChampionNamesSchema: Schema<ChampionNames> = new Schema({
  EN: String,
  KR: [String],
});

// initializing each users' model
let dynamicModels: any = {};
mongoose.connection.on('connected', () => {
  mongoose.connection.db.listCollections().toArray(function(err, collections) {
    collections.map(collection => {
      if (/^ChamNames_\d*/gi.test(collection.name)) {
        dynamicModels[collection.name] = mongoose.model(
          collection.name,
          ChampionNamesSchema,
          collection.name,
        );
      }
    });
  });
});

const dynamicChamNamesModels = (userID: String): Promise<mongoose.Model<ChampionNames>> => {
  return new Promise(function(resolve, reject) {
    if (!Object.keys(dynamicModels).includes(`ChamNames_${userID}`)) {
      dynamicModels[`ChamNames_${userID}`] = mongoose.model(
        `ChamNames_${userID}`,
        ChampionNamesSchema,
        `ChamNames_${userID}`,
      );
      dynamicModels[`ChamNames_${userID}`].insertMany(chamNameJson).then(() => {
        resolve(dynamicModels[`ChamNames_${userID}`]);
      });
    }
    resolve(dynamicModels[`ChamNames_${userID}`]);
  });
};

export default dynamicChamNamesModels;
