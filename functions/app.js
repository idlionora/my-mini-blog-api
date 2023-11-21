const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const blogpostRouter = require("./routes/blogpostRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/../dist`));

app.use("/api/v1/blogposts", blogpostRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
