/**
 * @file The flipping-tile web component module.
 * @module flipping-tile
 * @description This module defines a web component representing a flipping tile.
 * It handles visual states and interaction logic for flipping the tile,
 * including managing 'face-up', 'disabled', and 'hidden' attribute states.
 * The module dispatches 'flipping-tile:flip' events to notify when a tile is flipped.
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

import { cssTemplate } from './flipping-tile.css.js'
import { htmlTemplate } from './flipping-tile.html.js'

customElements.define('flipping-tile',
  /**
   * Represents a flipping tile.
   */
  class extends HTMLElement {
    /**
     * AbortController instance.
     *
     * @type {AbortController}
     */
    #abortController

    /**
     * The element representing the tile.
     */
    #tile

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
      this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true))

      // Make it possible to remove the event listeners.
      this.#abortController = new AbortController()

      // Get the tile element in the shadow root.
      this.#tile = this.shadowRoot.querySelector('#tile')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['face-up', 'disabled', 'hidden']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      // Enable or disable the button inside the shadow DOM.
      if ((name === 'disabled' || name === 'hidden') &&
        oldValue !== newValue) {
        // Determine if the disabled attribute should be present or absent.
        const isPresent = Boolean(newValue) || newValue === ''

        if (isPresent) {
          this.#tile.setAttribute('disabled', '')
          this.blur()
        } else {
          this.#tile.removeAttribute('disabled')
        }
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      // Set signal to be able to remove the event listener.

      // Listen to click events.
      this.addEventListener('click', (event) => {
        // Flip if main button, no other button or key pressed.
        if (event.button === 0 &&
          event.buttons < 2 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey) {
          this.#flip()
        }
      }, {
        signal: this.#abortController.signal
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Remove the event listener.
      // (The same signal can be used to remove other event listeners!)
      this.#abortController.abort()
    }

    /**
     * Specifies whether this instance contains the same content as another tile.
     *
     * @param {*} other - The tile to test for equality
     * @returns {boolean} true if other has the same content as this tile instance.
     */
    isEqual (other) {
      return this.isEqualNode(other)
    }

    /**
     * Flips the current instance, if it is not disabled.
     */
    #flip () {
      // Do not do anything if the element is disabled or hidden.
      if (this.hasAttribute('disabled') ||
        this.hasAttribute('hidden')) {
        return
      }

      // Toggle the face-up attribute.
      this.hasAttribute('face-up')
        ? this.removeAttribute('face-up')
        : this.setAttribute('face-up', '')

      // Raise the flipping-tile:flip event.
      this.dispatchEvent(new CustomEvent('flipping-tile:flip', {
        bubbles: true,
        detail: { faceUp: this.hasAttribute('face-up') }
      }))
    }
  }
)
