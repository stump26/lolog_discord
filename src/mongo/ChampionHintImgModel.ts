import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface championHintImg extends mongoose.Document {
  name: String;
  runeHint: Buffer;
  itemAndSpellHint: Buffer;
}

const championHintImgSchema = new Schema({
  name: String,
  runeHint: Buffer,
  itemAndSpellHint: Buffer,
});

export default mongoose.model<championHintImg>('ChampionHintImg', championHintImgSchema);
