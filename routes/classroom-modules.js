const express = require('express')
const router = express.Router()

const ClassroomModuleService = require('../app/service/ClassroomModuleService')
const ClassroomModuleController = require('../app/controller/ClassroomModuleController')

const classroomModuleService = new ClassroomModuleService()
const classroomModuleController = new ClassroomModuleController(classroomModuleService)
const classroomModuleValidator = require('../app/validator/ClassroomModuleValidator')

router.use(classroomModuleValidator)
router.post('/', classroomModuleController.addModuleToClassroom)
router.delete('/', classroomModuleController.removeModuleFromClassroom)

module.exports = router
