const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Function to process markdown files with frontmatter
function processMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const [, frontmatter, markdown] = content.split('---\n');
    
    // Parse frontmatter
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
            metadata[key.trim()] = value.trim();
        }
    });

    const html = marked(markdown);
    return { content: html, ...metadata };
}

// Function to apply blog post template
function applyBlogTemplate(template, { title, date, content }) {
    return template
        .replace(/<!-- Title will go here -->/g, title)
        .replace('<!-- Date will go here -->', date)
        .replace('<!-- Content will go here -->', content);
}

// Function to generate blog index
function generateBlogIndex(template, posts) {
    const postList = posts.map(post => `
        <article class="post-card">
            <div class="post-card-content">
                <div class="post-meta">
                    <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</time>
                </div>
                <h2 class="post-title">
                    <a href="/blog/${post.slug}">${post.title}</a>
                </h2>
                <p class="post-excerpt">${post.excerpt || ''}</p>
                <a href="/blog/${post.slug}" class="read-more">
                    Read More →
                </a>
            </div>
        </article>
    `).join('');

    return template.replace('<!-- Posts will go here -->', postList);
}

async function build() {
    // Create dist directory and subdirectories
    await fs.ensureDir('./dist');
    await fs.ensureDir('./dist/images');
    await fs.ensureDir('./dist/css');
    await fs.ensureDir('./dist/js');
    await fs.ensureDir('./dist/assets');
    await fs.ensureDir('./dist/blog');

    // Copy static assets
    await fs.copy('./src/css', './dist/css');
    await fs.copy('./src/js', './dist/js');
    await fs.copy('./src/public/images', './dist/images');
    await fs.copy('./src/assets', './dist/assets');  // This will copy all SVG files
    
    // Copy index.html
    await fs.copy('./src/index.html', './dist/index.html');
    
    // Get templates
    const baseTemplate = await fs.readFile('./src/templates/base.html', 'utf-8');
    const blogTemplate = await fs.readFile('./src/templates/blog.html', 'utf-8');
    const blogIndexTemplate = await fs.readFile('./src/templates/blog-index.html', 'utf-8');

    // Process blog posts
    const blogDir = 'src/content/blog';
    const blogFiles = fs.readdirSync(blogDir);
    const posts = [];

    for (const file of blogFiles) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(blogDir, file);
        const post = processMarkdown(filePath);
        post.slug = file.replace('.md', '');
        posts.push(post);

        // Generate blog post page
        const html = applyBlogTemplate(blogTemplate, post);
        const outFile = path.join('dist/blog', `${post.slug}.html`);
        fs.writeFileSync(outFile, html);
    }

    // Generate blog index
    const blogIndex = generateBlogIndex(blogIndexTemplate, posts);
    fs.writeFileSync('dist/blog/index.html', blogIndex);

    // Process regular pages
    const pagesDir = 'src/content/pages';
    const pageFiles = fs.readdirSync(pagesDir);

    for (const file of pageFiles) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(pagesDir, file);
        const { content, title } = processMarkdown(filePath);
        const html = applyTemplate(baseTemplate, { title, content });
        
        const outFile = path.join('dist', file.replace('.md', '.html'));
        fs.writeFileSync(outFile, html);
    }
}

build().catch(console.error); 