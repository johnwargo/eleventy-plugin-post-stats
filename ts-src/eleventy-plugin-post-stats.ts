/***********************************************
 * Eleventy Plugin Post Stats
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

import fs from 'fs';
//@ts-ignore
import logger from 'cli-logger';
//@ts-ignore
import writingStats from 'writing-stats';

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
  avgPostsPerYear: number,
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

// configure the logger
var conf: any = { console: true, level: logger.INFO };
conf.prefix = function (record: any) {
  return `[${APP_NAME}]`;
}
var log = logger(conf);

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
  if (debugMode) log.info(`Processing ${filePath}`);
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
      log.info();
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

    //initialize the data object returned by the plugin 
    const statsObject: StatsObject = {
      avgDays: 0,
      avgCharacterCount: 0,
      avgCodeBlockCount: 0,
      avgParagraphCount: 0,
      avgPostsPerYear: 0,
      avgWordCount: 0,
      postCount: 0,
      firstPostDate: new Date(),
      lastPostDate: new Date(),
      years: []
    }

    const debugMode = options.debugMode || false;
    log.level(debugMode ? log.DEBUG : log.INFO);
    log.debug('Debug mode enabled\n');

    // get the tag to use for the collection, default to post
    const tags: string[] = options.tags || ['post'];
    // make an empty array for the posts
    var posts: any[] = [];
    // Process each tag separately since getFilteredByTag looks for
    // posts with all of the tags, not just the one we want
    for (let tag of tags) {
      log.info(`Getting articles tagged with "${tag}"`);
      let tagPosts = collectionApi.getFilteredByTag(tag);
      log.info(`Found ${tagPosts.length} "${tag}" articles`);
      posts.push(...tagPosts);
    }
    const postCount = posts.length;
    if (postCount < 1) {
      log.info(`No articles found for tag(s): ${tags.join(', ')}`);
      // return the empty stats object
      return statsObject;
    }

    // sort by date just to make sure
    posts = posts.sort(byDate);
    // we have a post count greater than zero, so use it to initialize some 
    // previous placeholder properties
    statsObject.postCount = postCount;
    statsObject.firstPostDate = posts[0].data.page.date;
    statsObject.lastPostDate = posts[postCount - 1].data.page.date;
    var prevPostDate = posts[0].data.page.date;
    var currentYear = prevPostDate.getFullYear();

    log.info(`Generating statistics for ${postCount} articles`);
    log.info(`Processing articles for ${currentYear}`);
    console.time(durationStr);

    for (let post of posts) {
      let postDate = post.data.page.date;
      let daysBetween = (postDate - prevPostDate) / oneDayMilliseconds;
      // Did we change year?
      let thisYear = postDate.getFullYear();
      if (thisYear != currentYear) {
        if (debugMode) log.info(`Processing articles for ${thisYear}`);
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
    // finish up the last year, this works because posts are 
    // sorted by date
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

    // now, for average posts per year, ignore the current year. (v0.2.4)
    var tmpCount = 0;
    for (let i = 0; i < statsObject.years.length - 1; i++) {
      tmpCount += statsObject.years[i].postCount;
    }    
    statsObject.avgPostsPerYear = parseFloat((tmpCount / (statsObject.years.length - 1)).toFixed(2));

    log.info(`Completed post stats generation`);
    console.timeEnd(durationStr);

    if (debugMode) {
      log.info(`\nPost Stats Object`);
      log.info('-'.repeat(50));
      console.dir(statsObject);
      log.info();
    }

    return statsObject;
  });
}
