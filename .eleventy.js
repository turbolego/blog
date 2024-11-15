const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    // Pass through CMS files from 'src/admin'
    eleventyConfig.addPassthroughCopy("src/admin");

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
    };
};
