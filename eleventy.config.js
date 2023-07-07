const postStats = require('./eleventy-plugin-post-stats.js');

module.exports = eleventyConfig => {

  eleventyConfig.addPlugin(postStats, {debugMode: true });

  return {
		dir: {
      input: 'src',
			output: "_site",
			includes: "_includes",
			layouts: "_layouts",
			data: "_data"			
		}
	}
};