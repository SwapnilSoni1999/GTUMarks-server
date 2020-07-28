const { Router } = require('express')
const router = Router()

router.post('/', async (req, res, next) => {
    res.json(req.body)
})

module.exports = router
