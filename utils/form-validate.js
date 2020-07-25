const Joi = require('@hapi/joi'); // Validation
const urlPattern = /^[a-zA-Z0-9_-]{4,25}$/;

const signUpValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    profile_url: Joi.string()
      .regex(urlPattern, 'Profile URL must be only alphanumeric, - or _')
      .required(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};

const logInValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};

module.exports.signUpValidation = signUpValidation;
module.exports.logInValidation = logInValidation;
