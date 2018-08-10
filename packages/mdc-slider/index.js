/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCComponent from '@material/base/component';

import {MDCRipple} from '@material/ripple/index';
import {strings, cssClasses} from './constants';
import MDCSliderAdapter from './adapter';
import MDCSliderFoundation from './foundation';

/**
 * @extends MDCComponent<!MDCSliderFoundation>
 */
class MDCSlider extends MDCComponent {
  static attachTo(root) {
    return new MDCSlider(root);
  }

  constructor(...args) {
    super(...args);
    /** @type {?Element} */
    this.thumb_;
    /** @type {?Element} */
    this.trackFill_;
    /** @type {?Element} */
    this.tickMarkSet_;
    /** @type {?Element} */
    this.valueLabel_;
    /** @type {?Element} */
    this.valueLabelText_;
    /** @type {number} */
    this.digitWidth_;
    /** @type {number} */
    this.commaWidth_;
    /** @type {?Element} */
    this.lastTickMark_;
    /** @private {!MDCRipple} */
    this.ripple_ = this.initRipple_();
  }

  /** @return {number} */
  get value() {
    return this.foundation_.getValue();
  }

  /** @param {number} value */
  set value(value) {
    this.foundation_.setValue(value);
  }

  /** @return {number} */
  get min() {
    return this.foundation_.getMin();
  }

  /** @param {number} min */
  set min(min) {
    this.foundation_.setMin(min);
  }

  /** @return {number} */
  get max() {
    return this.foundation_.getMax();
  }

  /** @param {number} max */
  set max(max) {
    this.foundation_.setMax(max);
  }

  /** @return {boolean} */
  get disabled() {
    return this.foundation_.isDisabled();
  }

  /** @param {boolean} disabled */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /** @return {number} */
  get step() {
    return this.foundation_.getStep();
  }

  /** @param {number} step */
  set step(step) {
    this.foundation_.setStep(step);
  }

  /**
   * @return {!MDCRipple}
   * @private
   */
  initRipple_() {
    const ripple = new MDCRipple(this.root_.querySelector(strings.THUMB_SELECTOR));
    ripple.unbounded = true;
    return ripple;
  }

  destroy() {
    this.ripple_.destroy();
    super.destroy();
  }

  initialize() {
    this.thumb_ = this.root_.querySelector(strings.THUMB_SELECTOR);
    this.trackFill_ = this.root_.querySelector(strings.TRACK_FILL_SELECTOR);
    this.tickMarkSet_ = this.root_.querySelector(strings.TICK_MARK_SET_SELECTOR);
    this.valueLabel_ = this.root_.querySelector(strings.VALUE_LABEL_SELECTOR);
    this.valueLabelText_ = this.root_.querySelector(strings.VALUE_LABEL_TEXT_SELECTOR);

    // Render a digit and a comma to get the width for calculations.
    // This is to accomodate for different fonts and sizes used.
    if (this.valueLabelText_) {
      this.valueLabelText_.textContent = 0;
      this.digitWidth_ = this.valueLabelText_.clientWidth;
      this.valueLabelText_.textContent = ',';
      this.commaWidth_ = this.valueLabelText_.clientWidth;
    }
  }

  /**
   * @return {!MDCSliderFoundation}
   */
  getDefaultFoundation() {
    return new MDCSliderFoundation(
      /** @type {!MDCSliderAdapter} */ ({
        hasClass: (className) => this.root_.classList.contains(className),
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        setThumbAttribute: (name, value) => this.thumb_.setAttribute(name, value),
        setValueLabelPath: (value) => this.valueLabel_.setAttribute('d', value),
        setValueLabelText: (text) => {
          this.valueLabelText_.textContent = text;
        },
        setValueLabelTextStyleProperty: (propertyName, value) => {
          this.valueLabelText_.style.setProperty(propertyName, value);
        },
        removeValueLabelTextStyle: () => {
          this.valueLabelText_.removeAttribute('style');
        },
        getDigitWidth: () => this.digitWidth_,
        getCommaWidth: () => this.commaWidth_,
        computeBoundingRect: () => this.root_.getBoundingClientRect(),
        eventTargetHasClass: (target, className) => {
          if (target.classList) {
            return target.classList.contains(className);
          }
        },
        removeThumbAttribute: (name) => this.thumb_.removeAttribute(name),
        getThumbTabIndex: () => this.thumb_.tabIndex,
        registerEventHandler: (type, handler) => {
          this.root_.addEventListener(type, handler);
        },
        deregisterEventHandler: (type, handler) => {
          this.root_.removeEventListener(type, handler);
        },
        registerThumbEventHandler: (type, handler) => {
          this.thumb_.addEventListener(type, handler);
        },
        deregisterThumbEventHandler: (type, handler) => {
          this.thumb_.removeEventListener(type, handler);
        },
        registerBodyEventHandler: (type, handler) => {
          document.body.addEventListener(type, handler);
        },
        deregisterBodyEventHandler: (type, handler) => {
          document.body.removeEventListener(type, handler);
        },
        registerWindowResizeHandler: (handler) => {
          window.addEventListener('resize', handler);
        },
        deregisterWindowResizeHandler: (handler) => {
          window.removeEventListener('resize', handler);
        },
        notifyInput: () => {
          this.emit(strings.INPUT_EVENT, this);
        },
        notifyChange: () => {
          this.emit(strings.CHANGE_EVENT, this);
        },
        setThumbStyleProperty: (propertyName, value) => {
          this.thumb_.style.setProperty(propertyName, value);
        },
        setTrackFillStyleProperty: (propertyName, value) => {
          this.trackFill_.style.setProperty(propertyName, value);
        },
        setLastTickMarkStyleProperty: (propertyName, value) => {
          this.lastTickMark_.style.setProperty(propertyName, value);
        },
        hasTickMarkClass: (tickMark, className) => tickMark.classList.contains(className),
        addTickMarkClass: (tickMark, className) => tickMark.classList.add(className),
        removeTickMarkClass: (tickMark, className) => tickMark.classList.remove(className),
        getTickMarks: () => this.tickMarkSet_ ? this.tickMarkSet_.children : null,
        focusThumb: () => {
          this.thumb_.focus();
        },
        activateRipple: () => {
          this.ripple_.activate();
        },
        deactivateRipple: () => {
          this.ripple_.deactivate();
        },
        isRTL: () => getComputedStyle(this.root_).direction === 'rtl',
      })
    );
  }

  initialSyncWithDOM() {
    const origValueNow = parseFloat(this.thumb_.getAttribute(strings.ARIA_VALUENOW));
    this.max = parseFloat(this.thumb_.getAttribute(strings.ARIA_VALUEMAX)) || this.max;
    this.min = parseFloat(this.thumb_.getAttribute(strings.ARIA_VALUEMIN)) || this.min;
    this.step = parseFloat(this.thumb_.getAttribute(strings.DATA_STEP)) || this.step;
    this.value = origValueNow || this.value;
    this.disabled = (
      this.thumb_.hasAttribute(strings.ARIA_DISABLED) &&
      this.thumb_.getAttribute(strings.ARIA_DISABLED) !== 'false'
    );
    if (this.tickMarkSet_ && this.root_.classList.contains(cssClasses.DISCRETE)) {
      this.setUpTickMarks_();
    }
  }

  setUpTickMarks_() {
    const numMarks = this.foundation_.calculateNumberOfTickMarks();

    // Remove tick marks if there are any
    while (this.tickMarkSet_.firstChild) {
      this.tickMarkSet_.removeChild(this.tickMarkSet_.firstChild);
    }

    // Create the tick marks and append to the tick mark set
    const frag = document.createDocumentFragment();
    for (let i = 0; i < numMarks; i++) {
      const mark = document.createElement('div');
      mark.classList.add(cssClasses.TICK_MARK);
      frag.appendChild(mark);
    }
    this.tickMarkSet_.appendChild(frag);

    // Assign the last tick mark
    this.lastTickMark_ = this.root_.querySelector(strings.LAST_TICK_MARK_SELECTOR);

    this.foundation_.adjustLastTickMark(numMarks);
    this.foundation_.layout();
  }

  layout() {
    this.foundation_.layout();
    if (this.tickMarkSet_ && this.root_.classList.contains(cssClasses.DISCRETE)) {
      this.setUpTickMarks_();
    }
  }
}

export {MDCSliderFoundation, MDCSlider};
