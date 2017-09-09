// apply library styling
import './ReadingPositionIndicator.css';

/* --------------------------------------------------------------
  ReadingPositionIndicator library
*/

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

export default class ReadingPositionIndicator {
  constructor(
    props = {
      color: null,
      percentage: {
        show: false,
        displayBeforeScroll: false,
        color: null,
        opacity: null
      },
      rpiArea: null
    }
  ) {
    this.props = props;
    this.scroll = {
      maxHeight: 1,
      last_known_scroll_position: 0,
      ticking: false
    };
  }

  init() {
    this._transformName = getTransformVendorPrefixAsString();

    this.progressBarContainerEl = document.getElementById(
      'rpi-progress-bar-container'
    );
    this.progressBarEl = this.progressBarContainerEl.querySelector(
      '.rpi-progress-bar-container__position'
    );
    this.progressBarPercentageEl = this.progressBarContainerEl.querySelector(
      '.rpi-progress-bar-container__percentage'
    );

    if (this.props.color) {
      this.progressBarEl.style.background = this.props.color;
    }
    if (this.props.percentage) {
      if (this.props.percentage.color) {
        this.progressBarPercentageEl.style.color = this.props.percentage.color;
      }
      if (this.props.percentage.opacity) {
        this.progressBarPercentageEl.style.opacity = this.props.percentage.opacity;
      }
    }

    this._onResize = debounce(() => {
      this._update();
      this._updateProgressBar(getScrollPosition());
    }, 200);

    this._update();

    if (this.props.percentage && this.props.percentage.displayBeforeScroll) {
      this._updateProgressBar(getScrollPosition());
    }

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

  _updateRpiArea() {
    if (this.props.rpiArea) {
      let rect = this.props.rpiArea.getBoundingClientRect();
      let scrollPosition = getScrollPosition();

      this.rpiArea = {
        top: rect.top + scrollPosition,
        bottom: rect.bottom + scrollPosition,
        height: rect.height,
        rect: rect
      };
    } else {
      let documentHeight = getDocumentHeight();
      this.rpiArea = {
        top: 0,
        bottom: documentHeight,
        height: documentHeight
      };
    }
  }

  _update() {
    this._updateRpiArea();

    this.scroll.documentHeight = this.rpiArea.height;
    this.scroll.viewHeight = getViewHeight();
    this.scroll.maxHeight = this.scroll.documentHeight - this.scroll.viewHeight;
  }

  _onScroll() {
    // https://developer.mozilla.org/en-US/docs/Web/Events/scroll
    this.scroll.last_known_scroll_position = getScrollPosition();
    if (!this.scroll.ticking) {
      window.requestAnimationFrame(() => {
        this._updateProgressBar(this.scroll.last_known_scroll_position);
        this.scroll.ticking = false;
      });
    }
    this.scroll.ticking = true;
  }

  _updateProgressBar(scrollPosition) {
    scrollPosition = scrollPosition || 0;

    if (this.scroll.viewHeight >= this.rpiArea.height) {
      this.progressBarPercentageEl.textContent = 'no rpi needed';
    } else {
      if (scrollPosition < this.rpiArea.top) {
        this.progressBarPercentageEl.textContent = 'before position indicator';
        this.progressBarEl.style[this._transformName] = `scaleX(0)`;
      } else if (
        scrollPosition >
        this.rpiArea.bottom - this.scroll.viewHeight
      ) {
        this.progressBarPercentageEl.textContent = 'after position indicator';
        this.progressBarEl.style[this._transformName] = `scaleX(1)`;
      } else {
        let offset = scrollPosition - this.rpiArea.top;

        const percentage = Math.round(
          100 * offset / Math.max(this.scroll.maxHeight, 1)
        );

        this.progressBarContainerEl.setAttribute('aria-valuenow', percentage);
        this.progressBarEl.style[this._transformName] = `scaleX(${percentage /
          100})`;

        if (this.props.percentage && this.props.percentage.show) {
          this.progressBarPercentageEl.textContent = `${percentage}%`;
        }
      }
    }
  }
}
