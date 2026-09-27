---
layout: default
title: Projects
description: Project write-ups.
---
# Projects

Write-ups of things I've built or am working on, newest first.
You can follow new posts with the [Atom feed]({{ '/feed.xml' | relative_url }}).

{% if site.posts.size > 0 %}
<ul class="posts">
{% for post in site.posts %}<li><time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%Y-%m-%d" }}</time> <a href="{{ post.url | relative_url }}">{{ post.title }}</a>{% if post.description %}<br><span class="muted">{{ post.description }}</span>{% endif %}</li>
{% endfor %}</ul>
{% else %}
Nothing here yet.
{% endif %}
