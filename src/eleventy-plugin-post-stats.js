const fs = require('fs');
const path = require('path');


function byDate(a, b) {
  return a.date - b.date;
}

function updateStatsCount(totalStats, currentStats) {
  totalStats.docCount++;
  totalStats.charCount += currentStats.charCount;
  totalStats.wordCount += currentStats.wordCount;
  totalStats.daysBetween += currentStats.daysBetween;
}

function makeStatsObject() {
  return {
    docCount: 0,
    charCount: 0,
    wordCount: 0,
    daysBetween: 0,
  }
}

const postStats = (eleventyConfig) => {
  eleventyConfig.addCollection('postStats', (collection) => {
    // sort by date just to make sure
    const posts = collection.getFilteredByTags("post").sort(byDate);
    const postCount = posts.length;
    const statsObject = {
      postCount: postCount,
      firstPostDate: posts[0].date,
      lastPostDate: posts[postCount - 1].date,
    }

    // create new stats objects
    totalStats = { ...makeStatsObject() }
    yearStats = { ...makeStatsObject() }

    // for (let post of posts) {
    //   // debug('Post: %O', post)
    //   // post.templateContent

    // }

    // data = [];
    // for (const [key, value] of Object.entries(posts[0])) {
    //   data.push({ key: key, value: value });
    // }
    // return data;

    let outputFile = path.join(process.cwd(), 'post.json');
    // let fileContent = JSON.stringify(JSON.parse(posts[0].data));
    let fileContent = JSON.stringify(JSON.parse(posts[0].templateContent));
    fs.writeFileSync(outputFile, fileContent, 'utf8');

    return statsObject;
  });
}

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(postStats);
};