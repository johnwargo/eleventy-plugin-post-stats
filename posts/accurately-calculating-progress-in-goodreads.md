---
title: Accurately Calculating Progress in Goodreads
description: 
date: 2022-01-09
headerImage: 
categories: [Miscellaneous]
tags: post
---

I love writing utility applications; for many, many years I worked in the Enterprise space doing technology transitions and one of my favorite things was to write little pieces of code to solve problems big and small. For this blog post, the problem I’m dealing with is for a free app from Amazon called Goodreads.

For years, Amazon had two social apps that allowed people to track the books they read: Shelfari and Goodreads. They eventually shut down Shelfari and merged everyone’s data into Goodreads. That saddened me because Shelfari was a much better app than Goodreads and delivered a more consistent experience across platforms. Goodreads delivers a different user experience (UX) on different platforms (browser, native mobile apps) and I really kinda hate it. I’ve gotten used to the android app user experience, but when I sometimes have to use a browser instead, I’m completely lost in completing some tasks.

I use Goodreads because it lets me track how many books I read in a year (last year I read 68 books out of my goal of reading 50). It also allows me to see the books family and friends are reading, so it gives me great suggestions on what to pick up next. When I’m reading a book, Goodreads allows me to publish an update showing friends what I’m reading and how far into the book I am. The problem is that for many books, the information Goodreads uses to calculate percentage completion based on page number is inaccurate, making the progress value inaccurate as well. 

This happens because for some books, the pagecount data Goodreads has for some books is incorrect. This happens either because their source provides incorrect information or because there are multiple formats for a particular book which gives them different page counts. In some cases, I’ve seen places in Goodreads where I could pick a different publication for a particular book I’m reading, but I’ve not been able to find that particular area of the product in a while so I just give up. 

Why Goodreads would have an incorrect page count makes no sense to me since Amazon knows everything there is to know about books sold through Amazon (where I usually get mine). Why Goodreads would hide the ability to let me pick the format/edition of the book I’m trying to read is beyond me.

The pagecount issue also rears its ugly head because of a more mundane problem. Many business, technical, historical, etc. books have indices and notes pages tacked on at the end which make any progress calculation inaccurate. 
For example, I just finished reading Undaunted Courage by Stephen Ambrose and according to Amazon and Goodreads, the book has 521 pages. In reality, the readable part of the book, the stuff that most of us would consider the meat of the book, is 484 pages. 

So, if I’m on page 100 of the book and I update Goodreads with that number, it calculates that I completed 19% of the book. In reality though I’ve completed 20% of the book. That’s not a huge difference, but it matters; some books have much larger indices so it matters more for them.

After years of posting inaccurate progress percentages I decided to do something about it. I sat down and cranked out a quick application that takes the page number, actual page count, and total page count then spits out an adjusted value scaled to the total page count. You can find the application here: https://goodreads-page-adjuster.netlify.app/ and the source code for the project here: https://github.com/johnwargo/goodreads-page-adjuster.

![Goodreads Page Adjuster](/images/2022/goodreads-page-adjuster.png){target="_blank"}

When you access the app, you’re prompted for the values shown in the image below. Enter the appropriate values for the book you’re reading and you’re all set. I added a copy button because I frequently do this on a mobile phone and I didn’t want to have to mess around with selecting and copying the resulting value.

As you can see, I’ve setup the parameters for Undaunted Courage. When I’m on actual page 100, for the Goodreads total page count that would be 107 pages. When I copy the value from here and paste it into Goodreads, Goodreads will show an actual progress percentage based on the total number of pages Goodreads thinks the book has. 

There’s nothing complicated about what I did here, but it was just some simple problem I wanted to solve using code. Enjoy.
