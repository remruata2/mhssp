import mongoose from 'mongoose';

const ConsultancyProcurementSchema = new mongoose.Schema({
  referenceNo: {
    type: Number,
    required: [true, 'Please provide a reference number'],
    unique: true,
  },
  consultancyName: {
    type: String,
    required: [true, 'Please provide a consultancy name'],
  },
  scope: {
    type: String,
    required: [true, 'Please provide the scope of work'],
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: [true, 'Please provide a contractor'],
  },
  contractValue: {
    type: Number,
    required: [true, 'Please provide contract value'],
  },
  contractSignedDate: {
    type: Date,
    required: [true, 'Please provide a contract signed date'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Terminated'],
    default: 'Not Started',
  },
}, {
  timestamps: true,
});

export default mongoose.models.ConsultancyProcurement || mongoose.model('ConsultancyProcurement', ConsultancyProcurementSchema);
