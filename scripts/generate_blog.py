from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from html import escape
from pathlib import Path
import json
import re
from typing import Iterable


ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "blog-posts"
OUTPUT_DIR = ROOT / "blog"


SITE_NAME = "Ledgewave"
SITE_DESCRIPTION = (
    "Insights on collections automation, dunning, payment behavior, planned billing, "
    "and receivables forecasting for finance teams."
)
BLOG_TITLE = "Collections Automation Blog"
SOCIAL_IMAGE_URL = "https://ledgewave.com/assets/images/ledgewave-social-card.svg"
SOCIAL_IMAGE_ALT = "Ledgewave collections automation and forecast visibility for modern finance teams."
SITE_LOGO_URL = "https://ledgewave.com/assets/images/ledgewave-mark.svg"
ORGANIZATION_ID = "https://ledgewave.com/#organization"
WEBSITE_ID = "https://ledgewave.com/#website"


@dataclass
class Post:
    title: str
    slug: str
    summary: str
    date_iso: str
    modified_iso: str
    date_label: str
    category: str
    author: str
    read_time: str
    featured: bool
    cover_asset: str
    cover_note: str
    source_path: Path
    html_content: str
    faq_items: list[tuple[str, str]]


def slugify(value: str) -> str:
    lowered = value.lower().strip()
    lowered = re.sub(r"[^a-z0-9]+", "-", lowered)
    lowered = re.sub(r"-{2,}", "-", lowered)
    return lowered.strip("-") or "post"


def split_frontmatter(raw_text: str) -> tuple[dict[str, str], str]:
    if not raw_text.startswith("---\n"):
        return {}, raw_text

    parts = raw_text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}, raw_text

    frontmatter_raw = parts[0][4:]
    body = parts[1]
    metadata: dict[str, str] = {}
    for line in frontmatter_raw.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        metadata[key.strip().lower()] = value.strip()
    return metadata, body


def process_inline(text: str) -> str:
    escaped = escape(text)
    escaped = re.sub(
        r"`([^`]+)`",
        lambda match: f"<code>{escape(match.group(1))}</code>",
        escaped,
    )
    escaped = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda match: (
            f'<a href="{escape(match.group(2), quote=True)}" target="_blank" rel="noreferrer">'
            f"{match.group(1)}</a>"
        ),
        escaped,
    )
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", escaped)
    return escaped


def close_paragraph(paragraph_lines: list[str], output: list[str]) -> None:
    if not paragraph_lines:
        return
    joined = " ".join(paragraph_lines).strip()
    if joined:
        output.append(f"<p>{process_inline(joined)}</p>")
    paragraph_lines.clear()


def close_list(list_items: list[str], output: list[str], ordered: bool) -> None:
    if not list_items:
        return
    tag = "ol" if ordered else "ul"
    items = "".join(f"<li>{process_inline(item)}</li>" for item in list_items)
    output.append(f"<{tag}>{items}</{tag}>")
    list_items.clear()


def markdown_to_html(markdown: str) -> str:
    output: list[str] = []
    paragraph_lines: list[str] = []
    unordered_items: list[str] = []
    ordered_items: list[str] = []
    blockquote_lines: list[str] = []
    in_code = False
    code_lines: list[str] = []

    def close_blockquote() -> None:
        if not blockquote_lines:
            return
        text = " ".join(blockquote_lines).strip()
        if text:
            output.append(f"<blockquote><p>{process_inline(text)}</p></blockquote>")
        blockquote_lines.clear()

    for raw_line in markdown.splitlines() + [""]:
        line = raw_line.rstrip()
        stripped = line.strip()

        if stripped.startswith("```"):
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_list(ordered_items, output, ordered=True)
            close_blockquote()
            if in_code:
                code_html = escape("\n".join(code_lines))
                output.append(f"<pre><code>{code_html}</code></pre>")
                code_lines.clear()
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(raw_line)
            continue

        if not stripped:
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_list(ordered_items, output, ordered=True)
            close_blockquote()
            continue

        if stripped.startswith("# "):
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_list(ordered_items, output, ordered=True)
            close_blockquote()
            output.append(f"<h1>{process_inline(stripped[2:].strip())}</h1>")
            continue

        if stripped.startswith("## "):
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_list(ordered_items, output, ordered=True)
            close_blockquote()
            output.append(f"<h2>{process_inline(stripped[3:].strip())}</h2>")
            continue

        if stripped.startswith("### "):
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_list(ordered_items, output, ordered=True)
            close_blockquote()
            output.append(f"<h3>{process_inline(stripped[4:].strip())}</h3>")
            continue

        if stripped.startswith("> "):
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_list(ordered_items, output, ordered=True)
            blockquote_lines.append(stripped[2:].strip())
            continue

        unordered_match = re.match(r"^[-*]\s+(.*)$", stripped)
        if unordered_match:
            close_paragraph(paragraph_lines, output)
            close_list(ordered_items, output, ordered=True)
            close_blockquote()
            unordered_items.append(unordered_match.group(1).strip())
            continue

        ordered_match = re.match(r"^\d+\.\s+(.*)$", stripped)
        if ordered_match:
            close_paragraph(paragraph_lines, output)
            close_list(unordered_items, output, ordered=False)
            close_blockquote()
            ordered_items.append(ordered_match.group(1).strip())
            continue

        paragraph_lines.append(stripped)

    return "\n".join(output)


def infer_summary(markdown_body: str) -> str:
    for line in markdown_body.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith(("#", "-", "*", ">")):
            continue
        return stripped
    return "New insight from the Ledgewave team."


def parse_date(value: str, fallback: datetime) -> tuple[str, str]:
    if not value:
        return fallback.strftime("%Y-%m-%d"), fallback.strftime("%B %d, %Y")
    parsed = datetime.strptime(value, "%Y-%m-%d")
    return parsed.strftime("%Y-%m-%d"), parsed.strftime("%B %d, %Y")


def strip_leading_h1(html_content: str) -> str:
    stripped = re.sub(r"^<h1>.*?</h1>\n?", "", html_content, count=1, flags=re.S)
    return stripped.lstrip()


def extract_faq_items(markdown_body: str) -> list[tuple[str, str]]:
    items: list[tuple[str, str]] = []
    in_faq = False
    question: str | None = None
    answer_lines: list[str] = []

    def flush() -> None:
        nonlocal question, answer_lines
        answer = " ".join(line.strip() for line in answer_lines if line.strip())
        if question and answer:
            items.append((question, answer))
        question = None
        answer_lines = []

    for raw_line in markdown_body.splitlines():
        stripped = raw_line.strip()
        if not in_faq:
            if stripped.lower() == "## frequently asked questions":
                in_faq = True
            continue

        if stripped.startswith("## ") and stripped.lower() != "## frequently asked questions":
            break

        if stripped.startswith("### "):
            flush()
            question = stripped[4:].strip()
            continue

        if question is None:
            continue

        if stripped:
            answer_lines.append(stripped)

    flush()
    return items


def organization_schema() -> dict[str, object]:
    return {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        "name": SITE_NAME,
        "url": "https://ledgewave.com/",
        "logo": SITE_LOGO_URL,
        "description": "Ledgewave is collections automation and cash forecasting software for finance teams.",
    }


def website_schema() -> dict[str, object]:
    return {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "url": "https://ledgewave.com/",
        "name": SITE_NAME,
        "publisher": {"@id": ORGANIZATION_ID},
        "inLanguage": "en-US",
    }


def page_graph(page: dict[str, object], *entities: dict[str, object]) -> dict[str, object]:
    return {
        "@context": "https://schema.org",
        "@graph": [organization_schema(), website_schema(), page, *entities],
    }


def author_schema(name: str) -> dict[str, str]:
    author_type = "Organization" if "team" in name.lower() else "Person"
    return {"@type": author_type, "name": name}


def render_json_ld(payload: dict[str, object], script_id: str) -> str:
    return (
        f'<script id="{escape(script_id, quote=True)}" type="application/ld+json">\n'
        f"{json.dumps(payload, indent=2)}\n"
        "</script>"
    )


def load_posts() -> list[Post]:
    posts: list[Post] = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        if path.name.upper() == "POST_TEMPLATE.MD" or path.name.startswith("_"):
            continue
        raw_text = path.read_text(encoding="utf-8")
        metadata, body = split_frontmatter(raw_text)
        title = metadata.get("title") or path.stem.replace("-", " ").title()
        slug = metadata.get("slug") or slugify(path.stem)
        summary = metadata.get("summary") or infer_summary(body)
        modified_dt = datetime.fromtimestamp(path.stat().st_mtime)
        date_iso, date_label = parse_date(metadata.get("date", ""), modified_dt)
        modified_iso = modified_dt.strftime("%Y-%m-%d")
        category = metadata.get("category") or "Insights"
        author = metadata.get("author") or "Ledgewave Team"
        read_time = metadata.get("read_time") or "5 min read"
        featured = metadata.get("featured", "").lower() in {"yes", "true", "1"}
        cover_asset = metadata.get("cover_asset", "")
        cover_note = metadata.get("cover_note", "")
        faq_items = extract_faq_items(body)
        html_content = strip_leading_h1(markdown_to_html(body.strip()))
        posts.append(
            Post(
                title=title,
                slug=slug,
                summary=summary,
                date_iso=date_iso,
                modified_iso=modified_iso,
                date_label=date_label,
                category=category,
                author=author,
                read_time=read_time,
                featured=featured,
                cover_asset=cover_asset,
                cover_note=cover_note,
                source_path=path,
                html_content=html_content,
                faq_items=faq_items,
            )
        )
    return sorted(posts, key=lambda post: (post.date_iso, post.slug), reverse=True)


def render_image_placeholder(*, placeholder_id: str, asset_path: str, title: str, note: str, variant: str = "card") -> str:
    safe_variant = escape(variant, quote=True)
    safe_id = escape(placeholder_id, quote=True)
    safe_title = escape(title)
    safe_note = escape(note)
    safe_asset_path = escape(asset_path)
    note_markup = f'<p class="image-placeholder-note">{safe_note}</p>' if note else ""
    return (
        f'<figure class="image-placeholder image-placeholder--{safe_variant}" data-placeholder-id="{safe_id}">\n'
        f'  <div class="image-placeholder-frame" role="img" aria-label="{safe_title} placeholder">\n'
        f'    <span class="image-placeholder-kicker">Image placeholder</span>\n'
        f"    <div>\n"
        f'      <strong class="image-placeholder-title">{safe_title}</strong>\n'
        f"      {note_markup}\n"
        f"    </div>\n"
        f'    <p class="image-placeholder-target">Replace with <code>assets/images/{safe_asset_path}</code></p>\n'
        f"  </div>\n"
        f"</figure>"
    )


def render_post_cards(posts: Iterable[Post], base_href: str = "") -> str:
    cards = []
    for post in posts:
        href = f"{base_href}{post.slug}.html"
        featured_badge = '<span class="blog-badge">Featured</span>' if post.featured else ""
        cover_markup = (
            render_image_placeholder(
                placeholder_id=f"blog-card-{post.slug}",
                asset_path=post.cover_asset,
                title="Cover image",
                note="",
                variant="card",
            )
            if post.cover_asset
            else ""
        )
        cards.append(
            f"""
            <article class="blog-card">
              {cover_markup}
              <div class="blog-card-meta">
                <span class="resource-type">{escape(post.category)}</span>
                {featured_badge}
              </div>
              <h3>{escape(post.title)}</h3>
              <p>{escape(post.summary)}</p>
              <div class="blog-post-meta">
                <span>{escape(post.date_label)}</span>
                <span>{escape(post.read_time)}</span>
                <span>{escape(post.author)}</span>
              </div>
              <a class="btn btn-secondary" href="{escape(href, quote=True)}">Read post</a>
            </article>
            """.strip()
        )
    return "\n".join(cards)


def render_layout(
    *,
    title: str,
    meta_description: str,
    body_page: str,
    relative_prefix: str,
    canonical_url: str,
    og_type: str = "website",
    current_page: str = "blog",
    head_extra: str = "",
) -> str:
    full_title = f"{title} | {SITE_NAME}"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{escape(meta_description, quote=True)}">
  <title>{escape(full_title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
    rel="stylesheet"
  >
  <link rel="icon" href="{relative_prefix}assets/images/ledgewave-mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="{relative_prefix}assets/css/styles.css">
  <link rel="canonical" href="{escape(canonical_url, quote=True)}">
  <meta property="og:type" content="{escape(og_type, quote=True)}">
  <meta property="og:site_name" content="{SITE_NAME}">
  <meta property="og:title" content="{escape(full_title, quote=True)}">
  <meta property="og:description" content="{escape(meta_description, quote=True)}">
  <meta property="og:url" content="{escape(canonical_url, quote=True)}">
  <meta property="og:image" content="{SOCIAL_IMAGE_URL}">
  <meta property="og:image:alt" content="{SOCIAL_IMAGE_ALT}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{escape(full_title, quote=True)}">
  <meta name="twitter:description" content="{escape(meta_description, quote=True)}">
  <meta name="twitter:image" content="{SOCIAL_IMAGE_URL}">
  {head_extra}
</head>
<body data-page="{escape(current_page)}">
  <div class="site-shell">
    <div data-site-header></div>

    <main class="page-main">
{body_page}
    </main>

    <div data-site-footer></div>
  </div>

  <script src="{relative_prefix}assets/js/script.js"></script>
</body>
</html>
"""


def render_blog_index(posts: list[Post]) -> str:
    if posts:
        featured_post = next((post for post in posts if post.featured), posts[0])
        featured_markup = f"""
      <section class="page-hero reveal is-visible">
        <div class="page-hero-copy">
          <span class="section-pill">Blog</span>
          <h1>Collections automation insights for AR and finance teams.</h1>
          <p>
            Writing from the Ledgewave team on collections workflow, dunning, planned billing,
            payment behavior, and cash visibility.
          </p>
          <div class="page-hero-actions">
            <a class="btn btn-primary" href="{escape(featured_post.slug)}.html">Read the featured post</a>
            <a class="btn btn-secondary" href="../demo.html">Request a Demo</a>
          </div>
        </div>

        <aside class="page-hero-card">
          <span class="section-pill">Featured Post</span>
          <h2>{escape(featured_post.title)}</h2>
          <p>{escape(featured_post.summary)}</p>
          {render_image_placeholder(
              placeholder_id="blog-featured-cover",
              asset_path=featured_post.cover_asset,
              title="Featured article cover",
              note=featured_post.cover_note,
              variant="wide",
          ) if featured_post.cover_asset else ""}
          <div class="blog-post-meta">
            <span>{escape(featured_post.date_label)}</span>
            <span>{escape(featured_post.read_time)}</span>
            <span>{escape(featured_post.author)}</span>
          </div>
          <div class="page-hero-actions">
            <a class="btn btn-secondary" href="{escape(featured_post.slug)}.html">Read post</a>
          </div>
        </aside>
      </section>

      <section class="content-section reveal">
        <div class="section-heading">
          <span class="section-pill">Latest Posts</span>
          <h2>Recent writing from the Ledgewave team.</h2>
          <p>Articles for controllers, AR leaders, and finance teams evaluating modern collections workflow.</p>
        </div>
        <div class="blog-grid">
{render_post_cards(posts, base_href="")}
        </div>
      </section>
        """
    else:
        featured_markup = """
      <section class="page-hero reveal is-visible">
        <div class="page-hero-copy">
          <span class="section-pill">Blog</span>
          <h1>Collections automation insights for AR and finance teams.</h1>
          <p>
            Drop markdown files into <code>content/blog-posts</code> and run <code>python scripts/generate_blog.py</code>
            to publish your first articles.
          </p>
        </div>

        <aside class="page-hero-card">
          <span class="section-pill">No Posts Yet</span>
          <h2>Your blog is ready.</h2>
          <p>Create a source post in the folder and regenerate the site to populate this page.</p>
        </aside>
      </section>
        """

    blog_page = {
        "@type": "Blog",
        "@id": "https://ledgewave.com/blog/#blog",
        "url": "https://ledgewave.com/blog/",
        "name": BLOG_TITLE,
        "description": SITE_DESCRIPTION,
        "isPartOf": {"@id": WEBSITE_ID},
        "about": {"@id": ORGANIZATION_ID},
        "inLanguage": "en-US",
    }

    return render_layout(
        title=BLOG_TITLE,
        meta_description=SITE_DESCRIPTION,
        relative_prefix="../",
        canonical_url="https://ledgewave.com/blog/",
        body_page=featured_markup,
        head_extra=render_json_ld(page_graph(blog_page), "structured-data"),
    )


def render_post_page(post: Post, posts: list[Post]) -> str:
    related_posts = [candidate for candidate in posts if candidate.slug != post.slug][:3]
    related_markup = render_post_cards(related_posts, base_href="") if related_posts else ""
    canonical_url = f"https://ledgewave.com/blog/{post.slug}.html"

    body = f"""
      <section class="page-hero reveal is-visible">
        <div class="page-hero-copy">
          <span class="section-pill">{escape(post.category)}</span>
          <h1>{escape(post.title)}</h1>
          <p>{escape(post.summary)}</p>
          <div class="blog-post-meta">
            <span>{escape(post.date_label)}</span>
            <span>{escape(post.read_time)}</span>
            <span>{escape(post.author)}</span>
          </div>
          <div class="page-hero-actions">
            <a class="btn btn-primary" href="../demo.html">Request a Demo</a>
            <a class="btn btn-secondary" href="index.html">Back to Blog</a>
          </div>
        </div>

        <aside class="page-hero-card">
          <span class="section-pill">Why It Matters</span>
          <h2>Collections performance is more than an aging report.</h2>
          <p>Each article ties receivables data, workflow discipline, and forecast visibility back to the day-to-day decisions finance teams actually make.</p>
          {render_image_placeholder(
              placeholder_id=f"blog-post-hero-{post.slug}",
              asset_path=post.cover_asset,
              title="Article cover",
              note=post.cover_note,
              variant="wide",
          ) if post.cover_asset else ""}
          <div class="pill-row">
            <span class="pill">Operators</span>
            <span class="pill">Controllers</span>
            <span class="pill">AR leaders</span>
          </div>
        </aside>
      </section>

      <section class="content-section reveal">
        <article class="blog-article">
          {post.html_content}
        </article>
      </section>
    """

    if related_markup:
        body += f"""
      <section class="content-section reveal">
        <div class="section-heading">
          <span class="section-pill">More from the blog</span>
          <h2>Keep exploring.</h2>
        </div>
        <div class="blog-grid">
{related_markup}
        </div>
      </section>
        """

    page = {
        "@type": "WebPage",
        "@id": f"{canonical_url}#webpage",
        "url": canonical_url,
        "name": post.title,
        "description": post.summary,
        "isPartOf": {"@id": WEBSITE_ID},
        "about": {"@id": ORGANIZATION_ID},
        "inLanguage": "en-US",
        "primaryImageOfPage": SOCIAL_IMAGE_URL,
    }
    article = {
        "@type": "BlogPosting",
        "@id": f"{canonical_url}#article",
        "headline": post.title,
        "description": post.summary,
        "datePublished": post.date_iso,
        "dateModified": post.modified_iso,
        "author": author_schema(post.author),
        "publisher": {"@id": ORGANIZATION_ID},
        "mainEntityOfPage": {"@id": f"{canonical_url}#webpage"},
        "image": SOCIAL_IMAGE_URL,
        "articleSection": post.category,
        "url": canonical_url,
    }
    head_parts = [
        f'<meta name="author" content="{escape(post.author, quote=True)}">',
        f'<meta property="article:published_time" content="{escape(post.date_iso, quote=True)}">',
        f'<meta property="article:modified_time" content="{escape(post.modified_iso, quote=True)}">',
        f'<meta property="article:section" content="{escape(post.category, quote=True)}">',
        render_json_ld(page_graph(page, article), "structured-data"),
    ]
    if post.faq_items:
        faq_payload = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer,
                    },
                }
                for question, answer in post.faq_items
            ],
        }
        head_parts.append(render_json_ld(faq_payload, "faq-structured-data"))

    return render_layout(
        title=post.title,
        meta_description=post.summary,
        relative_prefix="../",
        canonical_url=canonical_url,
        og_type="article",
        body_page=body,
        head_extra="\n  ".join(head_parts),
    )


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    for existing_file in OUTPUT_DIR.glob("*.html"):
        existing_file.unlink()
    posts = load_posts()
    (OUTPUT_DIR / "index.html").write_text(render_blog_index(posts), encoding="utf-8")
    for post in posts:
        output_path = OUTPUT_DIR / f"{post.slug}.html"
        output_path.write_text(render_post_page(post, posts), encoding="utf-8")
    print(f"Generated blog with {len(posts)} post(s) in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
