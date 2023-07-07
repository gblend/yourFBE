export default {
  '/posts/recent': {
    get: {
      tags: ['Post'],
      description: 'Recent feed posts',
      summary: 'retrieves recent posts',
      operationId: 'recentPost',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'postSize',
          in: 'query',
          description: 'The number of posts to retrieve',
          type: 'number',
          example: 1,
        },
        {
          name: 'pageNumber',
          in: 'query',
          description: 'The number of the feed page to retrieve',
          type: 'number',
          example: 1,
        },
        {
          name: 'limit',
          in: 'query',
          description: 'The number of feeds to fetch',
          type: 'number',
          example: 10,
        },
      ],
      responses: {
        '200': {
          description: 'Recent posts successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Request processed successfully.',
                data: {
                  recentPosts: [
                    {
                      language: 'en',
                      feedTitle: 'Unraveled',
                      feedCategory: {
                        text: 'True Crime',
                      },
                      feedImageUrl:
                        'https://assets.pippa.io/shows/61b764f51695625f91e9505c/show-cover.jpg',
                      posts: [
                        {
                          guid: '646d08e1a4d7190011fdc7bf',
                          guidIsPermaLink: 'false',
                          title:
                            'Introducing Mind of a Monster: Aileen Wuornos',
                          description:
                            "<p>If you enjoyed Unraveled, you might also like Mind of a Monster from ID. Check out episode 1 of Mind of a Monster: Aileen Wuornos. Follow Mind of a Monster wherever you get your podcasts. </p><br><p>From 1989 to 1990, Aileen Wuornos killed seven men as she hitchhiked along Florida’s highways. Some were giving a woman in need a ride, others gave her money for sex, but they all fell victim to the rock ‘n’ roll biker chick dubbed the ‘Damsel of Death’. Across 6 episodes, criminal psychologist Dr. Michelle Ward speaks to detectives, witnesses, and experts to delve into the mind of Aileen Wuornos, a woman fueled by rage after decades of abuse at the hands of men. We’ll hear Aileen’s innermost feelings and thoughts, through letters she sent from prison to her best friend.</p><br /><hr><p style='color:grey; font-size:0.75em;'> Hosted on Acast. See <a style='color:grey;' target='_blank' rel='noopener noreferrer' href='https://acast.com/privacy'>acast.com/privacy</a> for more information.</p>",
                          pubDate: 'Tue, 30 May 2023 07:00:28 GMT',
                          link: 'https://shows.acast.com/unraveled/episodes/introducing-mind-of-a-monster-aileen-wuornos',
                          enclosureLength: '37098950',
                          enclosureType: 'audio/mpeg',
                          enclosureUrl:
                            'https://sphinx.acast.com/p/acast/s/unraveled/e/646d08e1a4d7190011fdc7bf/media.mp3',
                          itunesDuration: '38:38',
                          itunesTitle:
                            'Introducing Mind of a Monster: Aileen Wuornos',
                          itunesSummary:
                            "<p>If you enjoyed Unraveled, you might also like Mind of a Monster from ID. Check out episode 1 of Mind of a Monster: Aileen Wuornos. Follow Mind of a Monster wherever you get your podcasts. </p><br><p>From 1989 to 1990, Aileen Wuornos killed seven men as she hitchhiked along Florida’s highways. Some were giving a woman in need a ride, others gave her money for sex, but they all fell victim to the rock ‘n’ roll biker chick dubbed the ‘Damsel of Death’. Across 6 episodes, criminal psychologist Dr. Michelle Ward speaks to detectives, witnesses, and experts to delve into the mind of Aileen Wuornos, a woman fueled by rage after decades of abuse at the hands of men. We’ll hear Aileen’s innermost feelings and thoughts, through letters she sent from prison to her best friend.</p><br /><hr><p style='color:grey; font-size:0.75em;'> Hosted on Acast. See <a style='color:grey;' target='_blank' rel='noopener noreferrer' href='https://acast.com/privacy'>acast.com/privacy</a> for more information.</p>",
                          itunesExplicit: 'yes',
                          itunesEpisodeType: 'bonus',
                        },
                      ],
                    },
                    {
                      language: 'en',
                      feedTitle: 'The Apology Line',
                      feedCategory: {},
                      feedImageUrl:
                        'https://content.production.cdn.art19.com/images/be/e1/82/c2/bee182c2-14b7-491b-b877-272ab6754025/bd4ab6d08d7b723678a682b6e399d26523245b3ba83f61617b9b28396aba1092b101cd86707576ec021b77e143b447463342b352f8825265b15310c989b6cb93.jpeg',
                      posts: [
                        {
                          guid: 'gid://art19-episode-locator/V0/t4lrXlLWjuJE1m6FySMqLmZ5OSZQytO_wXEF3zdcrhs',
                          guidIsPermaLink: 'false',
                          title:
                            'Listen Now: Spellcaster: The Fall of Sam Bankman-Fried',
                          description:
                            '\n        <p>From Wondery and Bloomberg, the makers of The Shrink Next Door, comes a new story of incredible wealth, betrayal, and what happens when “doing good” goes really, really bad.</p><p>When nerdy gamer Sam Bankman-Fried rocketed to fame as the world’s richest 29-year-old, he pledged to donate his billions to good causes. But when Sam\'s crypto exchange FTX collapsed, billions of dollars went missing, and Sam was in handcuffs, those who knew him were left wondering — who was Sam really? A well-meaning billionaire who made a mistake? Or a calculated con man?</p><p><br></p><p>Listen to Spellcaster: <a href="http://Wondery.fm/SC_TAL" rel="noopener noreferrer" target="_blank"><u>Wondery.fm/SC_TAL</u></a></p><p>See Privacy Policy at <a href="https://art19.com/privacy" rel="noopener noreferrer" target="_blank">https://art19.com/privacy</a> and California Privacy Notice at <a href="https://art19.com/privacy#do-not-sell-my-info" rel="noopener noreferrer" target="_blank">https://art19.com/privacy#do-not-sell-my-info</a>.</p>\n      ',
                          pubDate: 'Mon, 05 Jun 2023 08:00:00 -0000',
                          contentEncoded:
                            '\n        <p>From Wondery and Bloomberg, the makers of The Shrink Next Door, comes a new story of incredible wealth, betrayal, and what happens when “doing good” goes really, really bad.</p><p>When nerdy gamer Sam Bankman-Fried rocketed to fame as the world’s richest 29-year-old, he pledged to donate his billions to good causes. But when Sam\'s crypto exchange FTX collapsed, billions of dollars went missing, and Sam was in handcuffs, those who knew him were left wondering — who was Sam really? A well-meaning billionaire who made a mistake? Or a calculated con man?</p><p><br></p><p>Listen to Spellcaster: <a href="http://Wondery.fm/SC_TAL" rel="noopener noreferrer" target="_blank"><u>Wondery.fm/SC_TAL</u></a></p><p>See Privacy Policy at <a href="https://art19.com/privacy" rel="noopener noreferrer" target="_blank">https://art19.com/privacy</a> and California Privacy Notice at <a href="https://art19.com/privacy#do-not-sell-my-info" rel="noopener noreferrer" target="_blank">https://art19.com/privacy#do-not-sell-my-info</a>.</p>\n      ',
                          enclosureLength: '8704417',
                          enclosureType: 'audio/mpeg',
                          enclosureUrl:
                            'https://dts.podtrac.com/redirect.mp3/chrt.fm/track/9EE2G/pdst.fm/e/rss.art19.com/episodes/b90680ff-bb5b-4ca7-a73b-94e77ef43a35.mp3?rss_browser=BAhJIgxNb3ppbGxhBjoGRVQ%3D--4f04cd103bfdd3e94cbbb356ead53321a4d63e94',
                          itunesDuration: '00:09:04',
                          itunesTitle:
                            'Listen Now: Spellcaster: The Fall of Sam Bankman-Fried',
                          itunesSummary:
                            "From Wondery and Bloomberg, the makers of The Shrink Next Door, comes a new story of incredible wealth, betrayal, and what happens when “doing good” goes really, really bad.\n\nWhen nerdy gamer Sam Bankman-Fried rocketed to fame as the world’s richest 29-year-old, he pledged to donate his billions to good causes. But when Sam's crypto exchange FTX collapsed, billions of dollars went missing, and Sam was in handcuffs, those who knew him were left wondering — who was Sam really? A well-meaning billionaire who made a mistake? Or a calculated con man?\n\n\n\n\nListen to Spellcaster: Wondery.fm/SC_TAL\n\nSee Privacy Policy at https://art19.com/privacy and California Privacy Notice at https://art19.com/privacy#do-not-sell-my-info.",
                          itunesExplicit: 'yes',
                          itunesEpisodeType: 'trailer',
                          itunesKeywords:
                            'SERIAL KILLER,TRUE CRIME,Society,This American Life,Murder,Apology,Apology Line,Binge Worthy Documentary,New York City,Binge-Worthy True Crime,exhibit c',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        '404': {
          description: 'Recent feed posts not found',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed',
                data: {
                  recentPosts: [],
                },
              },
            },
          },
        },
      },
    },
  },
};
