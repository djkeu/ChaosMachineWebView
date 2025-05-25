// fileLoader.js - Secure file loading utilities
(function() {
    'use strict';

    console.log("FileLoader initializing..."); // DEBUG 1

    // Initialize namespace
    window.ChaosMachine = window.ChaosMachine || {};
    window.ChaosMachine.fileLoader = {};

    // Allowed file types and their MIME types
    const ALLOWED_FILE_TYPES = {
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.bmp': 'image/bmp'
    };

    // Maximum file sizes (in bytes) for different types
    const MAX_FILE_SIZES = {
        'text/plain': 1024 * 1024,
        'application/json': 1024 * 1024,
        'image/png': 5 * 1024 * 1024,
        'image/jpeg': 5 * 1024 * 1024,
        'image/gif': 5 * 1024 * 1024,
        'image/webp': 5 * 1024 * 1024,
        'image/svg+xml': 1024 * 1024,
        'image/bmp': 5 * 1024 * 1024
    };

    function validateFilePath(filePath) {
        console.log("Validating path:", filePath); // DEBUG 2
        if (!filePath || typeof filePath !== 'string') {
            return { isValid: false, error: 'Invalid file path' };
        }

        // Modified to allow Android asset paths
        if (filePath.startsWith('file:///android_asset/') ||
            filePath.startsWith('./') ||
            filePath.startsWith('/') ||
            filePath.startsWith('file:///')) {
            // Continue validation
        } else {
            return { isValid: false, error: 'Only local files are allowed' };
        }

        const extension = '.' + filePath.split('.').pop().toLowerCase();
        console.log("Detected extension:", extension); // DEBUG 3

        if (!ALLOWED_FILE_TYPES[extension]) {
            return { isValid: false, error: `File type ${extension} is not allowed` };
        }

        return {
            isValid: true,
            fileType: ALLOWED_FILE_TYPES[extension],
            extension: extension
        };
    }

    async function loadTextFile(filePath) {
        console.log("Attempting to load:", filePath); // DEBUG 4
        const validation = validateFilePath(filePath);
        if (!validation.isValid) {
            throw new Error(`File validation failed: ${validation.error}`);
        }

        try {
            console.log("Preparing fetch for:", filePath); // DEBUG 5
            console.log("Document baseURI:", document.baseURI); // DEBUG 6

            // MODIFIED FETCH WITH CREDENTIALS
            const response = await fetch(filePath, {
                mode: 'no-cors',
                credentials: 'same-origin'
            });

            console.log("Fetch response status:", response.status); // DEBUG 7

            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
            }

            const contentLength = response.headers.get('content-length');
            console.log("Content length:", contentLength); // DEBUG 8

            const text = await response.text();
            console.log("File content sample:", text.substring(0, 50)); // DEBUG 9

            return text;

        } catch (error) {
            console.error("Full fetch error:", error); // DEBUG 10
            throw error;
        }
    }

    async function loadJsonFile(filePath) {
        const validation = validateFilePath(filePath);
        if (!validation.isValid) {
            throw new Error(`File validation failed: ${validation.error}`);
        }

        if (validation.fileType !== 'application/json' && validation.extension !== '.json') {
            throw new Error('loadJsonFile can only load JSON files');
        }

        try {
            const textContent = await loadTextFile(filePath);

            let jsonData;
            try {
                jsonData = JSON.parse(textContent);
            } catch (parseError) {
                throw new Error(`Invalid JSON format: ${parseError.message}`);
            }

            return jsonData;

        } catch (error) {
            console.error('Error loading JSON file:', error);
            throw error;
        }
    }

    async function loadImageFile(filePath) {
        const validation = validateFilePath(filePath);
        if (!validation.isValid) {
            throw new Error(`File validation failed: ${validation.error}`);
        }

        if (!validation.fileType.startsWith('image/')) {
            throw new Error('loadImageFile can only load image files');
        }

        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = function() {
                if (this.width === 0 || this.height === 0) {
                    reject(new Error('Invalid image file - no dimensions'));
                    return;
                }

                console.log(`Image loaded successfully: ${filePath} (${this.width}x${this.height})`);
                resolve(this);
            };

            img.onerror = function() {
                reject(new Error(`Failed to load image: ${filePath}`));
            };

            if (filePath.startsWith('file://')) {
                img.crossOrigin = 'anonymous';
            }

            img.src = filePath;
        });
    }

    async function loadFile(filePath) {
        const validation = validateFilePath(filePath);
        if (!validation.isValid) {
            throw new Error(`File validation failed: ${validation.error}`);
        }

        switch (validation.fileType) {
            case 'text/plain':
                return await loadTextFile(filePath);
            case 'application/json':
                return await loadJsonFile(filePath);
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/webp':
            case 'image/svg+xml':
            case 'image/bmp':
                return await loadImageFile(filePath);
            default:
                throw new Error(`Unsupported file type: ${validation.fileType}`);
        }
    }

    // Expose functions to namespace
    window.ChaosMachine.fileLoader = {
        loadTextFile,
        loadJsonFile,
        loadImageFile,
        loadFile,
        validateFilePath,
        ALLOWED_FILE_TYPES,
        MAX_FILE_SIZES
    };

    console.log("FileLoader initialized successfully"); // DEBUG 11
})();
