const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

async function build() {
    // Create dist directory
    await fs.ensureDir('./dist');

    // Copy static assets
    await fs.copy('./src/css', './dist/css');
    await fs.copy('./src/js', './dist/js');
    
    // Copy HTML files
    await fs.copy('./src/pages', './dist');
}

build().catch(console.error); 