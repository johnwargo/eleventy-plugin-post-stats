# Changelog

## 20250112 v0.2.13

Implemented a fix for the January 1st problem described below. Added the local timezone offset to every date read from a post. 

## 20240111 v0.2.12

Troubleshooting a problem with the plugin improperly putting articles published on January 1, so I made some changes as I tested it. No functionality changes made. 

The issue stems from the plugin treating Eleventy post file `data.page.date` property as UTC time which isn't correct. That takes any post published on January 1st and treats it like it was published on December 31st of the previous year. I'll fix this and publish an update tomorrow.

## 20240115 v0.2.6

* Added code to fill in missing months in the monthly count data, a logic error on my part. To fix this, the plugin pre-populates the `months` array before processing posts.
* Added a calculation for heatmap chart height based on the number of years displayed.

## 20240115 v0.2.5

Multiple updates: 

* Fixed logic issue with site average posts adjusting the logic when the site has no posts in the year the site's being built. When I added the feature, I made a logic error in assuming that there would always be posts in the current year, but that may not be true with sites that are active and built periodically, but don't have posts for the current year. In this version I check for that condition and act accordingly (including the current year if the final post date is not in the current year).
* Added months array to the Year object and updated the plugin to place posts per month into the array. This is a non-breaking change as it's just an additional property added to the generated stats object.
* Added posts per month heatmap to the Home page (`index.liquid` file) to show off the new monthly posts data.
* Updated all of the other charts on the Home page to use [Apex Charts](https://apexcharts.com/); moved the [charts.js](https://www.chartjs.org/)-based charts to a separate page called Alternate.

## 20240107 v.02.4

* Removed current year from site average posts per year. No sense counting the current year since it skews the number early in the year.

## 20231223 v.02.3

* Added support for [cli-logger](https://www.npmjs.com/package/cli-logger) to make it easier to format console output.

## 20231219 v.02.2

* Added average posts per year property.

## 20230719 v.02.0

**Breaking Change** Realizing a few minutes after I published the last update that I added support for a single tag when I should have allowed for multiple tags. So, in this release, I changed the `tag` configuration option to `tags` and expect an array of strings instead of a single string value.

Right now it only supports articles with a single tag although you can generate stats on multiple tags. If you need this plugin to support multiple tags applied to the same article without duplicates, let me know and I'll add a dedupe to the plugin before generating stats.

## 20230717 v.01.6

* Modified options to allow using something other than `post` to build the collection of items processed. You can set the tag when you add the plugin to the Eleventy project.

## 20230716 v.01.5

* Fixed an error in the `index.liquid` file, data for yearly word count and paragraph count were swapped in the table.
* Also refactored the code a bunch to make it more readable.

## 20230715 v.01.3

* Added post statistics: character count, word count, paragraph count, and code block count

## 20230707

**Breaking Change** `count` changed to `postCount`

* Also converted source to TypeScript

## 20230706

* Rebuilt the Eleventy project so all site files go into the `src` folder to make the repo cleaner
* Added plugin option `debugMode` in preparation for adding more later.

## 20230516

* Updated console output to display the plugin name in brackets
* Added generation duration to the console output
