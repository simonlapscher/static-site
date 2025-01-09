const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Function to process markdown files
function processMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const html = marked(content);
    const title = path.basename(filePath, '.md');
    return { content: html, title };
}

// Function to apply HTML template
function applyTemplate(baseTemplate, { title, content }) {
    return baseTemplate
        .replace('<!-- Content will go here -->', content)
        .replace('<!-- Title will go here -->', title);
}

async function build() {
    // Create dist directory
    await fs.ensureDir('./dist');

    // Copy static assets
    await fs.copy('./src/css', './dist/css');
    await fs.copy('./src/js', './dist/js');
    
    // Get the template
    const baseTemplate = await fs.readFile('./src/templates/base.html', 'utf-8');

    // Process pages directory
    const pagesDir = 'src/content/pages';
    const files = fs.readdirSync(pagesDir);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(pagesDir, file);
        const { content, title } = processMarkdown(filePath);
        const html = applyTemplate(baseTemplate, { title, content });
        
        // Generate HTML file in dist root
        const outFile = path.join('dist', file.replace('.md', '.html'));
        fs.writeFileSync(outFile, html);
    }
}

build().catch(console.error); 