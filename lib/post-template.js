import TOML from "@iarna/toml";
import camelcaseKeys from "camelcase-keys";
import YAML from "yaml";
import { DateTime } from "luxon";

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

const toOffsetDateTime = (value) => {
    if (!value) return undefined;

    const dt = DateTime.fromISO(value, { setZone: true });
    return dt.isValid ? dt.toISO({ suppressMilliseconds: false }) : undefined;
};

const getFrontMatter = (properties, frontMatterFormat) => {
    let delimiters;
    let frontMatter;

    properties = camelcaseKeys(properties, { deep: true });

    const parsedDate = properties.published
        ? toOffsetDateTime(properties.published)
        : undefined;
    const parsedLastmod = properties.updated
        ? toOffsetDateTime(properties.updated)
        : undefined;
    const parsedExpiry = properties.deleted
        ? toOffsetDateTime(properties.deleted)
        : undefined;

    properties = {
        ...(properties.postStatus === "draft" && { draft: true }),
        ...(properties.name && { title: properties.name }),
        ...(properties.photo && {
            images: properties.photo.map((image) => image.url),
        }),
        ...properties,
        date: parsedDate,
        publishDate: parsedDate,
        ...(parsedLastmod && { lastmod: parsedLastmod }),
        ...(parsedExpiry && { expiryDate: parsedExpiry }),
    };

    delete properties.content;
    delete properties.deleted;
    delete properties.name;
    delete properties.postStatus;
    delete properties.published;
    delete properties.slug;
    delete properties.type;
    delete properties.updated;
    delete properties.url;
    // 5. Make absolutely sure no string version leaked through
    if (!properties.lastmod) delete properties.lastmod;
    if (!properties.expiryDate) delete properties.expiryDate;
    // 6. Before TOML.stringify(properties), convert param name category to tags and makes sure that an array [] is used even when there is only one tag
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
};;

export const getPostTemplate = (properties, frontMatterFormat = "yaml") => {
    const content = getContent(properties);
    const frontMatter = getFrontMatter(properties, frontMatterFormat);

    return frontMatter + content;
};
