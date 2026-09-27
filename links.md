---
layout: default
title: Links
description: Sites Vivien likes.
---
# Links

{% if site.data.links.friends and site.data.links.friends.size > 0 %}
## Friends

<ul>
{% for l in site.data.links.friends %}<li><a href="{{ l.url }}">{{ l.name }}</a> - {{ l.note }}</li>
{% endfor %}</ul>
{% endif %}

## Elsewhere

<ul>
{% for l in site.data.links.cool %}<li><a href="{{ l.url }}">{{ l.name }}</a> - {{ l.note }}</li>
{% endfor %}</ul>
