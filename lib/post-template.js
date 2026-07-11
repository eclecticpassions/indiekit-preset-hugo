import TOML from "@iarna/toml";
import camelcaseKeys from "camelcase-keys";
import YAML from "yaml";

/**
 * Get content
 * @access private
 * @param {object} properties - JF2 properties
 * @returns {string} Content
 */
const getContent = (properties) => {
  if (properties.content) {
    const content =
      properties.content.text || properties.content.html || properties.content;
    return `\n${content}\n`;
  }

  return "";
};

/**
 * Get front matter
 * @access private
 * @param {object} properties - JF2 properties
 * @param {string} frontMatterFormat - Front matter format
 * @returns {string} Front matter in chosen format
 */
const getFrontMatter = (properties, frontMatterFormat) => {
  let delimiters;
  let frontMatter;

  // 1. camelCase the incoming properties first
  properties = camelcaseKeys(properties, { deep: true });

  // 2. Capture clean Date objects first
  const parsedDate = properties.published ? new Date(properties.published) : undefined;
  const parsedLastmod = properties.updated ? new Date(properties.updated) : undefined;
  const parsedExpiry = properties.deleted ? new Date(properties.deleted) : undefined;

  // 3. Build the clean, final object mapping
  properties = {
    ...(properties.postStatus === "draft" && { draft: true }),
    ...(properties.name && { title: properties.name }),
    ...(properties.photo && {
      images: properties.photo.map((image) => image.url),
    }),
    ...properties, // Pull everything else in safely early on
    
    // Explicitly place the strict types at the bottom to guarantee they win
    date: parsedDate,
    publishDate: parsedDate,
    ...(parsedLastmod && { lastmod: parsedLastmod }),
    ...(parsedExpiry && { expiryDate: parsedExpiry }),
  };

  // 4. Wipe out all unused/overlapping raw string properties completely
  delete properties.content;
  delete properties.deleted;
  delete properties.name;
  delete properties.postStatus;
  delete properties.published;
  delete properties.slug;
  delete properties.type;
  delete properties.updated;
  delete properties.url;

  // 5, Make absolutely sure no string version leaked through
  if (!properties.lastmod) delete properties.lastmod;
  if (!properties.expiryDate) delete properties.expiryDate;

  switch (frontMatterFormat) {
    case "json": {
      delimiters = ["", "\n"];
      frontMatter = JSON.stringify(properties, undefined, 2);
      break;
    }

    case "toml": {
      delimiters = ["+++\n", "+++\n"];
      frontMatter = TOML.stringify(properties);
      break;
    }

    default: {
      delimiters = ["---\n", "---\n"];
      frontMatter = YAML.stringify(properties, { lineWidth: 0 });
      break;
    }
  }

  return `${delimiters[0]}${frontMatter}${delimiters[1]}`;
};

/**
 * Get post template
 * @param {object} properties - JF2 properties
 * @param {string} [frontMatterFormat] - Front matter format
 * @returns {string} Rendered template
 */
export const getPostTemplate = (properties, frontMatterFormat = "yaml") => {
  const content = getContent(properties);
  const frontMatter = getFrontMatter(properties, frontMatterFormat);

  return frontMatter + content;
};
