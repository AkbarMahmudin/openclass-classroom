const { PrismaClient } = require('@prisma/client')
const NotFoundError = require('../utils/exceptions/NotFoundError')
const AuthorizationError = require('../utils/exceptions/AuthorizationError')

class ClassroomService {
  #prisma

  constructor () {
    this.#prisma = new PrismaClient()

    this.createClassroom = this.createClassroom.bind(this)
    this.updateClassroom = this.updateClassroom.bind(this)
    this.deleteClassroom = this.deleteClassroom.bind(this)
    this.getClassroom = this.getClassroom.bind(this)
  }

  async createClassroom (payload) {
    const newClassroom = await this.#prisma.classrooms.create({
      data: {
        ...payload
      }
    })

    return newClassroom
  }

  async updateClassroom (classroomId, payload) {
    const classroom = await this.#prisma.classrooms.findUnique({
      where: { id: Number(classroomId) }
    })

    if (!classroom) {
      throw new NotFoundError('Classroom not found')
    }

    if (payload.ownerId !== classroom.ownerId) {
      throw new AuthorizationError('You don\'t have permission')
    }

    const classroomUpdated = await this.#prisma.classrooms.update({
      where: { id: Number(classroomId) },
      data: payload
    })

    return classroomUpdated
  }

  async deleteClassroom (classroomId, ownerId) {
    // Delete syllabus (classroom_modules)
    await this.#prisma.classroom_modules.deleteMany({
      where: { classroomId: Number(classroomId) }
    })

    const classroom = await this.#prisma.classrooms.findFirst({
      where: {
        id: Number(classroomId)
      }
    })

    if (!classroom) {
      throw new NotFoundError('Classroom not found')
    }

    if (classroom.ownerId !== Number(ownerId) || !ownerId) {
      throw new AuthorizationError('You don\'t have permission')
    }

    const classroomDeleted = await this.#prisma.classrooms.delete({
      where: { id: Number(classroomId) }
    })

    return classroomDeleted
  }

  async getClassroom (classroomId = null, query) {
    let filter

    // Cek query string
    if (query) {
      const { owner } = query
      filter = {
        where: {
          ownerId: Number(owner)
        }
      }
    }

    // Get One OR Many
    let classroom = await this.#prisma.classrooms.findMany(filter || null) // Get Many

    if (classroomId) { // Get One
      classroom = await this.#prisma.classrooms.findUnique({
        where: { id: Number(classroomId) },
        include: {
          classroom_modules: {
            where: {
              classroomId: Number(classroomId)
            },
            select: { moduleId: true }
          }
        }
      })

      if (!classroom) {
        throw new NotFoundError('Classroom not found')
      }
      // Ubah nama property
      classroom.syllabuses = classroom.classroom_modules.map((cr) => cr.moduleId)
      delete classroom.classroom_modules
    }

    return classroom
  }
}

module.exports = ClassroomService
