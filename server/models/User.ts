import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Clerk user ID
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  resume: {
    type: String, // URL or base64 string
  },
  image: {
    type: String, // URL
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
