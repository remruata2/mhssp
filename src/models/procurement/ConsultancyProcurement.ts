import mongoose from 'mongoose';

// Clear any existing model to prevent the duplicate index warning
if (mongoose.models.ConsultancyProcurement) {
  delete mongoose.models.ConsultancyProcurement;
}

const ConsultancyProcurementSchema = new mongoose.Schema({
  contractBidNo: {
    type: String,
    required: [true, 'Please provide a Contract/BID number'],
    unique: true,
  },
  consultancyServices: {
    type: String,
    required: [true, 'Please provide consultancy services details'],
  },
  contractSigned: {
    type: Date,
    required: [true, 'Please provide contract signed date'],
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: [true, 'Please provide a contractor'],
  }
}, {
  timestamps: true,
});

// Remove any existing indexes to prevent duplicates
ConsultancyProcurementSchema.indexes().forEach(index => {
  ConsultancyProcurementSchema.index(index[0], index[1]);
});

export default mongoose.model('ConsultancyProcurement', ConsultancyProcurementSchema);
