import mongoose from "mongoose";
import { IContractor } from "./Contractor";

export interface ICivilWorksProcurement {
  lotNo: string;
  contractNo: string;
  workName: string;
  contractSignedDate: Date;
  contractor: mongoose.Types.ObjectId | IContractor;
  createdAt: Date;
  updatedAt: Date;
}

const civilWorksProcurementSchema = new mongoose.Schema<ICivilWorksProcurement>(
  {
    lotNo: { type: String, required: true },
    contractNo: { type: String, required: true },
    workName: { type: String, required: true },
    contractSignedDate: { type: Date, required: true },
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CivilWorksProcurement ||
  mongoose.model<ICivilWorksProcurement>(
    "CivilWorksProcurement",
    civilWorksProcurementSchema
  );
