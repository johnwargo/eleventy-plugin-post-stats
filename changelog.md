# Changelog

## 20230719 0.2.0

**Breaking Change** Realizing a few minutes after I published the last update that I added support for a single tag when I should have allowed for multiple tags. So, in this release, I changed the `tag` configuration option to `tags` and expect an array of strings instead of a single string value.

## 20230717 0.1.6

Modified options to allow using something other than `post` to build the collection of items processed. You can set the tag when you add the plugin to the Eleventy project.

## 20230716 0.1.5

* Fixed an error in the `index.liquid` file, data for yearly word count and paragraph count were swapped in the table.
* Also refactored the code a bunch to make it more readable.

## 20230715 0.1.3

Added post statistics: character count, word count, paragraph count, and code block count

## 20230707

Breaking change, `count` changed to `postCount`
Converted source to TypeScript

## 20230706

Rebuilt the Eleventy project so all site files go into the `src` folder to make the repo cleaner
Added plugin option `debugMode` in preparation for adding more later.

## 20230516

* Updated console output to display the plugin name in brackets
* Added generation duration to the console output
