import express from "express";
import path from "path";
const PORT = 3000;
const app = express()
app.use(express.json())
app.use(express.static(path.join(path.resolve(),"public")))
app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(path.resolve() + "/index.html");
})
app.listen(PORT)