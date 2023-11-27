const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const followSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Username cannot be blank'],
      maxLength: [36, 'Username cannot exceed 36 characters'],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, 'Email already in use'],
      required: [true, 'Email cannot be blank'],
      maxlength: [254, 'Email cannot exceed 254 characters'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      url: String,
      filename: String,
    },
    following: [followSchema],
    password: {
      type: String,
      required: [true, 'Password cannot be blank'],
      minlength: [6, 'Password must be a minimum of 6 characters'],
      select: false,
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        'Password must be a minimum of 6 characters, at least one letter, and one number',
      ],
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    slug: String,
  },
  {
    timestamps: true,
  }
);

// Create slug from User name
userSchema.pre('save', async function (next) {
  if (!this.isModified('name')) next();
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Hash passwords
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
