const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    criteria:{
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model('Question', questionSchema);
