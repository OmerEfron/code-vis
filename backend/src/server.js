const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const visualizationRoutes = require('./routes/visualizationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/visualizations', visualizationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 