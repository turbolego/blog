const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    // Pass through CMS files
    eleventyConfig.addPassthroughCopy("admin");

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
        pathPrefix: "/blog/", // Ensure paths align with the GitHub Pages subdirectory
        // Add this line to ensure posts have .html in their paths
        templateFormats: ["html", "md", "njk"],
    };
};
