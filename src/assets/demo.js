import ReadingPositionIndicator from './rpi';
import css from './demo.css'; // apply demo styling

/* -------------------------------------------------------------- 
  Demo 
*/
let readingPositionIndicator = new ReadingPositionIndicator({
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