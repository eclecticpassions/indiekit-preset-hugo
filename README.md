# Indiekit Plugin: preset-hugo

Forked from [@indiekit/preset-hugo](https://www.npmjs.com/package/@indiekit/preset-hugo).

## Features

1. Output unquoted date front matter (i.e. `date`, `publishDate`, `lastmod` ), instead of quoted string values.

    - For example:

      ```toml
      date = 2026-07-13T15:29:23+08:00
      ```

      Instead of:

      ```toml
      date = "2026-07-13T15:29:51+08:00"
      ```

    - Ensure date value is a native JavaScript Date object before being stringified
    - Modify the properties object mapping within getFrontMatter

2. Rename Indiekit property name `category` to `tags` and ensure single tags are also use arrays for consistency.

    - For example:

      ```toml
      tags = [ "tag1", "tag2" ]
      tags = [ "tag3" ]
      ```

      Instead of:

      ```toml
      category = [ "tag1", "tag2" ]
      category = "tag3"
      ```

## Install Custom Plugin

I personally wasn't able to use [NPM's override](https://docs.npmjs.com/cli/v10/configuring-npm/package-json?v=true#overrides) feature to replace the existing Indiekit `preset-hugo` plugin, therefore:

1. Remove existing: `npm remove @indiekit/preset-hugo`
2. Install custom preset-hugo: `npm install github:eclecticpassions/indiekit-preset-hugo` or `npm install @eclecticpassions/indiekit-preset-hugo`
3. Replace all existing configuration (e.g. in `indiekit.config.js`) and `package.json`, from `@indiekit/preset-hugo` to `@eclecticpassions/indiekit-preset-hugo`

## Pending

- Currently, `lib/post-template.js` is set up to convert dates to Asia/Hong_Kong time zone / UTC+8. I will add a config option in the future for others to set it in their Indiekit config file under the plugin settings.

## Resources

- [Hugo dates](https://gohugo.io/methods/page/date/)
- [Indiekit post template](https://getindiekit.com/configuration/post-template)
- [Indiekit Hugo publication preset plugin](https://getindiekit.com/plugins/presets/hugo)

## Disclaimer

LLMs were used to help generate the JavaScript code. All non-code parts (i.e. README) is written by me. Please review code before using in your Indiekit setup.

---

<div align="center">

*See below for the README of the original Indiekit `preset-hugo` plugin.*

</div>

---

## Indiekit Publication Preset for Hugo

A [Hugo](https://gohugo.io) publication preset for Indiekit.

## Installation

`npm install @indiekit/preset-hugo`

## Usage

Add `@indiekit/preset-hugo` to your list of plug-ins, specifying options as required:

```json
{
  "plugins": ["@indiekit/preset-hugo"],
  "@indiekit/preset-hugo": {
    "frontMatterFormat": "json"
  }
}
```

## Options

| Option              | Type     | Description                                                                            |
| :------------------ | :------- | :------------------------------------------------------------------------------------- |
| `frontMatterFormat` | `string` | Front matter format to use (`json`, `toml` or `yaml`). _Optional_, defaults to `yaml`. |
