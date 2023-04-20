---
title: Implementing Custom Pipes in Ionic
description: 
date: 2021-07-19
headerImage: 
categories: [Web Development]
tags: post
---

Earlier this year, I worked on a desktop app project using Ionic where the app imports a CSV file and does some processing on it. After I parsed the CSV file data using Papa Parse ([https://www.npmjs.com/package/ngx-papaparse](https://www.npmjs.com/package/ngx-papaparse){target="_blank"}) I wanted to display the parsed data back to the page so the user could validate that it parsed correctly.

I knew what I needed: something that built a comma-separated list in an array so I could easily render it in Ionic. Now, I knew Ionic (and Angular) had a pretty powerful pipes capability where you pass data through a pipe to transform it as its rendered on the page.

I'd worked with Pipes in an earlier version of Ionic, but when I tried to apply my previous solution to the latest (I don't even know what the latest Ionic version is, 6?), it just didn't work. I looked around on Stack Overflow and the Ionic Forums and found different suggestions on how to make it work, but no complete example to work from. I'm sure the solutions were there, but these quick one sentence suggestions for how to fix the issue I had didn't tell me exactly where everything went - and I needed to know exactly where to put things to make it work.

I started out with a stand-alone sample application; I always learn better working with real data on a clean slate, rather than trying to poke new tech into an existing application. Once I get it working, its much easier for me to shoehorn the new code into the existing app.

Here’s the output of my sample application; you can find the complete sample application at https://github.com/johnwargo/ionic-pipes-example.

![Custom Pipes Example Program Page](/images/2021/ionic-pipes-example.png)
