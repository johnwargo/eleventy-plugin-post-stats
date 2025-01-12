"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const cli_logger_1 = __importDefault(require("cli-logger"));
const writing_stats_1 = __importDefault(require("writing-stats"));
const APP_NAME = 'Eleventy-Plugin-Post-Stats';
const durationStr = `[${APP_NAME}] Duration`;
const oneDayMilliseconds = 1000 * 60 * 60 * 24;
var conf = { console: true, level: cli_logger_1.default.INFO };
conf.prefix = function (record) {
    return `[${APP_NAME}]`;
};
var log = (0, cli_logger_1.default)(conf);
function byDate(a, b) {
    return a.date - b.date;
}
function getMonthName(theDate) {
    return theDate.toLocaleString('default', { month: 'long' });
}
function fillMonthArray() {
    var months = [];
    var tmpDate = new Date();
    for (let i = 0; i < 12; i++) {
        tmpDate.setMonth(i);
        months.push({ month: getMonthName(tmpDate), postCount: 0 });
    }
    return months;
}
function countCodeBlocks(content) {
    const regex = /```(.*?)```/gis;
    const matches = content.match(regex);
    if (matches) {
        return matches.length;
    }
    else {
        return 0;
    }
}
function processPostFile(filePath, debugMode) {
    if (debugMode)
        log.info(`Processing ${filePath}`);
    try {
        let content = fs_1.default.readFileSync(filePath, 'utf8');
        content = content.replace(/---\n.*?\n---/s, '');
        content = content.replace(/^\s*[\r\n]/gm, '');
        let codeBlocks = countCodeBlocks(content);
        content = content.replace(/(```.+?```)/gms, '');
        let stats = (0, writing_stats_1.default)(content);
        if (debugMode) {
            log.info();
        }
        return {
            characterCount: stats.characterCount,
            codeBlockCount: codeBlocks,
            paragraphCount: stats.paragraphCount,
            wordCount: stats.wordCount
        };
    }
    catch (err) {
        console.error(err);
        return {
            characterCount: 0,
            codeBlockCount: 0,
            paragraphCount: 0,
            wordCount: 0
        };
    }
}
function convertPostDateToLocal(dateStr, offset) {
    var date = new Date(dateStr);
    return new Date(date.getTime() + offset);
}
module.exports = function (eleventyConfig, options = {}) {
    eleventyConfig.addCollection('postStats', (collectionApi) => {
        var avgDays = 0;
        var monthPostCount = 0;
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
        const statsObject = {
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
        };
        const debugMode = options.debugMode || false;
        log.level(debugMode ? log.DEBUG : log.INFO);
        log.debug('Debug mode enabled\n');
        const tags = options.tags || ['post'];
        var posts = [];
        for (let tag of tags) {
            log.info(`Getting articles tagged with the "${tag}" tag`);
            let tagPosts = collectionApi.getFilteredByTag(tag);
            log.info(`Located ${tagPosts.length} "${tag}" articles`);
            posts.push(...tagPosts);
        }
        const postCount = posts.length;
        if (postCount < 1) {
            log.info(`No articles found for tag(s): ${tags.join(', ')}`);
            return statsObject;
        }
        posts = posts.sort(byDate);
        statsObject.postCount = postCount;
        log.info(`Generating statistics for ${postCount} articles total`);
        var timeOffset = new Date().getTimezoneOffset() * 60000;
        log.debug(`Local time zone offset: ${timeOffset}`);
        statsObject.firstPostDate = convertPostDateToLocal(posts[0].data.page.date, timeOffset);
        statsObject.lastPostDate = convertPostDateToLocal(posts[postCount - 1].data.page.date, timeOffset);
        log.debug(`First post date: ${statsObject.firstPostDate}`);
        log.debug(`Last post date: ${statsObject.lastPostDate}`);
        var prevPostDate = convertPostDateToLocal(posts[0].data.page.date, timeOffset);
        var currentMonth = prevPostDate.getMonth();
        var currentYear = prevPostDate.getFullYear();
        var months = fillMonthArray();
        log.debug(`${getMonthName(prevPostDate)}, ${currentYear}`);
        console.time(durationStr);
        for (let post of posts) {
            let postDate = convertPostDateToLocal(post.data.page.date, timeOffset);
            let thisMonth = postDate.getMonth();
            let thisYear = postDate.getFullYear();
            if (thisMonth != currentMonth) {
                log.debug(`${getMonthName(postDate)}, ${thisYear}`);
                months[currentMonth].postCount = monthPostCount;
                monthPostCount = 0;
                currentMonth = thisMonth;
            }
            if (thisYear != currentYear) {
                log.debug(`Year change: ${currentYear} to ${thisYear}`);
                avgDays = yearPostDays / yearPostCount;
                let yearStats = {
                    year: currentYear,
                    postCount: yearPostCount,
                    avgDays: parseFloat(avgDays.toFixed(2)),
                    avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
                    avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
                    avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
                    avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2)),
                    months: months
                };
                statsObject.years.push(yearStats);
                yearCharacterCount = 0;
                yearCodeBlockCount = 0;
                yearParagraphCount = 0;
                yearWordCount = 0;
                yearPostCount = 0;
                yearPostDays = 0;
                currentYear = thisYear;
                months = fillMonthArray();
            }
            let daysBetween = (postDate.getTime() - prevPostDate.getTime()) / oneDayMilliseconds;
            prevPostDate = postDate;
            totalDays += daysBetween;
            yearPostDays += daysBetween;
            monthPostCount++;
            yearPostCount++;
            totalPostCount++;
            const postStats = processPostFile(post.page.inputPath, debugMode);
            totalCharacterCount += postStats.characterCount;
            yearCharacterCount += postStats.characterCount;
            totalCodeBlockCount += postStats.codeBlockCount;
            yearCodeBlockCount += postStats.codeBlockCount;
            totalParagraphCount += postStats.paragraphCount;
            yearParagraphCount += postStats.paragraphCount;
            totalWordCount += postStats.wordCount;
            yearWordCount += postStats.wordCount;
        }
        if (yearPostCount > 0) {
            months[prevPostDate.getMonth()].postCount = monthPostCount;
            avgDays = yearPostDays / yearPostCount;
            let yearStats = {
                year: currentYear,
                postCount: yearPostCount,
                avgDays: parseFloat(avgDays.toFixed(2)),
                avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
                avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
                avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
                avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2)),
                months: months
            };
            statsObject.years.push(yearStats);
        }
        statsObject.avgDays = parseFloat((totalDays / totalPostCount).toFixed(2));
        statsObject.avgCharacterCount = parseFloat((totalCharacterCount / totalPostCount).toFixed(2));
        statsObject.avgCodeBlockCount = parseFloat((totalCodeBlockCount / totalPostCount).toFixed(2));
        statsObject.avgParagraphCount = parseFloat((totalParagraphCount / totalPostCount).toFixed(2));
        statsObject.avgWordCount = parseFloat((totalWordCount / totalPostCount).toFixed(2));
        var loopLimit = statsObject.years.length;
        var thisYear = new Date().getFullYear();
        var tmpCount = 0;
        if (currentYear == thisYear)
            loopLimit--;
        for (let i = 0; i < loopLimit; i++) {
            tmpCount += statsObject.years[i].postCount;
        }
        statsObject.avgPostsPerYear = parseFloat((tmpCount / loopLimit).toFixed(2));
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
};
