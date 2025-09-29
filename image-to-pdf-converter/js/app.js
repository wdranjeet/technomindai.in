// Image to PDF Converter App
        // Image to PDF Converter App
        const fileInput = document.getElementById('file-input');
        const dropArea = document.getElementById('drop-area');
        const preview = document.getElementById('preview');
        const convertBtn = document.getElementById('convert-btn');
        const downloadZipBtn = document.getElementById('download-zip-btn');
        const convertedFiles = document.getElementById('converted-files');
    
        let images = [];
    
        const supportedTypes = [
            'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'
        ];
    
        function updatePreview() {
            preview.innerHTML = '';
            images.forEach((img, idx) => {
                const div = document.createElement('div');
                div.className = 'relative group';
                div.innerHTML = `
                    <img src="${img.dataURL}" alt="Image ${idx + 1}" class="w-full h-32 object-cover rounded shadow" draggable="true" data-idx="${idx}" />
                    <button class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100" title="Remove" data-remove="${idx}">&times;</button>
                    <div class="absolute bottom-1 left-1 flex gap-1">
                        <button class="bg-gray-700 text-white rounded px-1 text-xs opacity-80 hover:opacity-100" title="Move Left" data-move="left" data-idx="${idx}">&#8592;</button>
                        <button class="bg-gray-700 text-white rounded px-1 text-xs opacity-80 hover:opacity-100" title="Move Right" data-move="right" data-idx="${idx}">&#8594;</button>
                    </div>
                `;
                preview.appendChild(div);
            });
            convertBtn.disabled = images.length === 0;
            downloadZipBtn.disabled = images.length === 0;
        }
    
        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (!supportedTypes.includes(file.type)) return;
                const reader = new FileReader();
                reader.onload = e => {
                    images.push({ file, dataURL: e.target.result });
                    updatePreview();
                };
                reader.readAsDataURL(file);
            });
        }
    
        dropArea.addEventListener('click', () => fileInput.click());
        dropArea.addEventListener('dragover', e => {
            e.preventDefault();
            dropArea.classList.add('bg-blue-100');
        });
        dropArea.addEventListener('dragleave', e => {
            e.preventDefault();
            dropArea.classList.remove('bg-blue-100');
        });
dropArea.addEventListener('drop', e => {
  e.preventDefault();
  dropArea.classList.remove('bg-blue-100');
  handleFiles(e.dataTransfer.files);
});
// (No trailing duplicate or class-based code)
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
                
                // Image to PDF Converter App
                const fileInput = document.getElementById('file-input');
                const dropArea = document.getElementById('drop-area');
                const preview = document.getElementById('preview');
                const convertBtn = document.getElementById('convert-btn');
                const downloadZipBtn = document.getElementById('download-zip-btn');
                const convertedFiles = document.getElementById('converted-files');

                let images = [];

                const supportedTypes = [
                    'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'
                ];

                function updatePreview() {
                    preview.innerHTML = '';
                    images.forEach((img, idx) => {
                        const div = document.createElement('div');
                        div.className = 'relative group';
                        div.innerHTML = `
                            <img src="${img.dataURL}" alt="Image ${idx + 1}" class="w-full h-32 object-cover rounded shadow" draggable="true" data-idx="${idx}" />
                            <button class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100" title="Remove" data-remove="${idx}">&times;</button>
                            <div class="absolute bottom-1 left-1 flex gap-1">
                                <button class="bg-gray-700 text-white rounded px-1 text-xs opacity-80 hover:opacity-100" title="Move Left" data-move="left" data-idx="${idx}">&#8592;</button>
                                <button class="bg-gray-700 text-white rounded px-1 text-xs opacity-80 hover:opacity-100" title="Move Right" data-move="right" data-idx="${idx}">&#8594;</button>
                            </div>
                        `;
                        preview.appendChild(div);
                    });
                    convertBtn.disabled = images.length === 0;
                    downloadZipBtn.disabled = images.length === 0;
                }

                function handleFiles(files) {
                    Array.from(files).forEach(file => {
                        if (!supportedTypes.includes(file.type)) return;
                        const reader = new FileReader();
                        reader.onload = e => {
                            images.push({ file, dataURL: e.target.result });
                            updatePreview();
                        };
                        reader.readAsDataURL(file);
                    });
                }

    }

                    e.preventDefault();
                    dropArea.classList.add('bg-blue-100');
                });
    updateProgress(percentage) {
                    e.preventDefault();
                    dropArea.classList.remove('bg-blue-100');
                });
        this.progressBar.style.width = `${percentage}%`;
                    e.preventDefault();
                    dropArea.classList.remove('bg-blue-100');
                    handleFiles(e.dataTransfer.files);
                });
                fileInput.addEventListener('change', e => handleFiles(e.target.files));

                preview.addEventListener('click', e => {
                    if (e.target.dataset.remove !== undefined) {
                        images.splice(Number(e.target.dataset.remove), 1);
                        updatePreview();
                    }
                    if (e.target.dataset.move) {
                        const idx = Number(e.target.dataset.idx);
                        if (e.target.dataset.move === 'left' && idx > 0) {
                            [images[idx - 1], images[idx]] = [images[idx], images[idx - 1]];
                            updatePreview();
                        }
                        if (e.target.dataset.move === 'right' && idx < images.length - 1) {
                            [images[idx + 1], images[idx]] = [images[idx], images[idx + 1]];
                            updatePreview();
                        }
                    }
                });

                convertBtn.addEventListener('click', async () => {
                    if (images.length === 0) return;
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();
                    for (let i = 0; i < images.length; i++) {
                        const img = images[i];
                        const imgProps = pdf.getImageProperties(img.dataURL);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = pdf.internal.pageSize.getHeight();
                        let width = imgProps.width;
                        let height = imgProps.height;
                        // Scale to fit page
                        const ratio = Math.min(pdfWidth / width, pdfHeight / height);
                        width *= ratio;
                        height *= ratio;
                        const x = (pdfWidth - width) / 2;
                        const y = (pdfHeight - height) / 2;
                        pdf.addImage(img.dataURL, imgProps.fileType, x, y, width, height);
                        if (i < images.length - 1) pdf.addPage();
                    }
                    const pdfBlob = pdf.output('blob');
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    const fileName = `images-to-pdf-${Date.now()}.pdf`;
                    showConvertedFiles([{ name: fileName, url: pdfUrl }]);
                    // Auto download
                    const a = document.createElement('a');
                    a.href = pdfUrl;
                    a.download = fileName;
                    a.click();
                });

                function showConvertedFiles(files) {
                    convertedFiles.innerHTML = '<h2 class="font-semibold mb-2">Converted Files</h2>' +
                        files.map(f => `<a href="${f.url}" download="${f.name}" class="block text-blue-600 underline mb-1">${f.name}</a>`).join('');
                }

                // Download images as ZIP
                // Uses JSZip CDN
                function loadJSZip() {
                    return new Promise((resolve, reject) => {
                        if (window.JSZip) return resolve(window.JSZip);
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                        script.onload = () => resolve(window.JSZip);
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }

        this.progressText.textContent = `${Math.round(percentage)}%`;
                    if (images.length === 0) return;
                    const JSZip = await loadJSZip();
                    const zip = new JSZip();
                    images.forEach((img, idx) => {
                        // Convert dataURL to blob
                        const arr = img.dataURL.split(',');
                        const mime = arr[0].match(/:(.*?);/)[1];
                        const bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) u8arr[n] = bstr.charCodeAt(n);
                        zip.file(`image${idx + 1}.${mime.split('/')[1]}`, new Blob([u8arr], { type: mime }));
                    });
                    const blob = await zip.generateAsync({ type: 'blob' });
                    const url = URL.createObjectURL(blob);
                    const fileName = `images-${Date.now()}.zip`;
                    showConvertedFiles([{ name: fileName, url }]);
                    // Auto download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                });
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