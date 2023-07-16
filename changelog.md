# Changelog

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
