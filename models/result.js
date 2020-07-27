const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Subjects = new Schema({
    sub: { type: String },
    subGR: { type: String },
    subNA: { type: String },
    subGRE: { type: String },
    subGRM: { type: String },
    subGRTH: { type: String },
    subGRV: { type: String },
    subGRI: { type: String },
    subGRPR: { type: String }
}, { _id: false })

const ResultSchema = new Schema({
    exType: { type: String, required: true },
    enrollment: { type: String, required: true, unique: true },
    DECLARATIONDATE: { type: Date, required: true },
    sem: { type: Number, required: true },
    name: { type: String, require: true },
    CourseName: { type: String, required: true },
    ExamNumber: { type: String, required: true, unique: true }, // examId
    BR_CODE: { type: Number },
    TOTBACKL: { type: Number },
    CURBACKL: { type: Number },
    SPI: { type: Number, min: 0, max: 10, required: true },
    CPI: { type: Number, min: 0, max: 10, required: true },
    CGPA: { type: Number, min: 0, max: 10, required: true },
    TRIAL: { type: Number },
    RESULT: {
        type: String, required: true, validate: {
            validator: (v) => {
                if (v == 'PASS' || v == 'FAIL') {
                    return true
                } else {
                    return false
                }
            },
            message: props => `${props.value} is not a valid RESULT type.`
        }
    },
    IsREcheck: { type: String }, // fix later
    IsReass: { type: String }, // fix later
    RTI: { type: String }, // fix later
    subjects: { type: [Subjects], required: true }
}, { timestamps: true })

module.exports = mongoose.model('Result', ResultSchema, 'result')
