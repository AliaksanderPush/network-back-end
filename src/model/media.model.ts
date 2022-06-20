import { model, Schema, Model } from 'mongoose';
import { IMedia } from '../dto/media.dto';

const mediaSchema: Schema = new Schema(
	{
		url: String,
		postedBy: {
			type: Schema.Types.ObjectId,
			ref: 'UserModel',
		},
	},
	{ timestamps: true },
);

export const MediaModel: Model<IMedia> = model('MediaModel', mediaSchema);
