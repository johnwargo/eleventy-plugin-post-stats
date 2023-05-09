---
title: Joomla Article Conversion to Markdown
description: 
date: 2022-11-23
headerImage: 
categories: [Miscellaneous]
tags: post
---

I've been running johnwargo.com on Joomla since the late 2000's, upgrading as needed from Joomla 1, Joomla 2, and Joomla 3. The Joomla team recently released Joomla 4 and Joomla 3 will reach end of life next year. As I started working through the Joomla 3 to Joomla 4 upgrade process, I realized that my site was broken and I couldn't get any help from my ISP.

With that in mind, I started thinking about how I could easily migrate all of my existing article content to another CMS. I'm experienced (a bit) with Jekyll and have always wanted to learn more about Eleventy (11ty). I definitely didn't want to do all of the article conversion myself, so I started thinking about how to build a tool to do all of it for me. 

I knew Jekyll uses markdown files and Eleventy supports them as well, so I decided to convert my content to markdown thinking that with the right conversion template, I could migrate my site's articles to almost any CMS. 

I've published several node CLI modules in the past (for managing Jekyll assets and to simplify the Moddable CLI), so I decided I'd build this one in Node as well. I recently learned about the Open CLI Framework ([https://oclif.io/](https://oclif.io/){target="_blank"}) and wanted a chance to learn that framework.

The result of all of this is that I recently published a node module called Joomla to Markdown (joomla-to-markdown) available at [https://www.npmjs.com/package/joomla-to-markdown](https://www.npmjs.com/package/joomla-to-markdown){target="_blank"}. 

To use this module, export your Joomla site's Categories and Content tables to JSON files using MySQL Admin (or similar tool). Then, with a couple of simple terminal commands you can parse the article and category content and output a separate markdown file for each article in the Joomla site. 

I built the module so it uses a user-defined template file to define the format of the markdown file and allows you to add any field from the Joomla site's Content table to the markdown file. Its all pretty simple to use and available today.

I wrote the module to be completely command-line driven, where the user provides the parameters the module needs to operate on the command line, but it got tedious typing them in all the time. I'm currently working on an enhancement to the module which uses a local configuration file to run the process (as an alternative workflow) so you can tweak the template and quickly rerun the export without typing all sorts of command line options. I'll have that version of the module published after the US Thanksgiving holiday (2022).

I hopped back into my Joomla site and after making some tweaks was able to get it back up and running - hence my ability to publish this article. This probably won't last long, I'm going to redeploy this site on Jekyll first then Eleventy once I've got everything I want to do figured out. Stay tuned, I know I'll write about the experience once I do it.