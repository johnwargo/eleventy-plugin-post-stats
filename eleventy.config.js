const postStats = require('./src/eleventy-plugin-post-stats.js');

module.exports = eleventyConfig => {

  eleventyConfig.addPlugin(postStats);

  return {
    dir: {
      output: "_site",
    }
  }

};