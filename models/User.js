import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  identities: [
    {
      provider_type: {
        type: String,
        enum: ['google', 'facebook', 'local'],
      },
      data: Object,
    },
  ],
});

export const User = mongoose.model('User', UserSchema);
