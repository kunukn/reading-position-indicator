# reading position indicator
Small mobile friendly reading position indicator library with no external dependencies.

# newer library
A newer library exists here.<br/>
https://github.com/kunukn/position-indicator

This is more flexible and easier to integrate with UI libraries like React, Vue and Angular.

# demo
* https://codepen.io/kunukn/full/zNJqEE (version 1.0.3+)
* https://codepen.io/kunukn/full/ayeMZN/ (version 2.0.0+)

<img src="https://github.com/kunukn/reading-position-indicator/blob/master/media/rpi.gif?raw=true" width="300">

# about
A position indicator at the top of the page to visually display how far you have scrolled on a webpage.

Build with focus on **simplicity**, **performance** and **a11y**. 
Using transform translate for best performance. rAF for throttling scroll update and debounce for resize update. 

**Aria tags** are used to support screen readers. 

The progress element `<progress>` has not been used because the code gets messy with vendor prefixes and removing the default styles that comes with each browser. It gets even messier when fallback elements are added inside the progress element to support older browsers.


# browser support

![IE](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.0.0/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.0.0/chrome/chrome_48x48.png) | ![Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.0.0/firefox/firefox_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.0.0/opera/opera_48x48.png) | ![Safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.0.0/safari-ios/safari-ios_48x48.png)
--- | --- | --- | --- | --- |
IE 11 ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |


# npm

https://www.npmjs.com/package/reading-position-indicator


# size
* js `~6kb`
* css `<1kb`

# test
Tested with latest Chrome, Safari, Firefox, Edge, IE10+, iOS7+, Android 4.3+

# usage

Check the **dist/index.html** for inspiration.

* Add reference to `rpi.bundle.js` and `rpi.bundle.css` in the html page
* Apply the markup structure
* Init the library with JS

### html structure

```html
<head>
  ...
  <link rel="stylesheet" href="rpi.bundle.css">
  ...
</head>
<body>
  <!-- library markup -->
  <div class="rpi-progress-bar" 
    role="progressbar" 
    aria-valuemin="0" 
    aria-valuemax="100"
    aria-valuenow="0">
      <div class="rpi-progress-bar__position" aria-hidden="true"></div>
      <div class="rpi-progress-bar__percentage"></div>
  </div>
  <!-- end library markup -->
  
       ...          
       
       <script src="rpi.bundle.js"></script> <!-- library -->
       <script>new ReadingPositionIndicator().init();</script> <!-- usage -->
 </body>
```

### minimum markup required

```html
<div class="rpi-progress-bar">
      <div class="rpi-progress-bar__position"></div>
      <div class="rpi-progress-bar__percentage"></div>
</div>
```

### configuration and usage example

```javascript
var rpi;
setTimeout(function waitUntilDomIsReadyLoadingCustomFontsMightOffsetThis() {
  rpi = new ReadingPositionIndicator({
    rpiArea: '[data-rpi-area]', /* optional, query selector to an element */
    progressBar: { /* optional */
      show: true, /* default true */
      color: 'rgba(0, 120, 120, .5)', /* default from css */
    },
    percentage: { /* optional */
      show: true, /* default false */
      displayBeforeScroll: false, /* default false */
      opacity: .3, /* default from css */
      color: '#000', /* default from css */
    },
  }).init();
}, 200); // wait until DOM has fully rendered the article to get the calculations correct
// rpi.destroy(); // use when to be removed
// rpi.update(); // optional force update, example: DOM was updated and need to refresh the indicator
```


# development
* git clone the project or download it
* npm install
* npm start
* open a browser and go to localhost:3333

# build library into dist folder
* npm run build 

# how does it work?

It calculate heights for viewport, document and current scroll position. If rpiArea is used then it also uses getBoundingClientRect method to calculate dom element dimension. DOM updates are only applied if data has changed since last time. The calculation is updated on scroll and resize event and the information is updated to the DOM.


# license

MIT License: http://opensource.org/licenses/MIT
