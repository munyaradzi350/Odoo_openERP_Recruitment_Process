const express = require('express');
const jobRoutes = require('./routes/jobRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const offerRoutes = require('./routes/offerRoutes');
const salesOrderRoutes = require('./routes/salesOrderRoutes');
const manufactureOrderRoutes = require('./routes/manufactureOrderRoutes');



const app = express();
const port = 3000; 

app.use(express.json());

// Routes
app.use('/jobs', jobRoutes);
app.use('/interviews', interviewRoutes);
app.use('/offers', offerRoutes);
app.use('/orders', salesOrderRoutes);
app.use('/manufacture-orders', manufactureOrderRoutes);



app.listen(port, 'localhost', () => {
  console.log(`Express server running on http://localhost:${port}`);
});



