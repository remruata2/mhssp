import mongoose from 'mongoose';
import { IContractor } from './Contractor';

export interface ICivilWorksProcurement {
  lotNo: number;
  contractNo: number;
  workName: string;
  contractSignedDate: Date;
  contractor: mongoose.Types.ObjectId | IContractor;
  createdAt: Date;
  updatedAt: Date;
}

const civilWorksProcurementSchema = new mongoose.Schema<ICivilWorksProcurement>(
  {
    lotNo: { type: Number, required: true },
    contractNo: { type: Number, required: true },
    workName: { type: String, required: true },
    contractSignedDate: { type: Date, required: true },
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CivilWorksProcurement ||
  mongoose.model<ICivilWorksProcurement>('CivilWorksProcurement', civilWorksProcurementSchema);
