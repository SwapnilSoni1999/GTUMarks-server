const cipher = require('../utils/cipher')

const decryptMiddleware = async (req, res, next) => {
    if (req.headers['content-type'] === 'application/encrypted-json') {
        try {
            const payload = req.body.toString().trim()
            const xKey = req.headers['x-key']
            if (!xKey) {
                return res.status(403).json({ message: "No key provided!" })
            }
            const aesKey = cipher.RSAdecrypt(xKey)
            const jsonData = cipher.AESdecrypt(payload, aesKey)
        
            // verify signature: left
            req.body = JSON.parse(jsonData)
            return next()
        } catch (err) {
            return res.status(401).json({ message: "Access denied!", reason: "Invalid key!" })
        }
    } else {
        return next()
    }
}

module.exports = decryptMiddleware
