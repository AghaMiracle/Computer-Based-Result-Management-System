import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: 200
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    uppercase: true,
    trim: true,
    maxlength: 20
  },
  creditUnits: {
    type: Number,
    required: [true, 'Credit units is required'],
    min: 1,
    max: 12
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
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
    default: null
  },
  semesterType: {
    type: String,
    enum: ['first', 'second', 'third'],
    default: 'first'
  },
  level: {
    type: Number,
    enum: [100, 200, 300, 400, 500, 600, 700],
    required: true
  },
  description: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.index({ code: 1, institutionId: 1 }, { unique: true });
courseSchema.index({ departmentId: 1 });
courseSchema.index({ teacherId: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
