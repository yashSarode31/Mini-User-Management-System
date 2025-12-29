import dotenv from 'dotenv'

import app from './app.js'
import connectDB from './config/db.js'

dotenv.config()

const port = process.env.PORT || 5000

// Connect to Mongo only if configured with a valid-looking scheme.
// This keeps the server bootable for non-DB routes like /health.
const mongoUri = process.env.MONGO_URI
if (mongoUri?.startsWith('mongodb://') || mongoUri?.startsWith('mongodb+srv://')) {
	connectDB()
} else if (mongoUri) {
	console.warn('MONGO_URI is set but invalid; skipping DB connection.')
}

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
