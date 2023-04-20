
function byDate(a, b) {
  return a.date - b.date; 
}

const postStats = (eleventyConfig) => {
  eleventyConfig.addCollection('postStats', (collection) => {
    const posts = collection.getFilteredByTags("post").sort(byDate);
    const postCount = posts.length;
    const statsObject = {
      postCount: postCount,
      firstPostDate: posts[0].date,
      lastPostDate: posts[postCount - 1].date,
    }

    return statsObject;
  });
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(postStats);
};