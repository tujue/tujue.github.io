/**
 * Tools Configuration
 * Import from separate tools-definitions file
 */

// Import tool definitions (will be loaded from tools-definitions.js)
// For now, we'll use a dynamic import or global reference

/**
 * Get all tools (supports both module and global)
 */
export function getAllTools() {
    // Try module import first
    if (window.TOOLS_DEFINITIONS) {
        return window.TOOLS_DEFINITIONS;
    }

    // Fallback to legacy TOOLS
    if (window.TOOLS) {
        return window.TOOLS;
    }

    console.error('No tools found! Make sure tools-definitions.js is loaded.');
    return [];
}

/**
 * Get tool by ID
 */
export function getToolById(toolId) {
    const tools = getAllTools();
    return tools.find(t => t.id === toolId);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category) {
    const tools = getAllTools();
    if (category === 'all') return tools;
    return tools.filter(t => t.category === category);
}

/**
 * Get tool name (with i18n support)
 */
export function getToolName(tool, lang = 'en') {
    if (lang === 'tr' && tool.tr && tool.tr.name) {
        return tool.tr.name;
    }
    return tool.name;
}

/**
 * Get tool description (with i18n support)
 */
export function getToolDescription(tool, lang = 'en') {
    if (lang === 'tr' && tool.tr && tool.tr.description) {
        return tool.tr.description;
    }
    return tool.description;
}

export default {
    getAllTools,
    getToolById,
    getToolsByCategory,
    getToolName,
    getToolDescription
};
