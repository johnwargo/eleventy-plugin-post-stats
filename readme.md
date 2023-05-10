# Eleventy Plugin Post Statistics

An Eleventy plugin that generates a statistics collection you can use in your Eleventy sites to display stats for your site. 

## Installation

To install the plugin, in a terminal window or command prompt pointing to your Eleventy project execute the following command:

```shell
npm install eleventy-plugin-post-stats
```

In your project's `eleventy.config.js` file, import the package using the following:

```js
const pluginStats = require('eleventy-plugin-post-stats');
```

And in the same file's `module.exports` section, along with all the other plugin statements you site uses, add the following `addPlugin` statement:

```js
module.exports = eleventyConfig => {

  // Only add the following line
  eleventyConfig.addPlugin(pluginStats);

}
```

## Usage 

The plugin loops through all of your site's posts and builds the following collection:

```json
{
  "avgDays": 44.81,
  "count": 16,
  "firstPostDate": "2021-04-01T00:00:00.000Z",
  "lastPostDate": "2023-03-19T00:00:00.000Z",
  "years": [
    { "year": 2021, "count": 8, "avgDays": 24 },
    { "year": 2022, "count": 5, "avgDays": 81.8 },
    { "year": 2023, "count": 3, "avgDays": 38.67 }
  ]
}
```

At the root level are the following properties:

* `avgDays`: The average number of days between posts for all posts
* `count`: The total number of posts in the site
* `firstPostDate`: The timestamp for the first post published
* `lastPostDate`: The timestamp for the most recent post
* `Years` array: An array of statistics (count and average number of days between posts) for each year's posts.

Using that data, you can create a page in your site similar to the following (with better style and formatting, of course):

![Sample Stats Page](https://github.com/johnwargo/eleventy-plugin-post-stats/blob/main/images/image-01.png)

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com).

If you find this code useful and feel like thanking me for providing it, please consider <a *href*="https://www.buymeacoffee.com/johnwargo" *target*="_blank">Buying Me a Coffee</a>, or making a purchase from [my Amazon Wish List](https://amzn.com/w/1WI6AAUKPT5P9).
