// Image to PDF Converter App
(function() {
    'use strict';

    // Get DOM elements
    const fileInput = document.getElementById('file-input');
    const dropArea = document.getElementById('drop-area');
    const preview = document.getElementById('preview');
    const convertBtn = document.getElementById('convert-btn');
    const downloadZipBtn = document.getElementById('download-zip-btn');
    const convertedFiles = document.getElementById('converted-files');

    // State
    let images = [];

    // Supported image types
    const supportedTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'
    ];

    // Update preview grid
    function updatePreview() {
        preview.innerHTML = '';
        images.forEach((img, idx) => {
            const div = document.createElement('div');
            div.className = 'relative group';
            div.innerHTML = `
                <img src="${img.dataURL}" alt="Image ${idx + 1}" class="w-full h-32 object-cover rounded shadow" draggable="true" data-idx="${idx}" />
                <button class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-sm opacity-80 hover:opacity-100 transition" title="Remove" data-remove="${idx}">&times;</button>
                <div class="absolute bottom-1 left-1 flex gap-1">
                    <button class="bg-gray-700 text-white rounded px-2 py-1 text-xs opacity-80 hover:opacity-100 transition" title="Move Left" data-move="left" data-idx="${idx}">&#8592;</button>
                    <button class="bg-gray-700 text-white rounded px-2 py-1 text-xs opacity-80 hover:opacity-100 transition" title="Move Right" data-move="right" data-idx="${idx}">&#8594;</button>
                </div>
            `;
            preview.appendChild(div);
        });
        convertBtn.disabled = images.length === 0;
        downloadZipBtn.disabled = images.length === 0;
    }

    // Handle file selection
    function handleFiles(files) {
        const fileArray = Array.from(files);
        let loaded = 0;

        fileArray.forEach(file => {
            if (!supportedTypes.includes(file.type)) {
                showNotification(`File "${file.name}" is not a supported image type`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = e => {
                images.push({ 
                    file, 
                    dataURL: e.target.result,
                    name: file.name
                });
                loaded++;
                if (loaded === fileArray.filter(f => supportedTypes.includes(f.type)).length) {
                    updatePreview();
                    showNotification(`${loaded} image(s) added successfully`, 'success');
                }
            };
            reader.onerror = () => {
                showNotification(`Error reading file "${file.name}"`, 'error');
            };
            reader.readAsDataURL(file);
        });
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
            type === 'error' 
                ? 'bg-red-100 border border-red-400 text-red-700' 
                : 'bg-green-100 border border-green-400 text-green-700'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${type === 'error' ? '❌' : '✅'}</span>
                <span>${message}</span>
                <button class="ml-4 text-gray-500 hover:text-gray-700 font-bold">&times;</button>
            </div>
        `;

        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => notification.remove());

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Convert images to PDF
    async function convertToPdf() {
        if (images.length === 0) {
            showNotification('Please select at least one image', 'error');
            return;
        }

        convertBtn.disabled = true;
        convertBtn.textContent = 'Converting...';

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            let firstPage = true;

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                
                // Add new page for subsequent images
                if (!firstPage) {
                    pdf.addPage();
                }
                firstPage = false;

                // Get image properties
                const imgProps = pdf.getImageProperties(img.dataURL);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                // Calculate dimensions to fit page with margins
                const margin = 10;
                const maxWidth = pdfWidth - (margin * 2);
                const maxHeight = pdfHeight - (margin * 2);
                
                let width = imgProps.width;
                let height = imgProps.height;
                
                // Scale to fit page
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
                
                // Center image on page
                const x = (pdfWidth - width) / 2;
                const y = (pdfHeight - height) / 2;
                
                // Add image to PDF
                pdf.addImage(img.dataURL, imgProps.fileType, x, y, width, height);
            }

            // Generate and download PDF
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const fileName = `images-to-pdf-${Date.now()}.pdf`;
            
            // Show download link
            convertedFiles.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 class="font-semibold text-green-800 mb-2">✅ PDF Created Successfully!</h3>
                    <a href="${pdfUrl}" download="${fileName}" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        📥 Download PDF
                    </a>
                </div>
            `;

            // Auto download
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = fileName;
            a.click();

            showNotification('PDF created successfully!', 'success');
        } catch (error) {
            console.error('Error converting to PDF:', error);
            showNotification('Error creating PDF. Please try again.', 'error');
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert to PDF';
        }
    }

    // Load JSZip library dynamically
    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (window.JSZip) return resolve(window.JSZip);
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    }

    // Download images as ZIP
    async function downloadAsZip() {
        if (images.length === 0) {
            showNotification('Please select at least one image', 'error');
            return;
        }

        downloadZipBtn.disabled = true;
        downloadZipBtn.textContent = 'Creating ZIP...';

        try {
            const JSZip = await loadJSZip();
            const zip = new JSZip();

            images.forEach((img, idx) => {
                // Convert dataURL to blob
                const arr = img.dataURL.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const extension = mime.split('/')[1];
                zip.file(`image-${idx + 1}.${extension}`, new Blob([u8arr], { type: mime }));
            });

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const fileName = `images-${Date.now()}.zip`;

            // Show download link
            convertedFiles.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 class="font-semibold text-green-800 mb-2">✅ ZIP Created Successfully!</h3>
                    <a href="${url}" download="${fileName}" class="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                        📥 Download ZIP
                    </a>
                </div>
            `;

            // Auto download
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();

            showNotification('ZIP file created successfully!', 'success');
        } catch (error) {
            console.error('Error creating ZIP:', error);
            showNotification('Error creating ZIP file. Please try again.', 'error');
        } finally {
            downloadZipBtn.disabled = false;
            downloadZipBtn.textContent = 'Download Images as ZIP';
        }
    }

    // Event Listeners
    
    // File input change
    fileInput.addEventListener('change', e => {
        handleFiles(e.target.files);
    });

    // Click to open file dialog
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    dropArea.addEventListener('dragover', e => {
        e.preventDefault();
        dropArea.classList.add('border-blue-600', 'bg-blue-100');
    });

    dropArea.addEventListener('dragleave', e => {
        e.preventDefault();
        dropArea.classList.remove('border-blue-600', 'bg-blue-100');
    });

    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.classList.remove('border-blue-600', 'bg-blue-100');
        handleFiles(e.dataTransfer.files);
    });

    // Preview interactions (remove, reorder)
    preview.addEventListener('click', e => {
        const removeIdx = e.target.dataset.remove;
        if (removeIdx !== undefined) {
            const idx = Number(removeIdx);
            images.splice(idx, 1);
            updatePreview();
            showNotification('Image removed', 'success');
            return;
        }

        const move = e.target.dataset.move;
        const idx = Number(e.target.dataset.idx);
        
        if (move === 'left' && idx > 0) {
            [images[idx - 1], images[idx]] = [images[idx], images[idx - 1]];
            updatePreview();
        } else if (move === 'right' && idx < images.length - 1) {
            [images[idx + 1], images[idx]] = [images[idx], images[idx + 1]];
            updatePreview();
        }
    });

    // Convert button
    convertBtn.addEventListener('click', convertToPdf);

    // Download ZIP button
    downloadZipBtn.addEventListener('click', downloadAsZip);

})();