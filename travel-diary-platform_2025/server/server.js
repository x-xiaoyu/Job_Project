// server/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(cors())
app.use(express.json())

// 测试路由
app.get('/', (req, res) => {
    res.send('Server is running!')
})

// 连接 MongoDB 并启动服务
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ MongoDB connected')
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
    })
    .catch((err) => console.error('MongoDB connection error:', err))
