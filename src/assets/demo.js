import ReadingPositionIndicator from './rpi';
//import styles  from './demo.css'; // apply demo styling

/* -------------------------------------------------------------- 
  Demo 
*/
var readingPositionIndicator = new ReadingPositionIndicator({
  color: 'dodgerblue',
  showPercentage: true,
  percentage: {
    show: true,
    opacity: .4,
    color: '#000',
  },
}).init();

//readingPositionIndicator.destroy(); // use when to be removed

export default readingPositionIndicator;