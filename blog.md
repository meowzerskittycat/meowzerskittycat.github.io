---
layout: default
title: Blog
description: Writing on software development, programming and music.
---
# Blog

Writing on software development, programming and music, newest first.
New posts are also published to the [Atom feed]({{ '/feed.xml' | relative_url }}).

{% if site.posts.size > 0 %}
<ul class="posts">
{% for post in site.posts %}<li><time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%-d %B %Y" }}</time> <a href="{{ post.url | relative_url }}">{{ post.title }}</a>{% if post.description %}<br><span class="muted">{{ post.description }}</span>{% endif %}</li>
{% endfor %}</ul>
{% else %}
No posts yet.
{% endif %}
