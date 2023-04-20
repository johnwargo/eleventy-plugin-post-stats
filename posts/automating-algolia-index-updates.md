---
title: Automating Algolia Index Updates
description: Describes a utility I created to help Eleventy site owners to automate updating their Algolia indices outside of the build process.
date: 2023-03-19
headerImage: 
categories: [Web Development]
tags: post
---

I recently started working with the static site generator [Eleventy](https://www.11ty.dev/){target="_blank"}; since then I built a new site using it, and migrated an existing site from Jekyll to Eleventy. As part of that process, I followed Raymond Camden's [Adding Algolia Search to Eleventy and Netlify](https://www.raymondcamden.com/2020/06/24/adding-algolia-search-to-eleventy-and-netlify){target="_blank"} to offer search for the site.

In the article, Ray suggests hosting an Eleventy site on Netlify and using Netlify Functions update merge Algolia Index updates with the cloud. However, he expressed concerns about the time limit on Netlify Functions executions and the potential impact on larger sites. When I get to migrating this site, I don't have nearly the number of posts that Ray has, but I don't want to monitor the process to ensure the index update works.

I'm likely going to build and test any changes I make on the site locally, so I built a node-based command-line utility I'll use to update my index. I took the example code from Ray's article and packaged it in a simple node packageI can add as a development dependency in my sites and automate the index update. The package is called Algolia Index Update, and you can find it on [GitHub](https://github.com/johnwargo/algolia-index-update){target="_blank"} and [npmjs.org](https://www.npmjs.com/package/algolia-index-update){target="_blank"}.

I just realized that I made a mistake in the package. To enable it to work locally as well as a build task in a cloud hosting site, I store the index name and secret Algolia API keys in environment variables. As soon as I have more than one Eleventy site using Algolia, that's going to break. I'll have to update to store the index name locally with the site, perhaps in the package.json file or pass the index name on the command line. Stay tuned on that one.