from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from html import escape
from pathlib import Path
import re
from typing import Iterable


ROOT = Path(__file__).resolve().parent
POSTS_DIR = ROOT / "blog-posts"
OUTPUT_DIR = ROOT / "blog"


SITE_NAME = "Ledgewave"
SITE_TAGLINE = "Receivables OS"
SITE_DESCRIPTION = (
    "Insights for finance teams modernizing receivables operations, collections workflow, "
    "forecast discipline, and customer follow-up."
)


@dataclass
class Post:
    title: str
    slug: str
    summary: str
    date_iso: str
    date_label: str
    category: str
    author: str
    read_time: str
    featured: bool
    source_path: Path
    html_content: str


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
        date_iso, date_label = parse_date(metadata.get("date", ""), datetime.fromtimestamp(path.stat().st_mtime))
        category = metadata.get("category") or "Insights"
        author = metadata.get("author") or "Ledgewave Team"
        read_time = metadata.get("read_time") or "5 min read"
        featured = metadata.get("featured", "").lower() in {"yes", "true", "1"}
        html_content = markdown_to_html(body.strip())
        posts.append(
            Post(
                title=title,
                slug=slug,
                summary=summary,
                date_iso=date_iso,
                date_label=date_label,
                category=category,
                author=author,
                read_time=read_time,
                featured=featured,
                source_path=path,
                html_content=html_content,
            )
        )
    return sorted(posts, key=lambda post: (post.date_iso, post.slug), reverse=True)


def render_post_cards(posts: Iterable[Post], base_href: str = "") -> str:
    cards = []
    for post in posts:
        href = f"{base_href}{post.slug}.html"
        featured_badge = '<span class="blog-badge">Featured</span>' if post.featured else ""
        cards.append(
            f"""
            <article class="blog-card">
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


def render_layout(*, title: str, meta_description: str, body_page: str, relative_prefix: str, current_page: str = "blog") -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{escape(meta_description, quote=True)}">
  <title>{escape(title)} | {SITE_NAME}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
    rel="stylesheet"
  >
  <link rel="icon" href="{relative_prefix}assets/ledgewave-mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="{relative_prefix}styles.css">
</head>
<body data-page="{escape(current_page)}">
  <div class="site-shell">
    <div class="topline">
      Operator notes for teams modernizing receivables workflow and forecast discipline.
    </div>

    <header class="site-header" id="top">
      <a class="brand" href="{relative_prefix}index.html" aria-label="{SITE_NAME} home">
        <img src="{relative_prefix}assets/ledgewave-mark.svg" alt="" width="44" height="44">
        <span class="brand-copy">
          <strong>{SITE_NAME}</strong>
          <span>{SITE_TAGLINE}</span>
        </span>
      </a>

      <button
        class="nav-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="site-nav"
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
      </button>

      <nav class="site-nav" id="site-nav" aria-label="Primary">
        <a href="{relative_prefix}platform.html" data-nav="platform">Platform</a>
        <a href="{relative_prefix}solutions.html" data-nav="solutions">Solutions</a>
        <a href="{relative_prefix}operations.html" data-nav="operations">Operations</a>
        <a href="{relative_prefix}resources.html" data-nav="resources">Resources</a>
        <a href="{relative_prefix}blog/index.html" data-nav="blog">Blog</a>
        <a href="{relative_prefix}why-ledgewave.html" data-nav="why">Why Ledgewave</a>
      </nav>

      <a class="btn btn-primary nav-cta" href="{relative_prefix}demo.html">Request a Demo</a>
    </header>

    <main>
{body_page}
    </main>

    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-brand-top">
            <img src="{relative_prefix}assets/ledgewave-mark.svg" alt="" width="40" height="40">
            <span class="footer-brand-copy">
              <strong>{SITE_NAME}</strong>
              <span>Receivables OS for cleaner collections operations.</span>
            </span>
          </div>
          <p class="footer-note">
            {SITE_DESCRIPTION}
          </p>
        </div>

        <div class="footer-links">
          <strong>Product</strong>
          <a href="{relative_prefix}platform.html">Platform</a>
          <a href="{relative_prefix}solutions.html">Solutions</a>
          <a href="{relative_prefix}operations.html">Operations</a>
        </div>

        <div class="footer-links">
          <strong>Learn</strong>
          <a href="{relative_prefix}resources.html">Resources</a>
          <a href="{relative_prefix}blog/index.html">Blog</a>
          <a href="{relative_prefix}demo.html">Request a Demo</a>
        </div>

        <div class="footer-links">
          <strong>Browse</strong>
          <a href="{relative_prefix}index.html">Home</a>
          <a href="#top">Back to top</a>
        </div>
      </div>

      <div class="footer-meta">
        <span>&copy; <span id="year"></span> {SITE_NAME}. Receivables operations software.</span>
        <span>Built around imports, dunning workflow, and cash forecast visibility.</span>
      </div>
    </footer>
  </div>

  <script src="{relative_prefix}script.js"></script>
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
          <h1>Ideas, playbooks, and operator guidance for modern collections teams.</h1>
          <p>
            Writing from the Ledgewave team on imports, planned billing, payment behavior,
            collections workflow, and the decisions that shape cash visibility.
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
          <p>Articles for operators, controllers, and AR leaders evaluating a more connected receivables workflow.</p>
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
          <h1>Ideas, playbooks, and operator guidance for modern collections teams.</h1>
          <p>
            Drop markdown files into <code>blog-posts</code> and run <code>python generate_blog.py</code>
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

    return render_layout(
        title="Blog",
        meta_description=SITE_DESCRIPTION,
        relative_prefix="../",
        body_page=featured_markup,
    )


def render_post_page(post: Post, posts: list[Post]) -> str:
    related_posts = [candidate for candidate in posts if candidate.slug != post.slug][:3]
    related_markup = render_post_cards(related_posts, base_href="") if related_posts else ""

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

    return render_layout(
        title=post.title,
        meta_description=post.summary,
        relative_prefix="../",
        body_page=body,
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
