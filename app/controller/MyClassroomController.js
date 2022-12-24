const UserService = require('../service/UserService')

class MyClassroomController {
  #service
  #userService = new UserService()

  constructor (service) {
    this.#service = service

    this.saveClass = this.saveClass.bind(this)
    this.getMyClass = this.getMyClass.bind(this)
    this.deleteClass = this.deleteClass.bind(this)
  }

  async saveClass (req, res, next) {
    try {
      const { userId, classroomId } = req.body
      // Cek user ID ke service user
      await this.#userService.getUser(userId)
      const myClass = await this.#service.saveClass(userId, classroomId)

      return res.json(201, {
        status: 'success',
        message: 'New classroom saved',
        data: {
          myClass: {
            id: myClass.id
          }
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async getMyClass (req, res, next) {
    const { userId } = req.body
    const myClasses = await this.#service.getMyClass(userId)

    return res.json({
      status: 'success',
      data: {
        myClasses
      }
    })
  }

  async deleteClass (req, res, next) {
    try {
      const { id: myClassId } = req.params
      const { userId } = req.body
      await this.#service.deleteClass(userId, myClassId)

      return res.json({
        status: 'success',
        message: 'Your classroom deleted successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = MyClassroomController
