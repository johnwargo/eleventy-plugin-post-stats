/***********************************************
 * Eleventy Plugin Post Stats
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

type StatsObject = {
  avgDays: number,
  codeBlockCount?: number
  postCount: number,
  firstPostDate: Date,
  lastPostDate: Date,
  paragraphCount?: number,
  wordCount?: number,
  years: YearStats[],
}

type YearStats = {
  year: number,
  postCount: number,
  avgDays: number,
  paragraphCount?: number,
  wordCount?: number,
  codeBlockCount?: number
}

type ModuleOptions = {
  debugMode?: boolean
}

function byDate(a: any, b: any) {
  return a.date - b.date;
}

module.exports = function (eleventyConfig: any, options: ModuleOptions) {
  eleventyConfig.addCollection('postStats', (collectionApi: any) => {

    const APP_NAME = 'Eleventy-Plugin-Post-Stats';
    const durationStr = `[${APP_NAME}] Duration`;

    // sort by date just to make sure
    const posts = collectionApi.getFilteredByTags("post").sort(byDate);

    const postCount = posts.length;
    const statsObject: StatsObject = {
      avgDays: 0,
      postCount: postCount,
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
        let yearObject: YearStats = { year: currentYear, postCount: yearCount, avgDays: parseFloat(avgDays.toFixed(2)) };
        statsObject.years.push(yearObject);
        // reset the year article counts
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
      let yearObject: YearStats = { year: currentYear, postCount: yearCount, avgDays: parseFloat(avgDays.toFixed(2)) };
      statsObject.years.push(yearObject);
    }
    statsObject.avgDays = parseFloat((totalDays / totalCount).toFixed(2));

    console.log(`[${APP_NAME}] Completed post stats generation`);
    console.timeEnd(durationStr);

    return statsObject;
  });
}
