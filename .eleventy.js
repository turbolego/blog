const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    // Check for Netlify deployment using environment variable
    const isNetlify = process.env.NETLIFY === 'true';

    // Set the path prefix for images and assets based on the environment
    const imagePrefix = isNetlify ? '' : '/blog';  // '/blog' only on GitHub Pages
    const pathPrefix = isNetlify ? '' : '/blog';  // Use '/blog' for GitHub Pages

    // Pass through CMS files and images with the conditional prefix for images
    eleventyConfig.addPassthroughCopy({
        "src/images": imagePrefix + "/images",  // Apply the image prefix
    });
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/_redirects");

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

    return {
        dir: {
            input: "src",
            output: "_site",
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true,
        pathPrefix: pathPrefix, // Apply the path prefix for URLs
    };
};
