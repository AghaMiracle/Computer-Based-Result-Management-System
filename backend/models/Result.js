import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caScore: {
    type: Number,
    default: 0,
    min: 0
  },
  examScore: {
    type: Number,
    default: 0,
    min: 0
  },
  totalScore: {
    type: Number,
    default: 0,
    min: 0
  },
  letterGrade: {
    type: String,
    default: null
  },
  gradePoint: {
    type: Number,
    default: 0
  },
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Prevent duplicate results
resultSchema.index(
  { studentId: 1, courseId: 1, semesterId: 1, sessionId: 1 },
  { unique: true }
);
resultSchema.index({ teacherId: 1, courseId: 1 });
resultSchema.index({ institutionId: 1, status: 1 });

// Auto-compute total score before save
resultSchema.pre('save', async function(next) {
  if (this.isModified('caScore') || this.isModified('examScore')) {
    this.totalScore = (this.caScore || 0) + (this.examScore || 0);
    
    // Try to compute grade from institution's grading scale
    try {
      const GradingScale = mongoose.model('GradingScale');
      const gradingScale = await GradingScale.findOne({ institutionId: this.institutionId });
      
      if (gradingScale && gradingScale.scales.length > 0) {
        const matchedScale = gradingScale.scales.find(
          s => this.totalScore >= s.minScore && this.totalScore <= s.maxScore
        );
        if (matchedScale) {
          this.letterGrade = matchedScale.grade;
          this.gradePoint = matchedScale.gradePoint;
        }
      }
    } catch (err) {
      // Grading scale model may not be loaded yet; skip auto-computation
    }
  }
  next();
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
