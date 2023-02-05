import {paginate} from './index';
import {IFeedPost, IRssFeed} from '../../interface';

type pageInfo = {
	pageSize: number,
	pageNumber: number,
}

const transformRssFeed = async (feed: any, page: pageInfo): Promise<IRssFeed> => {
	const {result, pagination} = await paginate(feed.item, {pageSize: page.pageSize, pageNumber: page.pageNumber});

	return {
		title: feed.title?.[0],
		description: feed.description?.[0],
		copyright: feed.copyright?.[0],
		language: feed.language?.[0],
		pubDate: feed.pubDate?.[0],
		imageUrl: feed.image?.[0].url?.[0],
		link: feed.link?.[0],
		itunesType: feed['itunes:type']?.[0],
		itunesSummary: feed['itunes:summary']?.[0],
		itunesAuthor: feed['itunes:author']?.[0],
		itunesExplicit: feed['itunes:explicit']?.[0],
		itunesImage: feed['itunes:image']?.[0].href?.[0],
		itunesOwner: {
			name: feed['itunes:owner']?.[0]['itunes:name']?.[0],
			email: feed['itunes:owner']?.[0]['itunes:email']?.[0],
		},
		itunesCategory: {
			text: feed['itunes:category']?.[0].text?.[0],
			itunesText: feed['itunes:category']?.[0]['itunes:category']?.[0].text?.[0],
		},
		itunesKeywords: feed['itunes:keywords']?.[0],
		posts: transformFeedPosts(result),
		pagination,
	}
}

const transformFeedPosts = (posts: any): IFeedPost => {
	return posts.map((post: any) => {
		return {
			guid: post.guid?.[0]?.['_'],
			guidIsPermaLink: post.guid?.[0]?.['isPermaLink']?.[0],
			title: post.title?.[0],
			description: post.description?.[0],
			pubDate: post.pubDate?.[0],
			author: post.author?.[0],
			link: post.link?.[0],
			contentEncoded: post['content:encoded']?.[0],
			enclosureLength: post['enclosure']?.[0].length?.[0],
			enclosureType: post['enclosure']?.[0].type?.[0],
			enclosureUrl: post['enclosure']?.[0].url?.[0],
			itunesDuration: post['itunes:duration']?.[0],
			itunesTitle: post['itunes:title']?.[0],
			itunesAuthor: post['itunes:author']?.[0],
			itunesSummary: post['itunes:summary']?.[0],
			itunesSubtitle: post['itunes:subtitle']?.[0],
			itunesExplicit: post['itunes:explicit']?.[0],
			itunesEpisodeType: post['itunes:episodeType']?.[0],
			itunesKeywords: post['itunes:keywords']?.[0],
			itunesImageUrl: post['itunes:image']?.[0].url?.[0],
		};
	});
}


export {
	transformRssFeed
}
