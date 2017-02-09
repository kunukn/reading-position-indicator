# reading position indicator
Vanilla JS mobile friendly reading position indicator library

# about
A position indicator at the top of the page to visually display how far you have scrolled on a webpage.

# demo
http://codepen.io/kunukn/pen/zNJqEE


# browser support

![IE](https://cloud.githubusercontent.com/assets/398893/3528325/20373e76-078e-11e4-8e3a-1cb86cf506f0.png) | ![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png) | ![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png) | ![Opera](https://cloud.githubusercontent.com/assets/398893/3528330/27ec9fa8-078e-11e4-95cb-709fd11dac16.png) | ![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

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
  <div 
    class="rpi-progress-bar-container" 
    id="rpi-progress-bar-container" 
    role="progressbar" 
    aria-valuemin="0" 
    aria-valuemax="100"
    aria-valuenow="0">

      <div class="rpi-progress-bar-container__position" aria-hidden="true"></div>
      <div class="rpi-progress-bar-container__percentage"></div>

  </div>
  <!-- end library markup -->
       
       ...    
       
       <script src="rpi.bundle.js"></script> 
       <script>
        var rpi = new ReadingPositionIndicator({
          color: 'dodgerblue',
          showPercentage: true,
          percentage: {
            show: true,
            opacity: .3,
            color: '#000',
          },
        }).init();
        //rpi.destroy(); // use when to be removed
       </script>
 </body>
```

# License

MIT License: http://opensource.org/licenses/MIT
