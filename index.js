import { getPostTemplate } from "./lib/post-template.js";
import { getPostTypes } from "./lib/post-types.js";

const defaults = {
  frontMatterFormat: "toml",
};

export default class HugoPreset {
  name = "Hugo Custom Preset";
  postTypes;

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get info() {
    return {
      name: "Hugo Custom Unquoted", // <-- Indiekit reads this to display in your dashboard status
    };
  }

  get prompts() {
    return [
      {
        type: "select",
        name: "frontMatterFormat",
        message: "Which front matter format are you using?",
        choices: [
          {
            title: "JSON",
            value: "json",
          },
          {
            title: "TOML",
            value: "toml",
          },
          {
            title: "YAML",
            value: "yaml",
          },
        ],
        initial: 2,
      },
    ];
  }

  postTemplate(properties) {
    return getPostTemplate(properties, this.options.frontMatterFormat);
  }

  init(Indiekit) {
    this.postTypes = getPostTypes(Indiekit.postTypes);

    Indiekit.addPreset(this);
  }
}