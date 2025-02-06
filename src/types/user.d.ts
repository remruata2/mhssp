// types/user.d.ts
import { Document, Types } from "mongoose";

export interface IUser extends Document {
	username: string;
	password: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
	_id: Types.ObjectId;
}

declare namespace Express {
	interface User extends IUser {}
}
