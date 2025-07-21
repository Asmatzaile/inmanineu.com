import markdownIt from "markdown-it";
import fs from 'node:fs/promises';
import { HtmlBasePlugin } from "@11ty/eleventy";

export default async function(eleventyConfig) {
    eleventyConfig.setInputDirectory("src");
    eleventyConfig.setOutputDirectory("dist");
    eleventyConfig.addPassthroughCopy("src/bundle.css");
    eleventyConfig.addPassthroughCopy({"src/poemas/media": "media"});
    eleventyConfig.addPlugin(HtmlBasePlugin); // so that image paths are correct
    eleventyConfig.addGlobalData("layout", "layouts/base.njk");
    eleventyConfig.setLibrary("md", markdownIt({breaks: true}));
	eleventyConfig.addCollection("poemas", function (collectionApi) {
		return collectionApi.getFilteredByGlob("**/poemas/*.md");
	});
    eleventyConfig.addFilter("formatoFecha", value => {
        if (value === null || value === undefined) return "fecha desconocida";
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const date = new Date(value);
        return months[date.getMonth()] + " " + date.getFullYear();
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
