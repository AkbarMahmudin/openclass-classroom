const Joi = require('joi')
const InvariantError = require('../utils/exceptions/InvariantError')

const postValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      category: Joi.string().required(),
      level: Joi.string().valid('Pemula', 'Menengah', 'Mahir').required(),
      description: Joi.string().required(),
      ownerId: Joi.number().required()
    })
    const validateResult = schema.validate(req.body)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

const putValidator = (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      category: Joi.string(),
      level: Joi.string().valid('Pemula', 'Menengah', 'Mahir'),
      description: Joi.string(),
      ownerId: Joi.number().required()
    })
    const validateResult = schema.validate(req.body)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  postValidator, putValidator
}
