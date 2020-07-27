const { Router } = require('express')

const GTUResult = require('../utils/gtuResult')
const Result = require('../models/result')

const router = Router()

router.post('/', async (req, res, next) => {
    try {
        const { enrollment, examId } = req.body

        const response = await Result.findOne({ enrollment: enrollment, examId: examId })

        if (response) {
            return res.json(response)
        } else {
            const result = await GTUResult.fromEnrollment(enrollment, examId)
            const added = await Result.create(result)
            return res.json(result)
        }
    } catch (err) {
        console.log(err)
        res.status(503).json({ message: "Internal server error!" })
    }
})

module.exports = router
