
const Login = () => {
  return (
    <main>
        <div className="form-container">
          <h1>Login</h1>

          <form>

            <div className="input-group">
              <label htmlFor="email">Email: </label>
              <input type="text" name="email"/>
            </div>


            <div className="input-group">
              <label htmlFor="password">password: </label>
              <input type="password" name="password" />
            </div>

            <button className="button primary-button">
              Login
            </button>
          </form>
        </div>
    </main>
  )
}

export default Login