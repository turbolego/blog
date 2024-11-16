const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    // Pass through CMS files and images
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/_redirects");

    // Set the path prefix based on the environment
    const pathPrefix = process.env.NETLIFY ? '' : '/blog'; // Use '/blog' only on GitHub Pages

    // Add a custom filter to adjust image URLs based on the environment
    eleventyConfig.addFilter("imagePathPrefix", (url) => {
        if (url && !url.startsWith("http")) {
            return process.env.NETLIFY ? url : "/blog" + url; // Add '/blog' prefix only on GitHub Pages
        }
        return url;
    });

    // Pass through images with the prefix
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
