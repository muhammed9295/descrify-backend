import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { apiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Conversation } from "../models/conversation.models.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY
});

const generateTitleAndDescription = asyncHandler(async (req, res) => {
  const { productName, category } = req.query;
  const response = await  openai.chat.completions.create({
    messages: [{ role: "user", content: `Craft a captivating search engine optimized title and detailed description that highlights the unique features and benefits of ${productName} and category ${category}, enticing potential customers to make a purchase on Amazon.` }],
    model: "gpt-3.5-turbo",
    max_tokens: 100
  });

  const finalResponse = response.choices[0].message.content;

//   Save to conversation collection
const conversation = new Conversation({
    product: productName,
    category: category,
    response: finalResponse,
    userId: req.user._id
})

await conversation.save();

  return res
        .status(200)
        .json(new apiResponse(200, finalResponse, "Title generated successfully"));
});

// Get user conversation
const getUserConversation = asyncHandler(async (req, res)=>{
  const userConversation = await Conversation.find({userId: req.user._id}).select("-response")

  return res
   .status(200)
   .json(new apiResponse(200, userConversation, "User conversation retrieved successfully"));
})
// Get user conversation

// Get single user response
const getSingleUserResponse = asyncHandler(async(req, res)=> {
  const userResponse = await Conversation.findById(req.params?.id)

  return res
   .status(200)
   .json(new apiResponse(200, userResponse, "Single user response retrieved successfully"));
})
// Get single user response

// Delete single user response
const deleteResponse = asyncHandler(async(req, res)=>{
  try {
    const {id} = req.params
    // validate the id
    if(!id?.trim()){
      throw new apiError(400, "Invalid id passed")
    }

    const deletedResponse = await Conversation.findByIdAndDelete(id);

    if(!deletedResponse){
      throw new apiError(404, "Response not found")
    }

    return res
     .status(200)
     .json(new apiResponse(200, deletedResponse, "User response deleted successfully"));

  } catch (error) {
    console.error("Error deleting conversation", error);
    res.status(500).send({message: "Error deleting conversation"})
  }
})
// Delete single user response

export {generateTitleAndDescription, getUserConversation, getSingleUserResponse, deleteResponse};
