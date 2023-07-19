"use strict";
const fs = require('fs');
const writingStats = require('writing-stats');
const APP_NAME = 'Eleventy-Plugin-Post-Stats';
const durationStr = `[${APP_NAME}] Duration`;
const oneDayMilliseconds = 1000 * 60 * 60 * 24;
function byDate(a, b) {
    return a.date - b.date;
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
        console.log(`[${APP_NAME}] Processing ${filePath}`);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/---\n.*?\n---/s, '');
        content = content.replace(/^\s*[\r\n]/gm, '');
        let codeBlocks = countCodeBlocks(content);
        content = content.replace(/(```.+?```)/gms, '');
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
module.exports = function (eleventyConfig, options = {}) {
    eleventyConfig.addCollection('postStats', (collectionApi) => {
        const debugMode = options.debugMode || false;
        const tags = options.tags || ['post'];
        console.dir(options.tags);
        console.dir(tags);
        console.dir(...tags);
        const posts = collectionApi.getFilteredByTags(...tags).sort(byDate);
        const postCount = posts.length;
        const statsObject = {
            avgDays: 0,
            avgCharacterCount: 0,
            avgCodeBlockCount: 0,
            avgParagraphCount: 0,
            avgWordCount: 0,
            postCount: postCount,
            firstPostDate: posts[0].data.page.date,
            lastPostDate: posts[postCount - 1].data.page.date,
            years: []
        };
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
        if (debugMode)
            console.log(`[${APP_NAME}] Processing ${currentYear} posts`);
        console.time(durationStr);
        for (let post of posts) {
            const postDate = post.data.page.date;
            const daysBetween = (postDate - prevPostDate) / oneDayMilliseconds;
            var thisYear = postDate.getFullYear();
            if (thisYear != currentYear) {
                if (debugMode)
                    console.log(`[${APP_NAME}] Processing ${thisYear} posts`);
                avgDays = yearPostDays / yearPostCount;
                let yearStats = {
                    year: currentYear,
                    postCount: yearPostCount,
                    avgDays: parseFloat(avgDays.toFixed(2)),
                    avgCharacterCount: parseFloat((yearCharacterCount / yearPostCount).toFixed(2)),
                    avgCodeBlockCount: parseFloat((yearCodeBlockCount / yearPostCount).toFixed(2)),
                    avgParagraphCount: parseFloat((yearParagraphCount / yearPostCount).toFixed(2)),
                    avgWordCount: parseFloat((yearWordCount / yearPostCount).toFixed(2))
                };
                statsObject.years.push(yearStats);
                yearCharacterCount = 0;
                yearCodeBlockCount = 0;
                yearParagraphCount = 0;
                yearWordCount = 0;
                yearPostCount = 0;
                yearPostDays = 0;
                currentYear = thisYear;
            }
            prevPostDate = postDate;
            totalDays += daysBetween;
            yearPostDays += daysBetween;
            totalPostCount++;
            yearPostCount++;
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
            avgDays = yearPostDays / yearPostCount;
            let yearStats = {
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
};
