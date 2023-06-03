import {Document, Model} from 'mongoose';
import {IPagination} from './pagination';
import {objectId} from '../types';

type stringUndefined = string | undefined;

interface IRssFeed {
    title: stringUndefined,
    description: stringUndefined,
    copyright: stringUndefined,
    language: stringUndefined,
    pubDate: stringUndefined,
    imageUrl: stringUndefined,
    link: stringUndefined,
    itunesType: stringUndefined,
    itunesSummary: stringUndefined,
    itunesAuthor: stringUndefined,
    itunesExplicit: stringUndefined,
    itunesImage: stringUndefined,
    itunesOwner: {
        name: stringUndefined,
        email: stringUndefined,
    },
    itunesCategory: {
        text: stringUndefined,
        itunesText: stringUndefined,
    },
    itunesKeywords: stringUndefined,
    posts: IFeedPost,
    pagination: IPagination,
}


interface IFeedPost {
    guid: stringUndefined,
    guidIsPermaLink: stringUndefined,
    title: stringUndefined,
    description: stringUndefined,
    pubDate: stringUndefined,
    author: stringUndefined,
    link: stringUndefined,
    contentEncoded: stringUndefined,
    enclosureLength: stringUndefined,
    enclosureType: stringUndefined,
    enclosureUrl: stringUndefined,
    itunesDuration: stringUndefined,
    itunesTitle: stringUndefined,
    itunesAuthor: stringUndefined,
    itunesSummary: stringUndefined,
    itunesSubtitle: stringUndefined,
    itunesExplicit: stringUndefined,
    itunesEpisodeType: stringUndefined,
    itunesKeywords: stringUndefined,
    itunesImageUrl: stringUndefined,
}

interface IFeed {
    url: string,
    title: string,
    status?: string,
    description: string,
    logoUrl: string,
    category: objectId,
    socialHandle: string,
    socialPage: string,
    user?: objectId,
}

interface FeedModel extends Model<IFeed> {
}

interface IFeedCategory {
    name: string,
    description: string,
    status?: string,
}

interface FeedCategoryModel extends Model<IFeedCategory> {
}

interface IFollowedFeed {
    feed: objectId,
    user: objectId,
}

interface IFollowCategoryFeed {
    category: objectId,
    user: objectId,
}

interface FollowedFeedModel extends Model<IFollowedFeed, Document> {
}

interface ISavedForLater {
    post: any,
    status?: string,
    user: objectId,
    feed: objectId,
}

interface SavedForLaterModel extends Model<ISavedForLater> {
}

export {
    IFeed,
    IRssFeed,
    IFeedPost,
    IFeedCategory,
    IFollowedFeed,
    ISavedForLater,
    FeedCategoryModel,
    SavedForLaterModel,
    FollowedFeedModel,
    FeedModel,
    IFollowCategoryFeed
}
