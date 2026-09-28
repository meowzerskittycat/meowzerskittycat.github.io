---
layout: default
title: Links
description: Sites and resources I use or recommend.
---
# Links

Sites and resources I use or recommend.

{% if site.data.links.friends and site.data.links.friends.size > 0 %}
## Friends

<ul class="links">
{% for l in site.data.links.friends %}<li><a href="{{ l.url }}">{{ l.name }}</a><br><span class="muted">{{ l.note }}</span></li>
{% endfor %}</ul>
{% endif %}

## Resources

<ul class="links">
{% for l in site.data.links.cool %}<li><a href="{{ l.url }}">{{ l.name }}</a><br><span class="muted">{{ l.note }}</span></li>
{% endfor %}</ul>
