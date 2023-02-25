const path = require("path");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(3000);