---
title: JavaScript Microcontrollers
description: 
date: 2021-05-14
headerImage: 
categories: [Internet of Things (IoT)]
tags: post
---

For many years now, I've worked extensively with a variety of microcontrollers and single-board computers. Since I was a small child, I always had an interest in electronics projects and the modern catalog of these computing devices gives me lots of opportunities to play and build things.

In my professional life, for most of the last few years I've coded primarily using JavaScript and web technologies. My work on the Apache Cordova project and associated books plus my day job for products in the Apache Cordova and mobile development space kept me mostly in JavaScript code (for hybrid application and JavaScript-driven native application work). Because of this, I'm always on the lookout for interesting JavaScript microcontrollers.

## Tessel

I did some work many years ago on the [Tessel platform](https://tessel.io/){target="_blank"}; Tessel, in their own words, is “Tessel 2 is a robust IoT and robotics development platform. Leverage all the libraries of Node.JS to create useful devices in minutes with Tessel.” You code projects in JavaScript and the platform’s node engine executes them. You can even build and deploy web server applications to the device. I built and published several application projects for the Tessel platform: two versions of a weather station (https://github.com/johnwargo/tessel_weather_station and https://github.com/johnwargo/tessel_m2x_weather_station) and a garage door controller (https://github.com/johnwargo/tessel_garage_door_controller).

Coding for the platform is easy, you write your JavaScript code in your favorite editor, then use the Tessel command-line interface (CLI) to provision the device and deploy your code. You can even configure Wi-Fi network settings on the device using the CLI (instead of hard-coding them in your source code).

For hobbyists, Tessel is just an open source prototyping platform, they don’t produce a suite of different devices, instead, they produce a single reference device you can use to prototype your project, expecting that you’ll embed the platform in any commercial device you produce from the prototype. They also offer a small catalog of sensors and add-on modules (like the relay I used for my garage controller project and the weather sensor I used for my weather station projects) you can easily plug into the board.

I really enjoyed working on the platform and wish I could do more with it, but it’s prototype-only approach kept me away. I didn’t have any interesting hardware projects I wanted to build from scratch, and when I did, I selected the ESP32 platform for reasons I’ll explain some day.

## Espruino

Another popular JavaScript hardware platform is [Espruino](https://www.espruino.com/){target="_blank"}. Espruino produces a variety of device formats which gives you a lot of flexibility for different types of projects. 

Coding for Espruino is easy, you can use their CLI to deploy code to devices just like I described for Tessel above. They also offer a browser-based integrated development environment (IDE) they call the Web IDE. The Web IDE allows you to code your application, then push it directly to devices from the same interface; you simply plug the device in via a USB cable and work iteratively with the device through the browser.

![Espruino IDE](/images/2021/espruino-web-ide.png)

I’ve purchased several Espruino devices over the years, but haven’t done anything with them. I just haven’t found something interesting I want to do with them. I played around many years ago with the Espruino Pico device, it’s a USB stick with a microcontroller in it, but again struggled to find an interesting purpose for it. 

Of special interest to me is the Espruino Puck.js which is essentially a JavaScript programmed Bluetooth button with LEDs and other stuff like sensors inside. Again, I keep looking for something to do with this platform and the puck is such an interesting and capable device that I’m sure something will come up.

The biggest issue I have with the platform, and likely one of the reasons I’ve kept away from it, is that the boards are rather expensive. The small and simple Espruino Wi-Di device is $35US which is more than three times more expensive than the much more capable ESP32 device. I keep hoping the prices will drop on these devices, especially not that there are a whole lot of sub-$10 devices out in the market today, but Espruino devices remain a premium choice.

## Moddable

My most recent experimentation with JavaScript devices is on the Moddable platform. I think Moddable has incredible potential, for several reasons I’ll explain later, but I’m really struggling to be productive on the platform.

Many years ago I was at a trade show (I can’t remember which one) and met a guy named Peter promoting a platform called [Kinoma](https://en.wikipedia.org/wiki/Kinoma){target="_blank"} they were pre-release, but their JavaScript devices looked really cool so I ordered a few then waited patiently for them to ship. After they arrived, I never got around to playing with them, but by the time I did, the company had shut down. Sigh.

I’d check in every so often looking to see what the team was doing and a while back discovered that Peter and friends from Kimoma started a new company called Moddable. Moddable produces several inexpensive hardware devices with built-in displays running on Esprissif devices which I think is very interesting. They are also very open about supporting other platforms as well. As with the other platforms covered in this article, you code applications using JavaScript - the combination of JavaScript as a language coupled with built-in displays makes this a very interesting platform for me.
What’s interesting about the Moddable platform is that along with the inexpensive hardware, the team’s real focus seems to be the robust and capable device-side JavaScript API available to applications running on the device. They provide well-written Networking, Bluetooth, File System, Graphics API and more - making it really easy to build capable and compelling apps for compatible devices.

What’s always worried me when working with microntroller-driven displays is how to actually get what you want on the screen and properly converting graphics files for display. The well-thought out and consistent Moddable device-side API makes this easy and compatible across a variety of devices and displays.

My goal is to build a few projects on their hardware platform, then do some on other devices using the Moddable SDK. There’s some complexity to the Moddable SDK, so I plan to pen a few articles sharing what I learned working with the platform and the tools I put in place to make it easier for me.

## Platform Differences

There are major differences between the Tessel and Espruino tooling and Moddable’s approach. This isn’t a complaint, simply an explanation that they’re very different.

Tessel and Espruino are hardware platforms, so the only code you have to worry about is the JavaScript code you write for your particular project. The devices run a proprietary (but open source) runtime environment (firmware) that executes whatever JavaScript code you publish to the device.

Using these devices, you may have to periodically upgrade the device’s runtime environment, but that’s easily done with the platform tools. Typically, as soon as you get your code running on a device, you leave it alone and don’t worry about firmware updates. If it works, just leave it alone.

Since Moddable supports a wide variety of hardware platforms, the Moddable team took a different approach to runtime management. The Moddable SDK must deliver a proprietary (although open source) JavaScript runtime to the device before it can execute on the device. This...complicates the toolchain you need on your development system to develop projects using the SDK. I’m not saying it's bad, it's just more work to install and maintain the toolchain on Moddable.

To work with the Moddable SDK, you must first install the Moddable SDK and set the client-side environment variables required by the platform. Next, you must install the device SDKs for each hardware platform you work with. The Moddable devices use the Espressif platform, so for those devices you must install the ESP-IDF SDK. I have a bevvy of M5Stack devices (M5Stack devices are cool too) with displays on them; these devices are Espressif-based as well, so I can use the same SDK setup for those devices as well. If I expand my device catalog, I’ll merely have to install the appropriate SDK for those devices to use it with the Moddable JavaScript SDK.

## Windows Issues

My primary development environment is Microsoft Windows (I have several macOS devices, but it’s hard to get around more than 30 years of experience developing with specific keyboard capabilities) and I’ve been working though some Moddable SDK installation issues with the Moddable team and hope to have them resolved soon. Right now, the Moddable SDK won’t deploy modules to Moddable devices on my Windows system. I created a clean Windows Virtual Machine (VM) and confirmed the issue appears there as well, so I know the issue is on their side.

Once I get that working, I have more articles to deliver here about the development experience, tooling, and the cool projects I have planned for the platform. Stay tuned.
