const postStats = require('./eleventy-plugin-post-stats.js');

module.exports = eleventyConfig => {

  const debugMode = true;

  // eleventyConfig.addPlugin(postStats);
  eleventyConfig.addPlugin(postStats, {debugMode});  
  // eleventyConfig.addPlugin(postStats, { debugMode, tags: ['post', 'news'] });
  // eleventyConfig.addPlugin(postStats, { debugMode, tags: ['news'] });
  // eleventyConfig.addPlugin(postStats, { debugMode, tags: ['post', 'news'] });

  eleventyConfig.addFilter('commaize', function (num, locale = 'en-us') {
    return num.toLocaleString(locale);
  });

  eleventyConfig.addPassthroughCopy('src/assets/');

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    }
  }
};