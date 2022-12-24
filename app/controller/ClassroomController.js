const UserService = require('../service/UserService')
const PostService = require('../service/PostService')

class ClassroomController {
  #service
  #userService = new UserService()
  #postService = new PostService()

  constructor (service) {
    this.#service = service

    this.createClassroom = this.createClassroom.bind(this)
    this.updateClassroom = this.updateClassroom.bind(this)
    this.deleteClassroom = this.deleteClassroom.bind(this)
    this.getClassroom = this.getClassroom.bind(this)
  }

  async createClassroom (req, res, next) {
    try {
      const { name, category, level, description, ownerId } = req.body

      // cek ownerId = apakah user adalah owner kelas?
      await this.#userService.getUser(ownerId)

      const newClassroom = await this.#service.createClassroom({
        name, category, level, description, ownerId
      })

      return res.json(201, {
        status: 'success',
        message: 'Classroom created successfully',
        data: {
          classroom: { id: newClassroom.id }
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async updateClassroom (req, res, next) {
    try {
      // cek ownerId
      await this.#userService.getUser(req.body.ownerId)

      const { id: classroomId } = req.params
      const { id: classroomUpdated } = await this.#service.updateClassroom(classroomId, req.body)

      return res.json(200, {
        status: 'success',
        message: 'Classroom updated successfully',
        data: {
          classroom: { id: classroomUpdated }
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteClassroom (req, res, next) {
    try {
      const { id: classroomId } = req.params
      await this.#service.deleteClassroom(classroomId, req.query.owner)

      return res.json(200, {
        status: 'success',
        message: 'Classroom deleted successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async getClassroom (req, res, next) {
    try {
      const { id: classroomId } = req.params
      let classroom = await this.#service.getClassroom(classroomId)

      // Cek owner classroom
      if (req.query.owner) {
        classroom = await this.#service.getClassroom(classroomId, req.query)
      }

      // Detail owner
      if (classroomId) {
        const { user: owner } = await this.#userService.getUser(classroom.ownerId)
        classroom.owner = owner
        delete classroom.ownerId

        // Detail syllabuses
        const { modules: syllabuses } = await this.#postService.getModule(classroom.syllabuses)
        classroom.syllabuses = classroom.syllabuses.length
          ? syllabuses
          : []
      } else {
        classroom = await Promise.all(classroom.map(async (cr) => {
          const { user: owner } = await this.#userService.getUser(cr.ownerId)
          cr.owner = owner
          delete cr.ownerId

          return cr
        }))
      }

      return res.json(200, {
        status: 'success',
        data: classroomId ? { classroom } : { classrooms: classroom }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ClassroomController
