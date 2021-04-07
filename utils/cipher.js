const crypto = require('crypto')
const fs = require('fs')

const publicKey = fs.readFileSync('RSA_public.key', { encoding: 'utf8' })
const privateKey = fs.readFileSync('RSA_private.key', { encoding: 'utf8' })
console.log("RSA keys loaded!")

const AESiv = new Buffer.alloc(16)
console.log("iv", AESiv)

exports.RSAencrypt = (data) => {
    const buffer = Buffer.from(data)
    const encrypted = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer)
    return encrypted.toString('base64')
}

exports.RSAdecrypt = (data) => {
    try {
        const buffer = Buffer.from(data, "base64")
        const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer)
        return decrypted.toString('utf8')
    } catch (err) {
        console.log('util error')
    }
}

exports.AESencrypt = (data, key) => {
   try {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, AESiv)
    const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final()
    ])
    return encrypted.toString('base64')
   } catch (err) {
	console.log('aes cipher error')
   }
}

exports.AESdecrypt = (data, key) => {
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, AESiv)
    const decrypted = Buffer.concat([ 
        decipher.update(data, 'base64'),
        decipher.final()
    ])
    return decrypted.toString('utf8')
  } catch (err) {
    console.log('aes error')
  }
}
