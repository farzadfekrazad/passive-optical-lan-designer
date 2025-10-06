import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = Number(process.env.PORT || 4001)
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT })
})

// Minimal auth stub
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {}
  if (!email) {
    return res.status(400).json({ message: 'email required' })
  }
  const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '1h' })
  res.json({ token, user: { email } })
})

app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`)
})