"use client";

const ALLOWED_TAGS = new Set([
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "code",
  "a",
  "br",
  "h4",
]);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const createParagraphMarkup = (text: string) => {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) {
    return "<p>Sorry, I couldn't find relevant information right now.</p>";
  }

  return paragraphs
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
};

const isSafeHref = (href: string) => {
  if (!href) {
    return false;
  }

  try {
    const parsedUrl = new URL(href, "https://insurealltheway.co");

    return ["http:", "https:", "mailto:"].includes(parsedUrl.protocol);
  } catch (error) {
    return false;
  }
};

const sanitizeNode = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtml(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();
  const children = Array.from(element.childNodes)
    .map(sanitizeNode)
    .join("");

  if (!ALLOWED_TAGS.has(tagName)) {
    return children;
  }

  if (tagName === "br") {
    return "<br />";
  }

  if (tagName === "a") {
    const href = element.getAttribute("href") || "";

    if (!isSafeHref(href)) {
      return children;
    }

    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${children}</a>`;
  }

  return `<${tagName}>${children}</${tagName}>`;
};

export const sanitizeChatHtml = (html: string) => {
  if (!html || !html.trim()) {
    return "<p>Sorry, I couldn't find relevant information right now.</p>";
  }

  if (typeof window === "undefined") {
    return createParagraphMarkup(html);
  }

  const trimmedHtml = html.trim();

  if (!trimmedHtml.includes("<")) {
    return createParagraphMarkup(trimmedHtml);
  }

  const parsedDocument = new DOMParser().parseFromString(trimmedHtml, "text/html");
  const sanitizedHtml = Array.from(parsedDocument.body.childNodes)
    .map(sanitizeNode)
    .join("")
    .trim();

  return sanitizedHtml || "<p>Sorry, I couldn't find relevant information right now.</p>";
};
