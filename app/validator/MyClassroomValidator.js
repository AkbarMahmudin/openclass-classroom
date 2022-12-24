const Joi = require('joi')
const InvariantError = require('../utils/exceptions/InvariantError')

module.exports = (req, res, next) => {
  try {
    const opt = {
      userId: Joi.number().required(),
      classroomId: Joi.number().required()
    }
    if (req.method.toLowerCase() === 'delete') {
      delete opt.classroomId
    }
    const schema = Joi.object(opt)
    const validateResult = schema.validate(req.body)

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }

    next()
  } catch (err) {
    next(err)
  }
}
