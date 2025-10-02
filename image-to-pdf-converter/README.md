# Image to PDF Converter

A simple, privacy-friendly web app to convert multiple images (JPG, PNG, JPEG, GIF, BMP, WebP) into a single PDF document. All processing is done client-side in your browser - no uploads, no data collection.

## Features

✨ **Core Features:**
- Multiple image upload (drag-and-drop or file picker)
- Live image preview with thumbnails
- Remove unwanted images with one click
- Reorder images using arrow buttons
- Convert all images to a single PDF document
- Download all images as a ZIP file (alternative option)

🎨 **User Experience:**
- Clean, modern, responsive UI using Tailwind CSS
- Works on desktop, tablet, and mobile devices
- Visual feedback for all actions
- Success/error notifications
- No page reloads or navigation

🔒 **Privacy & Security:**
- 100% client-side processing
- No server uploads
- No data collection
- No tracking
- Files never leave your device

## Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **BMP** (.bmp)
- **WebP** (.webp)

## Usage

1. **Open** the converter by navigating to `index.html` in your web browser
2. **Upload** images by:
   - Clicking the upload area to select files, or
   - Dragging and dropping images onto the upload area
3. **Preview** your images in the thumbnail grid
4. **Manage** your images:
   - Click the ❌ button to remove an image
   - Use ← → arrows to reorder images
5. **Convert** to PDF:
   - Click "📄 Convert to PDF" button
   - PDF will be generated and automatically downloaded
6. **Alternative**: Click "📦 Download as ZIP" to get all images in a zip file

## Technologies Used

- **HTML5** - Structure and semantics
- **CSS** - Custom styles
- **Tailwind CSS** (CDN) - Utility-first CSS framework
- **Vanilla JavaScript** - No frameworks, pure JS
- **[jsPDF](https://github.com/parallax/jsPDF)** (CDN) - Client-side PDF generation
- **[JSZip](https://stuk.github.io/jszip/)** (CDN, loaded on demand) - ZIP file creation

## Installation

No installation required! Just open `index.html` in any modern web browser:

```bash
# Clone or download this repository
# Then open the file
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

Or serve it with a local web server:

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (with http-server)
npx http-server

# Then visit http://localhost:8080/image-to-pdf-converter/
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript (arrow functions, const/let, etc.)
- FileReader API
- Canvas API
- Blob API

**Tested and working on:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## File Structure

```
image-to-pdf-converter/
├── index.html          # Main HTML file
├── js/
│   └── app.js         # JavaScript application logic
└── README.md          # This file
```

## Code Quality

✅ **Clean Code:**
- Well-structured, readable JavaScript
- Proper error handling
- No code duplication
- Clear function names and comments

✅ **Performance:**
- Efficient image processing
- Minimal memory footprint
- Fast PDF generation

✅ **Security:**
- No eval() or dangerous patterns
- Input validation
- Safe file handling

## Recent Fixes (2025)

- ✅ Fixed JavaScript syntax errors and duplicate code
- ✅ Cleaned up HTML structure and removed duplicate sections
- ✅ Improved UI/UX with better spacing and layout
- ✅ Enhanced button states and visual feedback
- ✅ Added proper error handling and notifications
- ✅ Improved responsive design for mobile devices

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Made with ❤️ by TechnoMind AI**