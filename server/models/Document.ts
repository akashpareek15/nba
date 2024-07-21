
import { Schema, model, } from 'mongoose';


interface IDocument {
    fileName: string;
    originalFileName: string;
}

const documentSchema = new Schema<IDocument>(
    {
        fileName: { type: String, required: true, },
        originalFileName: { type: String, required: true, },
    },
    {
        timestamps: true,
    }
);

export const Document = model<IDocument>('Document', documentSchema);
