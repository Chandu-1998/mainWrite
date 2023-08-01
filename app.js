const express = require("express"); // Express Server Framework
const mongoose = require('mongoose')
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser')
const userRoutes = require('./routes/users');
const knownLanguageRoutes = require('./routes/knownLanguages');
const otherLanguageRoutes = require('./routes/otherLanguages');
const termsConditionsRoutes = require('./routes/termsConditions');
const writerExpertRoutes = require('./routes/writerExperts');
const writerKnowledgeRoutes = require('./routes/writerKnowledge');
const masterQuestionsRoutes = require('./routes/masterQuestions');
const writerDetailsRoutes = require('./routes/writerDetails');
const notifications = require('./routes/notifications');
const globalErrorHandler = require('./controllers/errorController');
const db = require('./config/dbConnection')
db.connect()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())    

app.use('/users', userRoutes);
app.use('/known-languages', knownLanguageRoutes);
app.use('/other-languages', otherLanguageRoutes);
app.use('/writer-expertises', writerExpertRoutes);
app.use('/writer-knowledges', writerKnowledgeRoutes);
app.use('/terms-conditions', termsConditionsRoutes);
app.use('/master-questions', masterQuestionsRoutes);
app.use('/writers', writerDetailsRoutes);
app.use('/notifications', notifications);

app.use(globalErrorHandler);

app.listen(8080,()=>{console.log('Server Running on Port 8080......')})
module.exports = app;