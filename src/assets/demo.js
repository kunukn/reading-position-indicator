import ReadingPositionIndicator from './ReadingPositionIndicator';
import styles  from './demo.css'; // apply demo styling

/* --------------------------------------------------------------
  Demo 
*/
var rpi = new ReadingPositionIndicator({
  color: 'navyblue',
  percentage: {
    show: true,
    opacity: .3,
    color: '#000',
  },
}).init();

//rpi.destroy(); // use when to be removed

export default readingPositionIndicator;