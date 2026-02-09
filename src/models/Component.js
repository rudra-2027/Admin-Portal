const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  description: {
    type: String,
    required: true
  },

  techStack: {
    type: [String],
    index: true
  },

  category: {
    type: String,
    index: true
  },

  tags: {
    type: [String],
    index: true
  },

  previewImages: {
    type: [String] 
  },

  sourceUrl: {
    type: String
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["draft", "pending", "published", "rejected"],
    default: "draft",
    index: true
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  views: {
    type: Number,
    default: 0
  },

  downloads: {
    type: Number,
    default: 0
  }

}, { timestamps: true });
componentSchema.index({ status: 1, category: 1 });
componentSchema.index({ tags: 1 });
componentSchema.index({ techStack: 1 });
componentSchema.index({ isFeatured: 1, status: 1 });
componentSchema.pre("validate", async function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

module.exports = mongoose.model("Component", componentSchema);


