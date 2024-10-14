// https://github.com/ManolisMariakakis/Clip-path-Maker-by-Drag-Drop?tab=GPL-3.0-1-ov-file#readme
// Initialize global variables
var width;
var height;
var grid = [1, 1];
var point;
var coords = [];

// ClipPathMaker constructor function
class ClipPathMaker {
    constructor(clipboxSelector, clippathSelector) {
        this.clipbox = document.querySelector(clipboxSelector);
        this.clippath = document.querySelector(clippathSelector);
        this.init();
    }
    // Initialization function to set up the clip path maker
    init() {
        this.appendStyles(); // Append external styles for the clip path maker
        this.createShape(); // Create the initial shape and handles
    }
    // Function to append styles dynamically
    appendStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'ClipPathDragMaker.css'; // External CSS file
        document.head.appendChild(link);
    }
    // Function to create the initial shape with handles and points
    createShape() {
        var clipbox = this.clipbox;
        width = clipbox.offsetWidth - 20;
        height = clipbox.offsetHeight - 20;

        // Create clipshape and cliphandles elements and append to clipbox
        var clipshape = document.createElement('div');
        clipshape.classList.add('clipshape');
        var cliphandles = document.createElement('div');
        cliphandles.classList.add('cliphandles');
        clipbox.appendChild(clipshape);
        clipbox.appendChild(cliphandles);

        var clippath = this.clippath;
        var codeXYSpan = document.createElement('span');
        codeXYSpan.classList.add('code_xy');
        codeXYSpan.textContent = '';
        clippath.innerHTML = 'clip-path: ';
        clippath.appendChild(codeXYSpan);
        clippath.innerHTML += ';';
    }
    // Function to create and update the shape based on coordinates
    makeShape(coords) {
        var cliphandles = document.querySelector('.cliphandles');
        var codeXY = document.querySelector('.code_xy');

        // Clear existing handles and points
        cliphandles.innerHTML = '';
        codeXY.innerHTML = '';

        coords.forEach((coord, i) => {
            var x = coord[0];
            var y = coord[1];

            var code_x = x + "%";
            var code_y = y + "%";

            var x_px = Math.round((x / 100) * width);
            var y_px = Math.round((y / 100) * height);

            // Create handle element
            var handleDiv = document.createElement('div');
            handleDiv.classList.add('handle');
            handleDiv.setAttribute('data-handle', i);
            handleDiv.style.top = `${y_px}px`;
            handleDiv.style.left = `${x_px}px`;
            cliphandles.appendChild(handleDiv);

            // Create code (point) element
            var codeElement = document.createElement('code');
            codeElement.classList.add('point');
            codeElement.setAttribute('data-point', i);
            codeElement.textContent = `${code_x} ${code_y}`;
            codeXY.appendChild(codeElement);

            // Handle polygon points
            if (i === coords.length - 1) {
                codeXY.insertAdjacentText('afterbegin', 'polygon(');
                codeXY.insertAdjacentText('beforeend', ')');
                this.clipIt(); // Apply the clip-path to the shape
                this.DragDrop(); // Enable dragging and deleting of handles
            } else {
                codeXY.insertAdjacentText('beforeend', ',');
            }
        });
    }
    // Function to handle dragging and deleting of points
    DragDrop() {
        var clipbox = this.clipbox;
        var cliphandles = clipbox.querySelectorAll(".handle");
        var code_xy = document.querySelector('.code_xy');

        // Delegate event to handle mousedown on handles
        document.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('handle')) {
                var handle = e.target;
                // Handle left-click (e.button === 0)
                if (e.button === 0) {
                    var count = document.querySelectorAll('.handle').length;

                    // Only show delete button if more than 3 handles exist
                    if (count > 3) {
                        var point = handle.getAttribute('data-handle');

                        // Remove the 'show-delete' class from all handles
                        document.querySelectorAll('.handle').forEach((h) => {
                            h.classList.remove('show-delete');
                        });

                        // Add 'show-delete' class to the clicked handle
                        handle.classList.add('show-delete');

                        // Add delete button functionality if it hasn't been attached already
                        var deletePoint = handle.querySelector('.delete-point');

                        if (!deletePoint.hasListenerAttached) {
                            // Define the delete function
                            const handleDelete = (e) => {
                                handle.remove(); // Remove handle
                                var pointElement = document.querySelector(`[data-point="${point}"]`);
                                if (pointElement) {
                                    pointElement.remove(); // Remove corresponding point
                                }

                                // Clean up code_xy content and update shape
                                code_xy.innerHTML = code_xy.innerHTML.replace(/\(,/g, '(').replace(/,\)/g, ')').replace(/,,/g, ',');
                                this.clipIt(); // Update the shape

                                // Rebuild the shape after deletion
                                // Get the current clip-path as text from the clippath element
                                var clip_path = this.clippath.textContent;
                                //console.log(`clip_path ${clip_path}`); // Log the current clip-path for debugging

                                // Remove 'clip-path:' and 'polygon()' from the string and get the coordinate part
                                var coordString = clip_path.replace('clip-path:', '').replace('polygon(', '').replace(')', '');

                                // Split the string into individual coordinate pairs (e.g., "10% 20%" becomes ['10% 20%', '30% 40%', ...])
                                var coordPairs = coordString.split(',').map(pair => pair.trim());

                                // Map each coordinate pair into an array of numeric values
                                // Example: ['10% 20%'] -> [10, 20]
                                var coordsArray = coordPairs.map(pair => {
                                    // Split the pair into x and y values, remove '%' symbol, and convert to numbers
                                    var [x, y] = pair.split(' ').map(val => parseFloat(val.replace('%', '')));
                                    return [x, y]; // Return the coordinate pair as a numeric array
                                });

                                // Log the final coordinates array for debugging
                                //console.log('coordsArray:', coordsArray);

                                // Rebuild and redraw the shape using the updated coordinates
                                this.makeShape(coordsArray);


                                // Remove the event listener after execution
                                deletePoint.removeEventListener('mousedown', handleDelete);
                            };

                            // Attach the event listener only once
                            deletePoint.addEventListener('mousedown', handleDelete);
                            deletePoint.hasListenerAttached = true; // Mark as listener attached
                        }

                        // Delay hiding the delete button after mouseup
                        handle.addEventListener('mouseup', () => {
                            setTimeout(() => {
                                handle.classList.remove('show-delete');
                            }, 2000);
                        });
                    }
                }
            }
        });

        // Right-click contextmenu event
        const handleRightClick = (e) => {
            // Check if the clicked element is a handle
            if (e.target.classList.contains('handle')) {
                e.preventDefault(); // Prevent default right-click menu

                var handle = e.target;
                var point = handle.getAttribute('data-handle');

                if (!handle) return; // Exit if handle doesn't exist

                // Check if the right-click listener is already attached
                if (!handle.hasListenerAttached) {
                    // Get current coords from the clip-path
                    var clip_path = this.clippath.textContent;
                    var coordString = clip_path.replace('clip-path:', '').replace('polygon(', '').replace(')', '');
                    var coordPairs = coordString.split(',').map(pair => pair.trim());

                    // Map the coord pairs into usable arrays
                    var coordsArray = coordPairs.map(pair => {
                        var [x, y] = pair.split(' ').map(val => parseFloat(val.replace('%', '')));
                        return [x, y];
                    });

                    // Find current handle's coordinates (x, y)
                    var currentCoord = coordsArray[point];

                    // Insert a new handle after the current handle's coordinates (offset 10%)
                    var newCoord = [
                        (currentCoord[0] + 10) % 100, // X offset
                        (currentCoord[1] + 10) % 100  // Y offset
                    ];

                    coordsArray.splice(parseInt(point) + 1, 0, newCoord);

                    this.makeShape(coordsArray); // Update the shape

                    // Mark as listener attached to prevent further binding
                    handle.hasListenerAttached = true;
                }

                // Remove the event listener after execution
                //document.removeEventListener('contextmenu', handleRightClick);
            }
        };

        // Add listener for right-click if not already attached
        if (!document.hasListenerAttached) {
            document.addEventListener('contextmenu', handleRightClick);
            document.hasListenerAttached = true; // Flag to prevent multiple listeners
        }


        // Add delete buttons to handles (only once)
        document.querySelectorAll('.handle').forEach((handle) => {
            handle.innerHTML = '<div class="delete-point"></div>';
        });

        // Handle dragging of points
        cliphandles.forEach((handle) => {
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            // Mousedown event for dragging
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                handle.classList.add('is-dragging');
                offsetX = e.clientX - handle.getBoundingClientRect().left;
                offsetY = e.clientY - handle.getBoundingClientRect().top;
                e.preventDefault(); // Prevent default behavior
            });

            // Mousemove event to handle dragging
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    let x = e.clientX - offsetX;
                    let y = e.clientY - offsetY;

                    // Snap to grid
                    if (grid && grid.length === 2) {
                        x = Math.round(x / grid[0]) * grid[0];
                        y = Math.round(y / grid[1]) * grid[1];
                    }
                    if (x < 0) { x = 0; }
                    if (x > width) { x = width; }
                    if (y < 0) { y = 0; }
                    if (y > height) { y = height; }

                    handle.style.left = `${x}px`;
                    handle.style.top = `${y}px`;

                    let i = handle.dataset.handle;
                    let point = document.querySelector(`[data-point="${i}"]`);
                    point.textContent = `${((x / width) * 100).toFixed(0)}% ${((y / height) * 100).toFixed(0)}%`;

                    this.clipIt(); // Update the shape
                    e.preventDefault();
                }
            });

            // Mouseup event to stop dragging
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    handle.classList.remove('is-dragging');
                    isDragging = false;
                }
            });
        });
    }

    // Function to apply the clip-path style to the shape
    clipIt() {
        var clip_path = this.clippath.textContent;
        var clipshape = document.querySelector('.clipshape');
        clipshape.setAttribute('style', clip_path); // Apply clip-path
    }


}







