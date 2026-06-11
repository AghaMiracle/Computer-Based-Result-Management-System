import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  matricNumber: {
    type: String,
    required: [true, 'Matric number is required'],
    trim: true,
    maxlength: 30
  },
  level: {
    type: Number,
    enum: [100, 200, 300, 400, 500, 600, 700],
    default: 100
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  expectedGraduationDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'graduated', 'suspended', 'expelled', 'withdrawn'],
    default: 'active'
  },
  guardianName: {
    type: String,
    default: null
  },
  guardianPhone: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

studentProfileSchema.index({ institutionId: 1, departmentId: 1 });
studentProfileSchema.index({ matricNumber: 1, institutionId: 1 }, { unique: true });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
export default StudentProfile;
