// apply library styling
import './ReadingPositionIndicator.css';
import {
  applyElements,
  applyConfiguration,
  applyEventListeners,
  getTransformVendorPrefixAsString,
  getScrollPosition,
  getDocumentHeight,
  getViewHeight,
} from './helpers';

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
        opacity: null,
      },
      rpiArea: null,
    };

    this.props = { ...defaultProps, ...props };
    this.elems = {}; // DOM elements
    this.state = {
      scroll: {
        maxHeight: 1,
        last_known_scroll_position: 0,
        ticking: false,
      },
      rpiArea: {},
      virtualDOM: {},
      DOM: {},
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
      const rect = this.elems.rpiArea.getBoundingClientRect();
      const scrollPosition = getScrollPosition();

      this.state.rpiArea = {
        top: rect.top + scrollPosition,
        bottom: rect.bottom + scrollPosition,
        height: rect.height,
      };
    } else {
      const documentHeight = getDocumentHeight();
      this.state.rpiArea = {
        top: 0,
        bottom: documentHeight,
        height: documentHeight,
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
          this.state.scroll.last_known_scroll_position || 0,
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
    const { viewHeight, maxHeight } = this.state.scroll;

    if (viewHeight >= this.state.rpiArea.height) {
      // no position indicator needed, we can see it all in view size
      this.state.virtualDOM.progressBarPercentageTextContent = '';
      this.state.virtualDOM.progressBarPercentage = '100';
      return;
    }

    if (scrollPosition < this.state.rpiArea.top) {
      // before position indicator
      this.state.virtualDOM.progressBarPercentageTextContent = '';
      this.state.virtualDOM.progressBarPercentage = '0';
      this.state.virtualDOM.progressBarPositionStyleTransform = 'scaleX(0)';
    } else if (scrollPosition > this.state.rpiArea.bottom - viewHeight) {
      // after position indicator
      this.state.virtualDOM.progressBarPercentageTextContent = '';
      this.state.virtualDOM.progressBarPercentage = '100';
      this.state.virtualDOM.progressBarPositionStyleTransform = 'scaleX(0)';
    } else {
      const offset = scrollPosition - this.state.rpiArea.top;
      const percentage = Math.min(Math.round((100 * offset) / Math.max(maxHeight, 1)),100);

      if (this.props.progressBar.show) {
        this.state.virtualDOM.progressBarPositionStyleTransform = `scaleX(${percentage /
          100})`;
      }

      if (this.props.percentage.show) {
        this.state.virtualDOM.progressBarPercentageTextContent = `${percentage}%`;
      }

      this.state.virtualDOM.progressBarPercentage = `${percentage}`;
    }
  }

  update() {
    this._updateCalculationInformationAndSaveToState();
    this._updateProgressBar(getScrollPosition());
    return this;
  }

  _updateDOM() {
    const {
      progressBarPercentageTextContent,
      progressBarPositionStyleTransform,
      progressBarPercentage,
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
        progressBarPercentage,
      );
    }
  }
}
