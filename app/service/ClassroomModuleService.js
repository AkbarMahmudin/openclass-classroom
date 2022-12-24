const { PrismaClient } = require('@prisma/client')
const NotFoundError = require('../utils/exceptions/NotFoundError')
const ConflictError = require('../utils/exceptions/ConflictError')

class ClassroomModuleService {
  #prisma

  constructor () {
    this.#prisma = new PrismaClient()

    this.addModuleToClassroom = this.addModuleToClassroom.bind(this)
    this.removeModuleFromClassroom = this.removeModuleFromClassroom.bind(this)
  }

  async addModuleToClassroom (classroomId, moduleId) {
    // Cek classroom
    const classroom = await this.#prisma.classrooms.findUnique({ where: { id: classroomId } })
    if (!classroom) {
      throw new NotFoundError('Classroom not found')
    }

    const moduleExist = await this.#prisma.classroom_modules.findMany({
      where: {
        AND: {
          classroomId,
          moduleId: { in: moduleId }
        }
      }
    })

    // Module sudah ada di dalam silabus. *: agar tidak ada duplikasi modul dalam 1 kelas
    if (moduleExist.length > 0) {
      throw new ConflictError('Module is already exist in syllabuses')
    }

    const payload = moduleId.map((id) => ({
      classroomId,
      moduleId: id
    }))

    const newClassroomModule = await this.#prisma.classroom_modules.createMany({
      data: payload
    })

    return newClassroomModule
  }

  async removeModuleFromClassroom (classroomId, moduleId) {
    // Cek classroom
    const classroom = await this.#prisma.classrooms.findFirst({
      where: { id: Number(classroomId) }
    })
    if (!classroom) {
      throw new NotFoundError('Classroom not found')
    }

    const moduleExist = await this.#prisma.classroom_modules.findMany({
      where: {
        AND: {
          classroomId,
          moduleId: { in: moduleId }
        }
      }
    })

    // Module tidak ditemukan di dalam silabus
    if (!moduleExist.length) {
      throw new NotFoundError('Module in syllabuses doesn\'t exist')
    }

    const classroomModuleRemoved = await this.#prisma.classroom_modules.deleteMany({
      where: {
        AND: {
          classroomId,
          moduleId: {
            in: moduleId
          }
        }
      }
    })

    return classroomModuleRemoved
  }
}

module.exports = ClassroomModuleService
