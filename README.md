# X-TRACK SHARE

A private, _WeTransfer like_ service for sharing music and video.

Share unique links to your media folders stored inside [Cloudinary](https://cloudinary.com)

## Configuration

To launch the application you must first provide you Cloudinary cloud API keys and secret : 

**Steps to do this :**

1. Create the .env file (it is never stored in the git repository)
```
cp .env.sample .env
nano .env
```
2. Replace the sample values by yours
(Copy and paste your cloudinary settings inside the .env file and save the file.)
```properties
CLOUDINARY_CLOUD_NAME=my_cloud_name
CLOUDINARY_API_KEY=12345678901234
CLOUDINARY_API_SECRET=00000000000000000
```

## Technical Notes

### Build with [chakra-ui](https://github.com/chakra-ui/chakra-ui)

This repository was bootstraped using [chakra-ui](https://github.com/chakra-ui/chakra-ui) as the component library within a Next.js app.

### Storybook Integration

As many knows, there is still no official Chakra UI plugin for Storybook integration, so we have to do [small tweaks to Storybook configuration](https://dev.to/carlosrafael22/what-i-ve-learned-with-chakra-ui-so-far-4f5e) to ensure that Chakra UI Theme is loaded by all stories.  
*Essentially : *  
`main.js` and `preview.js` inside the `.storybook/` folder are responsible to wrap stories inside the `<ChakraProvider>`


### Cloudinary

Cloudinary has some extraordinay capacities, like :
* [Generate zip files from a selection of medias](https://cloudinary.com/blog/dynamically_generating_zip_files_with_one_line_of_code)

### Adaptive Streaming

A list of MUST-READ articles to explain how the adaptive bitrates formats work (HSL and MPEG-DASH)
* [DASH & HLS : The two main video stream protocols](https://blog.eleven-labs.com/en/video-live-dash-hls/)
* [Implementing adaptive bitrate transformations in Cloudinary](https://cloudinary.com/documentation/adaptive_bitrate_streaming)
* [A review of popular video players streaming performances](https://www.heartinternet.uk/blog/streaming-video-on-the-web-a-performance-review-of-popular-javascript-players/)

And finally, the way to put all of this together is demonstrated with this video tutorial from Google and Cloudinary :
* [ReactNYC Modern Media Experiences with Cloudinary and Shaka Player](https://cloudinary.com/blog/reactnyc_building_modern_media_experiences_in_react_apps)

### Deploy your own

Deploy your own version using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/x-track-mag/x-track-share&project-name=x-track-share&repository-name=x-track-share)

