import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'

const server = express()
const port = process.env.PORT || 3001

//***************** MIDDLEWARE ****************/

server.use(cors())
server.use(express.json())

//***************** ROUTES ****************/

//***************** ERROR HANDLERS ****************/

console.table(listEndpoints(server, port))
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
  console.log('🐒 Mongo Connected 👍')
  server.listen(port, () => {
    console.log(`🏃Server running on port 🚪${port}`)
  })
})
