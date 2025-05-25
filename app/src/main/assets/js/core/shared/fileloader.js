// fileLoader.js - Secure file loading utilities
(function() {
    'use strict';
    
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
        'text/plain': 1024 * 1024, // 1MB for text files
        'application/json': 1024 * 1024, // 1MB for JSON files
        'image/png': 5 * 1024 * 1024, // 5MB for images
        'image/jpeg': 5 * 1024 * 1024,
        'image/gif': 5 * 1024 * 1024,
        'image/webp': 5 * 1024 * 1024,
        'image/svg+xml': 1024 * 1024, // 1MB for SVG
        'image/bmp': 5 * 1024 * 1024
    };
    
    /**
     * Validates file path and type
     * @param {string} filePath - The file path to validate
     * @returns {Object} - Validation result with isValid, fileType, and error
     */
    function validateFilePath(filePath) {
        if (!filePath || typeof filePath !== 'string') {
            return { isValid: false, error: 'Invalid file path' };
        }
        
        // Check if it's a local file path
        if (!filePath.startsWith('file://') && !filePath.startsWith('./') && !filePath.startsWith('/')) {
            return { isValid: false, error: 'Only local files are allowed' };
        }
        
        // Get file extension
        const extension = '.' + filePath.split('.').pop().toLowerCase();
        
        if (!ALLOWED_FILE_TYPES[extension]) {
            return { isValid: false, error: `File type ${extension} is not allowed` };
        }
        
        return { 
            isValid: true, 
            fileType: ALLOWED_FILE_TYPES[extension],
            extension: extension
        };
    }
    
    /**
     * Loads a text file securely
     * @param {string} filePath - Path to the text file
     * @returns {Promise<string>} - Promise resolving to file content
     */
    async function loadTextFile(filePath) {
        const validation = validateFilePath(filePath);
        if (!validation.isValid) {
            throw new Error(`File validation failed: ${validation.error}`);
        }
        
        if (!['text/plain', 'application/json'].includes(validation.fileType)) {
            throw new Error('loadTextFile can only load text and JSON files');
        }
        
        try {
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
            }
            
            // Check file size
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) > MAX_FILE_SIZES[validation.fileType]) {
                throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZES[validation.fileType]} bytes`);
            }
            
            const text = await response.text();
            
            // Validate content size after loading
            if (text.length > MAX_FILE_SIZES[validation.fileType]) {
                throw new Error(`File content too large. Maximum size: ${MAX_FILE_SIZES[validation.fileType]} bytes`);
            }
            
            return text;
            
        } catch (error) {
            console.error('Error loading text file:', error);
            throw error;
        }
    }
    
    /**
     * Loads and parses a JSON file securely
     * @param {string} filePath - Path to the JSON file
     * @returns {Promise<Object>} - Promise resolving to parsed JSON object
     */
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
            
            // Parse JSON with error handling
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
    
    /**
     * Loads an image file securely
     * @param {string} filePath - Path to the image file
     * @returns {Promise<HTMLImageElement>} - Promise resolving to loaded image element
     */
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
                // Additional validation - check if image actually loaded
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
            
            // Set crossorigin if needed for local files
            if (filePath.startsWith('file://')) {
                img.crossOrigin = 'anonymous';
            }
            
            img.src = filePath;
        });
    }
    
    /**
     * Generic file loader that automatically determines the appropriate loading method
     * @param {string} filePath - Path to the file
     * @returns {Promise<*>} - Promise resolving to appropriate data type
     */
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
    
})();
