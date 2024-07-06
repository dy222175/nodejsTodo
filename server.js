import { connectDB } from './data/database.js'
import { app } from './app.js'

//calling the database to connect with database
connectDB()

app.listen(process.env.PORT, () => {
  console.log(
    `server is working on port:${process.env.PORT} in ${process.env.NODE_ENV} mode`,
  )
})
