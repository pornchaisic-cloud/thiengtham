// Cloudflare Pages Function — proxy Facebook Graph API for Portfolio section
// Reads PUBLIC_FB_ACCESS_TOKEN from CF Pages env (production)
// Returns up to 6 image posts (deduplicated by image URL)
export async function onRequest(context) {
  const token = context.env.PUBLIC_FB_ACCESS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: "PUBLIC_FB_ACCESS_TOKEN not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = `https://graph.facebook.com/v22.0/ThiengTham.DEV/posts?fields=message,permalink_url,full_picture,attachments{media{source,image},subattachments{media{image}}}&limit=9&access_token=${token}`;

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
    const images = [];
    const seen = new Set();

    // Take ONE cover image per post (matches build-time full_picture behavior)
    // Priority: full_picture (always available) → attachments.media.image.src → first subattachment
    for (const post of posts) {
      const link = post.permalink_url || "#";
      let src = post.full_picture;

      if (!src && post.attachments?.data) {
        for (const att of post.attachments.data) {
          if (att.media?.image?.src) { src = att.media.image.src; break; }
          if (att.subattachments?.data) {
            for (const sub of att.subattachments.data) {
              if (sub.media?.image?.src) { src = sub.media.image.src; break; }
            }
            if (src) break;
          }
        }
      }

      if (src) {
        // Dedupe by base image URL (strip query params and size suffixes)
        const key = src.split("?")[0].split("_n.jpg")[0] + "_n.jpg";
        if (!seen.has(key)) {
          seen.add(key);
          images.push({ src, url: link });
        }
      }
      if (images.length >= 6) break;
    }

    return new Response(
      JSON.stringify({ images: images.slice(0, 6) }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // Cache on CF edge for 5 min — FB doesn't change posts every second
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