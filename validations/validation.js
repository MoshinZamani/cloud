const joi = require("joi");

const signUpValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(5).max(10),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};

const signInValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(5).max(10),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};

const postsValidation = (data) => {
  const schemaValidation = joi.object({
    title: joi.string().required().min(5).max(124),
    topic: joi.string().valid("politics", "health", "sport", "tech").required(),
    timeStamp: joi.string().required(),
    message: joi.string().required().min(15).max(248),
    ownerId: joi.string().required(),
    expiry: joi.string().required(),
    live: joi.boolean().required(),
  });
  return schemaValidation.validate(data);
};

module.exports.signUpValidation = signUpValidation;
module.exports.signInValidation = signInValidation;
module.exports.postsValidation = postsValidation;
