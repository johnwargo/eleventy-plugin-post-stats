/***********************************************
 * Eleventy Plugin Post Stats
 * 
 * By John M. Wargo
 * https://johnwargo.com
 ***********************************************/

import { debug } from "console";

const fs = require('fs');
const writingStats = require('writing-stats');

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

type ContentStats = {
  characterCount: number,
  codeBlocks: number,
  paragraphs: number,
  words: number
}

type ModuleOptions = {
  debugMode?: boolean
}

const APP_NAME = 'Eleventy-Plugin-Post-Stats';
const durationStr = `[${APP_NAME}] Duration`;

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
    // remove the code blocks
    // content = content.replace(/```(.*?)```/gis, '');    
    // content = content.replace(/^((?:(?:[ ]{4}|\t).*(\R|$))+)/gm, '');
    content = content.replace(/(```.+?```)/gms, '');
    // get the rest of the article stats
    let stats = writingStats(content);
    if (debugMode) {
      console.dir(stats);
      console.log();
    }
    return {
      characterCount: stats.characterCount,
      codeBlocks: codeBlocks,
      paragraphs: stats.paragraphCount,
      words: stats.wordCount
    };
  } catch (err) {
    console.error(err);
    return {
      characterCount: 0,
      codeBlocks: 0,
      paragraphs: 0,
      words: 0
    };
  }
}

module.exports = function (eleventyConfig: any, options: ModuleOptions = {}) {
  eleventyConfig.addCollection('postStats', (collectionApi: any) => {

    // sort by date just to make sure
    const posts = collectionApi.getFilteredByTags("post").sort(byDate);

    const postCount = posts.length;
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
    var totalPostCount = 0;
    var totalCharacterCount = 0;
    var totalCodeBlockCount = 0;
    var totalParagraphCount = 0;
    var totalWordCount = 0;
    var totalDays = 0;
    var yearCharacterCount = 0;
    var yearCodeBlockCount = 0;
    var yearParagraphCount = 0;
    var yearWordCount = 0;
    var yearPostCount = 0;
    var yearPostDays = 0;
    var prevPostDate = posts[0].data.page.date;
    var currentYear = prevPostDate.getFullYear();

    const debugMode = options.debugMode || false;
    if (debugMode) {
      console.log(`[${APP_NAME}] Debug mode enabled`);
    }

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
        avgDays = yearPostDays / yearPostCount;
        // Add our year stats to the object
        let yearObject: YearStats = {
          year: currentYear,
          postCount: yearPostCount,
          avgDays: parseFloat(avgDays.toFixed(2)),
          avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
          avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
          avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
          avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))
        };
        statsObject.years.push(yearObject);
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
      totalCodeBlockCount += postStats.codeBlocks;
      yearCodeBlockCount += postStats.codeBlocks;
      // update paragraph counts
      totalParagraphCount += postStats.paragraphs;
      yearParagraphCount += postStats.paragraphs;
      // update word counts
      totalWordCount += postStats.words;
      yearWordCount += postStats.words;
    }
    if (yearPostCount > 0) {
      // calculate the average days between posts
      avgDays = yearPostDays / yearPostCount;
      // Add our year stats to the object
      let yearObject: YearStats = {
        year: currentYear,
        postCount: yearPostCount,
        avgDays: parseFloat(avgDays.toFixed(2)),
        avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
        avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
        avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
        avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))
      };
      statsObject.years.push(yearObject);
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
