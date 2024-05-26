
import { Schema, model, } from 'mongoose';


interface ICriteria {
  criteriaId: number;
  criteriaName: string;
}

const criteriaSchema = new Schema<ICriteria>(
  {
    criteriaName: { type: String, required: true, },
    criteriaId: { type: Number, required: true, }
  },
  {
    timestamps: true,
  }
);

export const Criteria = model<ICriteria>('Criteria', criteriaSchema);
