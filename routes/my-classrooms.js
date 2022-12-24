const express = require('express')
const router = express.Router()

const MyClassroomService = require('../app/service/MyClassroomService')
const MyClassroomController = require('../app/controller/MyClassroomController')

const myClassroomService = new MyClassroomService()
const myClassroomController = new MyClassroomController(myClassroomService)
const myClassroomValidator = require('../app/validator/MyClassroomValidator')

router.get('/', myClassroomController.getMyClass)
router.use(myClassroomValidator)
router.post('/', myClassroomController.saveClass)
router.delete('/:id', myClassroomController.deleteClass)

module.exports = router
