const dotenv = require('dotenv')
const cors = require("cors");
const express = require('express');
dotenv.config()

const aiRouter = require("./routes/ai.routes")

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello Backend!!');
})

app.use("/get-response", aiRouter)


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})