export default function (config) {
  config.setServerOptions({ watch: ["dist/assets/**/*"] });
  config.addPassthroughCopy({ "src/static": "/" });
  config.addFilter("json", (value) =>
    JSON.stringify(value).replace(/</g, "\\u003c"),
  );
  config.addFilter("pad", (value) => String(value).padStart(2, "0"));
  config.addFilter("related", (works, work) =>
    works
      .filter((w) => w.id !== work.id)
      .sort(
        (a, b) =>
          Number(b.theme === work.theme) - Number(a.theme === work.theme),
      )
      .slice(0, 3),
  );
  config.addFilter("findWork", (works, id) => works.find((w) => w.id === id));
  return {
    dir: { input: "src", output: "dist" },
    pathPrefix: "/acervo/",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
