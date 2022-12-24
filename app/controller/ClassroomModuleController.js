const PostService = require('../service/PostService')

class ClassroomModuleController {
  #service
  #postService = new PostService()

  constructor (service) {
    this.#service = service

    this.addModuleToClassroom = this.addModuleToClassroom.bind(this)
    this.removeModuleFromClassroom = this.removeModuleFromClassroom.bind(this)
  }

  async addModuleToClassroom (req, res, next) {
    try {
      const { classroomId, moduleId } = req.body
      let { modules } = await this.#postService.getModule(moduleId)
      modules = modules.map((module) => module.id)
      await this.#service.addModuleToClassroom(classroomId, modules)

      return res.json(201, {
        status: 'success',
        message: 'Add module successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  async removeModuleFromClassroom (req, res, next) {
    try {
      const { classroomId, moduleId } = req.body
      let { modules } = await this.#postService.getModule(moduleId)
      modules = modules.map((module) => module.id)
      await this.#service.removeModuleFromClassroom(classroomId, modules)

      return res.json(200, {
        status: 'success',
        message: 'Removed module successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ClassroomModuleController
