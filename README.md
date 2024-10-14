
# Clip-path Maker by Drag/Drop

This project is an interactive tool for creating and customizing CSS `clip-path` shapes using drag-and-drop functionality. It allows users to visually define a polygonal `clip-path` by adjusting draggable handles on a shape within a container. The corresponding CSS `clip-path` code is dynamically updated and displayed as the shape is modified.

## Features

- **Drag-and-Drop Interaction**: Adjust polygon vertices by dragging handles around the container.
- **Real-Time CSS Code Generation**: As you move the handles, the CSS `clip-path` value is updated and displayed on the page.
- **Custom Shapes**: Start with a predefined shape (polygon) and modify it by adjusting the coordinates.
- **Handle Deletion**: Remove vertices if needed using the delete button that appears when dragging.
- **Coordinate Snapping**: Ensures that handles stay within the boundaries of the container.

## How It Works

### 1. HTML (`index.html`)
- The core HTML sets up the `clipbox` container where the shape will be displayed and manipulated.
- A `clippath` element displays the generated `clip-path` CSS code.
- On window load, a `ClipPathMaker` object is initialized, and a default shape is drawn using predefined coordinates.

### 2. JavaScript (`ClipPathDragMaker.js`)
- This file contains the `ClipPathMaker` class, which:
  - Initializes the clip-path editor within the `clipbox`.
  - Creates draggable handles based on the provided coordinates.
  - Allows dynamic dragging of handles, updating the shape and corresponding CSS code.
  - Implements a simple drag-and-drop system to manipulate the vertices of the polygon.

### 3. CSS (`ClipPathDragMaker.css`)
- Defines styles for the `clipbox`, draggable handles, and visual feedback (such as hover and drag effects).
- Each handle represents a point in the polygon and is styled accordingly for clarity and ease of use.

## Setup and Usage

### Prerequisites
No specific prerequisites are needed beyond a modern web browser.

### Steps to Use
1. Clone or download the repository.
2. Open `index.html` in a web browser.
3. Upon loading, you will see a shape with draggable handles in a 300x300 pixel box.
4. Drag the handles to adjust the shape.
5. The `clip-path` CSS code is automatically updated and shown below the shape.

### Customizing the Shape
To start with a different shape, modify the `coords` array in the `window.onload` function in `index.html`. The `coords` array holds the percentage values for each vertex of the polygon.

Example:
```javascript
var coords = [
    [20, 0], [80, 0], [100, 20], [100, 80],
    [80, 100], [20, 100], [0, 80], [0, 20],
];
```

## Future Enhancements
- Add functionality to add new vertices by clicking within the container.

---

Enjoy creating custom clip-path shapes with ease!
