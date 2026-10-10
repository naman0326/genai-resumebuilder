import { useState } from 'react'
import '../auth.form.scss'

import { Link, useNavigate } from 'react-router'

import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({username, email, password})
    navigate("/")
  }


  if(loading){
    return <main><h1>Loading...</h1></main>
  }

  return (
    <main>
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="email">Email: </label>
              <input type="text" name="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter email'/>
            </div>

            <div className="input-group">
              <label htmlFor="username">Username: </label>
              <input type="username" name="username" onChange={(e) => setUsername(e.target.value)} placeholder='Enter your username'/>
            </div>


            <div className="input-group">
              <label htmlFor="password">password: </label>
              <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='Choose strong password'/>
            </div>

            <button className="button primary-button">
              Register
            </button>

          </form>

          <p>Already a User? 
              <span style={{paddingInline:'0.3rem'}}><Link to={`/login`}>Login</Link></span>
            Instead</p>
        </div>
    </main>
  )
}

export default Register