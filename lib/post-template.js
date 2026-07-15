import TOML from "@iarna/toml";
import camelcaseKeys from "camelcase-keys";
import YAML from "yaml";

const getContent = (properties) => {
    if (properties.content) {
        const content =
            properties.content.text ||
            properties.content.html ||
            properties.content;
        return `\n${content}\n`;
    }

    return "";
};

// Strips quotes from TOML keys matching Hugo's datetime parameters
const unquoteTomlDatetimes = (toml) =>
    toml.replace(
        /^(date|publishDate|lastmod|expiryDate) = "([^"\r\n]+)"/gm,
        "$1 = $2",
    );

const getFrontMatter = (properties, frontMatterFormat) => {
    let delimiters;
    let frontMatter;

    // 1. camelCase the incoming properties first
    properties = camelcaseKeys(properties, { deep: true });

    // 2. Map the raw Indiekit datetime strings directly to Hugo fields
    properties = {
        ...(properties.postStatus === "draft" && { draft: true }),
        ...(properties.name && { title: properties.name }),
        ...(properties.photo && {
            images: properties.photo.map((image) => image.url),
        }),
        ...properties,
        ...(properties.published && { date: properties.published }),
        ...(properties.published && { publishDate: properties.published }),
        ...(properties.updated && { lastmod: properties.updated }),
        ...(properties.deleted && { expiryDate: properties.deleted }),
    };

    // 3. Clean up the unused original raw properties
    delete properties.content;
    delete properties.deleted;
    delete properties.name;
    delete properties.postStatus;
    delete properties.published;
    delete properties.slug;
    delete properties.type;
    delete properties.updated;
    delete properties.url;

    // Before TOML.stringify(properties), convert param name category to tags and makes sure that an array [] is used even when there is only one tag
    if (properties.category) {
        properties.tags = Array.isArray(properties.category)
            ? properties.category
            : [properties.category];
        delete properties.category;
    }

    switch (frontMatterFormat) {
        case "json": {
            delimiters = ["", "\n"];
            frontMatter = JSON.stringify(properties, undefined, 2);
            break;
        }
        case "toml": {
            delimiters = ["+++\n", "+++\n"];
            frontMatter = unquoteTomlDatetimes(TOML.stringify(properties));
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

export const getPostTemplate = (properties, frontMatterFormat = "yaml") => {
    const content = getContent(properties);
    const frontMatter = getFrontMatter(properties, frontMatterFormat);

    return frontMatter + content;
};
