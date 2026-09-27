---
layout: default
title: about
description: a bit about me
---
<article class="post op" markdown="1">
{% include post-head.html op=true subject="about" %}
<blockquote class="post-body" markdown="1">

i'm **{{ site.author }}**. first-year engineering student, and i make music in my spare time.
i like figuring out how stuff works.

made this site so i'd have a small place online that's mine. i'll add to it when i have time.

</blockquote>
</article>

<article class="post reply">
  {% include post-head.html subject="profile" %}
  <blockquote class="post-body">
    <dl class="spec">
      <dt>name</dt><dd>{{ site.author }}</dd>
      <dt>pronouns</dt><dd>he/him</dd>
      <dt>studying</dt><dd>{{ site.data.uni.degree }}, {{ site.data.uni.year }}</dd>
      <dt>hobbies</dt><dd>making music</dd>
    </dl>
  </blockquote>
</article>

<article class="post reply">
  {% include post-head.html subject="things i like" %}
  <blockquote class="post-body">
    <dl class="spec">
      {% for f in site.data.favorites %}
        <dt>{{ f.category }}</dt><dd>{{ f.items | join: ", " }}</dd>
      {% endfor %}
    </dl>
  </blockquote>
</article>
