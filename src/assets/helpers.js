// https://john-dugan.com/javascript-debounce/
export function debounce(e, t, n) {
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

// Cross-browser
export function getScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop || 0;
}

export function applyElements() {
  const progressBar = document.querySelector('.rpi-progress-bar');
  this.elems.progressBar = progressBar;
  this.elems.progressBarPosition = progressBar.querySelector(
    '.rpi-progress-bar__position',
  );
  this.elems.progressBarPercentage = progressBar.querySelector(
    '.rpi-progress-bar__percentage',
  );

  if (this.props.rpiArea) {
    this.elems.rpiArea = document.querySelector(this.props.rpiArea);
  }
}

export function applyConfiguration() {
  const { percentage, progressBar } = this.props;
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

export function applyEventListeners() {
  this._onResize = debounce(() => {
    this.update();
  }, 200);

  // ES6 rebind
  this._onScroll = this._onScroll.bind(this);
  this._onResize = this._onResize.bind(this);

  window.addEventListener('scroll', this._onScroll);
  window.addEventListener('resize', this._onResize);
}

export function getTransformVendorPrefixAsString() {
  // http://shouldiprefix.com/#transforms
  const el = document.createElement('div');
  const names = {
    transform: 'transform', // Modern
    WebkitTransition: 'webkitTransform', // iOS7+
    MsTransform: 'msTransform', // IE9+
  };

  for (let i = 0; i < names.length; i += 1) {
    const name = names[i];
    if (el.style[name] !== undefined) {
      return names[name];
    }
  }
  return 'transform';
}

// Cross-browser http://stackoverflow.com/a/11077758/815507
export function getDocumentHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
  );
}

// Cross-browser
export function getViewHeight() {
  return Math.max(window.innerHeight, 0);
}
