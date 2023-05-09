---
title: Synchronizing CircuitPython Files
description: 
date: 2023-02-20
headerImage: 
categories: [Uncategorised]
tags: post
---

  
I love working with a variety of microcontroller devices and a lot of my projects use LEDs, so I was pleasantly surprised when the folks at Adafruit added the FeatherS2 Neo ([https://www.adafruit.com/product/5629](https://www.adafruit.com/product/5629){target="_blank"}) board to their catalog. It has an ESP32 processor and a 5x5 grid of little NeoPixels onboard, so it is perfect for some of my projects.

The board comes configured to use CircuitPython ([https://circuitpython.org/](https://circuitpython.org/){target="_blank"}) by default, although you can also program it in C in the Arduino IDE. I haven't done much CircuitPython work in the past, so I thought I'd learn more about it as I worked with the board. I'll publish some of my projects for it as I progress, but this article is about the CircuitPython development workflow and a tool I created to tweak that workflow to suit my particular needs.

When you connect a CircuitPython (CP) device to a computer using a USB cable, the CP device manifests itself as a connected drive. On my Windows development system, due to all of the other drives I have connected to it, the CP device appears as drive H. On the macOS system, where I'm writing this article, it appears as /Volumes/CIRCUITPY.

Developer tooling reads and writes directly to/from the 'drive' to deploy executable code to the device (in this case, written in the CP variant of Python). There are even Python editing tools like Mu ([https://codewith.mu/](https://codewith.mu/){target="_blank"}) or extensions for popular editors like Visual Studio Code ([https://marketplace.visualstudio.com/items?itemName=joedevivo.vscode-circuitpython](https://marketplace.visualstudio.com/items?itemName=joedevivo.vscode-circuitpython){target="_blank"}) that understands how to interact with connected CP devices. The developer connects the device and opens an editor and codes away. The tooling I mentioned also provides additional capabilities that assists with monitoring and debugging an application as it runs on the CP device.

This approach works great for new developers and classroom environments. All the learner has to do is plugin the device, open an editor, and away they go. As the learner moves from classroom to home, all of the code they need is already on the device, they can edit it anywhere they want then unplug the device and take it with them.

I'm used to a different development workflow.

In modern development workflows, developers work in a local code project (in a project folder on a local hard drive) or in the cloud (accessed using a browser-based editor for example). In that workflow, changes to the project's code are tracked and managed through a version control system like Git and synchronized between development systems through a cloud repository like GitHub. When working with a microcontroller or single board computer, I'm used to coding in my local project folder and deploying code to the device when it's ready to run on the device. As I complete features, I commit them to the version control system and push them to the cloud for sharing.

What I want to do is use this type of Git-based workflow with the CP device.

I could create a git repository on the connected CP Device, code away on the device and commit my changes to the repository on the device then synchronize that device-side repository to the cloud. That would work, but this is still very device-focused; the primary storage location for my code is the device, not my local development system.

Another option is to code locally, then copy the files to the CP device. This could be a simple shell/command script and would work, but the CP-aware editors expect to read/write to/from the device, so that would eliminate those types of tools from my tool belt.

What I decided to do instead is leave the development workflow like it is, use the CP-aware tools that expect to interact directly with the connected device and copy the code to my local project folder. I could create a local folder for the project code, set up a Git repository in the folder, then copy the code files from the CP device periodically as I work on the project. I could implement this as a simple script, all I'd have to do is make sure I ran it whenever I had new code to copy.  
Rather than write a script or copy a script into every project, I decided to create a tool I could use in any project and share with others to use with their projects as well.

The tool I created is a node-based command-line module called CircuitPython Sync (cpsync), you can access the code on GitHub ([https://github.com/johnwargo/circuitpython-sync](https://github.com/johnwargo/circuitpython-sync){target="_blank"}) and install it on your development systems using Node Package Manager (npm) ([https://www.npmjs.com/package/cpsync](https://www.npmjs.com/package/cpsync){target="_blank"}).

I wrote it in NodeJS because I have a lot of experience using node in many of my other projects and it's a standard part of many modern software development workflows. I expect I'll someday rewrite it as a standalone executable using Rust.  
To use the tool, you open a terminal window (macOS or Linux) or command prompt (Windows) and execute the `cpsync` command (passing in the correct arguments, of course - all describe on the Github or NPM pages) and it will setup a file change listener on the CP device. Then, with that running, use the CircuitPython editor of choice to modify the code on the device. Every time you save a change to an existing file, create a new file, or delete a file on the device, cpsync copies, creates, or deletes the file in the designated project folder. You can see an example of cpsync in action in the following figure.

![cpsync terminal window](/images/2023/cp-sync-1.png)

In this example, the tool synchronizes CP files from drive H:\ to my project folder in c:\Users\john\dev\cp-project\. The CP device has a lot of extra files on it that aren't generally used or accessed by a developer, so in the example I used a command-line flag (-i for ignore) that tells cpsync to ignore (not synchronize) the unnecessary files.

So, when this runs, my local project folder will only contain the lib folder plus the code.py and feather2neo.py files updated with the latest changes every time those changes are written to the CP device. If I added a new file or folder, those would automatically synchronize to the local project folder. If I deleted a file or folder, those changes would reflect in the local project folder within a few seconds.

![Windows Explorer Project Folder](/images/2023/cp-sync-2.png)

Synchronized Project

This tool allows me to use the workflow and tooling that works best for me when working with a CircuitPython device. I hope you find it useful for your projects too.