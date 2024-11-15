module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("admin"); // Pass through CMS files

    eleventyConfig.addCollection("posts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
            return new Date(b.date) - new Date(a.date); // Sort by date descending
        });
    });

    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
