const express = require('express');
const auth = require("./routes/auth")

const app = express();

app.use(express.json())
app.use("/auth", auth);

app.get('/', (req, res)=>{
    res.send("Working")
})


app.listen(3000, ()=>{
    console.log("App started at port 3000")
})