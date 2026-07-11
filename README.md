# Indiekit Plugin: preset-hugo

Forked from [@indiekit/preset-hugo](https://www.npmjs.com/package/@indiekit/preset-hugo). In order to get unquoted dates in front matter, the following changes were made:

- Ensure date value is a native JavaScript Date object before being stringified
- Modify the properties object mapping within getFrontMatter

See below for the README of the original preset-hugo plugin.

---

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
