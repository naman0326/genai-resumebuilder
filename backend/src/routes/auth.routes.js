const express = require('express')
const authController = require('../controllers/auth.controller')
const authUser = require('../middlewares/auth.middleware')

const authRouter = express.Router()

/**
 * @route POST /api/auth/register
    @description Register a new User
    @access Public
*/

authRouter.post('/register', authController.registerUserController)

/**
 *  @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 * 
 */

authRouter.post('/login', authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear cookie from user cookie and add token in blacklist
 * @access public
 */

authRouter.get('/logout', authController.logoutUserController)



/**
 *  @route GET /api/auth/getme
 * @description get the current loggedin details
 * @access private
 * 
 */

authRouter.get('/getme',authUser, authController.getMeController)


module.exports = authRouter

