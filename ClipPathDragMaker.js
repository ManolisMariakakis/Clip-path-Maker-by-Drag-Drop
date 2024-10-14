var width;
var height;
var grid = [1, 1];
var point;
var coords = [];

function ClipPathMaker(clipboxSelector, clippathSelector) {
    this.clipbox = document.querySelector(clipboxSelector);
    this.clippath = document.querySelector(clippathSelector);
    this.init();
}

ClipPathMaker.prototype.init = function () {
    this.appendStyles();
    this.createShape();
};

ClipPathMaker.prototype.appendStyles = function () {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'ClipPathDragMaker.css';
    document.head.appendChild(link);
};

ClipPathMaker.prototype.createShape = function () {
    var clipbox = this.clipbox
    width = clipbox.offsetWidth - 20;
    height = clipbox.offsetHeight - 20;

    var clipshape = document.createElement('div');
    clipshape.classList.add('clipshape');
    var cliphandles = document.createElement('div');
    cliphandles.classList.add('cliphandles');
    clipbox.appendChild(clipshape);
    clipbox.appendChild(cliphandles);

    var clippath = this.clippath
    var codeXYSpan = document.createElement('span');
    codeXYSpan.classList.add('code_xy');
    codeXYSpan.textContent = '';
    clippath.innerHTML = 'clip-path: ';
    clippath.appendChild(codeXYSpan);
    clippath.innerHTML += ';';
};

ClipPathMaker.prototype.makeShape = function (coords) {

    var cliphandles = document.querySelector('.cliphandles'); // Use class selector
    var codeXY = document.querySelector('.code_xy');  // Use class selector

    // Clear the contents of the .cliphandles and .code_xy elements
    cliphandles.innerHTML = '';
    codeXY.innerHTML = '';

    coords.forEach((coord, i) => {
        var x = coord[0];
        var y = coord[1];

        var code_x = x + "%";
        var code_y = y + "%";

        var x_px = Math.round((x / 100) * width);
        var y_px = Math.round((y / 100) * height);

        var handleDiv = document.createElement('div');

        handleDiv.classList.add('handle');
        handleDiv.setAttribute('data-handle', i);

        handleDiv.style.top = `${y_px}px`;
        handleDiv.style.left = `${x_px}px`;
        cliphandles.appendChild(handleDiv);

        var codeXY = document.querySelector('.code_xy');
        var codeElement = document.createElement('code');
        codeElement.classList.add('point');
        codeElement.setAttribute('data-point', i);
        codeElement.textContent = `${code_x} ${code_y}`;
        codeXY.appendChild(codeElement);
        if (i == coords.length - 1) {
            //$code_xy.append(`<code class="point" data-point="${i}">${code_x} ${code_y}</code>`);
            codeXY.insertAdjacentText('afterbegin', 'polygon(');
            codeXY.insertAdjacentText('beforeend', ')');
            this.clipIt();
            this.DragDrop();
        } else {
            //$code_xy.append(`<code class="point" data-point="${i}">${code_x} ${code_y}</code>,`);
            codeXY.insertAdjacentText('beforeend', ',');
        }

    });

}


ClipPathMaker.prototype.DragDrop = function () {

    var clipbox = this.clipbox;
    var cliphandles = clipbox.querySelectorAll(".handle");

    // Select the .code_xy element and cache it
    var code_xy = document.querySelector('.code_xy');

    // Delegate events from a parent container
    document.addEventListener('mousedown', (e) => {
        // Check if the clicked element is a handle
        if (e.target.classList.contains('handle')) {
            var handle = e.target;
            var count = document.querySelectorAll('.handle').length;

            // Only show delete button if more than 3 cliphandles exist
            if (count > 3) {
                var point = handle.getAttribute('data-handle');

                // Remove the 'show-delete' class from all cliphandles
                document.querySelectorAll('.handle').forEach((h) => {
                    h.classList.remove('show-delete');
                });

                // Add 'show-delete' class to the clicked handle
                handle.classList.add('show-delete');

                // Check if the clicked element is the delete button
                var deletePoint = handle.querySelector('.delete-point');
                deletePoint.addEventListener('mousedown', (e) => {
                    // Remove the handle and corresponding point
                    handle.remove();
                    var pointElement = document.querySelector('[data-point="' + point + '"]');
                    if (pointElement) {
                        pointElement.remove();
                    }

                    code_xy.innerHTML = code_xy.innerHTML.replace(/\(,/g, '(').replace(/,\)/g, ')').replace(/,,/g, ',');

                    this.clipIt();
                });

                // Delay hiding the delete button after mouseup
                handle.addEventListener('mouseup', () => {
                    setTimeout(function () {
                        handle.classList.remove('show-delete');
                    }, 2000);
                });
            }
        }
    });

    // Cache cliphandles and add delete buttons once
    document.querySelectorAll('.handle').forEach((handle) => {
        handle.innerHTML = '<div class="delete-point"></div>';
    });

    cliphandles.forEach((handle) => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let point;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            handle.classList.add('is-dragging');

            // Calculate the offset to ensure smooth dragging
            offsetX = e.clientX - handle.getBoundingClientRect().left;
            offsetY = e.clientY - handle.getBoundingClientRect().top;

            // Find the related point element using the data-handle attribute
            let i = handle.dataset.handle; // Assumes handle has data-handle attribute
            point = document.querySelector('[data-point="' + i + '"]'); // Find the point element

            // Add class to indicate the point is changing
            if (point) {
                point.classList.add('changing');
            }

            // Prevent default to avoid text selection during drag
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                // Calculate new position
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;

                // Snap to grid if grid is defined
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

                setPoint(x, y, point);
                this.clipIt();

                e.preventDefault();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                handle.classList.remove('is-dragging');
                isDragging = false;

                // Remove the changing class from the point when dragging stops
                if (point) {
                    point.classList.remove('changing');
                }

                // Reset point reference
                point = null;
            }
        });
    });

}



function setPoint(x, y, point) {
    // console.log(`start ${x} ${y} ${width} ${height}`)
    var snap = 1;

    var x = ((x / width) * 100).toFixed(0);
    if (x < snap) {
        var x = 0;
    }
    if (x > 100 - snap) {
        var x = 100;
    }
    var y = ((y / height) * 100).toFixed(0);
    if (y < snap) {
        var y = 0;
    }
    if (y > 100 - snap) {
        var y = 100;
    }

    // Add % if number is not zero
    if (x !== 0) {
        var x = x + "%";
    }
    if (y !== 0) {
        var y = y + "%";
    }

    // console.log(`end ${x} ${y}`)
    point.textContent = x + " " + y;
}


ClipPathMaker.prototype.clipIt = function () {
    var clip_path = this.clippath.textContent;
    var clipshape = document.querySelector('.clipshape');
    clipshape.setAttribute('style', clip_path);
}


