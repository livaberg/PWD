/**
 * @file The my-memory-game web component module.
 * @module my-memory-game
 * @author Mats Loock <mats.loock@lnu.se>
 */

import { cssTemplate, IMG_URLS } from './memory-app.css'
import { htmlTemplate } from './memory-app.html'

/*
 * Define custom element.
 */
customElements.define('my-memory-game',
  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    /**
     * AbortController instance.
     *
     * @type {AbortController}
     */
    #abortController

    /**
     * The game board element.
     *
     * @type {HTMLDivElement}
     */
    #gameBoard

    /**
     * The tile template element.
     *
     * @type {HTMLTemplateElement}
     */
    #tileTemplate

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the templates to the shadow root.
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
      this.shadowRoot.appendChild(htmlTemplate.content.cloneNode(true))

      // Make it possible to remove the event listeners.
      this.#abortController = new AbortController()

      // Get the game board element in the shadow root.
      this.#gameBoard = this.shadowRoot.querySelector('#game-board')

      // Get the tile template element in the shadow root.
      this.#tileTemplate = this.shadowRoot.querySelector('#tile-template')
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get #gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      switch (this.boardSize) {
        case 'small': {
          gameBoardSize.width = gameBoardSize.height = 2
          break
        }

        case 'medium': {
          gameBoardSize.height = 2
          break
        }
      }

      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get #tiles () {
      const tiles = Array.from(this.#gameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this.#init()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }

      this.#upgradeProperty('boardsize')

      this.#gameBoard.addEventListener('my-flipping-tile-extra:flip',
        () => this.#onTileFlip(),
        { signal: this.#abortController.signal }
      )

      this.addEventListener('dragstart',
        (event) => {
          // Disable element dragging.
          event.preventDefault()
          event.stopPropagation()
        },
        { signal: this.#abortController.signal }
      )
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
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    #upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    #init () {
      const { width, height } = this.#gameBoardSize

      const tilesCount = width * height

      if (tilesCount !== this.#tiles.all.length) {
        // Remove existing tiles, if any.
        while (this.#gameBoard.firstChild) {
          this.#gameBoard.removeChild(this.#gameBoard.lastChild)
        }

        if (width === 2) {
          this.#gameBoard.classList.add('small')
        } else {
          this.#gameBoard.classList.remove('small')
        }

        // Add tiles.
        for (let i = 0; i < tilesCount; i++) {
          const tile = this.#tileTemplate.content.cloneNode(true)
          this.#gameBoard.appendChild(tile)
        }
      }

      // Create a sequence of numbers between 0 and 15,
      // and then shuffle the sequence.
      const indexes = [...Array(tilesCount).keys()]

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }

      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })
    }

    /**
     * Handles flip events.
     */
    #onTileFlip () {
      const tiles = this.#tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        const isEqual = first.isEqual(second)

        // Delay the flip back of the tiles.
        // If the tiles are equal, the delay is 1000 ms.
        // If the tiles are not equal, the delay is 1500 ms.
        const delay = isEqual ? 1000 : 1500

        window.setTimeout(() => {
          let eventName = 'my-memory-game:tiles-mismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'my-memory-game:tiles-match'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('my-memory-game:game-over', {
              bubbles: true
            }))

            this.#init()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }
  }
)
