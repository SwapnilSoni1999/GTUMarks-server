const { Router } = require('express')

const GTUResult = require('../utils/gtuResult')
const Result = require('../models/result')

const router = Router()

router.post('/', async (req, res, next) => {
    try {
        const { enrollment, examId } = req.body

        const response = await Result.findOne({ enrollment: enrollment, examId: examId })
        const enrRegex = new RegExp(/^\d+$/g)
        if (!enrRegex.test(enrollment)) {
            return res.status(403).json({ message: "Invalid enrollment number!" })
        }

        if (response) {
            return res.encSend(response)
        } else {
            const result = await GTUResult.fromEnrollment(enrollment, examId)
            if ('message' in result) {
                return res.status(404).json({ message: result.message })
            }
            if (result) {
                await Result.create(result)
                return res.encSend(result)
            } else {
                throw new Error(`Gtu server error`)
            }
        }
    } catch (err) {
        console.log(err)
        res.status(503).json({ message: "Internal server error!" })
    }
})

module.exports = router
