const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const morgan = require('morgan')

const apiRoute = require('./routes')

const app = express()

const PORT = process.env.PORT || 5000 

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan())

mongoose.connect('mongodb://localhost:27017/GTU', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true
})
   .then(() => console.log("Established connection to Database!"))
   .catch(() => console.log('Error while establishing connection to Database!'))


app.use('/api', apiRoute)

app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`)
})

module.exports = app
