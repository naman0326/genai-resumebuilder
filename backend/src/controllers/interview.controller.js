const interviewReportModel = require('../models/InterviewReport.model')
const {generateInterviewReport} = require('../services/ai.service')
const {extractPdfText} = require('../services/pdf.service')

async function generateInterviewReportController(req, res){
    // multipart/form-data: text fields are in req.body, the resume PDF (optional) is in req.file
    const {jobDescription, selfDescription} = req.body

    if(!jobDescription){
        return res.status(400).json({message: "Job description is required"})
    }

    let resume;
    if(req.file){
        try {
            resume = await extractPdfText(req.file.buffer)
        } catch (err) {
            console.error("Reading resume PDF failed:", err.message)
            return res.status(400).json({message: "Could not read the resume PDF"})
        }

        if(!resume){
            return res.status(400).json({message: "No text found in the resume PDF (is it a scanned image?)"})
        }
    }

    if(!resume && !selfDescription){
        return res.status(400).json({message: "Provide a resume or a self description"})
    }
    let aiReport;

    try {
        aiReport = await generateInterviewReport({jobDescription, resume, selfDescription})
    } catch (err) {
        console.error("AI report generation failed:", err.message)
        return res.status(502).json({message: "Failed to generate interview report, please try again"})
    }

    try {
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            jobDescription,
            resume,
            selfDescription,
            ...aiReport
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (err) {
        console.error("Saving interview report failed:", err.message)
        return res.status(500).json({message: "Failed to save interview report"})
    }
}


module.exports = {generateInterviewReportController}
