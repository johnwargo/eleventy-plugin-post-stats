
const postStats = (eleventyConfig) => {
  eleventyConfig.addCollection('postStats', (collection) => {
    return { field1: 'value3', field2: 'value4' };
  });
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(postStats);
};