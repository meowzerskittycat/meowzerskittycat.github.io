---
title: "Markdown reference"
description: "A reference post covering every Markdown feature the site supports."
---

This post demonstrates the Markdown features supported by the site, using placeholder text. Each
section covers one feature. The source file, `_posts/2026-09-27-lorem-ipsum.md`, can be used as a
reference when writing new posts.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat.

## Text formatting

Duis aute irure dolor in **reprehenderit** in voluptate velit esse *cillum dolore* eu fugiat nulla
pariatur. Excepteur sint ***occaecat cupidatat*** non proident, ~~sunt in culpa~~ qui officia deserunt
mollit anim id est laborum. Inline code is written as `git status`, and keyboard keys as
<kbd>Ctrl</kbd> + <kbd>S</kbd>.

A backslash at the end of a line\
forces a line break within the same paragraph.

## Links

Curabitur pretium tincidunt lacus: [an external link](https://suckless.org),
[a link to another page on this site]({{ '/about/' | relative_url }}), and a bare URL,
<https://example.com>.

## Headings

### Third-level heading

Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.

#### Fourth-level heading

Est eros bibendum elit, nec luctus magna felis sollicitudin mauris.

## Lists

Unordered list with nesting:

- Integer in mauris eu nibh euismod gravida.
- Duis ac tellus et risus vulputate vehicula.
  - Donec lobortis risus a elit.
  - Etiam tempor.
- Ut ullamcorper, ligula eu tempor congue.

Ordered list:

1. Morbi in sem quis dui placerat ornare.
2. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.
3. Sed arcu. Cras consequat.

Task list:

- [x] Praesent dapibus, neque id cursus faucibus
- [ ] Tortor neque egestas augue
- [ ] Eu vulputate magna eros eu erat

## Quotes

> Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.
>
> > Phasellus ultrices nulla quis nibh. Quisque a lectus.

## Code

Fenced code block with a language specified:

```c
#include <stdio.h>

/* lorem ipsum, but in C */
int main(void)
{
	for (int i = 0; i < 3; i++)
		printf("lorem ipsum %d\n", i);
	return 0;
}
```

Fenced code block without a language:

```
$ make
cc -o lorem lorem.c
```

## Tables

| Version | Time (ms) | Notes                  |
|:--------|----------:|:----------------------:|
| v0.1    | 412       | Lorem ipsum            |
| v0.2    | 97        | Dolor sit amet         |
| v0.3    | 31        | Consectetur adipiscing |

## Images

Images are stored in `assets/img/posts/<post-name>/`:

![A simple block diagram with three boxes labelled Lorem, Ipsum and Dolor]({{ '/assets/img/posts/lorem-ipsum/diagram.svg' | relative_url }})

## Definition lists

Lorem
: Placeholder text used since the 1500s.

Ipsum
: The second word of the placeholder text.

## Footnotes

Fusce convallis metus id felis luctus adipiscing.[^1] Pellentesque egestas, neque sit amet convallis
pulvinar, justo nulla eleifend augue.[^2]

[^1]: Footnotes are listed at the end of the post.
[^2]: Footnotes are numbered automatically.

## Horizontal rule

A horizontal rule is written as three dashes on a separate line:

---

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
