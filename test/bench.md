# Markdown bench file

This file exists to test the Unmarked engine. A round trip marked->unmarked->marked should yield the exact same HTML.

## Subheadings

### Subheading 2

#### Subheading 3

##### Subheading 4

###### Subheading 5

####### Subheading 6

Now, let's test _italics_ and **bold** and **_both_**. We also have _this_ and `code`. Next up, [links](https://google.com) and ![Images](https://img.shields.io/badge/test-badge-blue). But, \`this is not code \`.

# Lists

1. This
2. is
3. a
4. ordered
5. list

---

-   This
-   is
-   an
-   unordered
-   list

---

-   This
    -   List
        -   Is
        -   Nested

---

-   [ ] This
-   [ ] List
-   [ ] Supports
-   [x] Tasks

# Tables

| Header 1  | Header 2  |
| :-------- | --------- |
| Content 1 | Content 2 |
| Content 1 | Content 2 |
| Content 1 | Content 2 |

# Code blocks

One

```
    unspecified::language();
```

after another

```java
    // Guess the language
    public class HelloWorldTextProviderFactory {
    }
```
