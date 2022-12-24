const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const classroomsRouter = require('./routes/classrooms')
const classroomModulesRouter = require('./routes/classroom-modules')
const myClassroomsRouter = require('./routes/my-classrooms')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/classrooms', classroomsRouter)
app.use('/syllabuses', classroomModulesRouter)
app.use('/my-classrooms', myClassroomsRouter)

app.use((err, req, res, next) => {
  const { statusCode = 500, status = 'fail', message } = err

  return res.json(statusCode, {
    status, message
  })
})

module.exports = app
