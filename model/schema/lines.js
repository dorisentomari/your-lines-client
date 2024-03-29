import mongoose from 'mongoose';
import { COMMON_FIELDS } from './baseInfo';
import {
  searchFormalIdList,
  searchAreaIdList,
  searchLanguageIdList,
  searchLanguageMap,
  searchAreaMap
} from '../../config/constant';
import { changeMongoIDToStr } from '../../helpers/utils';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LinesSchema = new Schema({
  _uploaderId: { type: ObjectId, ref: 'user', required: true },
  originName: { type: String, required: false },
  nameCn: { type: String, required: false },
  formalId: { type: String, required: true, enum: searchFormalIdList },
  areaId: { type: String, required: true, enum: searchAreaIdList },
  linesLangId: { type: String, required: false, enum: searchLanguageIdList },
  linesText: { type: String, required: false },
  transLangId: { type: String, required: false, enum: searchLanguageIdList },
  transText: { type: String, required: false },
  imageIdList: [{ type: String, default: '' }],
  ...COMMON_FIELDS
});

LinesSchema.set('toObject', { getters: true, virtuals: true });
LinesSchema.set('toJSON', { getters: true, virtuals: true });

LinesSchema.virtual('areaCn').get(function () {
  return searchAreaMap[this.areaId];
});

LinesSchema.virtual('linesLangCn').get(function () {
  return searchLanguageMap[this.linesLangId];
});

LinesSchema.virtual('transLangCn').get(function () {
  return searchLanguageMap[this.transLangId];
});

LinesSchema.virtual('uploaderId').get(function () {
  return changeMongoIDToStr(this._uploaderId);
});

let LinesModel = mongoose.model('lines', LinesSchema);

export default LinesModel;
