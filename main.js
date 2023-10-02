const express = require("express");
const mongoose = require("mongoose");
const { MONGO_DB_CONFIG } = require("./src/config/app.config");
const { initMeetingServer } = require("./meeting.server");

const app = express();
const server = require("http").createServer(app);

initMeetingServer(server);

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_DB_CONFIG.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database Connect"), (err) => console.log(`Database Can't be connected\n${err}`));

app.use(express.json());
app.use("/api", require("./src/routes/app.routes"));

server.listen(process.env.port || 4000, () => {
    console.log("Server is Ready!");
});
