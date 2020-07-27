# Understanding Noise in Digital Photography

Noise can often ruin otherwise good photographs. Thankfully, there are techniques you can use to minimize its effects.

## Background
How exactly does your camera create a digital picture? The answer is quite simple.

0. A light source emits photons (particles of light).
1. That light bounces off items in your scene. The way a material reflects, transmits, absorbs, or emits light determines how it will appear in the final image.
2. The photons make their way through your camera's lens and onto its sensor.
3. The sensor, which consist of numerous elements called pixels, record how much light falls onto each pixel during the exposure and emits a signal proportional to the brightness of each pixel. Additional circuity digitizes the signal and creates a digital camera.

This process is similar to how your eyes work. However, your eye detects and transmits the image using cells, while the camera is built with solid-state digital logic.

## Where does the noise come in?
First, understand what noise is. Noise is an unwanted signal mixed into your desired signal. In photography, noise manifests itself as graininess in the final picture.

There is an unavoidable amount of noise called "read noise", introduced into the image when it is read from the camera sensor. The reason for this is heat. All objects above absolute zero (-273 Celsius or -459 Fahrenheit) have heat, in the form of tiny vibrations at the atomic level. The electrons carrying your image from the sensor to the signal digitizer are subject to the same vibrations, and it causes the signal to fluctuate unpredictably.

For the interested, this phenomenon is known as Johnson-Nyquist noise. If you'd like to learn more about the physics behind it, a good place to start would be the [Wikipedia page](https://en.wikipedia.org/wiki/Johnson%E2%80%93Nyquist_noise) on it.

Read noise can be tackled at the physical level by cooling down the sensor. In fact, in some applications that require highly precise images (such as scientific imaging and astronomy) the sensors of their instruments are actually cooled to extremely low temperatures. However, this is too unwieldy and expensive for photography.

![A picture I took with severe noise](https://i.imgur.com/2b0Nj78.png)\
(A picture I took with severe noise)

## Why do images taken in dark light seem to have more noise?

Let's do a simple thought experiment.

Suppose you took a picture under well-lit conditions, and its average brightness was 12 units. There was 1 unit of electronic noise.

Now, let's say you took a picture of the same scene, but under worse lighting. In this case, its average brightness may only be 3 units, but the 1 unit of noise remains. Technically, the amount of noise did not change. However, this image must be adjusted in post processing; otherwise, it would be unacceptably dark. To bring it up to the same brightness as the first image, we could multiply the signal by 4; however, that would **quadruple** the amount of noise as well! We would have 12 units of brightness, but 4 units of noise, considerably more than the amount that was present when the image was taken with better lighting.

This is the reason darker images become more noisy. They don't have more noise per se, but the process of brightening them after the initial exposure also increases noise.

![A comparison of a noisy picture and a picture under better illumination](https://upload.wikimedia.org/wikipedia/commons/3/3b/Noise_Comparison.JPG)

(A comparison of the same scene, shot under low and normal light conditions)

## How do I avoid noise?

There are a variety of practices that can help mitigate the effects of noise:

* Set your camera's ISO to a lower value. Recall that higher sensitivity means noise is multiplied. However, this may be impossible for certain scenes, which brings us to the second point:
* Set your exposure time appropriately. Instead of opting for a fast shutter and higher ISO, expose your image for longer at a lower ISO. This avoids the need to amplify the signal (as well as the noise) by simply gathering more light.
* Use a large aperture. This helps gather more light, again improving exposure.
* Shoot in RAW format instead of JPEG. RAW images can store much more color detail, improving your chances of getting rid of noise in post. Shooting in RAW has a plethora of advantages besides just noise reduction; if the slightly increased storage space is not a limiting factor for you, I would strongly recommend you to always shoot RAW.
* Leverage your camera's built-in functionality. Many modern DSLRs have built-in noise reduction features.

Most of these tips assume that you are shooting a low-light scene, since noise is generally not a concern when it comes to scenes with plenty of light.

Notice that time and time again they come back to one central idea: *It is better to gather enough light during the initial exposure, instead of amplifying the signal.*

## Closing remarks

There are many other sources of noise in digital photography. However, read noise is by and far the most common and significant source of noise in most pictures. If you notice persistent and unmoving artifacts in your image, the culprit is most likely a defective sensor pixel and not noise.
