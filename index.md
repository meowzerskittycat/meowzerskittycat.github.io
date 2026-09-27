---
layout: default
---
This is my personal site. I'm a first-year software engineering student, and I make music in my spare time, mostly for myself.

Most of what ends up here is on the [blog]({{ '/blog/' | relative_url }}): notes on software I'm writing or learning about, some music, and other things I find interesting. The rest is smaller: a short page [about]({{ '/about/' | relative_url }}) me, a [status]({{ '/status/' | relative_url }}) page with what I'm up to right now, and a few [links]({{ '/links/' | relative_url }}).

The site is plain HTML, with no tracking, cookies or scripts. I update it when I have something worth writing down.

{% assign latest = site.posts | first %}{% if latest %}
Latest post: [{{ latest.title }}]({{ latest.url | relative_url }}), {{ latest.date | date: "%Y-%m-%d" }}.
{% endif %}
