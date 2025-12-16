const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config({
   path: path.resolve(__dirname, "./localenv/.env"),
});

const Player = require("./models/Player");

/* express stuff */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

if (process.argv.length !== 3) {
    console.log("Usage app.js <PORT NUMBER>");
    process.exit(1);
  }
const portNumber = process.argv[2];

app.listen(portNumber, () => {
    console.log(`Stats server running on http://localhost:${portNumber}`);
});


/* Coding part starts here */

/* Initial connection to mongoose */
async function main() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    } catch (e) {
      console.error(e);
    }
}

main().catch(console.error);

/* Home Page */
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/add-player", async (req, res) => {
    try {
        const pname = req.body;
        console.log(pname)
        /* im having trouble with getting the name lol */
      
        /* TODO: Check if pname exists and structure data according to schema, assign to player*/
        const line40 = await get40LRecord(pname);
        const league = await get40LRecord(pname);
        console.log("40 L:", line40)
        console.log("league: ",league)

        const new_player = new Player ({
            username: pname,
            sprint_40: line40,
            tetra_league: league,
        })

        await new_player.save();
        console.log("New player added:", new_player);
        const players = await Player.find({});
        console.log("All players:", players);
        res.send("Player added successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding player");
    }
  });

async function get40LRecord(username) {
    const res = await fetch(
        `https://ch.tetr.io/api/users/${username}/records/40l/top`
    );

    const json = await res.json();

    if (!json.success) {
        throw new Error("TETR.IO API error");
    }
    return json.data;
}

async function getLeagueRecord(username) {
    const res = await fetch(
        `https://ch.tetr.io/api/users/${username}/records/league/top`
    );

    const json = await res.json();

    if (!json.success) {
        throw new Error("TETR.IO API error");
    }
    return json.data;
}



/* Coding part stops here */
console.log("Type stop to shutdown the server: ");
process.stdin.setEncoding("utf8");
process.stdin.on('readable', () => {
	const dataInput = process.stdin.read();
	if (dataInput !== null) {
        const command = dataInput.trim();
		if (command === "stop") {
			process.stdout.write("Shutting down the server\n"); 
            process.exit(0);  /* exiting */
        } 
        else {
			process.stdout.write(`Invalid command: ${command}`);
		}
        process.stdout.write("Type stop to shutdown the server: ");
		process.stdin.resume();
    }
});