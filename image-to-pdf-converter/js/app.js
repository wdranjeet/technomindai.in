class ImageToPdfConverter {
    constructor() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.imagePreview = document.getElementById('imagePreview');
        this.clearImagesBtn = document.getElementById('clearImages');
        this.convertToPdfBtn = document.getElementById('convertToPdf');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        
        this.selectedImages = [];
        this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        
        this.init();
    }

    init() {
        // Add event listeners
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearImagesBtn.addEventListener('click', () => this.clearAllImages());
        this.convertToPdfBtn.addEventListener('click', () => this.convertToPdf());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('border-blue-400', 'bg-blue-50');
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        const imageFiles = files.filter(file => this.supportedFormats.includes(file.type));
        
        if (imageFiles.length === 0) {
            this.showError('Please select valid image files (JPG, PNG, GIF, BMP, WebP)');
            return;
        }

        imageFiles.forEach(file => this.addImage(file));
        this.updateUI();
    }

    addImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageData = {
                id: Date.now() + Math.random(),
                file: file,
                dataUrl: e.target.result,
                name: file.name
            };
            
            this.selectedImages.push(imageData);
            this.renderImagePreview();
            this.updateUI();
        };
        
        reader.readAsDataURL(file);
    }

    renderImagePreview() {
        this.imagePreview.innerHTML = '';
        
        this.selectedImages.forEach((image, index) => {
            const imageElement = this.createImagePreviewElement(image, index);
            this.imagePreview.appendChild(imageElement);
        });
    }

    createImagePreviewElement(image, index) {
        const div = document.createElement('div');
        div.className = 'relative bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow';
        
        div.innerHTML = `
            <div class="aspect-square overflow-hidden rounded-lg mb-2">
                <img src="${image.dataUrl}" alt="${image.name}" class="w-full h-full object-cover">
            </div>
            <div class="text-xs text-gray-600 truncate mb-2" title="${image.name}">${image.name}</div>
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">#${index + 1}</span>
                <div class="flex space-x-1">
                    ${index > 0 ? '<button class="move-up-btn text-blue-600 hover:text-blue-800 text-sm" title="Move up">↑</button>' : ''}
                    ${index < this.selectedImages.length - 1 ? '<button class="move-down-btn text-blue-600 hover:text-blue-800 text-sm" title="Move down">↓</button>' : ''}
                    <button class="remove-btn text-red-600 hover:text-red-800 text-sm" title="Remove">✕</button>
                </div>
            </div>
        `;

        // Add event listeners for buttons
        const removeBtn = div.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => this.removeImage(image.id));

        const moveUpBtn = div.querySelector('.move-up-btn');
        if (moveUpBtn) {
            moveUpBtn.addEventListener('click', () => this.moveImage(index, index - 1));
        }

        const moveDownBtn = div.querySelector('.move-down-btn');
        if (moveDownBtn) {
            moveDownBtn.addEventListener('click', () => this.moveImage(index, index + 1));
        }

        return div;
    }

    removeImage(imageId) {
        this.selectedImages = this.selectedImages.filter(img => img.id !== imageId);
        this.renderImagePreview();
        this.updateUI();
    }

    moveImage(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= this.selectedImages.length) return;
        
        const [movedImage] = this.selectedImages.splice(fromIndex, 1);
        this.selectedImages.splice(toIndex, 0, movedImage);
        this.renderImagePreview();
    }

    clearAllImages() {
        this.selectedImages = [];
        this.renderImagePreview();
        this.updateUI();
        this.fileInput.value = '';
    }

    updateUI() {
        if (this.selectedImages.length > 0) {
            this.imagePreviewContainer.classList.remove('hidden');
        } else {
            this.imagePreviewContainer.classList.add('hidden');
        }
    }

    async convertToPdf() {
        if (this.selectedImages.length === 0) {
            this.showError('Please select at least one image');
            return;
        }

        this.showProgress();
        
        try {
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            for (let i = 0; i < this.selectedImages.length; i++) {
                const image = this.selectedImages[i];
                
                // Update progress
                const progress = ((i + 1) / this.selectedImages.length) * 100;
                this.updateProgress(progress);
                
                // Add new page if not the first image
                if (i > 0) {
                    pdf.addPage();
                }
                
                // Load image to get dimensions
                const img = await this.loadImage(image.dataUrl);
                
                // Calculate dimensions to fit the page
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 10;
                
                const maxWidth = pageWidth - (margin * 2);
                const maxHeight = pageHeight - (margin * 2);
                
                let { width, height } = this.calculateDimensions(
                    img.width, 
                    img.height, 
                    maxWidth, 
                    maxHeight
                );
                
                // Center the image on the page
                const x = (pageWidth - width) / 2;
                const y = (pageHeight - height) / 2;
                
                // Add image to PDF
                pdf.addImage(image.dataUrl, 'JPEG', x, y, width, height);
                
                // Small delay to prevent blocking the UI
                await this.delay(50);
            }
            
            // Generate and download PDF
            const fileName = `images-to-pdf-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            this.hideProgress();
            this.showSuccess(`PDF generated successfully! Downloaded as ${fileName}`);
            
        } catch (error) {
            console.error('Error converting to PDF:', error);
            this.hideProgress();
            this.showError('Error converting images to PDF. Please try again.');
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
        let width = originalWidth;
        let height = originalHeight;
        
        // Scale down if larger than max dimensions
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        return { width, height };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showProgress() {
        this.progressContainer.classList.remove('hidden');
        this.convertToPdfBtn.disabled = true;
        this.convertToPdfBtn.textContent = 'Converting...';
        this.convertToPdfBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    updateProgress(percentage) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${Math.round(percentage)}%`;
    }

    hideProgress() {
        this.progressContainer.classList.add('hidden');
        this.convertToPdfBtn.disabled = false;
        this.convertToPdfBtn.textContent = 'Convert to PDF';
        this.convertToPdfBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        this.updateProgress(0);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
            type === 'error' 
                ? 'bg-red-100 border border-red-400 text-red-700' 
                : 'bg-green-100 border border-green-400 text-green-700'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${type === 'error' ? '❌' : '✅'}</span>
                <span>${message}</span>
                <button class="ml-2 text-gray-500 hover:text-gray-700">&times;</button>
            </div>
        `;

        // Add close functionality
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageToPdfConverter();
});