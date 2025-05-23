/**
 * @file The HTML template for the flipping-tile web component.
 * @module flipping-tile.html
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

// Define the HTML template.
export const htmlTemplate = document.createElement('template')
htmlTemplate.innerHTML = `
  <button part="tile-main" id="tile">
    <div part="tile-front" id="front">
      <slot></slot>
    </div>
    <div part="tile-back" id="back"></div>
  </button>
`
