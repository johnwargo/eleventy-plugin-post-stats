
function byDate(a, b) {
  return a.date - b.date;
}

function truncFloat(num) {
  return parseFloat(num.toFixed(2));
}

const postStats = (eleventyConfig) => {
  eleventyConfig.addCollection('postStats', (collectionApi) => {
    // sort by date just to make sure
    const posts = collectionApi.getFilteredByTags("post").sort(byDate);

    const postCount = posts.length;   
    const statsObject = {
      avgDays: 0,
      count: postCount,
      firstPostDate: posts[0].data.page.date,
      lastPostDate: posts[postCount - 1].data.page.date,
      years: []
    }

    var avgDays = 0;
    var totalCount = 0;
    var totalDays = 0;
    var yearCount = 0;
    var yearDays = 0;
    var prevPostDate = posts[0].data.page.date;
    var currentYear = prevPostDate.getFullYear();

    // loop though the posts and write the date to the console
    for (let post of posts) {
      const postDate = post.data.page.date;
      const daysBetween = (postDate - prevPostDate) / (1000 * 60 * 60 * 24);
      // Did we change year?
      var thisYear = postDate.getFullYear();
      if (thisYear != currentYear) {
        // calculate the average days between posts
        avgDays = yearDays / yearCount;
        // Add our year stats to the object
        yearObject = { year: currentYear, count: yearCount, avgDays: truncFloat(avgDays) };
        statsObject.years.push(yearObject);
        // reset the year article count
        yearCount = 0;
        yearDays = 0;
        currentYear = thisYear;
      }
      totalCount++;
      totalDays += daysBetween;
      yearCount++;
      yearDays += daysBetween;
      prevPostDate = postDate;
    }
    if (yearCount > 0) {
      // calculate the average days between posts
      avgDays = yearDays / yearCount;
      // Add our year stats to the object
      yearObject = { year: currentYear, count: yearCount, avgDays: truncFloat(avgDays) };
      statsObject.years.push(yearObject);
    }
    statsObject.avgDays = truncFloat(totalDays / totalCount);
    // console.dir(statsObject);
    return statsObject;
  });
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(postStats);
};