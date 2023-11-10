const express = require("express");
const morgan = require("morgan");
const blogpostRouter = require("./routes/blogpostRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/../dist`));

app.use("/api/v1/blogposts", blogpostRouter);

module.exports = app;
