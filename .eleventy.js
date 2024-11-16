const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    // Check for Netlify deployment using environment variable
    const isNetlify = process.env.NETLIFY === 'true';

    // Set the path prefix for images and assets based on the environment
    const pathPrefix = isNetlify ? '' : '/blog';  // Use '/blog' only on GitHub Pages

    // Pass through CMS files and images with the conditional prefix for images
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/_redirects");

    // Ensure that images are copied with the correct pathPrefix
    eleventyConfig.addPassthroughCopy({
        "src/images": pathPrefix + "/images",  // Apply the image prefix
    });

    // Add "posts" collection
    eleventyConfig.addCollection("posts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
            return new Date(b.date) - new Date(a.date); // Sort by date descending
        });
    });

    // Add custom date filter
    eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
        return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(format);
    });

    // Modify image paths in markdown files
    eleventyConfig.addFilter("imagePathPrefix", (url) => {
        if (url.startsWith("/images/")) {
            return pathPrefix + url;
        }
        return url;  // No change if the URL doesn't match the expected pattern
    });

    return {
        dir: {
            input: "src",
            output: "_site",
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true,
        pathPrefix: pathPrefix, // Apply prefix to all URLs
    };
};
