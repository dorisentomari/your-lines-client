import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { formatTime, randomString } from '../../helpers/utils';
import { COMMON_FIELDS } from './baseInfo';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const SAFE_WORK_FACTOR = 5;

const UserSchema = new Schema({
  username: { type: String, default: randomString() },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: false },
  avatarUrl: { type: String, required: false },
  phone: { type: String, required: false },
  isActivated: { type: Boolean, default: false, select: false },
  // user 的角色有两种，一种是用户，一种是管理
  // auth 为 1， 表示是普通客户端的用户，所有客户端的权限都一样
  // auth 为 2， 表示是管理端操作人员
  // auth 为 3， 表示是管理端的管理员
  auth: { type: Number, default: 1 },
  _creatorId: { type: ObjectId, ref: 'user', required: false },
  ...COMMON_FIELDS
});

UserSchema.pre('save', function(next) {
  let user = this;
  user.updateTime = new Date();
  if (user.isNew) {
    user.createTime = user.updateTime = Date.now();
  } else {
    user.updateTime = Date.now();
  }
  if (user.isNew || user.isModified('password')) {
    bcrypt.genSalt(SAFE_WORK_FACTOR, (error, salt) => {
      if (error) {
        return next();
      }
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) {
          return next();
        }
        user.password = hash;
        return next();
      });
    });
  }
});

UserSchema.set('toObject', { getters: true, virtuals: true });
UserSchema.set('toJSON', { getters: true, virtuals: true });

UserSchema.methods.toJSON = function() {
  let result = this.toObject();
  result.createTime = formatTime(result.createTime);
  result.updateTime = formatTime(result.updateTime);
  result.id = result._id;
  delete result._id;
  delete result.password;
  delete result.__v;
  return result;
};

UserSchema.methods.comparePassword = function(candidatePassword, password, callback) {
  bcrypt.compare(candidatePassword, password, (error, isMatch) => {
    if (error) {
      return callback(error);
    }
    callback(null, isMatch);
  });
};

let UserModel = mongoose.model('user', UserSchema);

export default UserModel;
