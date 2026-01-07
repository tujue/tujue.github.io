/**
 * TOOLS DEFINITIONS
 * All tool metadata - separated from main.js for better organization
 */

const TOOLS = [
    {
        id: 'json-master-studio',
        name: 'JSON Master Studio',
        icon: '{ }',
        description: 'All-in-One JSON Tool: Format, Validate, Minify, CSV/XML Convert, and Generate Types in 6 languages (TS/Go/C#/Java/Python/Kotlin).',
        tags: ['JSON', 'Format', 'Convert', 'TypeGen', 'CSV', 'XML', 'Studio'],
        color: 'primary',
        category: 'developer'
    },
    {
        id: 'code-beautifier',
        name: 'Code Beautifier',
        icon: '✨',
        description: 'Beautify and format HTML, CSS, JavaScript, and JSON code',
        tags: ['Format', 'Prettier', 'Code', 'Dev'],
        color: 'warning',
        category: 'developer',
        tr: { name: 'Kod Güzelleştirici', description: 'HTML, CSS, JavaScript ve JSON kodlarını güzelleştirin ve biçimlendirin' }
    },
    {
        id: 'base64-tool',
        name: 'Base64 Encoder/Decoder',
        icon: '🔐',
        description: 'Encode text to Base64 or decode Base64 strings back to text',
        tags: ['Base64', 'Encode', 'Decode'],
        color: 'secondary',
        category: 'converter'
    },
    {
        id: 'regex-tester',
        name: 'Regex Tester',
        icon: '🔍',
        description: 'Test regular expressions with live matching and explanations',
        tags: ['Regex', 'Pattern', 'Match'],
        color: 'primary',
        category: 'developer'
    },
    {
        id: 'url-tool',
        name: 'URL Encoder/Decoder',
        icon: '🔗',
        description: 'Encode and decode URL strings and components',
        tags: ['URL', 'Encode', 'Decode'],
        color: 'success',
        category: 'converter'
    },
    {
        id: 'hash-generator',
        name: 'Hash Generator',
        icon: '🔐',
        description: 'Generate MD5, SHA-1, and SHA-256 hashes from text',
        tags: ['Hash', 'MD5', 'SHA-256', 'Security'],
        color: 'warning',
        category: 'security'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        icon: '🔑',
        description: 'Generate strong, cryptographically secure passwords with customizable options',
        tags: ['Security', 'Password', 'Random'],
        color: 'warning',
        category: 'security'
    },
    {
        id: 'text-analyzer',
        name: 'Text Analyzer',
        icon: '📏',
        description: 'Comprehensive text analysis: word count, reading time, character stats',
        tags: ['Text', 'Count', 'Analysis'],
        color: 'success',
        category: 'other'
    },
    {
        id: 'ip-lookup',
        name: 'IP Address Lookup',
        icon: '🌍',
        description: 'Get your IP address and geolocation information forany IP',
        tags: ['IP', 'Geolocation', 'Network'],
        color: 'primary',
        category: 'other'
    },
    {
        id: 'random-generator',
        name: 'Random Generator',
        icon: '🎲',
        description: 'Generate random numbers, coin flips, dice rolls, colors, and decisions',
        tags: ['Random', 'Number', 'Dice', 'Color'],
        color: 'warning',
        category: 'other'
    },
    {
        id: 'health-calculator',
        name: 'Health Calculator',
        icon: '🏥',
        description: 'Calculate age, BMI, ideal weight, and health metrics',
        tags: ['Age', 'BMI', 'Health', 'Calculator'],
        color: 'success',
        category: 'other'
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        icon: '⚖️',
        description: 'Convert length, weight, temperature, and data units instantly',
        tags: ['Convert', 'Units', 'Metric', 'Imperial'],
        color: 'primary',
        category: 'converter'
    },
    {
        id: 'qr-generator',
        name: 'QR Code Studio',
        icon: '📱',
        description: 'Advanced QR Studio: Colors, Logo, WiFi, vCard and more.',
        tags: ['QR', 'Code', 'Generator', 'Studio', 'Logo'],
        color: 'secondary',
        category: 'design'
    },
    {
        id: 'image-tools',
        name: 'Social Image Studio',
        description: 'Crop, Resize and Convert images for Social Media (Instagram, Twitter, YouTube).',
        category: 'image',
        icon: '✂️',
        color: 'pink',
        tags: ['Image', 'Crop', 'Social Media', 'Resize']
    },
    {
        id: 'photo-editor',
        name: 'Advanced Photo Studio',
        icon: '✨',
        description: 'Advanced Photo Editor: Filters, Effects, Crop, Rotate, and Layers.',
        category: 'image',
        tags: ['Photo', 'Editor', 'Filters', 'Effects', 'Studio'],
        color: 'purple'
    },
    {
        id: 'text-tools',
        name: 'Text Tools',
        icon: '✍️',
        description: 'Grammar check, readability score, and advanced text analysis',
        tags: ['Grammar', 'Readability', 'Text', 'Analysis'],
        color: 'info',
        category: 'other'
    },
    {
        id: 'color-extractor',
        name: 'Image Analyzer & Editor',
        icon: '🖼️',
        description: 'Advanced image analysis: Extract colors, apply filters, and convert formats.',
        tags: ['Image', 'Filter', 'Color', 'Converter'],
        color: 'primary',
        category: 'image'
    },
    {
        id: 'css-generator',
        name: 'CSS Generator',
        icon: '✨',
        description: 'Create Box Shadows, Gradients, and Glassmorphism effects visually',
        tags: ['CSS', 'Design', 'Generator', 'UI'],
        color: 'secondary',
        category: 'design'
    },
    {
        id: 'audio-waveform',
        name: 'Audio Waveform Generator',
        icon: '🌊',
        description: 'Visualize audio files with customizable waveform graphics',
        tags: ['Audio', 'Waveform', 'Visualization', 'Generator'],
        color: 'success',
        category: 'image'
    },
    {
        id: 'ascii-art',
        name: 'ASCII Art Generator',
        icon: '🔡',
        description: 'Convert text and images into ASCII art characters instantly',
        tags: ['ASCII', 'Art', 'Text', 'Image'],
        color: 'warning',
        category: 'image'
    },
    {
        id: 'resume-builder',
        name: 'CV Builder',
        icon: '👔',
        description: 'Create professional resumes instantly with live preview and PDF export',
        tags: ['Resume', 'CV', 'Builder', 'PDF'],
        color: 'primary',
        category: 'document'
    },
    {
        id: 'markdown-editor',
        name: 'Markdown Editor',
        icon: '📝',
        description: 'Write and preview Markdown with live rendering and export to HTML',
        tags: ['Markdown', 'Editor', 'Preview', 'HTML'],
        color: 'info',
        category: 'document'
    },
    {
        id: 'jwt-debugger',
        name: 'JWT Debugger',
        icon: '🔐',
        description: 'Decode and verify JSON Web Tokens (JWT) with detailed header and payload inspection',
        tags: ['JWT', 'Token', 'Authentication', 'Security'],
        color: 'warning',
        category: 'developer'
    },
    {
        id: 'meta-tags-generator',
        name: 'Meta Tags / SEO Generator',
        icon: '📊',
        description: 'Generate Open Graph, Twitter Cards, and SEO meta tags with live preview',
        tags: ['SEO', 'Meta Tags', 'Open Graph', 'Social Media'],
        color: 'success',
        category: 'design'
    },
    {
        id: 'cron-builder',
        name: 'Cron Expression Builder',
        icon: '⏰',
        description: 'Build and understand cron expressions with visual builder and next run times',
        tags: ['Cron', 'Scheduler', 'DevOps', 'Automation'],
        color: 'primary',
        category: 'developer'
    },
    {
        id: 'color-palette',
        name: 'Color Palette Generator',
        icon: '🎨',
        description: 'Generate beautiful color palettes from a base color with harmony rules',
        tags: ['Color', 'Palette', 'Design', 'UI'],
        color: 'warning',
        category: 'design'
    },
    {
        id: 'timestamp-converter',
        name: 'Unix Timestamp Converter',
        icon: '🕐',
        description: 'Convert between Unix timestamps and human-readable dates with timezone support',
        tags: ['Timestamp', 'Date', 'Unix', 'Time'],
        color: 'info',
        category: 'converter'
    },
    {
        id: 'bg-remover',
        name: 'Background Remover',
        icon: '🖼️',
        description: 'Remove background from images using Magic Wand (Color Selection)',
        tags: ['Image', 'Magic Wand', 'Edit', 'Photo'],
        color: 'primary',
        category: 'image'
    },
    {
        id: 'pdf-manager',
        name: 'PDF Manager',
        icon: '📄',
        description: 'Merge, split, and organize PDF documents completely in browser',
        tags: ['PDF', 'Document', 'Office', 'Files'],
        color: 'danger',
        category: 'document'
    },
    {
        id: 'ocr-tool',
        name: 'Image to Text (OCR)',
        icon: '🔍',
        description: 'Extract text from images, photos, and screenshots with high accuracy',
        tags: ['OCR', 'Text', 'Image', 'Scan'],
        color: 'success',
        category: 'document'
    },
    {
        id: 'metadata-tool',
        name: 'Metadata Expert',
        icon: '🖼️',
        description: 'View and strip EXIF/Metadata from images for privacy',
        tags: ['Privacy', 'Image', 'Metadata', 'EXIF'],
        color: 'warning',
        category: 'image'
    },
    {
        id: 'diff-checker',
        name: 'Unified Diff Checker',
        icon: '🌓',
        description: 'Compare two text or code blocks and highlight differences (Unified View)',
        tags: ['Diff', 'Compare', 'Code', 'Text'],
        color: 'primary',
        category: 'developer'
    },
    {
        id: 'steganography',
        name: 'Steganography Master',
        icon: '🔐',
        description: 'Hide secret messages inside images using LSB encryption technology',
        tags: ['Security', 'Privacy', 'Hidden', 'Image'],
        color: 'secondary',
        category: 'security'
    },
    {
        id: 'web-scraper',
        name: 'Web Scraper & DOM',
        icon: '🕸️',
        description: 'Fetch and analyze web pages to extract links, images, and meta data',
        tags: ['Web', 'Data', 'Scrape', 'SEO'],
        color: 'success',
        category: 'developer'
    },
    {
        id: 'svg-optimizer',
        name: 'SVG Nano Optimizer',
        icon: '📐',
        description: 'Optimize and minify SVG code for web performance and clean paths',
        tags: ['SVG', 'Design', 'Optimize', 'Vector'],
        color: 'warning',
        category: 'developer'
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        icon: '🗜️',
        description: 'Compress and optimize JPG, PNG, WebP images with quality control and size reduction',
        tags: ['Image', 'Compress', 'Optimize', 'WebP'],
        color: 'primary',
        category: 'image'
    },
    {
        id: 'favicon-generator',
        name: 'Favicon Generator',
        icon: '🎨',
        description: 'Generate favicons in all sizes (16x16 to 512x512) from image or emoji with preview',
        tags: ['Favicon', 'Icon', 'Generator', 'PNG'],
        color: 'secondary',
        category: 'image'
    },
    {
        id: 'htpasswd-generator',
        name: 'htpasswd Generator',
        icon: '🔐',
        description: 'Generate htpasswd files for Apache/Nginx with bcrypt, MD5, SHA encryption',
        tags: ['Security', 'Apache', 'Nginx', 'Auth'],
        color: 'warning',
        category: 'developer'
    },
    {
        id: 'link-shortener',
        name: 'Link Shortener & QR',
        icon: '🔗',
        description: 'Shorten URLs with custom aliases, generate QR codes, and track clicks (demo)',
        tags: ['URL', 'Shorten', 'QR', 'Link'],
        color: 'success',
        category: 'converter'
    },
    {
        id: 'social-preview',
        name: 'Social Media Preview',
        icon: '📱',
        description: 'Preview how your content looks on Google, Twitter, Facebook/LinkedIn and generate Meta Tags',
        tags: ['SEO', 'Social', 'Meta', 'Preview'],
        color: 'primary',
        category: 'image'
    },
    {
        id: 'prompt-wizard',
        name: 'AI Prompt Wizard',
        icon: '🧙‍♂️',
        description: 'Build perfect prompts for Midjourney & DALL-E without typing complex commands',
        tags: ['AI', 'Prompt', 'Generator', 'Midjourney', 'Art'],
        color: 'indigo',
        category: 'image'
    },
    {
        id: 'gamepad-tester',
        name: 'Gamepad Tester',
        description: 'Test your game controllers, joysticks, and vibration feedback directly in the browser',
        category: 'developer',
        icon: '🎮',
        color: 'purple',
        tags: ['Gamepad', 'Joystick', 'Controller', 'Input']
    },

    {
        id: 'code-to-image',
        name: 'Code to Image Studio',
        description: 'Turn your code snippets into beautiful, shareable images with syntax highlighting',
        category: 'image',
        icon: '📸',
        color: 'cyan',
        tags: ['Code', 'Image', 'Highlight', 'Share']
    },
    {
        id: 'mock-credit-card',
        name: 'Mock Card Studio',
        icon: '💳',
        description: 'Generate valid test credit card numbers (Luhn algorithm) for sandbox/payment testing.',
        tags: ['Payment', 'Test', 'Mock', 'Generator', 'Card'],
        color: 'rose',
        category: 'developer'
    },
    {
        id: 'subnet-calculator',
        name: 'CIDR Subnet Calculator',
        icon: '🖧',
        description: 'Calculate network range, broadcast address, and host count from an IP/CIDR block.',
        tags: ['Network', 'IP', 'CIDR', 'Subnet', 'Calculator'],
        color: 'indigo',
        category: 'developer'
    },
    {
        id: 'http-client',
        name: 'HTTP Request Builder',
        icon: '🚀',
        description: 'Test REST APIs directly from your browser. Send GET, POST requests and view JSON responses.',
        tags: ['HTTP', 'API', 'REST', 'Postman', 'Request'],
        color: 'orange',
        category: 'developer'
    },
    {
        id: 'social-grid-maker',
        name: 'Social Grid & Panorama',
        icon: '📸',
        description: 'Split images into 3x3 grids or seamless panoramas for Instagram and social media.',
        tags: ['Instagram', 'Grid', 'Panorama', 'Split', 'Crop'],
        color: 'pink',
        category: 'image'
    },
    {
        id: 'sql-playground',
        name: 'SQL Studio',
        description: 'Run SQL queries in-browser with SQLite. Import/Export DBs and visualize data.',
        category: 'developer',
        icon: '🗄️',
        color: 'indigo',
        tags: ['SQL', 'Database', 'SQLite', 'Query', 'WASM']
    },
    {
        id: 'virtual-piano',
        name: 'Virtual Piano',
        icon: '🎹',
        description: 'Play music with your keyboard! Features recording, different oscillator types, and visual effects.',
        tags: ['Music', 'Piano', 'Game', 'Fun', 'Audio'],
        color: 'pink',
        category: 'other'
    },
    {
        id: 'og-image-generator',
        name: 'OG Image Studio',
        icon: '🖼️',
        description: 'Design professional Open Graph (Social Media) preview images for your blog or project instantly.',
        tags: ['Design', 'Social', 'SEO', 'Image', 'OG'],
        color: 'indigo',
        category: 'image'
    },
    {
        id: 'p2p-transfer',
        name: 'DevDrop (P2P Transfer)',
        icon: '📡',
        description: 'Send files directly between devices (P2P) without a server. Secure, fast, and private.',
        tags: ['Network', 'P2P', 'Transfer', 'File', 'Share'],
        color: 'success',
        category: 'developer',
        tr: {
            name: 'DevDrop (P2P Transfer)',
            description: 'Dosyaları sunucu olmadan doğrudan cihazlar arasında (P2P) gönderin. Güvenli, hızlı ve gizli (Şifreli).'
        }
    },
    {
        id: 'css-minifier',
        name: 'CSS Minifier',
        description: 'Minify and beautify CSS code to reduce file size or improve readability.',
        category: 'developer',
        icon: '🎨',
        color: 'pink',
        tags: ['CSS', 'Minify', 'Beautify', 'Optimize']
    }
];

// Make tools globally available
if (typeof window !== 'undefined') {
    window.TOOLS = TOOLS;
    window.TOOLS_DEFINITIONS = TOOLS;
    console.log(`✅ Loaded ${TOOLS.length} tool definitions`);
}
