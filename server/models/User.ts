import { Schema, model, Document } from 'mongoose';
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string[];
    password: string;
}

/**
 * User Schema
 */
var userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name not provided"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name not provided"],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        // required: [true, "email not provided"],
        // validate: {
        //     validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        //     message: '{VALUE} is not a valid email!'
        // }

    },

    department: {
        type: Array<String>,
        // required: [true, "At least one department should be provided"],
        // validate: {
        //     validator: (v) => v && Array.isArray(v) && v.length,
        //     message: 'At least one department should be provided'
        // }
    },
    role: {
        type: String,
        // enum: ["hod", "admin"],
        // required: [true, "Invalid Role"]
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

export const UserSchema = model<IUser>('User', userSchema);