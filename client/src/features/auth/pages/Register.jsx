import '../auth.form.scss'

import { Link } from 'react-router'
const Register = () => {


  const handleSubmit = (e) => {
    e.preventDefault()

  }


  return (
    <main>
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="email">Email: </label>
              <input type="text" name="email" placeholder='Enter email'/>
            </div>

            <div className="input-group">
              <label htmlFor="username">Username: </label>
              <input type="username" name="username" placeholder='Enter your username'/>
            </div>


            <div className="input-group">
              <label htmlFor="password">password: </label>
              <input type="password" name="password" placeholder='Choose strong password'/>
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