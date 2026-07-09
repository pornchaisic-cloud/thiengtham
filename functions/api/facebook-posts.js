// Cloudflare Pages Function — proxy Facebook Graph API for Portfolio section
// Reads PUBLIC_FB_ACCESS_TOKEN from CF Pages env (production)
// Uses the LATEST post:
//   - If the latest post is a VIDEO/REEL → return { type: 'video', items: [video] }
//   - If the latest post is a PHOTO (single or album) → return { type: 'photo', items: [images...] }
// If the latest post has no media, no items are returned (client will hide the section).
//
// IMPORTANT: `subattachments` is a NESTED field of `attachments`, not a top-level
// field of the post. Must request `attachments{media,subattachments{media{image}}}`
// — putting `subattachments` at the top level is silently ignored by the FB API.
export async function onRequest(context) {
  const token = context.env.PUBLIC_FB_ACCESS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: "PUBLIC_FB_ACCESS_TOKEN not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `https://graph.facebook.com/v22.0/ThiengTham.DEV/posts?fields=message,permalink_url,full_picture,attachments{media,subattachments{media{image}}}&limit=10&access_token=${token}`;

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

    let type = null;       // 'video' | 'photo'
    let items = [];        // [{ src, poster?, url }]
    let usedPost = null;
    let postUrl = null;

    const stripKey = (u) => u.split("?")[0].split("_n.jpg")[0] + "_n.jpg";

    for (const post of posts) {
      const postUrlLocal = post.permalink_url || "#";
      const att = post.attachments?.data?.[0];

      // VIDEO path — `media.source` exists, `media.image` may or may not
      // FB reels/videos return: { media: { source: 'https://video...mp4', image: { src: '...' }, type: 'video' } }
      const mediaSrc = att?.media?.source;
      if (mediaSrc && (typeof mediaSrc === 'string') && mediaSrc.startsWith('http')) {
        type = 'video';
        items = [{
          src: mediaSrc,
          poster: post.full_picture || att.media?.image?.src || null,
          url: postUrlLocal,
        }];
        usedPost = post;
        postUrl = postUrlLocal;
        break; // latest post only
      }

      // PHOTO path — collect full_picture + attachments/subattachments (album)
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

      add(post.full_picture);
      if (post.attachments?.data) {
        for (const a of post.attachments.data) {
          add(a.media?.image?.src);
          if (a.subattachments?.data) {
            for (const sub of a.subattachments.data) {
              add(sub.media?.image?.src);
            }
          }
        }
      }

      // PHOTO path — return all images from the post (full_picture + album
      // subattachments). The client renders them in a responsive grid so a
      // single photo OR an album both look like a proper portfolio.
      if (postImages.length > 0) {
        type = 'photo';
        items = postImages.map((src) => ({ src, url: postUrlLocal }));
        usedPost = post;
        postUrl = postUrlLocal;
        break; // latest post only
      }

      // Latest post had nothing usable — try next post by NOT breaking
    }

    return new Response(
      JSON.stringify({
        type,                              // 'video' | 'photo' | null
        items,                             // array (empty when no media on latest)
        meta: {
          postId: usedPost?.id || null,
          postUrl,
          count: items.length,
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
