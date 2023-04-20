
const postStats = (eleventyConfig) => {
  eleventyConfig.addCollection('postStats', (collection) => {
    return { field1: 'value1', field2: 'value2' };
  });
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(postStats);
};