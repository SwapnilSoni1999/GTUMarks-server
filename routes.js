const { Router } = require('express')

const resultRoute = require('./api/result')
const sessionsRoute = require('./api/sessions')
const courseRoute = require('./api/course')
const examRoute = require('./api/exam')
const testRoute = require('./api/test')

const router = Router()

router.use('/result', resultRoute)
router.use('/sessions', sessionsRoute)
router.use('/course', courseRoute)
router.use('/exam', examRoute)
router.use('/test', testRoute)

module.exports = router
