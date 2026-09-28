---
layout: default
---
I am a first-year software engineering student. This site is where I publish notes on the software I write and the subjects I am studying, along with occasional posts about music, which I make in my spare time.

Most of the writing is on the [blog]({{ '/blog/' | relative_url }}). The [about]({{ '/about/' | relative_url }}) page has a short introduction, the [status]({{ '/status/' | relative_url }}) page shows what I am working on at the moment, and the [links]({{ '/links/' | relative_url }}) page lists sites I use or recommend.

The site is static HTML, with no tracking, cookies or scripts.

{% assign latest = site.posts | first %}{% if latest %}
Latest post: [{{ latest.title }}]({{ latest.url | relative_url }}), {{ latest.date | date: "%-d %B %Y" }}.
{% endif %}
