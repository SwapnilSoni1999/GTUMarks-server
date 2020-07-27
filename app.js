const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')

const resultRoute = require('./api/result')
const sessionsRoute = require('./api/sessions')
const courseRoute = require('./api/course')
const examRoute = require('./api/exam')

const app = express()

const PORT = process.env.PORT || 5000 

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(mongoSanitize())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/GTU', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true
})
   .then(() => console.log("Established connection to Database!"))
   .catch(() => console.log('Error while establishing connection to Database!'))


app.use('/result', resultRoute)
app.use('/sessions', sessionsRoute)
app.use('/course', courseRoute)
app.use('/exam', examRoute)

module.exports = app

app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`)
})