const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    // hide {select: false} key-value pairs
    newDoc.blogpostImgUpdate = undefined;
    newDoc.bannerImgUpdate = undefined;

    res.status(201).json({
      status: "success",
      data: {
        doc: newDoc,
      },
    });
  });

exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    if (req.params.userId) req.query.user = req.params.userId;

    const modelQuery = Model.find();
    if (populateOptions) {
      populateOptions.forEach((option) => modelQuery.populate(option));
    }

    const features = new APIFeatures(modelQuery, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const modelQuery = Model.findById(req.params.id);
    if (populateOptions) {
      populateOptions.forEach((option) => modelQuery.populate(option));
    }
    const doc = await modelQuery;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc: doc,
      },
    });
  });

exports.updateOneForUserOnly = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).select(
      "+blogpostImgUpdate +bannerImgUpdate",
    );

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    if (req.user.id !== doc.user.id && req.user.role !== "admin") {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    Object.keys(req.body).forEach((key) => {
      doc[key] = req.body[key];
    });

    if (req.user.role !== "admin") {
      doc.user = req.user.id;
    }

    doc.updatedAt = Date.now();
    await doc.save({ validateBeforeSave: true });

    // remove {select:false} from doc
    doc.blogpostImgUpdate = undefined;
    doc.bannerImgUpdate = undefined;

    res.status(200).json({
      status: "success",
      data: {
        doc: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
