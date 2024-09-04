const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
require("./config/passportSetup");
require("dotenv").config();

const MDB = process.env.MONGO_URI;

const typeDefs = require("./graphQl/typeDefs");
const resolvers = require("./graphQl/resolvers");

const app = express();

const auth = require("./authentication/patientAuth");

const SDK_KEY = process.env.SDK_KEY;
const SDK_SECRET = process.env.SDK_SECRET;

const corsOptions = {
  origin: "http://localhost:5173", // React frontend's URL
  credentials: true, // Allow cookies to be sent and received
};

// Use CORS to allow cross-origin requests
app.use(cors(corsOptions));

// Use body-parser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/patients", require("./routes/patientRoutes"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(authRoutes);
//app.use(auth);
// Signature route
app.get("/signature", (req, res) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    app_key: SDK_KEY,
    tpc: "test",
    role_type: 1,
    version: 1,
    iat: iat,
    exp: exp,
  };

  const sdkJWT = jwt.sign(oPayload, SDK_SECRET, {
    algorithm: "HS256",
    header: oHeader,
  });

  res.send(sdkJWT);
});

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start().then(() => {
  server.applyMiddleware({ app });

  mongoose
    .connect(MDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");

      app.listen({ port: 4000 }, () => {
        console.log(
          "Server running on http://localhost:4000" + server.graphqlPath
        );
        console.log("REST API running on http://localhost:4000/");
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
    });
});
