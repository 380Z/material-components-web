/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCDrawerAdapter from '../adapter';
import MDCDismissibleDrawerFoundation from '../dismissible/foundation';
import {cssClasses, strings} from '../constants';

/**
 * @extends {MDCDismissibleDrawerFoundation<!MDCDrawerAdapter>}
 */
class MDCModalDrawerFoundation extends MDCDismissibleDrawerFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter() {
    return /** @type {!MDCDrawerAdapter} */ ({
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      hasClass: (/* className: string */) => {},
      computeBoundingRect: () => {},
      setStyleAppContent: (/* propertyName: string, value: string */) => {},
      addClassAppContent: (/* className: string */) => {},
      removeClassAppContent: (/* className: string */) => {},
      isRtl: () => {},
      notifyClose: () => {},
      notifyOpen: () => {},
      trapFocusOnSurface: () => {},
      untrapFocusOnSurface: () => {},
    });
  }

  /**
   * On open.
   * @override
   */
  opened() {
    this.adapter_.trapFocusOnSurface();
  }

  /**
   * On close.
   * @override
   */
  closed() {
    this.adapter_.untrapFocusOnSurface();
  }

  handleScrimClick() {
    this.close();
  }
}

export default MDCModalDrawerFoundation;