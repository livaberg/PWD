/**
 * @file The memory-app web component module.
 * @module memory-app
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

import '../flipping-tile/index.js'
import { cssTemplate, IMG_URLS } from './memory-app.css'
import { htmlTemplate } from './memory-app.html'

/*
 * Define custom element.
 */
customElements.define('memory-app',
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
     * The size selector element.
     *
     * @type {HTMLDivElement}
     */
    #sizeSelector

    /**
     * The number of attempts made.
     *
     * @type {number}
     */
    #attempts = 0

    /**
     * The attempt counter element.
     *
     * @type {HTMLDivElement}
     */
    #attemptCounterElement

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

      this.#sizeSelector = this.shadowRoot.querySelector('#size-selector')
      this.#attemptCounterElement = this.shadowRoot.querySelector('#attempt-counter')

      this.#attemptCounterElement.style.display = 'none'

      this.#gameBoard.style.display = 'none'

      this.shadowRoot.querySelector('#size-selector-wrapper').style.display = 'flex'

      this.#gameBoard.addEventListener('flipping-tile:flip',
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

      this.#sizeSelector.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
          const size = event.target.getAttribute('data-size')
          this.boardSize = size

          this.shadowRoot.querySelector('#size-selector-wrapper').style.display = 'none'

          this.#gameBoard.style.display = 'grid'

          this.#init()
        }
      }, { signal: this.#abortController.signal })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Remove the event listener.
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
      this.#attempts = 0
      this.#attemptCounterElement.style.display = 'block'
      this.#updateAttemptCounter()

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

      this.#tiles.all.forEach(tile => {
        tile.removeAttribute('face-up')
        tile.removeAttribute('disabled')
        tile.removeAttribute('hidden')
      })
    }

    /**
     * Handles flip events.
     */
    #onTileFlip () {
      const tiles = this.#tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        this.#attempts++
        this.#updateAttemptCounter()

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
          let eventName = 'memory-app:tiles-mismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-app:tiles-match'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hasAttribute('hidden'))) {
            tiles.all.forEach(tile => (tile.disabled = true))

            // Trigger confetti animation if available.
            if (typeof window.confetti === 'function') {
              window.confetti({
                particleCount: 300,
                spread: 360,
                startVelocity: 60,
                decay: 0.9,
                scalar: 1.2,
                origin: { y: 0.6 },
                ticks: 300
              })
            }

            this.dispatchEvent(new CustomEvent('memory-app:game-over', {
              bubbles: true
            }))

            this.#showFinalResult()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

    /**
     * Updates the attempt counter element.
     */
    #updateAttemptCounter () {
      this.#attemptCounterElement.textContent = `Number of attempts: ${this.#attempts}`
    }

    /**
     * Shows the final result in an alert box.
     */
    #showFinalResult () {
      const resultBox = this.shadowRoot.querySelector('#result-alert')
      const resultMessage = this.shadowRoot.querySelector('#result-message')

      resultMessage.textContent = `Congratulations! You finished the game in ${this.#attempts} attempts.`

      resultBox.classList.add('visible')

      // Hide the result box after 4 seconds.
      setTimeout(() => {
        resultBox.classList.remove('visible')
      }, 4000)

      this.#resetGame()
    }

    /**
     * Resets the game board to show the size selector again.
     */
    #resetGame () {
      this.shadowRoot.querySelector('#size-selector-wrapper').style.display = 'flex'
      this.#gameBoard.style.display = 'none'
      this.#attemptCounterElement.style.display = 'none'
    }
  }
)
