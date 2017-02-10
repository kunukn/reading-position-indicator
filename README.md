# reading position indicator
Small mobile friendly reading position indicator library with no dependencies.

# demo

http://codepen.io/kunukn/full/zNJqEE

<img src="/media/rpi.gif?raw=true" width="200">

# about
A position indicator at the top of the page to visually display how far you have scrolled on a webpage.

Build with focus on simplicity, performance and a11y. 
Using transform translate for best performance. rAF for throttling scroll update and debounce for resize update. 

Aria tags are used to support screen readers. 

The progress element `<progress>` has not been used because the code gets messy with vendor prefixes and removing the defailt styles that comes with each browser. It gets even messier when fallback elements are added inside the progress element to support older browsers.


# browser support

![IE](https://cloud.githubusercontent.com/assets/398893/3528325/20373e76-078e-11e4-8e3a-1cb86cf506f0.png) | ![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png) | ![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png) | ![Opera](https://cloud.githubusercontent.com/assets/398893/3528330/27ec9fa8-078e-11e4-95cb-709fd11dac16.png) | ![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |


# size
* js `~5kb`
* css `<1kb`

# test
Tested with latest Chrome, Safari, Firefox, Edge, IE10+, iOS7+, Android 4.3+

# usage

### html structure

```html
<head>
  ...
  <link rel="stylesheet" href="rpi.bundle.css">
  ...
</head>
<body>
  <!-- library markup -->
  <div id="rpi-progress-bar-container" 
    class="rpi-progress-bar-container" 
    role="progressbar" 
    aria-valuemin="0" 
    aria-valuemax="100"
    aria-valuenow="0">
      <div class="rpi-progress-bar-container__position" aria-hidden="true"></div>
      <div class="rpi-progress-bar-container__percentage"></div>
  </div>
  <!-- end library markup -->
  
       ...          
       
       <script src="rpi.bundle.js"></script> <!-- library -->
       <script>new ReadingPositionIndicator().init();</script> <!-- usage -->
 </body>
```

### minimum markup required

```html
<div id="rpi-progress-bar-container" class="rpi-progress-bar-container">
      <div class="rpi-progress-bar-container__position"></div>
      <div class="rpi-progress-bar-container__percentage"></div>
</div>
```

### configuration example

```javascript
var rpi = new ReadingPositionIndicator({
          color: 'navyblue', // progress bar color
          percentage: {
            show: true,
            opacity: .3,
            color: '#000',
          },
        }).init();
//rpi.destroy(); // use when to be removed
```


# license

MIT License: http://opensource.org/licenses/MIT
