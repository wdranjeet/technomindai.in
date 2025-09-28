class WordCounter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.paragraphCount = document.getElementById('paragraphCount');
        this.spaceCount = document.getElementById('spaceCount');
        this.charNoSpaceCount = document.getElementById('charNoSpaceCount');
        this.sentenceCount = document.getElementById('sentenceCount');
        this.readingTime = document.getElementById('readingTime');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    init() {
        // Add event listeners
        this.textInput.addEventListener('input', () => this.updateStats());
        this.textInput.addEventListener('paste', () => {
            // Small delay to ensure pasted content is processed
            setTimeout(() => this.updateStats(), 10);
        });
        this.clearBtn.addEventListener('click', () => this.clearText());

        // Initial update
        this.updateStats();
    }

    updateStats() {
        const text = this.textInput.value;
        
        // Update all statistics
        this.updateWordCount(text);
        this.updateCharacterCount(text);
        this.updateParagraphCount(text);
        this.updateSpaceCount(text);
        this.updateCharNoSpaceCount(text);
        this.updateSentenceCount(text);
        this.updateReadingTime(text);
    }

    updateWordCount(text) {
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        this.wordCount.textContent = words;
    }

    updateCharacterCount(text) {
        this.charCount.textContent = text.length;
    }

    updateParagraphCount(text) {
        if (text.trim() === '') {
            this.paragraphCount.textContent = '0';
            return;
        }
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;
        this.paragraphCount.textContent = paragraphs;
    }

    updateSpaceCount(text) {
        const spaces = (text.match(/\s/g) || []).length;
        this.spaceCount.textContent = spaces;
    }

    updateCharNoSpaceCount(text) {
        const charsNoSpace = text.replace(/\s/g, '').length;
        this.charNoSpaceCount.textContent = charsNoSpace;
    }

    updateSentenceCount(text) {
        if (text.trim() === '') {
            this.sentenceCount.textContent = '0';
            return;
        }
        const sentences = text.split(/[.!?]+/).filter(s => s.trim() !== '').length;
        this.sentenceCount.textContent = sentences;
    }

    updateReadingTime(text) {
        const wordsPerMinute = 200; // Average reading speed
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        this.readingTime.textContent = `${minutes} min`;
    }

    clearText() {
        this.textInput.value = '';
        this.updateStats();
        this.textInput.focus();
    }
}

// Initialize the Word Counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordCounter();
});