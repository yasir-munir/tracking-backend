const express = require('express');
const userRoutes = require('./src/routes/routes');
const dbConfig = require('./src/config/dbConfig');
const { connectToSSH } = require('./src/utils/sshClient');
const cors = require('cors');

const app = express();
app.use(express.json());

// Use middleware for Authentication
// app.use(authMiddleware.authenticate);

const corsOptions = {
  origin: '*', // Replace with your allowed origin
  methods: 'GET,POST,PUT,DELETE',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
// Enable CORS for all routes
// app.use(cors());

// Use routes
app.use('/api/users', userRoutes);

// Connect to SSH
connectToSSH();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));