const { Router } = require('express')
const GTUResult = require('../utils/gtuResult')

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const response = await GTUResult.getSession()
        res.encSend(response)
    } catch (error) {
        res.status(503).json({ message: "Internal server error" })
    }
})

module.exports = router
