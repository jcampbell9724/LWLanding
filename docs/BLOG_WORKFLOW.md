# Blog Workflow

## Add a new post

1. Create a new markdown file in `content/blog-posts/`.
2. Copy the format from `content/blog-posts/POST_TEMPLATE.md`.
3. Fill in the frontmatter values.
4. Write the article in markdown.
5. Run:

```powershell
python scripts/generate_blog.py
```

## What the script does

- reads all `.md` files in `content/blog-posts/`
- generates `blog/index.html`
- generates one static HTML page per post in `blog/`

## Notes

- The blog is static. New posts do not appear until you rerun `python scripts/generate_blog.py`.
- Posts are sorted newest first by the `date` field.
- Set `featured: yes` on one post if you want it highlighted on the blog index.
- If no `slug` is provided, the script builds one from the filename.
- Add `cover_alt:` in the frontmatter for the article hero image and featured blog card description.
- Regular blog grid cards keep their cover images decorative, so you only need one useful `cover_alt` sentence per post.
