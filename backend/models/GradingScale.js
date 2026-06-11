import mongoose from 'mongoose';

const gradingScaleSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  name: {
    type: String,
    default: 'Default',
    trim: true
  },
  scales: [{
    grade: { type: String, required: true },       // e.g., 'A'
    minScore: { type: Number, required: true },     // e.g., 70
    maxScore: { type: Number, required: true },     // e.g., 100
    gradePoint: { type: Number, required: true },   // e.g., 5.0
    remark: { type: String, default: 'Excellent' }  // e.g., 'Excellent'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

gradingScaleSchema.index({ institutionId: 1 });

const GradingScale = mongoose.model('GradingScale', gradingScaleSchema);
export default GradingScale;
