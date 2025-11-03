import mongoose, { Schema, models } from "mongoose";

const QuoteSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Quote text is required"],
      trim: true,
    },
    author: {
      type: String,
      default: "Unknown",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "quotes" }
);

const Quote = models.Quote || mongoose.model("Quote", QuoteSchema);
export default Quote;
