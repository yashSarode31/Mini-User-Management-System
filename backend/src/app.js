import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes.js'


const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' })
})

export default app
