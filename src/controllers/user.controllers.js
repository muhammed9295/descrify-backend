import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { apiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new apiError(400, "Email already exists");
  }

  const user = await User.create({
    userName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});
// Register User

// Generate Access and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};
// Generate Access and Refresh Token

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 900000,
    sameSite: 'none',
    partitioned: true,
    domain: '.descrify.netlify.app',
    path: '/'
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});
// Login User

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});
// Logout User

// Get history of Single User
const getHistory = asyncHandler(async (req, res) => {
  const history = await User.aggregate([
    {
      $lookup: {
        from: "conversations",
        localField: "_id",
        foreignField: "userId",
        as: "history",
      },
    },
    {
      $addFields: {
        history: {
          $arrayElemAt: ["$history", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        history:{
          conversationId:"$history._id",
          product:"$history.product",
          category:"$history.category",
          userId:"$history.userId",
          createdAt:"$history.createdAt"
        }
      }
    }
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, history, "History retrieved successfully"));
});
// Get history of Single User

export { registerUser, loginUser, logoutUser, getHistory };
