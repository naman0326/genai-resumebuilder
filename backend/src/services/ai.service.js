const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

// Free models on OpenRouter; the second one is used if the first is rate-limited or down
const OPENROUTER_MODELS = [
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free"
]


const questionSchema = {
    type: "object",
    properties: {
        question: { type: "string" },
        intention: { type: "string" },
        answer: { type: "string" }
    },
    required: ["question", "intention", "answer"],
    additionalProperties: false
}

// Mirrors InterviewReport.model.js so the result can be saved directly
const interviewReportSchema = {
    type: "object",
    properties: {
        matchScore: { type: "number", minimum: 0, maximum: 100 },
        technicalQuestions: { type: "array", items: questionSchema },
        behavioralQuestions: { type: "array", items: questionSchema },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"],
                additionalProperties: false
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"],
                additionalProperties: false
            }
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
    additionalProperties: false
}


const SYSTEM_PROMPT = `You are an expert interview coach.
Given a job description, the candidate's resume and their self description, produce an interview preparation report:
- matchScore: 0-100, how well the candidate fits the job
- technicalQuestions: likely technical questions, the interviewer's intention behind each, and a strong answer
- behavioralQuestions: likely behavioral questions, the intention behind each, and a strong answer
- skillGaps: skills the job needs that the candidate lacks, with severity low, medium or high
- preparationPlan: a day-by-day plan with a focus and concrete tasks for each day
Respond only with JSON matching the given schema.`


async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
    const userPrompt = `Job description:\n${jobDescription}\n\nResume:\n${resume || "Not provided"}\n\nSelf description:\n${selfDescription || "Not provided"}`

    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            models: OPENROUTER_MODELS,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "interview_report",
                    strict: true,
                    schema: interviewReportSchema
                }
            }
        })
    })

    if (!response.ok) {
        throw new Error(`OpenRouter request failed (${response.status}): ${await response.text()}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
        throw new Error("OpenRouter returned an empty response")
    }

    try {
        return JSON.parse(content)
    } catch (err) {
        throw new Error("OpenRouter returned invalid JSON")
    }
}


module.exports = { generateInterviewReport }
