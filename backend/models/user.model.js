import mongoose, {Schema} from  "mongoose"

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
