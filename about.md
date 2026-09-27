---
layout: default
title: About
description: A bit about me.
sections: [About, Profile, Things I like]
---
# About

I'm {{ site.author }}. First-year engineering student, and I make music in my spare time.
I like figuring out how stuff works.

I made this site so I'd have a small place online that's mine. I'll add to it when I have time.

## Profile

<table class="status">
<tr><th scope="row">Name</th><td>{{ site.author }}</td></tr>
<tr><th scope="row">Pronouns</th><td>he/him</td></tr>
<tr><th scope="row">Studying</th><td>{{ site.data.uni.degree }}, {{ site.data.uni.year }}</td></tr>
</table>

## Things I like

<table class="status">
{% for f in site.data.favorites %}<tr><th scope="row">{{ f.category }}</th><td>{{ f.items | join: ", " }}</td></tr>
{% endfor %}</table>
