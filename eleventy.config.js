import markdownIt from "markdown-it";
import fs from 'node:fs/promises'

export default async function(eleventyConfig) {
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
    eleventyConfig.addGlobalData("layout", "layouts/base.njk");
    eleventyConfig.setLibrary("md", markdownIt({breaks: true}));
	eleventyConfig.addCollection("poemas", function (collectionApi) {
		return collectionApi.getFilteredByGlob("**/poemas/*.md");
	});

    // TODO: remove if 'virtual data files' are a thing
    eleventyConfig.on("eleventy.before", async () => {
        const layout = 'layouts/poema.njk'
        const json = JSON.stringify({layout})
        await fs.writeFile('src/poemas/poemas.json', json);
	});
    eleventyConfig.on("eleventy.after", async() => {
        await fs.rm('src/poemas/poemas.json');
    })
}
