// apply library styling
import './ReadingPositionIndicator.css';

/* --------------------------------------------------------------
  ReadingPositionIndicator library
*/

export default class ReadingPositionIndicator {
  constructor(props) {
    const defaultProps = {
      progressBar: {
        show: true,
        color: null,
        opacity: null,
      },
      percentage: {
        show: false,
        displayBeforeScroll: false,
        color: null,
        opacity: null
      },
      rpiArea: null
    };

    this.props = { ...defaultProps, ...props };
    this.elems = {}; // dom elements
    this.state = {
      scroll: {
        maxHeight: 1,
        last_known_scroll_position: 0,
        ticking: false
      },
      rpiArea: {},
      virtualDOM: {},
      DOM: {}
    };
  }

  init() {
    this._transformName = getTransformVendorPrefixAsString();

    applyElements.call(this);

    this._updateCalculationInformationAndSaveToState();

    applyConfiguration.call(this);

    applyEventListeners.call(this);

    return this;
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    return this;
  }

  _updateRpiArea() {
    if (this.elems.rpiArea) {
      let rect = this.elems.rpiArea.getBoundingClientRect();
      let scrollPosition = getScrollPosition();

      this.state.rpiArea = {
        top: rect.top + scrollPosition,
        bottom: rect.bottom + scrollPosition,
        height: rect.height
      };
    } else {
      let documentHeight = getDocumentHeight();
      this.state.rpiArea = {
        top: 0,
        bottom: documentHeight,
        height: documentHeight
      };
    }
  }

  _updateCalculationInformationAndSaveToState() {
    this._updateRpiArea();
    this.state.scroll.viewHeight = getViewHeight();
    this.state.scroll.maxHeight =
      this.state.rpiArea.height - this.state.scroll.viewHeight;
  }

  _onScroll() {
    // https://developer.mozilla.org/en-US/docs/Web/Events/scroll
    this.state.scroll.last_known_scroll_position = getScrollPosition();
    if (!this.state.scroll.ticking) {
      window.requestAnimationFrame(() => {
        this._updateProgressBar(
          this.state.scroll.last_known_scroll_position || 0
        );
        this.state.scroll.ticking = false;
      });
    }
    this.state.scroll.ticking = true;
  }

  _updateProgressBar(scrollPosition) {
    this._updateVirtualDOM(scrollPosition);
    this._updateDOM();
  }

  _updateVirtualDOM(scrollPosition) {
    let { viewHeight, maxHeight } = this.state.scroll;

    if (viewHeight >= this.state.rpiArea.height) {
      // no position indicator needed, we can see it all in view size
      this.state.virtualDOM.progressBarPercentageTextContent = '';
    } else {
      if (scrollPosition < this.state.rpiArea.top) {
        // before position indicator
        this.state.virtualDOM.progressBarPercentageTextContent = '';
        this.state.virtualDOM.progressBarPositionStyleTransform = 'scaleX(0)';
      } else if (scrollPosition > this.state.rpiArea.bottom - viewHeight) {
        // after position indicator
        this.state.virtualDOM.progressBarPercentageTextContent = '';
        this.state.virtualDOM.progressBarPositionStyleTransform = 'scaleX(0)';
      } else {
        let offset = scrollPosition - this.state.rpiArea.top;
        const percentage = Math.round(100 * offset / Math.max(maxHeight, 1));

        if (this.props.progressBar.show) {
          this.state.virtualDOM.progressBarPositionStyleTransform = `scaleX(${percentage /
            100})`;
        }

        if (this.props.percentage.show) {
          this.state.virtualDOM.progressBarPercentageTextContent = `${percentage}%`;
        }
      }
    }
  }

  update(){
    this._updateCalculationInformationAndSaveToState();
    this._updateProgressBar(getScrollPosition());
    return this;
  }

  _updateDOM() {
    let {
      progressBarPercentageTextContent,
      progressBarPositionStyleTransform,
      progressBarPercentage
    } = this.state.virtualDOM;

    if (
      progressBarPercentageTextContent !==
      this.state.DOM.progressBarPercentageTextContent
    ) {
      // update dom state
      this.state.DOM.progressBarPercentageTextContent = progressBarPercentageTextContent;
      // update dom
      this.elems.progressBarPercentage.textContent = progressBarPercentageTextContent;
    }

    if (
      progressBarPositionStyleTransform !==
      this.state.DOM.progressBarPositionStyleTransform
    ) {
      // update dom state
      this.state.DOM.progressBarPositionStyleTransform = progressBarPositionStyleTransform;
      // update dom
      this.elems.progressBarPosition.style[
        this._transformName
      ] = progressBarPositionStyleTransform;
    }

    if (progressBarPercentage !== this.state.DOM.progressBarPercentage) {
      // update dom state
      this.state.DOM.progressBarPercentage = progressBarPercentage;
      // update dom
      this.elems.progressBar.setAttribute(
        'aria-valuenow',
        progressBarPercentage
      );
    }
  }
}

function applyElements() {
  let progressBar = document.getElementById('rpi-progress-bar');
  this.elems.progressBar = progressBar;
  this.elems.progressBarPosition = progressBar.querySelector(
    '.rpi-progress-bar__position'
  );
  this.elems.progressBarPercentage = progressBar.querySelector(
    '.rpi-progress-bar__percentage'
  );

  if (this.props.rpiArea) {
    this.elems.rpiArea = document.querySelector(this.props.rpiArea);
  }
}

function applyConfiguration() {
  let { percentage, progressBar } = this.props;
  if (progressBar) {
    if (progressBar.color) {
      this.elems.progressBarPosition.style.background = progressBar.color;
    }
    if (progressBar.opacity) {
      this.elems.progressBarPosition.style.opacity = progressBar.opacity;
    }
  }
  if (percentage) {
    if (percentage.color) {
      this.elems.progressBarPercentage.style.color = percentage.color;
    }
    if (percentage.opacity) {
      this.elems.progressBarPercentage.style.opacity = percentage.opacity;
    }
    if (percentage.displayBeforeScroll) {
      this._updateProgressBar(getScrollPosition());
    }
  }
}

function applyEventListeners() {
  this._onResize = debounce(() => {
    this.update();
  }, 200);

  // ES6 rebind
  this._onScroll = this._onScroll.bind(this);
  this._onResize = this._onResize.bind(this);

  window.addEventListener('scroll', this._onScroll);
  window.addEventListener('resize', this._onResize);
}

function getTransformVendorPrefixAsString() {
  // http://shouldiprefix.com/#transforms
  const el = document.createElement('div');
  const names = {
    transform: 'transform', // Modern
    WebkitTransition: 'webkitTransform', // iOS7+
    MsTransform: 'msTransform' // IE9+
  };

  /* eslint-disable */
  for (var name in names) {
    if (el.style[name] !== undefined) {
      return names[name];
    }
  }
  /* eslint-enable */
  return 'transform';
}

// Cross-browser
function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop || 0;
}

// Cross-browser http://stackoverflow.com/a/11077758/815507
function getDocumentHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
}

// Cross-browser
function getViewHeight() {
  return Math.max(window.innerHeight, 0);
}

// https://john-dugan.com/javascript-debounce/
function debounce(e, t, n) {
  /* eslint-disable */
  var a;
  return function() {
    var r = this,
      i = arguments,
      o = function() {
        (a = null), n || e.apply(r, i);
      },
      s = n && !a;
    clearTimeout(a), (a = setTimeout(o, t || 200)), s && e.apply(r, i);
  };
  /* eslint-enable */
}
