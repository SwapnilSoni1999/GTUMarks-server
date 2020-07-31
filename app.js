const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const morgan = require('morgan')

const cipher = require('./utils/cipher')
const apiRoute = require('./routes')
const encryptedJSON = require('./middleware/encryptedJSON')

const app = express()

const PORT = process.env.PORT || 5000 

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan('dev'))
app.use(express.raw({ type: 'application/encrypted-json' }))
app.use(encryptedJSON)

mongoose.connect('mongodb://localhost:27017/GTU', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true
})
   .then(() => console.log("Established connection to Database!"))
   .catch(() => console.log('Error while establishing connection to Database!'))


app.use('/api', apiRoute)

// add encryption algo
app.response.encSend = async function(data) {
    const xKey = this.req.headers['x-key']
    if (!xKey) {
        return this.status(403).json({ message: "No key provided!" })
    }
    const aesKey = await cipher.RSAdecrypt(xKey)    
    const cipherData = await cipher.AESencrypt(JSON.stringify(data), aesKey)

    this.setHeader('Content-Type', 'application/encrypted-json')
    // application/encrypted-json
    this.send(cipherData)
}

app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`)
})

module.exports = app

//remove later
cipher.RSAencrypt('abcdefghijklmnop').then(xkey => console.log("X-Key", xkey ))
