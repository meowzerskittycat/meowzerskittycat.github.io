---
layout: default
title: About
description: A bit about Vivien.
---
# About

I'm {{ site.author }}. I'm in my first year of engineering, and outside of classes I make music.
I like figuring out how things work, which is more or less why I picked engineering.

I made this site so I'd have a place online that's mine, and somewhere to write up projects properly
instead of leaving them in a folder.

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
