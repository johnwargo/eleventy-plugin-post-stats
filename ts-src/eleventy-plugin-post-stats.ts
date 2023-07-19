/***********************************************
 * Eleventy Plugin Post Stats
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

const fs = require('fs');
const writingStats = require('writing-stats');

type ContentStats = {
  characterCount: number,
  codeBlockCount: number,
  paragraphCount: number,
  wordCount: number
}

type StatsObject = {
  avgDays: number,
  avgCharacterCount: number,
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
  avgCharacterCount: number,
  avgCodeBlockCount: number,
  avgParagraphCount: number,
  avgWordCount: number,
  postCount: number
}

type ModuleOptions = {
  debugMode?: boolean,
  tags?: string[]
}

const APP_NAME = 'Eleventy-Plugin-Post-Stats';
const durationStr = `[${APP_NAME}] Duration`;
const oneDayMilliseconds = 1000 * 60 * 60 * 24;

function byDate(a: any, b: any) {
  return a.date - b.date;
}

function countCodeBlocks(content: string): number {
  const regex = /```(.*?)```/gis;
  const matches = content.match(regex);
  if (matches) {
    return matches.length;
  } else {
    return 0;
  }
}

function processPostFile(filePath: string, debugMode: boolean): ContentStats {

  if (debugMode) console.log(`[${APP_NAME}] Processing ${filePath}`);

  try {
    // read the file
    let content = fs.readFileSync(filePath, 'utf8');
    // remove yaml front matter 
    // https://stackoverflow.com/questions/75845110/javascript-regex-to-replace-yaml-frontmatter
    content = content.replace(/---\n.*?\n---/s, '');
    // remove empty lines
    content = content.replace(/^\s*[\r\n]/gm, '');
    // count code blocks
    let codeBlocks = countCodeBlocks(content);
    // remove code blocks for the next part
    content = content.replace(/(```.+?```)/gms, '');
    // get the rest of the article stats
    let stats = writingStats(content);
    if (debugMode) {
      console.dir(stats);
      console.log();
    }
    return {
      characterCount: stats.characterCount,
      codeBlockCount: codeBlocks,
      paragraphCount: stats.paragraphCount,
      wordCount: stats.wordCount
    };
  } catch (err) {
    console.error(err);
    return {
      characterCount: 0,
      codeBlockCount: 0,
      paragraphCount: 0,
      wordCount: 0
    };
  }
}

module.exports = function (eleventyConfig: any, options: ModuleOptions = {}) {
  eleventyConfig.addCollection('postStats', (collectionApi: any) => {

    const debugMode = options.debugMode || false;
    // get the tag to use for the collection, default to post
    const tags: string[] = options.tags || ['post'];
    console.dir(options.tags);
    console.dir(tags);
    console.dir(...tags);
    // sort by date just to make sure
    const posts = collectionApi.getFilteredByTags(...tags).sort(byDate);
    const postCount = posts.length;

    //initialize the data object returned by the plugin 
    const statsObject: StatsObject = {
      avgDays: 0,
      avgCharacterCount: 0,
      avgCodeBlockCount: 0,
      avgParagraphCount: 0,
      avgWordCount: 0,
      postCount: postCount,
      firstPostDate: posts[0].data.page.date,
      lastPostDate: posts[postCount - 1].data.page.date,
      years: []
    }

    var avgDays = 0;
    var totalDays = 0;
    var totalPostCount = 0;
    var totalCharacterCount = 0;
    var totalCodeBlockCount = 0;
    var totalParagraphCount = 0;
    var totalWordCount = 0;
    var yearCharacterCount = 0;
    var yearCodeBlockCount = 0;
    var yearParagraphCount = 0;
    var yearWordCount = 0;
    var yearPostCount = 0;
    var yearPostDays = 0;
    var prevPostDate = posts[0].data.page.date;
    var currentYear = prevPostDate.getFullYear();

    if (debugMode) {
      console.log(`[${APP_NAME}] Debug mode enabled`);
    }
    console.log(`[${APP_NAME}] Generating statistics for ${postCount} "${tags}" items`);
    if (debugMode) console.log(`[${APP_NAME}] Processing ${currentYear} posts`);
    console.time(durationStr);

    for (let post of posts) {
      const postDate = post.data.page.date;
      const daysBetween = (postDate - prevPostDate) / oneDayMilliseconds;
      // Did we change year?
      var thisYear = postDate.getFullYear();
      if (thisYear != currentYear) {
        if (debugMode) console.log(`[${APP_NAME}] Processing ${thisYear} posts`);
        // calculate the average days between posts
        avgDays = yearPostDays / yearPostCount;
        // Add our year stats to the object
        let yearStats: YearStats = {
          year: currentYear,
          postCount: yearPostCount,
          avgDays: parseFloat(avgDays.toFixed(2)),
          avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
          avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
          avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
          avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))
        };
        statsObject.years.push(yearStats);
        // reset the year article counts
        yearCharacterCount = 0;
        yearCodeBlockCount = 0;
        yearParagraphCount = 0;
        yearWordCount = 0;
        yearPostCount = 0;
        yearPostDays = 0;
        currentYear = thisYear;
      }

      // update our stats
      prevPostDate = postDate;
      totalDays += daysBetween;
      yearPostDays += daysBetween;
      //update post counts
      totalPostCount++;
      yearPostCount++;

      // get the writing stats for the post
      const postStats: ContentStats = processPostFile(post.page.inputPath, debugMode);
      // update character counts
      totalCharacterCount += postStats.characterCount;
      yearCharacterCount += postStats.characterCount;
      // update code block counts
      totalCodeBlockCount += postStats.codeBlockCount;
      yearCodeBlockCount += postStats.codeBlockCount;
      // update paragraph counts
      totalParagraphCount += postStats.paragraphCount;
      yearParagraphCount += postStats.paragraphCount;
      // update word counts
      totalWordCount += postStats.wordCount;
      yearWordCount += postStats.wordCount;
    } // for (let post of posts) {

    // ================================================================
    // finish up the last year, works because posts are sorted by date
    // ================================================================

    if (yearPostCount > 0) {
      // calculate the average days between posts
      avgDays = yearPostDays / yearPostCount;
      // Add our year stats to the object
      let yearStats: YearStats = {
        year: currentYear,
        postCount: yearPostCount,
        avgDays: parseFloat(avgDays.toFixed(2)),
        avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
        avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
        avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
        avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))
      };
      statsObject.years.push(yearStats);
    }
    statsObject.avgDays = parseFloat((totalDays / totalPostCount).toFixed(2));
    statsObject.avgCharacterCount = parseFloat((totalCharacterCount / totalPostCount).toFixed(2));
    statsObject.avgCodeBlockCount = parseFloat((totalCodeBlockCount / totalPostCount).toFixed(2));
    statsObject.avgParagraphCount = parseFloat((totalParagraphCount / totalPostCount).toFixed(2));
    statsObject.avgWordCount = parseFloat((totalWordCount / totalPostCount).toFixed(2));

    console.log(`[${APP_NAME}] Completed post stats generation`);
    console.timeEnd(durationStr);

    if (debugMode) {
      console.log(`\n[${APP_NAME}] Post Stats Object`);
      console.log('-'.repeat(50));
      console.dir(statsObject);
      console.log();
    }

    return statsObject;
  });
}
