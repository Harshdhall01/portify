const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formData: {
    personal: {
      name:     { type: String },
      title:    { type: String },
      bio:      { type: String },
      email:    { type: String },
      phone:    { type: String },
      location: { type: String },
      photo:    { type: String },
    },
    skills: {
      technical: { type: String },
      soft:      { type: String },
      tools:     { type: String },
    },
    projects: [
      {
        title: { type: String },
        desc:  { type: String },
        link:  { type: String },
        tech:  { type: String },
      }
    ],
    education: [
      {
        degree: { type: String },
        school: { type: String },
        year:   { type: String },
        grade:  { type: String },
      }
    ],
    socials: {
      github:    { type: String },
      linkedin:  { type: String },
      twitter:   { type: String },
      website:   { type: String },
      instagram: { type: String },
    }
  },

  templateId:    { type: Number, default: 1 },
  aiEnhanced:    { type: Boolean, default: false },
  status:        { type: String, default: 'draft' }, // 'draft' | 'live'
  deployUrl:     { type: String, default: null },

  // ── Publish fields ───────────────────────────────────────────
  publishedHtml: { type: String, default: null },   // full HTML stored here
  slug:          { type: String, default: null, unique: true, sparse: true }, // e.g. "harsh-dhall-x7k2"

}, { timestamps: true })

module.exports = mongoose.model('Portfolio', portfolioSchema)