import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import ErrorHandler from '../middlewares/error.js'
import { sendCookie } from '../utiles/features.js'
//import { cookie } from 'express/lib/response'

export const getAllUsers = async (req, res) => {
  // Functionality to get all users can be added here
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email }).select('+password')

    if (!user) {
      return next(new ErrorHandler('User Not Exist', 400))
    }

    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User Not Exist',
    //   })
    // }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return next(new ErrorHandler('Invalid Email or Password', 400))
    }

    // if (!isMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid Email or Password',
    //   })
    // }

    sendCookie(user, res, `Welcome back ${user.name}`, 200)
  } catch (error) {
    next(error) // Pass errors to the error handler middleware
  }
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    let user = await User.findOne({ email })

    if (user) {
      return next(new ErrorHandler('User Already Exist', 404))
    }

    // if (user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User Already Exist',
    //   })
    // }

    const hashedPassword = await bcrypt.hash(password, 10)

    user = await User.create({ name, email, password: hashedPassword })

    sendCookie(user, res, 'Registered successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const getMyProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  })
}
export const logout = (req, res) => {
  try {
    return res
      .status(200)
      .cookie('token', '', {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === 'Development' ? 'lax' : 'none', //ho gya jugad
        secure: process.env.NODE_ENV === 'Development' ? false : true,
      })

      .json({
        success: true,
        user: req.user,
      })
  } catch (error) {
    next(error)
  }
}
