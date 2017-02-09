// apply library styling
import styles  from './ReadingPositionIndicator.css'; 

/* --------------------------------------------------------------
  ReadingPositionIndicator library 
*/
export default class ReadingPositionIndicator {
  constructor(props = {
    color: null,
    percentage: {
      show: false,
      color: null,
      opacity: null,
    }
  }) {
    props.percentage = props.percentage || {};
    this.props = props;
    this.scroll = {
      maxHeight: 1,
      last_known_scroll_position: 0,
      ticking: false,
    };
  }

  init() {
    this._transformName = this._getTransformVendorPrefixAsString();
    
    this.progressBarContainerEl = document.getElementById('rpi-progress-bar-container');
    this.progressBarEl = this.progressBarContainerEl.querySelector('.rpi-progress-bar-container__position');
    this.progressBarPercentageEl = this.progressBarContainerEl.querySelector('.rpi-progress-bar-container__percentage');
    
    if(this.props.color) {
      this.progressBarEl.style.backgroundColor = this.props.color;
    }
    if(this.props.percentage.show) {
      if(this.props.percentage.color) this.progressBarPercentageEl.style.color = this.props.percentage.color;
      if(this.props.percentage.opacity) this.progressBarPercentageEl.style.opacity = this.props.percentage.opacity;
    }
    
    this._onResize = this._debounce(event => {
      this._update();
    }, 200);

    this._update();
    
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);

    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('resize', this._onResize);
    
    return this;
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    return this;
  }

  _update() {
    this.scroll.documentHeight = this._getDocumentHeight();
    this.scroll.viewHeight = this._getViewHeight();
    this.scroll.maxHeight = this.scroll.documentHeight - this.scroll.viewHeight;
    this._updateProgressBar(this._getScrollPosition() );
  }

  _onScroll() {
    // https://developer.mozilla.org/en-US/docs/Web/Events/scroll
    this.scroll.last_known_scroll_position = this._getScrollPosition();
    if (!this.scroll.ticking) {
      window.requestAnimationFrame(_ => {
        this._updateProgressBar(this.scroll.last_known_scroll_position);
        this.scroll.ticking = false;
      });
    }
    this.scroll.ticking = true;
  }

  _updateProgressBar(scrollPosition) {    
    scrollPosition = scrollPosition || 0;
    const value = Math.min(scrollPosition, this.scroll.maxHeight);
    const percentage = Math.round(100 * value / Math.max(this.scroll.maxHeight, 1));
    this.progressBarContainerEl.setAttribute('aria-valuenow', percentage);
    this.progressBarEl.style[this._transformName] = `scaleX(${percentage/100})`;

    if (this.props.percentage.show) {
      if (this.scroll.viewHeight >= this.scroll.documentHeight)
        this.progressBarPercentageEl.innerHTML = '';
      else
        this.progressBarPercentageEl.innerHTML = `${percentage}%`;
    }
  }
  
    _getTransformVendorPrefixAsString() {
        // http://shouldiprefix.com/#transforms
        const el = document.createElement('div');
        const names = {
          transform: 'transform',  // Modern
          WebkitTransition: 'webkitTransform', // iOS7+
          MsTransform: 'msTransform', // IE9+
        }
        for (var name in names) {
            if (el.style[name] !== undefined) {
                return names[name];
            }
        }
        return 'transform';
    }


  // Cross-browser http://stackoverflow.com/a/11077758/815507
  _getDocumentHeight() {
    return Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
  }

  // Cross-browser
  _getViewHeight() {
    return Math.max(
      window.innerHeight, 
      0);
  }
  
  // Cross-browser
  _getScrollPosition(){    
    // window.scrollY is buggy, e.g. for Safari not correct height
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  // https://john-dugan.com/javascript-debounce/
  _debounce(e, t, n) {
    var a;
    return function() {
      var r = this,
        i = arguments,
        o = function() {
          a = null, n || e.apply(r, i)
        },
        s = n && !a;
      clearTimeout(a), a = setTimeout(o, t || 200), s && e.apply(r, i)
    }
  }
}
