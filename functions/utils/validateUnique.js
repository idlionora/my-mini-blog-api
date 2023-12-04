const User = require("../models/userModel");

const validateUnique = async (category, input) => {
  const userWithReqEmail = await User.findOne({ [category]: input });
  return !userWithReqEmail;
};

module.exports = validateUnique;
