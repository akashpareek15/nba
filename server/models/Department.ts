
import { Schema, model, } from 'mongoose';


interface IDepartment {
  departmentId: number;
  departmentName: string;
}

const departmentSchema = new Schema<IDepartment>(
  {
    departmentName: { type: String, required: true, },
    departmentId: { type: Number, required: true, }
  },
  {
    timestamps: true,
  }
);

export const Department = model<IDepartment>('Department', departmentSchema);
