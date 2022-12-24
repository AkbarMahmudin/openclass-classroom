const { PrismaClient } = require('@prisma/client')
const ConflictError = require('../utils/exceptions/ConflictError')
const NotFoundError = require('../utils/exceptions/NotFoundError')
const AuthorizationError = require('../utils/exceptions/AuthorizationError')

class MyClassroomService {
  #prisma

  constructor () {
    this.#prisma = new PrismaClient()

    this.saveClass = this.saveClass.bind(this)
    this.getMyClass = this.getMyClass.bind(this)
    this.deleteClass = this.deleteClass.bind(this)
  }

  async saveClass (userId, classroomId) {
    const classIsExist = await this.#prisma.my_classrooms.findFirst({
      where: {
        userId, classroomId
      }
    })

    // Cek kelas sudah tersimpan
    if (classIsExist) {
      throw new ConflictError('Class is already exist in your classroom')
    }

    const classroom = await this.#prisma.classrooms.findFirst({ where: { id: classroomId } })
    // Cek ketika classroom yang dipilih tidak ada
    if (!classroom) {
      throw new NotFoundError('Classroom not found')
    }

    const savedMyClass = await this.#prisma.my_classrooms.create({
      data: {
        userId,
        classroomId
      }
    })

    return savedMyClass
  }

  async getMyClass (userId = null) {
    const filter = {
      select: {
        id: true,
        classrooms: {
          select: {
            id: true,
            name: true,
            level: true,
            category: true
          }
        }
      }
    }

    // Ketika user ID ada -> tampilkan myclass milik user
    if (userId) {
      filter.where = {
        userId: Number(userId)
      }
    }

    const myClasses = await this.#prisma.my_classrooms.findMany(filter)

    return myClasses
  }

  async deleteClass (userId, myClassId) {
    const myClass = await this.#prisma.my_classrooms.findFirst({
      where: {
        id: Number(myClassId)
      }
    })

    // Classroom tidak ada
    if (!myClass) {
      throw new NotFoundError('Classroom not found')
    }

    // Bukan oleh user berwenang
    if (myClass && userId !== myClass.userId) {
      throw new AuthorizationError('You don\'t have permission')
    }

    const myClassDeleted = await this.#prisma.my_classrooms.delete({
      where: {
        id: Number(myClassId)
      }
    })

    return myClassDeleted
  }
}

module.exports = MyClassroomService
