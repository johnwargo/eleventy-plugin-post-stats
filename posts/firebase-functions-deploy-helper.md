---
title: Firebase Functions Deploy Helper
description: 
date: 2021-04-03
headerImage: 
categories: [Miscellaneous]
tags: post
---

As I mentioned in an earlier post, I worked on a project this year that used Firebase Functions against a Google Cloud SQL database. As I worked with Functions, I quickly started bumping up against deployment quotas.

My project has 61 functions, and if I try to publish all of them, Firebase craps out and will only publish a subset of the total. I quickly realized that if I published the whole batch twice, all of them would usually publish.

In conversations with the Firebase Support team, they indicated that there was nothing I could do except to publish my functions in batches. When I'm coding in my project, I'm jumping around from function to function and it's too much trouble to reliably track which functions I modified. I decided instead to use automation and a little Node module to solve the problem for me.

The module I created is called Firebase Functions Deploy Helper and you can find it at [https://www.npmjs.com/package/firebase-functions-deploy-helper.](https://www.npmjs.com/package/firebase-functions-deploy-helper){target="_blank"} When you install the module, it installs a command called `ffdh` which simplifies batch installation of a Firebase project's functions.

You can deploy in batches, deciding at runtime how many batches you want to use, then deploying each batch separately. You can also use search to select the functions to deploy, searching for functions using a search string against the start or end of the function name.

Read the project readme file to learn more about how to use the module.