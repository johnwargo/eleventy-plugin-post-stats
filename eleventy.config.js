const postStats = require('./src/eleventy-plugin-post-stats.js');

module.exports = eleventyConfig => {

  eleventyConfig.addPlugin(postStats);

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