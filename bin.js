const albumItems = document.querySelectorAll(".album-item");

albumItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        event.preventDefault();

        const bgImage = item.querySelector("div").style.backgroundImage;
        const imageUrl = bgImage.slice(5, -2); // Remove url("...")

        fabric.Image.fromURL(imageUrl, function (image) {
            image.set({
                left: 0,
                top: 0,
                scaleX: 0.3,
                scaleY: 0.3,
            });

            // Assign unique ID for tracking
            const uniqueId = `img_${Date.now()}`;
            image.id = uniqueId;
            logoPrices.set(image.id, 3); // Only assign price to image!

            canvas.add(image);
            canvas.centerObject(image);
            canvas.setActiveObject(image);

            updatePriceDisplay();

            // Create a label that follows the image (but not grouped)
            const updateLabelPosition = () => {
                const actualWidth = Math.round(image.width * image.scaleX);
                const actualHeight = Math.round(image.height * image.scaleY);

                label.set({
                    left: image.left,
                    top: image.top + image.getScaledHeight() + 5,
                    text: `${actualWidth}×${actualHeight} px`,
                });

                canvas.renderAll();
            };

            const actualWidth = Math.round(image.width * image.scaleX);
            const actualHeight = Math.round(image.height * image.scaleY);
            const label = new fabric.Text(`${actualWidth}×${actualHeight} px`, {
                fontSize: 14,
                fill: '#333',
                selectable: false,
                evented: false,
                left: image.left,
                top: image.top + image.getScaledHeight() + 5,
            });

            canvas.add(label);

            // When image moves or scales, update label position and text
            image.on('moving', updateLabelPosition);
            image.on('scaling', updateLabelPosition);
            image.on('rotating', updateLabelPosition);
            image.on('modified', updateLabelPosition);

            uploadedElements.push({
                type: "image",
                id: image.id,
                url: imageUrl,
                properties: {
                    left: image.left,
                    top: image.top,
                    scaleX: image.scaleX,
                    scaleY: image.scaleY,
                    width: actualWidth,
                    height: actualHeight,
                },
            });
        }, { crossOrigin: 'anonymous' });
    });
});
albumItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        event.preventDefault();

        // Extract background image URL from 'url("...")'
        const bgImage = item.querySelector("div").style.backgroundImage;
        const imageUrl = bgImage.slice(5, -2); // Remove url("...")

        // Use Fabric.js built-in loader with crossOrigin
        fabric.Image.fromURL(imageUrl, function (image) {
            image.set({
                left: 0,
                top: 0,
                scaleX: 0.3,
                scaleY: 0.3,
            });

            // Calculate scaled width and height
            const actualWidth = Math.round(image.width * image.scaleX);
            const actualHeight = Math.round(image.height * image.scaleY);

            // Create label text under the image
            const sizeText = new fabric.Text(`${actualWidth}×${actualHeight} px`, {
                fontSize: 14,
                fill: '#333',
                left: image.left,
                top: image.top + image.getScaledHeight() + 5,
                selectable: false,
                evented: false,
            });

            // Group the image and the text label
            const group = new fabric.Group([image, sizeText], {
                left: image.left,
                top: image.top,
            });

            // Assign unique ID to the group
            group.id = `img_${Date.now()}`;
            logoPrices.set(group.id, 3); // Track price

            canvas.add(group);
            canvas.centerObject(group);
            canvas.setActiveObject(group);

            updatePriceDisplay();

            // Save element details
            uploadedElements.push({
                type: "image",
                id: group.id,
                url: imageUrl,
                properties: {
                    left: group.left,
                    top: group.top,
                    scaleX: image.scaleX,
                    scaleY: image.scaleY,
                    width: actualWidth,
                    height: actualHeight,
                },
            });

        }, { crossOrigin: 'anonymous' }); // Enable cross-origin handling
    });
});
async function imagecollector() {
    const images = [];
    try {
        for (const toggler of toggelers) {
            toggler.click();
            await new Promise(resolve => setTimeout(resolve, 500));

            // TEMP: Remove all size labels before capturing
            const objectsToRemove = [];
            canvas.getObjects().forEach(obj => {
                if (obj.type === 'group') {
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('px'));
                    if (textObj) {
                        // Remove label from group
                        obj.remove(textObj);
                        canvas.renderAll();
                    }
                }
            });

            // Screenshot after label is removed
            const dataURL = await html2canvas(canvasContainer, { useCORS: true }).then(canvas => {
                return canvas.toDataURL("image/png");
            });

            images.push(dataURL);

            // Optional: Restore the removed text label if needed
            // (only if you saved a reference to it before removal)
        }

        return images;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function imagecollector() {
    const images = [];

    try {
       

        for (const toggler of toggelers) {
            toggler.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the content to update

            // Remove size labels (like "100px") from fabric.js canvas groups
            canvas.getObjects().forEach(obj => {
                if (obj.type === 'group') {
                    const textObj = obj._objects.find(o => o.type === 'text' && o.text.includes('px'));
                    if (textObj) {
                        obj.remove(textObj); // Remove label
                        canvas.renderAll();  // Update the canvas
                    }
                }
            });

            // Ensure canvas has fully rendered before capturing
            await new Promise(resolve => setTimeout(resolve, 100)); // Add a short delay for rendering

            // Capture screenshot using html2canvas
            const dataURL = await html2canvas(canvasContainer, { useCORS: true }).then(canvas => {
                return canvas.toDataURL("image/png");
            });

            images.push(dataURL); // Store the captured image
            console.log(images);
            alert('...')
        }

        return images; // Return the array of images

    } catch (error) {
        console.error("An error occurred:", error);
    }
}
