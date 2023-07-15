/***********************************************
 * Eleventy Plugin Post Stats
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

type StatsObject = {
  avgDays: number,
  avgCodeBlockCount: number
  avgParagraphCount: number,
  avgWordCount: number,
  firstPostDate: Date,
  lastPostDate: Date,
  postCount: number,
  years: YearStats[],
}

type YearStats = {
  year: number,
  avgDays: number,
  avgCodeBlockCount?: number,
  avgParagraphCount?: number,
  avgWordCount?: number,
  postCount: number
}

type ModuleOptions = {
  debugMode?: boolean
}

function byDate(a: any, b: any) {
  return a.date - b.date;
}

function countCodeBlocks(content: string): number {
  const regex = /<pre.*?>(.*?)<\/pre>/gis;
  const matches = content.match(regex);
  if (matches) {
    return matches.length;
  } else {
    return 0;
  }
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
      avgCodeBlockCount: 0,
      avgParagraphCount: 0,
      avgWordCount: 0,
      postCount: postCount,
      firstPostDate: posts[0].data.page.date,
      lastPostDate: posts[postCount - 1].data.page.date,
      years: []
    }

    var avgDays = 0;
    var totalPostCount = 0;
    var totalCodeBlockCount = 0;
    var totalParagraphCount = 0;
    var totalWordCount = 0;
    var totalDays = 0;
    var yearCodeBlockCount = 0;
    var yearParagraphCount = 0;
    var yearWordCount = 0;
    var yearPostCount = 0;
    var yearPostDays = 0;
    var prevPostDate = posts[0].data.page.date;
    var currentYear = prevPostDate.getFullYear();

    const debugMode = options.debugMode || false;
    if (debugMode) console.log(`[${APP_NAME}] Debug mode enabled`);

    console.log(`[${APP_NAME}] Generating post stats`);
    if (debugMode) console.log(`[${APP_NAME}] Processing ${currentYear} posts`);
    console.time(durationStr);
    for (let post of posts) {

      console.dir(post);

      const postDate = post.data.page.date;
      const daysBetween = (postDate - prevPostDate) / (1000 * 60 * 60 * 24);
      // Did we change year?
      var thisYear = postDate.getFullYear();
      if (thisYear != currentYear) {
        if (debugMode) console.log(`[${APP_NAME}] Processing ${thisYear} posts`);
        // calculate the average days between posts
        avgDays = yearPostDays / yearPostCount;
        // Add our year stats to the object
        let yearObject: YearStats = { 
          year: currentYear, 
          postCount: yearPostCount, 
          avgDays: parseFloat(avgDays.toFixed(2)),
          avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
          avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
          avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))        
        };
        statsObject.years.push(yearObject);
        // reset the year article counts
        yearPostCount = 0;
        yearPostDays = 0;
        currentYear = thisYear;
      }

      // lets do that code block thing
      let codeBlockCount = countCodeBlocks(post.templateContent);
      yearCodeBlockCount += codeBlockCount;
      totalCodeBlockCount += codeBlockCount;

      // Now paragraph count


      // Now word count

      
      totalPostCount++;
      totalDays += daysBetween;
      yearPostCount++;
      yearPostDays += daysBetween;
      prevPostDate = postDate;
    }
    if (yearPostCount > 0) {
      // calculate the average days between posts
      avgDays = yearPostDays / yearPostCount;
      // Add our year stats to the object
      let yearObject: YearStats = { year: currentYear, postCount: yearPostCount, avgDays: parseFloat(avgDays.toFixed(2)) };
      statsObject.years.push(yearObject);
    }
    statsObject.avgDays = parseFloat((totalDays / totalPostCount).toFixed(2));
    statsObject.avgCodeBlockCount = parseFloat((totalCodeBlockCount / totalPostCount).toFixed(2));
    statsObject.avgParagraphCount = parseFloat((totalParagraphCount / totalPostCount).toFixed(2));
    statsObject.avgWordCount = parseFloat((totalWordCount / totalPostCount).toFixed(2));

    console.log(`[${APP_NAME}] Completed post stats generation`);
    console.timeEnd(durationStr);

    return statsObject;
  });
}
