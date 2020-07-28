const cipher = require('../utils/cipher')

const decryptMiddleware = async (req, res, next) => {
    if (req.headers['content-type'] === 'application/encrypted-json') {
        console.log("decrypting data")
        const payload = req.body.toString().trim()
        const xKey = req.headers['x-key']
        if (!xKey) {
            return res.status(403).json({ message: "No key provided!" })
        }
        const aesKey = await cipher.RSAdecrypt(xKey)
        const jsonData = await cipher.AESdecrypt(payload, aesKey)
    
        // verify signature: left
        req.body = JSON.parse(jsonData)
        next()
    } else {
        next()
    }
}

module.exports = decryptMiddleware
