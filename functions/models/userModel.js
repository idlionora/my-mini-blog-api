const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  photo: { type: String, default: "default.jpg" },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: [8, "Please provide a password longer than 7 characters."],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (el) {
        // only works on CREATE and SAVE!!!
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.hasCorrectPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasChangedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
