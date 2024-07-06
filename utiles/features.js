import jwt from 'jsonwebtoken'

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
  //The jwt.sign method is used to create a new JWT.
  res
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,

      //sameSite: 'none', // ab ye postman me kam nhi krega
      //secure: true, // to dono pr run krane ka jugad

      sameSite: process.env.NODE_ENV === 'Development' ? 'lax' : 'none',
      secure: process.env.NODE_ENV === 'Development' ? false : true,
    })
    .json({
      success: true,
      message: message,
    })
}
