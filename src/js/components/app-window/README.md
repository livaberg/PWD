# &lt;app-window&gt;

A custom web component that displays a draggable window interface, mimicking the look and feel of a desktop application window. The window is intended for embedding individual app content in a moveable, self-contained container.


## Attributes

title — Sets the window’s title shown in the header. This is read once when the component is first connected to the DOM.


## Features

- Draggable window interface with smooth mouse-based movement.  
- Close button in the header to remove the window from the DOM.  
- Automatically stacks above sibling windows by dynamically adjusting z-index.  
- Encapsulated structure and styling via Shadow DOM.  
- Clean, desktop-like design with custom styling and rounded corners.  


## Events

None


## Example

```html
<app-window title="My App"></app-window>
```


## Dependencies

The component has no dependencies.