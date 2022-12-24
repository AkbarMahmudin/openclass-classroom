const Joi = require('joi')
const InvariantError = require('../utils/exceptions/InvariantError')

module.exports = (req, res, next) => {
  try {
    const schema = Joi.object({
      classroomId: Joi.number().required(),
      moduleId: Joi.array().items(Joi.string()).min(1).required()
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
