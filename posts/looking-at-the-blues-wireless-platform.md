---
title: Looking at the Blues Wireless Platform
description: 
date: 2021-10-10
headerImage: 
categories: [Internet of Things (IoT)]
tags: post
---

I love working with microcontrollers; I got started early with the Arduino and Particle Platforms as well as Raspberry Pi (yes, I know, the Pi is not a microcontroller) and many others. I built a few projects on the Particle platform, but I never really got into the Internet of Things (IoT) space. Me hacking around with microcontrollers and single-board computers isn't necessarily the IoT space.

I recently learned about Ray Ozzie's latest project: Blues Wireless ([https://www.geekwire.com/2021/ray-ozzies-telecom-startup-blues-wireless-raises-22m-bill-gates-others/](https://www.geekwire.com/2021/ray-ozzies-telecom-startup-blues-wireless-raises-22m-bill-gates-others/){target="_blank"}) and quickly ordered some hardware and got to work learning how to use it. IoT platforms are usually either a software only solution (running in the cloud) or a combined hardware and software solution. Blues Wireless is the latter. The purpose of this article is to give you my take on the platform, and I'll likely publish additional articles here or elsewhere showing you how to use it for different types of projects.

## Notecard and Notecarrier

Blues' primary hardware product is the Notecard, a tiny wireless device with a processor, some sensors, and an interface that allows other hardware devices to use it to send and receive data to and from the cloud.

![Blues Wireless Notecard](/images/2021/blues-wireless-notecard.png)

Note:  Image 'borrowed' from the Blues Wireless web site at [https://blues.io](https://blues.io){target="_blank"}.

According to the data sheet, [Notecard](https://dev.blues.io/hardware/notecard-datasheet/note-wbex-500/){target="_blank"} is:

* A drop-in embeddable data storage and transport module for cellular IoT products, pumping JSON-formatted or binary data ("Notes") bi-directionally between device and cloud:
* JSON from/to MCU application using I2C, Serial, or USB.
* JSON to/from your cloud app using HTTPS.
* JSON is auto-tagged with date/time, tower, and GPS locations.
* A removable and field-upgradable 30mm x 35mm system-on-a-module (SOM).
* A cellular device without the monthly fees.

The product page also says:

* 500MB and 10 years of cellular connectivity included
* Global cellular over LTE-M, NB-IoT, or Cat-1
* Secure “off the internet” communications from device-to-cloud
* Low-power hardware (~8µA when idle), power-conscious firmware
* Embed with onboard M.2 Key E connector or via a companion board
* Unmatched developer experience and JSON-based API

As you can see from the specs, Blues thought very carefully about what they built and fit into this small card everything you need for many IoT applications.

The game changing aspect of this is that the Notecard includes 500MB of data transfer and 10 years of cellular connectivity. There’s no monthly fees for cellular data, you spend between $49US and $69US for the Notecard and get cellular data coverage for the device for 10 years. I don’t know what happens if you try to use more than 500MB over those 10 years, but as long as you’re smart and careful about how you use the provided data plan you should be OK.

For some applications, all you need is the Notecard. If, for example, all you wanted was an asset tracker, you can build one using the accelerometer and GPS sensors along with the wireless radio. All you would have to do is power it up, set the device’s configuration via the command-line tools, and you’re all set - no coding required.

Let me explain…

The Notecard has a processor, some memory, some sensors, and a wireless radio with loads of data transfer capacity. It is essentially a cellular microcontroller without the ability to program the processor directly. Instead, Blues provides an interface customers can use to configure and control the device externally using the supported USB, Serial, or I2C interfaces.

To configure the device, you use a connected device to pass JSON messages to the Notecard through one of the supported interfaces. Firmware on the device parses the JSON messages and makes the appropriate local configuration changes or performs the necessary actions based on the contents of the JSON message.

Using one of the Notecarriers, you can connect the Notecard to a computer using a USB cable the poke and prod the device with JSON messages over a command-line interface (CLI) or through a browser console.
There’s even Notecarrier devices for Adafruit Feather compatible devices and Raspberry Pi; with those devices you configure the Notecard using an I2C interface through your device’s custom code (which I’ll talk about a little later).

The JSON API is very robust, offering a lot of different options for configuring the Notecard. I haven’t yet learned everything it can do, but you can configure how frequently the device wakes up to collect data and how frequently it sends the data over the network. You can even configure it to sleep periodically and how frequently it checks for new data to download over the network.

I’m not going to describe all these options, you can find documentation for the capabilities here: https://dev.blues.io/reference/notecard-api/card-requests/. And for a complete tutorial on turning a Notecard into an asset tracker, refer to the Asset Tracking tutorial. https://dev.blues.io/notecard/notecard-guides/asset-tracking/.

Now, if you want to do more with Notecard, this is where the I2C and Serial interfaces come in. You can connect the Notecard to any external computing device and send and receive JSON messages to and from the Notecard. Through this mechanism, the code running on the computing device can (and this is by no means a complete list):

* Send data to the Notecard
* Retrieve data from the Notecard
* Request data from remote data sources (3rd party APIs)
* Trigger sending queued data over the network connection

This is where the enormous power of the platform comes into play. Instead of forcing you to shoehorn your project needs into a custom microcontroller and network device, Blues lets you build your IoT project using any hardware and software you want, leveraging the Notecard to handle all data transfers and cellular connectivity.

To make it even easier for developers to build prototype devices, Blues offers several Notecarrier devices. The simplest one is the Notecarrier B which offers a simple M.2 connector for the Notecard and pins you can use to connect the carrier to power abd other hardware devices (like a custom computing module). There’s also Notecarriers for the Adafruit Feather platform and Raspberry Pi, enabling you to plug in your own compatible hardware and interact with the Notecard using the Blues Wireless SDKs for the target device.

Blues’ expectation is that you’ll prototype with the Notecarrier devices, then build custom hardware devices embedding the processor and other hardware (like sensors) with an M.2 connector for the Notecard. For hobbyists like me, the Notecarriers are perfect for building cool network connected devices into my projects.

Now, at this point you may be asking yourself where does all of the data go? I’ll cover that topic in the next section.

## Notehub

Cellular IoT projects are all about data - collecting data from remote locations and streaming the data to a central hub for processing. On the Blues Wireless platform, devices automatically send their data to projects defined in the Blues Wireless Notehub service.

In Notehub you define Projects for every time of project you have running on the platform. When you configure a Notecard, you configure the Notehub project ID on the device so it knows where to send all of its data.

Recognizing that you’re going to want to do more with the data then simply store it on Notehub, Notehub offers a feature called Routes that enables you to process and forward the collected data to an external other system for further processing and/or storage. I’ll dig deeper into how this works in subsequent articles; I have plans for a project and 
I’ll walk through every aspect of it as I put it together.

## Conclusion

As I mentioned in the beginning of the article, I’m a hobbyist and don’t work in the IoT space, so I can’t talk about the benefits of the Blues Wireless platform in large IoT deployments.

Blues Wireless handles one of the most expensive and complicated parts of IoT: cellular data, offering a simple 10 year data plan for an unbelievable price. As I worked through the documentation and examples, I was pleased to see that every time I thought of something I wanted to do with the platform (like remotely executing code on a remote device like Particle does, and forwarding data out of Notehub to other services) there was a solution for it.

Blues Wireless is a relatively new company but they really seem to have a lot of things figured out. They recently announced their own Feather compatible hardware device called the Swan. I have one on order and I’ll write about it once I get some time to play with it.