# Image to PDF Converter

A simple, privacy-friendly web app to convert multiple images (JPG, PNG, JPEG, GIF, BMP, WebP) into a single PDF document. All processing is done client-side in your browser.

## Features
- Multiple image upload (drag-and-drop or file picker)
- Image preview with remove and reorder options
- Supported formats: JPG, JPEG, PNG, GIF, BMP, WebP
- Client-side PDF generation (no server upload)
- Download PDF or all images as a ZIP file
- Responsive, modern UI (Tailwind CSS)

## Usage
1. Open `index.html` in your browser.
2. Drag and drop or select images.
3. Preview, remove, or reorder images as needed.
4. Click "Convert to PDF" to download the PDF.
5. Or click "Download Images as ZIP" to get all images in a zip file.

## Technologies Used
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- [jsPDF](https://github.com/parallax/jsPDF) (via CDN)
- [JSZip](https://stuk.github.io/jszip/) (via CDN, loaded on demand)

## Security & Privacy
- All processing is local to your browser. No files are uploaded.

## License
MIT