import '../interview.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { generateInterviewReport } from '../services/interview.api'


export const Home = () => {

  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()

  const [jobDescription, setJobDescription] = useState("")
  const [resume, setResume] = useState(null)
  const [selfDescription, setSelfDescription] = useState("")

  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [report, setReport] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setReport(null)
    setGenerating(true)

    try {
      const data = await generateInterviewReport({ jobDescription, resume, selfDescription })
      setReport(data.interviewReport)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, please try again")
    } finally {
      setGenerating(false)
    }
  }

  const onLogout = async () => {
    await handleLogout()
    navigate('/login')
  }

  return (
    <div className="home">

      <header className="home-header">
        <h2>Hi, {user?.username}</h2>
        <button className="button primary-button" onClick={onLogout}>Logout</button>
      </header>

      <form className="report-form" onSubmit={handleSubmit}>
        <h1>Interview Preparation</h1>

        <div className="input-group">
          <label htmlFor="jobDescription">Job description (required)</label>
          <textarea id="jobDescription" rows={6} value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)} placeholder='Paste the job description' />
        </div>

        <div className="input-group">
          <label htmlFor="resume">Resume (PDF, max 5MB)</label>
          <input type="file" id="resume" accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0] || null)} />
          {resume && <span className="file-name">Selected: {resume.name}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="selfDescription">Self description</label>
          <textarea id="selfDescription" rows={4} value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)} placeholder='Tell us about yourself' />
        </div>

        <p className="hint">Provide a resume, a self description, or both.</p>

        <button className="button primary-button" disabled={generating}>
          {generating ? "Generating report... (this can take a minute)" : "Generate report"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      {report && <Report report={report} />}
    </div>
  )
}


const Report = ({ report }) => {
  return (
    <section className="report">

      <div className="match-score">
        <span>Match score</span>
        <strong>{report.matchScore}/100</strong>
      </div>

      <QuestionList title="Technical questions" questions={report.technicalQuestions} />
      <QuestionList title="Behavioral questions" questions={report.behavioralQuestions} />

      <div className="report-section">
        <h2>Skill gaps</h2>
        {report.skillGaps.length === 0 && <p>No skill gaps found.</p>}
        <ul className="skill-gaps">
          {report.skillGaps.map((gap, i) => (
            <li key={i}>
              {gap.skill}
              <span className={`severity ${gap.severity}`}>{gap.severity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h2>Preparation plan</h2>
        {report.preparationPlan.map((day) => (
          <div className="card" key={day.day}>
            <h3>Day {day.day}: {day.focus}</h3>
            <ul>
              {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}


const QuestionList = ({ title, questions }) => {
  return (
    <div className="report-section">
      <h2>{title}</h2>
      {questions.map((q, i) => (
        <details className="card" key={i}>
          <summary>{q.question}</summary>
          <p><strong>Intention:</strong> {q.intention}</p>
          <p><strong>Answer:</strong> {q.answer}</p>
        </details>
      ))}
    </div>
  )
}
