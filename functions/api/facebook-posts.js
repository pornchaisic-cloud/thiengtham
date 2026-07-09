// Cloudflare Pages Function — proxy Facebook Graph API for Portfolio section
// Reads PUBLIC_FB_ACCESS_TOKEN from CF Pages env (production)
// Returns ALL images from the LATEST post (album-aware).
// If the latest post has no images, falls back to the next post with images.
export async function onRequest(context) {
  const token = context.env.PUBLIC_FB_ACCESS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: "PUBLIC_FB_ACCESS_TOKEN not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `https://graph.facebook.com/v22.0/ThiengTham.DEV/posts?fields=message,permalink_url,full_picture,attachments{media{source,image},subattachments{media{image}}}&limit=20&access_token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: "Facebook API error", status: res.status, detail: text.slice(0, 200) }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await res.json();
    const posts = data.data || [];

    // NEW STRATEGY: take ALL images from the most recent post that has any.
    // Supports albums (subattachments) and multi-attachment posts.
    let images = [];
    let usedPost = null;

    const stripKey = (url) => url.split("?")[0].split("_n.jpg")[0] + "_n.jpg";

    for (const post of posts) {
      const postImages = [];
      const seen = new Set();

      const add = (src) => {
        if (!src) return;
        const key = stripKey(src);
        if (!seen.has(key)) {
          seen.add(key);
          postImages.push(src);
        }
      };

      // full_picture is the first/cover image (always present when post has photos)
      add(post.full_picture);

      // Attachments — single photo, video (skipped), or album
      if (post.attachments?.data) {
        for (const att of post.attachments.data) {
          add(att.media?.image?.src);
          if (att.subattachments?.data) {
            for (const sub of att.subattachments.data) {
              add(sub.media?.image?.src);
            }
          }
        }
      }

      if (postImages.length > 0) {
        usedPost = post;
        const link = post.permalink_url || "#";
        images = postImages.map((src) => ({ src, url: link }));
        break; // only the latest post with images
      }
    }

    // Cap at 12 to keep grid reasonable if there's a huge album
    images = images.slice(0, 12);

    return new Response(
      JSON.stringify({
        images,
        meta: {
          postId: usedPost?.id || null,
          postUrl: usedPost?.permalink_url || null,
          imageCount: images.length,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
