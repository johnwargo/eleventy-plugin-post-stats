# Eleventy Plugin Post Statistics

An Eleventy plugin that generates a site posts statistics collection you can use in [Eleventy](https://www.11ty.dev/) sites to display stats for your site. Here is an example from [johnwargo.com](https://johnwargo.com/statistics/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/115f4c2d-998f-4010-a1cf-ca0c3973b4d5/deploy-status)](https://app.netlify.com/sites/eleventy-plugin-post-stats/deploys)

The repository includes a complete Eleventy project you can serve to see the plugin in action; [see it now](https://eleventy-plugin-post-stats.netlify.app/).

**Note:** The plugin assumes your post files are in markdown format and tagged with `post`. You can configure the plugin to process documents assigned to other tags.

## Installation

To install the plugin, in a terminal window or command prompt pointing to your Eleventy project execute the following command:

```shell
npm install eleventy-plugin-post-stats
```

In your project's `eleventy.config.js` file, import the package (at the top of the file) using:

```js
const pluginStats = require('eleventy-plugin-post-stats');
```

And in the same file's `module.exports` section, along with all the other plugin statements you site uses, add the following `addPlugin` statement:

```js
module.exports = eleventyConfig => {

  // add only the following line
  eleventyConfig.addPlugin(pluginStats);

}
```

The complete file should look something like the following (but with your site's other stuff in it too):

```js
const postStats = require('./eleventy-plugin-post-stats.js');

module.exports = eleventyConfig => {

  eleventyConfig.addPlugin(postStats);
  
};
```

With this in place, you Eleventy site has a new collection called `postStats`, you can access it using `collections.postStats`.  

By default, the plugin processes all posts tagged with a `tag` of `post`. If you want statistics calculated based on posts with a different `tag` value, specify the `tags` property containing an array of tags in the options passed to the plugin when you add it in your Eleventy project.

**Note:** The plugin assumes each article is tagged with a single tag. If your site has multiple tags assigned to an article, it will get counted more that once in the stats: once for each tag value.

For example, to calculate statistics for all articles tagged with `news`, add the plugin to your project using the following:

```js
eleventyConfig.addPlugin(postStats, { tags: ['news'] });
```

If you want to process both `posts` and `news` items, add the plugin to your project passing in an array listing the tags:

```js
eleventyConfig.addPlugin(postStats, { tags: ['post', 'news'] });
```

You can enhance the output the plugin sends to the terminal as the plugin executes by enabling Debug Mode:

```js
eleventyConfig.addPlugin(postStats, { debugMode: true });
```

Enable both using:

```js
eleventyConfig.addPlugin(postStats, { debugMode: true, tag: ['post'] });
```

or

```js
eleventyConfig.addPlugin(postStats, { debugMode: true, tag: ['news'] });
```

or

```js
eleventyConfig.addPlugin(postStats, { debugMode: true, tag: ['post', 'news'] });
```

When the plugin executes during an Eleventy site build, loops through all of your site's posts and builds the following collection:

**Note:** The `months` data shown in the example was manually edited, the data does not accurately reflect the actual post counts for the year. It is just made data up to demonstrate the data structure.

```json
{
  "avgDays": 11.17,
  "avgCharacterCount": 2034.27,
  "avgCodeBlockCount": 0.02,
  "avgParagraphCount": 3.25,
  "avgPostsPerYear": 27.5,
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
      "avgWordCount": 369.06,
      "months": [
        { "month": "January", "postCount": 2 },
        { "month": "February", "postCount": 5 },
        { "month": "March", "postCount": 2 },
        { "month": "April", "postCount": 2 },
        { "month": "May", "postCount": 2 },
        { "month": "June", "postCount": 2 },
        { "month": "July", "postCount": 2 },
        { "month": "August", "postCount": 3 },
        { "month": "September", "postCount": 2 },
        { "month": "October", "postCount": 4 },
        { "month": "November", "postCount": 2 },
        { "month": "December", "postCount": 5 }
      ]
    },
    {
      "year": 2022,
      "postCount": 29,
      "avgDays": 12.41,
      "avgCharacterCount": 2015.14,
      "avgCodeBlockCount": 0,
      "avgParagraphCount": 3.28,
      "avgWordCount": 361.59,
      "months": [
        { "month": "January", "postCount": 8 },
        { "month": "February", "postCount": 3 },
        { "month": "March", "postCount": 1 },
        { "month": "April", "postCount": 3 },
        { "month": "May", "postCount": 5 },
        { "month": "June", "postCount": 5 },
        { "month": "July", "postCount": 6 },
        { "month": "August", "postCount": 2 },
        { "month": "September", "postCount": 2 },
        { "month": "October", "postCount": 4 },
        { "month": "November", "postCount": 2 },
        { "month": "December", "postCount": 5 }
      ]
    },
    {
      "year": 2023,
      "postCount": 19,
      "avgDays": 10.37,
      "avgCharacterCount": 1949.47,
      "avgCodeBlockCount": 0,
      "avgParagraphCount": 3.13,
      "avgWordCount": 352.95,
      "months": [
        { "month": "January", "postCount": 6 },
        { "month": "February", "postCount": 0 },
        { "month": "March", "postCount": 1 },
        { "month": "April", "postCount": 3 },
        { "month": "May", "postCount": 2 },
        { "month": "June", "postCount": 2 },
        { "month": "July", "postCount": 5 },
        { "month": "August", "postCount": 7 },
        { "month": "September", "postCount": 2 },
        { "month": "October", "postCount": 2 },
        { "month": "November", "postCount": 2 },
        { "month": "December", "postCount": 5 }
      ]
    }
  ]
}
```

At the root level are the following site-wide properties:

* `avgDays`: The average number of days between posts for the entire site.
* `avgCharacterCount`: The average number of post characters per post for the entire site.
* `avgCodeBlockCount`: The average number of code blocks per post for the entire site.
* `avgParagraphCount`: The average number of paragraphs per post for the entire site.
* `avgPostsPerYear`: The average number of posts per year.
* `avgWordCount`" The average number of words per post for the entire site.
* `postCount`: The total number of posts in the site
* `firstPostDate`: The timestamp for the first post published
* `lastPostDate`: The timestamp for the most recent post
* `Years` array: An array of statistics (postCount and average number of days between posts) for each year's posts shown in the example above.

Here's an example in Liquid for rendering those values in an Eleventy site:

```html
<ul>
  <li>
    <strong>First post:</strong>
    {{ collections.postStats.firstPostDate }}
  </li>
  <li>
    <strong>Last post:</strong>
    {{ collections.postStats.lastPostDate }}
  </li>
  <li>
    <strong>Post count:</strong>
    {{ collections.postStats.postCount }}
  </li>
  <li>
    <strong>Average days between posts:</strong>
    {{ collections.postStats.avgDays }}
  </li>
  <li>
    <strong>Average characters per post:</strong>
    {{ collections.postStats.avgCharacterCount }}
  </li>
  <li>
    <strong>Average words per post:</strong>
    {{ collections.postStats.avgWordCount }}
  </li>
  <li>
    <strong>Average paragraphs per post:</strong>
    {{ collections.postStats.avgParagraphCount }}
  </li>
  {%- if collections.postStats.avgCodeBlockCount > 0 -%}
    <li>
      <strong>Average code blocks per post:</strong>
      {{ collections.postStats.avgCodeBlockCount }}
    </li>
  {% endif %}
</ul>
```

The `years` array contains many of those same properties, scoped to all posts for the year:

* `avgDays`: The average number of days between posts for the selected year.
* `avgCharacterCount`: The average number of post characters per post for the selected year.
* `avgCodeBlockCount`: The average number of code blocks per post for the selected year.
* `avgParagraphCount`: The average number of paragraphs per post for the selected year.
* `avgWordCount`" The average number of words per post for the selected year.
* `postCount`: The total number of posts in the site for the year
* `months`: An array of posts per month statistics for the selected year, each array element (in month order) stores both the month name and monthly post count: `( month: 'January', postCount: 23)`.

Using that data, you can create a page in your site similar to the following (with better style and formatting, of course):

![Sample Stats Page](images/image-01.png)

Refer to this project's [index.liquid](https://github.com/johnwargo/eleventy-plugin-post-stats/blob/main/src/index.liquid) file for the source code for that page.

## Launching the Test Site

To view the sample statistics page, make a local clone of the repo then:

1. Open a terminal window or command prompt and execute the following command: `npm install`
2. Start Eleventy's `serve` process by executing `npm start`
3. Click the link to launch the site in the browser.

Early versions of this plugin (up to version 0.2.4) used [Charts.js](https://www.chartjs.org/) to generate the graphs on the sample site's home page. Starting with version 0.2.5, I converted the sample site's Home page to use [Apex Charts](https://apexcharts.com/) since I liked the style and capabilities of the charts plus the library supports heat maps which is something I wanted to add since this plugin now has posts per month capabilities. 

I kept the old page around, you can access it using the menu at the top of the sample site, so you have two examples to use to learn how to use this plugin in your site.

## Notes

Eleventy doesn't let you access page content from a plugin, at least I couldn't figure out how to do so, so the plugin reads each post file from the file system during processing. My hope is that someday the Eleventy team removes that restriction, it should improve the performance of the plugin for larger sites. Right now Eleventy reads all the post files, then the plugin does it again, so each post gets loaded from the file system twice.

I didn't code the post stats stuff, instead the plugin uses the [Writing-stats](https://www.npmjs.com/package/writing-stats) package to handle the character, word, amd paragraph counting.

The sample statistics page uses [MVP.css](https://andybrewer.github.io/mvp/) to make the site's sole page prettier without any direct styling. You should be able to take the repository's [index.liquid](https://github.com/johnwargo/eleventy-plugin-post-stats/blob/main/src/index.liquid) file and copy it over to your Eleventy project renaming it to `statistics.liquid` to add stats to the site.

***

You can find information on many different topics on my [personal blog](http://www.johnwargo.com). Learn about all of my publications at [John Wargo Books](http://www.johnwargobooks.com).

If you find this code useful and feel like thanking me for providing it, please consider <a href="https://www.buymeacoffee.com/johnwargo" target="_blank">Buying Me a Coffee</a>, or making a purchase from [my Amazon Wish List](https://amzn.com/w/1WI6AAUKPT5P9).
