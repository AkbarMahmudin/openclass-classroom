const express = require('express')
const router = express.Router()

const ClassroomService = require('../app/service/ClassroomService')
const ClassroomController = require('../app/controller/ClassroomController')

const classroomService = new ClassroomService()
const classroomController = new ClassroomController(classroomService)
const classroomValidator = require('../app/validator/ClassroomValidator')

router.get('/', classroomController.getClassroom)
router.get('/:id', classroomController.getClassroom)
router.post('/', classroomValidator.postValidator, classroomController.createClassroom)
router.put('/:id', classroomValidator.putValidator, classroomController.updateClassroom)
router.delete('/:id', classroomController.deleteClassroom)

module.exports = router
