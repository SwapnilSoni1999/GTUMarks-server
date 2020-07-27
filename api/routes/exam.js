const { Router } = require('express')
const GTUResult = require('../../utils/gtuResult')

const router = Router()

router.post('/', async (req, res, next) => {
    try {
        const { examSession, examType } = req.body
        const response = await GTUResult.getExam(examSession, examType)
        res.json(response)
    } catch (err) {
        console.log(err)
        res.status(503).json({ message: "Internal server error" })
    }
})

module.exports = router