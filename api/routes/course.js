const { Router } = require('express')
const GTUResult = require('../../utils/gtuResult')

const router = Router()

router.post('/', async (req, res, next) => {
    try {
        const { examSession } = req.body
        const response = await GTUResult.getCourse(examSession)
        res.json(response)
    } catch (error) {
        console.log(error)
        res.status(503).json({ message: "Internal server error" })
    }
})

module.exports = router
