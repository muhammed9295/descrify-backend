import mongoose from 'mongoose';
import {asyncHandler} from "../utils/asyncHandlers.js";
import {apiError} from "../utils/apiErrors.js";
import {apiResponse} from "../utils/apiResponse.js";
import {User} from "../models/user.models.js";

// Register User
const registerUser = asyncHandler(async(req, res)=>{
    const {userName, email, password} = req.body;

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new apiError(400, "Email already exists");
    }

    const user = await User.create({
        userName,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new apiError(500, "Something went wrong while creating user")
    }

    return res
     .status(201)
     .json(new apiResponse(200, createdUser, "User registered successfully"))
})
// Register User