---
title: "Lorem ipsum: a Markdown test post"
description: "Placeholder text that shows everything a post can do. Open the source file to see how each part is written."
---

This is a test post. It's filled with placeholder text, but every section shows one Markdown
feature, so it doubles as a reference. The source is `_posts/2026-09-27-lorem-ipsum.md`.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat.

## Text formatting

Duis aute irure dolor in **reprehenderit** in voluptate velit esse *cillum dolore* eu fugiat nulla
pariatur. Excepteur sint ***occaecat cupidatat*** non proident, ~~sunt in culpa~~ qui officia deserunt
mollit anim id est laborum. Inline code looks like `git status`, and keys like
<kbd>Ctrl</kbd> + <kbd>S</kbd>.

A line can end with a backslash\
to force a line break without starting a new paragraph.

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

Unordered, with nesting:

- Integer in mauris eu nibh euismod gravida.
- Duis ac tellus et risus vulputate vehicula.
  - Donec lobortis risus a elit.
  - Etiam tempor.
- Ut ullamcorper, ligula eu tempor congue.

Ordered:

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

A fenced code block with a language name:

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

And one without:

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

Images go in `assets/img/posts/<post-name>/`:

![A simple block diagram with three boxes labelled Lorem, Ipsum and Dolor]({{ '/assets/img/posts/lorem-ipsum/diagram.svg' | relative_url }})

## Definition lists

Lorem
: Placeholder text used since the 1500s.

Ipsum
: The second word of it.

## Footnotes

Fusce convallis metus id felis luctus adipiscing.[^1] Pellentesque egestas, neque sit amet convallis
pulvinar, justo nulla eleifend augue.[^2]

[^1]: This is a footnote. It shows up at the bottom of the post.
[^2]: Footnotes are numbered automatically.

## Horizontal rule

Three dashes on their own line:

---

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
