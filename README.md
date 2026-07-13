# Indiekit Plugin: preset-hugo

Forked from [@indiekit/preset-hugo](https://www.npmjs.com/package/@indiekit/preset-hugo). In order to get unquoted dates in front matter, the following changes were made:

- Ensure date value is a native JavaScript Date object before being stringified
- Modify the properties object mapping within getFrontMatter

> [!important]
> I asked an LLM to help me with the code. Please review before using in your setup.

## Installation

I personally wasn't able to use NPM's override feature for the exisiting Indiekit preset-hugo plugin.

1. Remove existing: `npm remove @indiekit/preset-hugo`
2. Install with: `npm install github:eclecticpassions/indiekit-preset-hugo`
3. Replace all existing configuration (e.g. `indiekit.config.js`) and `package.json`, from `@indiekit/preset-hugo` to `@eclecticpassions/indiekit-preset-hugo`
4. Remove and rebuild `rm -rf node_modules package-lock.json` and `npm install`

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
