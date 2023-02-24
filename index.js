//import 'package:express/express.dart'
const express = require('express');
const mongoose = require('mongoose');


const authRouter = require('./routers/auth');

const PORT = process.env.PORT || 3000;
const app = express();
const DB = 'mongodb+srv://19btcse09:Bibhu123@cluster0.r9yizrq.mongodb.net/?retryWrites=true&w=majority';

app.use(express.json());
app.use(authRouter);

mongoose.connect(DB)
    .then(() => {
        console.log('Connection successful');
    })
    .catch((e) => {
        console.log(e);
    });


app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected to port ${PORT}`);
});
