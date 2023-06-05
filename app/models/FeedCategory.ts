import {model, Schema} from 'mongoose';
import joi, {ValidationResult} from 'joi';
import {FeedCategoryModel, IFeedCategory} from '../interface';

const FeedCategorySchema = new Schema<IFeedCategory, FeedCategoryModel>({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['enabled', 'disabled'],
            messages: '{VALUE} is not acceptable'
        },
        default: 'enabled',
    },
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});
FeedCategorySchema.index({name: 'text', description: 'text'}, {unique: true});

FeedCategorySchema.virtual('feedsCount', {
    ref: 'Feed',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
    count: true,
});

FeedCategorySchema.virtual('feeds', {
    ref: 'Feed',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});

const FeedCategory = model<IFeedCategory, FeedCategoryModel>('FeedCategory', FeedCategorySchema);

const validateFeedCategoryDto = (feedCategoryDto: IFeedCategory): ValidationResult => {
    const feedCategory = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
    });
    return feedCategory.validate(feedCategoryDto);
}

export {
    FeedCategory,
    validateFeedCategoryDto
}


