const axios = require('axios').default
const qs = require('querystring')

const hostUrl = "http://ws-gtur.gtu.ac.in/fetchapps/fetchApplications"
const defaultHeaders = {
    'Password': 'convo@2013',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'ws-gtur.gtu.ac.in',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip',
    'User-Agent': 'okhttp/2.7.2',
}
class GTUResult {
    constructor() {}

    static async _generateDeviceId() {
        const lower = "abcdefghijklmnopqrstuvwxyz"
        const upper = lower.toUpperCase()
        const digits = "1234567890"
        const chars = lower + upper + digits
        let result = ''
        for (let i = 0; i < 16; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    static async _subResult(enrollment, examId, subjectCode) {
        const payload = {
            'ReqOperation': 'ViewSubjectGrade',
            'ExamID': String(examId),
            'EnrNo': String(enrollment),
            'SubjectCode': String(subjectCode),
            'IsCurrent': '0'
        }
        const res = await axios({
            method: 'POST',
            url: hostUrl,
            headers: defaultHeaders,
            data: qs.stringify(payload),
            responseType: 'json'
        })
        return res.data[0]
    }

    static async _populateResult(data, enrollment, examId) {
        data = data[0]
        const subjectCodes = []
        for (let i = 0; i < 16; i++) {
            if (data['SUB' + i.toString()] != "") {
                const subCode = data['SUB' + i.toString()]
                subjectCodes.push(subCode)
            }
        }
        const toDel = []
        for (let key of Object.keys(data)) {
            if ((/SUB.+/).test(key)) {
                toDel.push(key)
            }
        }
        for (let key of toDel) {
            delete data[key]
        }
        const subjectResults = []
        for (let sc of subjectCodes) {
            subjectResults.push(await this._subResult(enrollment, examId, sc))
        }
        data.subjects = subjectResults
        return data
    }

    // TO USE
    static async fromEnrollment(enrollment, examId) {
        
        const data = {
            'ReqOperation': 'StudentResult',
            'ExamID': String(examId),
            'EnrNo': String(enrollment),
            'DeviceId': await this._generateDeviceId(),
            'OSversion': '29',
            'LatLong': '0',
            'MobileNo': '916929696969',
            'IMEI_NO': '0',
            'IPAddress': '7a54:8059:4d78:551f:6065:9eda:7720:f6eb%dummy0',
            'IsCurrent': '0'
        }
        const res = await axios({
            method: 'POST',
            url: hostUrl,
            headers: defaultHeaders,
            data: qs.stringify(data),
            responseType: 'json'
        })
        if (res.status == 200 || res.status == 201) {
            // formatting data

            // declaration date
            const fullResult = await this._populateResult(res.data, enrollment, examId)
            fullResult.DECLARATIONDATE = new Date(fullResult.DECLARATIONDATE)
            
            // semester
            fullResult.sem = Number(fullResult.sem)

            // branch code
            fullResult.BR_CODE = Number(fullResult.BR_CODE)

            // rename MAP_NUMBER to enrollment
            fullResult.enrollment = fullResult.MAP_NUMBER
            delete fullResult.MAP_NUMBER

            // total backlog
            fullResult.TOTBACKL = Number(fullResult.TOTBACKL)

            // current backlog
            fullResult.CURBACKL = Number(fullResult.CURBACKL)

            // SPI
            fullResult.SPI = Number(fullResult.SPI)

            // CPI
            fullResult.CPI = Number(fullResult.CPI)

            // CGPA
            fullResult.CGPA = Number(fullResult.CGPA)

            // TRIAL
            fullResult.TRIAL = Number(fullResult.TRIAL)

            // IsREcheck
            // fullResult.IsREcheck (do it later)

            // IsReass
            // fullResult.IsReass

            // RTI
            // fix later

            return fullResult
        } else {
            console.log(res.data)
            console.log("Found some issues maybe!")
        }
    }

    // TO USE
    static async getSession() {
        
        const data = {
            'ReqOperation': 'GetSession'
        }
        const res = await axios({
            method: 'POST',
            url: hostUrl,
            headers: defaultHeaders,
            data: qs.stringify(data),
            responseType: 'json'
        })
        return res.data
    }

    // TO USE
    static async getCourse(examSession) {
        
        const data = {
            'ReqOperation': 'GetCourse',
            'ExSession': examSession
        }

        const res = await axios({
            method: 'POST',
            url: hostUrl,
            headers: defaultHeaders,
            data: qs.stringify(data),
            responseType: 'json'
        })
        return res.data
    }
    
    // TO USE
    static async getExam(examSession, examType) {
        const data = {
            'ReqOperation': 'GetExamName',
            'ExSession': examSession,
            'ExType': examType
        }
        const res = await axios({
            method: 'POST',
            url: hostUrl,
            headers: defaultHeaders,
            data: qs.stringify(data),
            responseType: 'json'
        })
        return res.data
    }
}

module.exports = GTUResult
