/**
 * @file A CSS template string that is used to style the shadow DOM of the
 * flipping-tile web component.
 * @module flipping-tile.css
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Liv Åberg <lh224hh@student.lnu.se>
 */

// Define the CSS template.
export const cssTemplate = document.createElement('template')
cssTemplate.innerHTML = `
  <style>
    :host {
        display: block;
        height: 80px;
        width: 80px;
        perspective: 1000px;
        position: relative;
    }

    :host([hidden]) #tile {
        cursor: default;
        pointer-events: none;
        box-shadow: none;
        border-style: dotted;
        border-color: #858585;
    }

    :host([hidden]) #tile>* {
        visibility: hidden;
    }

    /* flipping */
    :host([face-up]) #tile {
      transform: rotateY(180deg);
    }

    #tile {
      display: inline-block;
      height: 100%;
      width: 100%;
      padding:0;
      border: solid 1px #767676;
      border-radius: 10px;
      outline: none;
      background-color: #fff;
      cursor: pointer;
      box-shadow: 0px 0 10px #ccc;
      /* flipping */
      transform-style: preserve-3d;
      transition: 1s;
    }

    #tile:focus {
      border-color: #000;
      box-shadow: 0px 0 10px black;
    }

    #tile[disabled] {
      cursor: default;
      pointer-events: none;
      box-shadow: none;
      border-style: dashed;
      border-color: #858585;
    }

    button:focus-visible {
      outline: 4px solid #0055ff;
      outline-offset: 3px;
      box-shadow: 0 0 0 4px rgba(0, 85, 255, 0.5);
      border-radius: 10px;
      z-index: 2;
      transform: scale(1.1);
      transition: transform 0.2s ease;
    }

    #front,
    #back {
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-radius: 8px;
      margin:2px;
      /* flipping */
      position: absolute;
      top:0;
      left:0;
      backface-visibility: hidden;
    }

    #front {
      background-color:#fff;
      /* flipping */
      transform: rotateY(180deg);
    }

    #back {
      /* lnu-symbol.png */
      background:#ffe001 no-repeat center/50% url('data:image/png;base64,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');
    }

    slot {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Styles any content in the slot element.  */
    slot>* {
        max-width: 80%;
        max-height: 80%;
    }

    /* Styles slotted images.  */
    ::slotted(img) {
        max-width: 80%;
        max-height: 80%;
    }

  </style>
`
