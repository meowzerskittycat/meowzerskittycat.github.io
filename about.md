---
layout: default
title: About
description: A bit about me.
---
# About

I'm a first-year software engineering student. I like figuring out how things work, and most of
the time that means writing code. Outside of that I make music.

I made this site so I'd have a place online that's mine, and somewhere to write things up properly
instead of leaving notes scattered in folders.

## Profile

<table class="status">
<tr><th scope="row">Pronouns</th><td>he/him</td></tr>
<tr><th scope="row">Studying</th><td>Software engineering, 1st year</td></tr>
</table>

## Things I like

<table class="status">
{% for f in site.data.favorites %}<tr><th scope="row">{{ f.category }}</th><td>{{ f.items | join: ", " }}</td></tr>
{% endfor %}</table>
