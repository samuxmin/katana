import express from "express";
import path from "path";
import cors from "cors"
import dotenv from "dotenv"
const PORT = process.env.PORT || "3000";
const app = express()
app.use(express.json())
dotenv.config()
app.use(express.static(path.join(path.resolve(),"public")))
app.use(cors())
app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(path.resolve() + "/index.html");
})

app.listen(PORT)