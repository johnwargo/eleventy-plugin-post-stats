/***********************************************
 * Eleventy Plugin Post Stats
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

function byDate(a, b) {
  return a.date - b.date;
}

module.exports = function(eleventyConfig, options = {}) {
  eleventyConfig.addCollection('postStats', (collectionApi) => {

    const APP_NAME = 'Eleventy-Plugin-Post-Stats';
    const durationStr = `[${APP_NAME}] Duration`;

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

    const debugMode = options.debugMode || false;
    if (debugMode) console.log(`[${APP_NAME}] Debug mode enabled`);

    console.log(`[${APP_NAME}] Generating post stats`);
    if (debugMode) console.log(`[${APP_NAME}] Processing ${currentYear} posts`);
    console.time(durationStr);
    for (let post of posts) {
      const postDate = post.data.page.date;
      const daysBetween = (postDate - prevPostDate) / (1000 * 60 * 60 * 24);
      // Did we change year?
      var thisYear = postDate.getFullYear();
      if (thisYear != currentYear) {
        if (debugMode) console.log(`[${APP_NAME}] Processing ${thisYear} posts`);
        // calculate the average days between posts
        avgDays = yearDays / yearCount;
        // Add our year stats to the object
        yearObject = { year: currentYear, count: yearCount, avgDays: avgDays.toFixed(2) };
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
      yearObject = { year: currentYear, count: yearCount, avgDays: avgDays.toFixed(2) };
      statsObject.years.push(yearObject);
    }    
    statsObject.avgDays = (totalDays / totalCount).toFixed(2);

    console.log(`[${APP_NAME}] Completed post stats generation`);
    console.timeEnd(durationStr);

    return statsObject;
  });
}
