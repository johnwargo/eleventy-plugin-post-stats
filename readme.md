# Eleventy Plugin Post Statistics

An Eleventy plugin that generates a statistics collection you can use in your Eleventy sites to display stats for your site. 

Eleventy doesn't let you access page content from a plugin, at least I couldn't figure out how, so the plugin...

**Note:** This plugin uses the [Writing-stats](https://www.npmjs.com/package/writing-stats) package to handle the character, word, amd paragraph counting.

sample page uses mvp (add link) for formatting


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


writeData: true

debugMode: true


## Usage 

The plugin loops through all of your site's posts and builds the following collection:

```json
{
  "avgDays": 11.17,
  "avgCharacterCount": 2034.27,
  "avgCodeBlockCount": 0.02,
  "avgParagraphCount": 3.25,
  "avgWordCount": 366.45,
  "postCount": 100,
  "firstPostDate": "2020-06-20T00:00:00.000Z",
  "lastPostDate": "2023-07-12T00:00:00.000Z",
  "years": [    
    {
      "year": 2021,
      "postCount": 31,
      "avgDays": 11.84,
      "avgCharacterCount": 2045.42,
      "avgCodeBlockCount": 0,
      "avgParagraphCount": 3.24,
      "avgWordCount": 369.06
    },
    {
      "year": 2022,
      "postCount": 29,
      "avgDays": 12.41,
      "avgCharacterCount": 2015.14,
      "avgCodeBlockCount": 0,
      "avgParagraphCount": 3.28,
      "avgWordCount": 361.59
    },
    {
      "year": 2023,
      "postCount": 19,
      "avgDays": 10.37,
      "avgCharacterCount": 1949.47,
      "avgCodeBlockCount": 0,
      "avgParagraphCount": 3.13,
      "avgWordCount": 352.95
    }
  ]
}
```


At the root level are the following properties:

* `avgDays`: The average number of days between posts for all posts
* `postCount`: The total number of posts in the site
* `firstPostDate`: The timestamp for the first post published
* `lastPostDate`: The timestamp for the most recent post
* `Years` array: An array of statistics (postCount and average number of days between posts) for each year's posts.

Using that data, you can create a page in your site similar to the following (with better style and formatting, of course):

![Sample Stats Page](images/image-01.png)

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com).

If you find this code useful and feel like thanking me for providing it, please consider <a href="https://www.buymeacoffee.com/johnwargo" target="_blank">Buying Me a Coffee</a>, or making a purchase from [my Amazon Wish List](https://amzn.com/w/1WI6AAUKPT5P9).
