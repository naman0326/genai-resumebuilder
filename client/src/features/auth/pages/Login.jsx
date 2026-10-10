import '../auth.form.scss'

import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

import { useNavigate } from 'react-router'


const Login = () => {

  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({email, password})
    navigate('/home')
  }

  if(loading){
    return (
      <main>
          <h1>Loading...</h1>
      </main>
    )
  }

  return (
    <main>
        <div className="form-container">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="email">Email: </label>
              <input type="text" name="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter email'/>
            </div>


            <div className="input-group">
              <label htmlFor="password">password: </label>
              <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='Enter password'/>
            </div>

            <button className="button primary-button">
              Login
            </button>
          </form>

          <p>New User? Please
              <span style={{paddingInline:'0.3rem'}}><Link to={`/`}>Register</Link></span>
            here</p>
        </div>
    </main>
  )
}

export default Login