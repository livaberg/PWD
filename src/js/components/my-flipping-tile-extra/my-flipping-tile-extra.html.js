/**
 * @file The HTML template for the my-flipping-tile-extra web component.
 * @module my-flipping-tile-extra.html
 * @author Mats Loock <mats.loock@lnu.se>
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
