
# Clip-path Maker by Drag/Drop

**Clip-path Maker** is an interactive tool that allows users to create and modify clip-path shapes by dragging handles on a visual interface. The tool generates clip-path polygons that can be applied to elements using CSS. Users can add, remove, and adjust handles to customize the shape.

## Features

- **Interactive Handles**: Drag handles to adjust the clip-path points visually.
- **Add New Handles**: Right-click on an existing handle to add a new point after the clicked handle.
- **Delete Handles**: Left-click and delete handles to remove a point from the shape.
- **Dynamic Shape Updates**: As you drag, add, or delete handles, the clip-path polygon is updated and applied instantly.
- **Responsive Design**: The tool is designed to adapt to different screen sizes.

## Usage

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ManolisMariakakis/Clip-path-Maker-by-Drag-Drop
   ```

2. **Include the project files in your web project**:

   - `ClipPathDragMaker.js`
   - `ClipPathDragMaker.css`
   - `index.html` (optional for basic usage)

### Basic Setup

1. **Include the necessary JavaScript file in your HTML**:

   ```html
   <script src="ClipPathDragMaker.js" defer></script>
   ```

2. **Add an empty `.clipbox` div and a `.clippath` code element**:

   ```html
   <div class="clipbox"></div>
   <code class="clippath"></code>
   ```

3. **Initialize the `ClipPathMaker` in your JavaScript**:

   ```javascript
   window.onload = function () {
     var clipPathMaker = new ClipPathMaker('.clipbox', '.clippath');
     var coords = [
       [20, 0],
       [80, 0],
       [100, 20],
       [100, 80],
       [80, 100],
       [20, 100],
       [0, 80],
       [0, 20],
     ];
     clipPathMaker.makeShape(coords);
   };
   ```

### How to Use

- **Drag Handles**: Click and drag handles to adjust their positions. The corresponding `clip-path` values are automatically updated.
- **Right-click to Add Handle**: Right-click on any handle to add a new handle next to it. The new handle will be positioned with a slight offset from the original point.
- **Delete Handle**: Left-click on any handle to bring up the delete button. Clicking the delete button will remove that handle and update the clip-path.

### Example

Here's a simple example that creates a polygon shape:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Clip-path Maker by Drag/Drop</title>
  <script src="ClipPathDragMaker.js" defer></script>
</head>
<body>
  <div class="clipbox"></div>
  <code class="clippath"></code>
  <script>
    window.onload = function () {
      var clipPathMaker = new ClipPathMaker('.clipbox', '.clippath');
      var coords = [
        [20, 0],
        [80, 0],
        [100, 20],
        [100, 80],
        [80, 100],
        [20, 100],
        [0, 80],
        [0, 20],
      ];
      clipPathMaker.makeShape(coords);
    };
  </script>
</body>
</html>
```

### Customization

- **Modify the Initial Shape**: Adjust the `coords` array to create different shapes according to your needs.
- **Styling**: If you wish to customize the appearance beyond the default styles, you can modify the `ClipPathDragMaker.css` file. Note that since the CSS is dynamically loaded by the JavaScript, you'll need to ensure your custom styles are applied correctly.

## Project Structure

- **ClipPathDragMaker.js**: Contains the main JavaScript logic to create and manage the clip-path shapes and handle dragging events. It also dynamically appends the CSS file to the document.
- **index.html**: Basic HTML setup to demonstrate the tool.
- **ClipPathDragMaker.css**: CSS file for customizing styles if needed.

## License

[This project is licensed under the **GPL-3.0 License**.](https://github.com/ManolisMariakakis/Clip-path-Maker-by-Drag-Drop?tab=GPL-3.0-1-ov-file#readme)
