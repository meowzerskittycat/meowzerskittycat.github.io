---
layout: default
title: Blog
description: Blog posts, newest first.
---
# Blog

Posts about software, music, and whatever else I feel like writing up, newest first.
You can follow new posts with the [Atom feed]({{ '/feed.xml' | relative_url }}).

{% if site.posts.size > 0 %}
<ul class="posts">
{% for post in site.posts %}<li><time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%Y-%m-%d" }}</time> <a href="{{ post.url | relative_url }}">{{ post.title }}</a>{% if post.description %}<br><span class="muted">{{ post.description }}</span>{% endif %}</li>
{% endfor %}</ul>
{% else %}
Nothing here yet.
{% endif %}
