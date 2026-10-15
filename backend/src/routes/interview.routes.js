const express = require('express')
const interviewController = require('../controllers/interview.controller')
const authUser = require('../middlewares/auth.middleware')
const uploadResume = require('../middlewares/upload.middleware')

const interviewRouter = express.Router()

/**
 * @route POST /api/interview
 * @description generate an interview report from job description, resume PDF (multipart field "resume") and self description
 * @access private
 */

interviewRouter.post('/', authUser, uploadResume, interviewController.generateInterviewReportController)


module.exports = interviewRouter
