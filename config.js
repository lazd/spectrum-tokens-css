const StyleDictionary = require("style-dictionary");
const CSSSetsFormatter = require("style-dictionary-sets").CSSSetsFormatter;
const NameKebabTransfom = require("style-dictionary-sets").NameKebabTransfom;
const AttributeSetsTransform =
  require("style-dictionary-sets").AttributeSetsTransform;

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerFormat(CSSSetsFormatter);

const generateFileConfig = (subSystemName, setName) => {
  const sets = [setName, subSystemName];
  return {
    destination: `${subSystemName}/${setName}-vars.css`,
    format: CSSSetsFormatter.name,
    filter: (token) => {
      return (
        typeof token.attributes === "object" &&
        !Array.isArray(token.attributes) &&
        token.attributes !== null &&
        "sets" in token.attributes &&
        token.attributes.sets.some((element) => {
          return sets.includes(element);
        })
      );
    },
    options: {
      showFileHeader: false,
      outputReferences: true,
      sets
    },
  }
}

module.exports = {
  source: ["node_modules/@adobe/spectrum-tokens/src/**/*.json"],
  platforms: {
    CSS: {
      buildPath: "dist/css/",
      transforms: [AttributeSetsTransform.name, NameKebabTransfom.name],
      prefix: "spectrum",
      files: [
        {
          destination: "default-vars.css",
          format: CSSSetsFormatter.name,
          filter: (token) => {
            return !("sets" in token.attributes);
          },
          options: {
            showFileHeader: false,
            outputReferences: true,
          },
        },
        generateFileConfig("spectrum","desktop"),
        generateFileConfig("spectrum","mobile"),
        generateFileConfig("spectrum","light"),
        generateFileConfig("spectrum","dark"),
        generateFileConfig("spectrum","darkest"),
        generateFileConfig("express","desktop"),
        generateFileConfig("express","mobile"),
        generateFileConfig("express","light"),
        generateFileConfig("express","dark"),
        generateFileConfig("express","darkest"),
      ],
    },
  },
};
