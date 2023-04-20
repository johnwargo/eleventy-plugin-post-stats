const postStats = require('./src/eleventy-plugin-post-stats.js');
const pluginDate = require("eleventy-plugin-date");

module.exports = eleventyConfig => {

  eleventyConfig.addPlugin(postStats);
  eleventyConfig.addPlugin(pluginDate);

  const english = new Intl.DateTimeFormat("en");
	eleventyConfig.addFilter("niceDate", function (d) {
		return english.format(d);
	});
  
  return {
    dir: {
      output: "_site",
    }
  }

};