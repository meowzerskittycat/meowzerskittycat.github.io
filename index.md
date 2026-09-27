---
layout: default
---
# {{ site.author }}

This is my personal site. I'm a first-year engineering student, and I make music in my spare time, mostly for myself.

Most of what ends up here is about [projects]({{ '/projects/' | relative_url }}): things I've built for uni or on my own, how I went about them, and what I'd do differently next time. The rest is smaller: a short page [about]({{ '/about/' | relative_url }}) me, a [status]({{ '/status/' | relative_url }}) page with what I'm up to right now, and some notes on [music]({{ '/music/' | relative_url }}) and [uni]({{ '/uni/' | relative_url }}).

The site is plain HTML, with no tracking, cookies or scripts. I update it when I have something worth writing down.

{% assign latest = site.posts | first %}{% if latest %}
Latest post: [{{ latest.title }}]({{ latest.url | relative_url }}), {{ latest.date | date: "%Y-%m-%d" }}.
{% endif %}
