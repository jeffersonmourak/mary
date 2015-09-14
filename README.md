# Mary

## What's Mary ?
Mary is a static HTML file output from a markdown file

## How this works ?
In the ```articles``` directory you will create yours articles, in a markdown file.
before this, just run ```node mary.js``` and your HTML will be generated in ```output``` directory

### Is Just write a markdown file ?
yes, but you will need write a header.

WTF?, Keep Calm and Keep Coding...

The header is a JSON text, after your text...
look this example...

```
	{
		"title" : "The title of post",
		"author" : "Author of post"
	}
	------HEADER----- //The end of the header

	#Hello World //the begin of your text

```
###Why i need write this header ?
The header is the information of this article, is necessary to Mary identify, the informations on theme

##Theme
if you don't like out default theme, vou can create yours...
in the theme directory, you will need have this structure

###Structure

theme/
├── assets/
│   ├── style.cc
│	└── ...
│
├── article.html  <---- is the template from content of a single article
├── articles.html <---- is the template from the list of articles who will appear in index
├── index.html    <---- is the template from the index page.
└── infos.json    <---- is the informations of blog who will appear in index

###HTML Data
to show a information added in article, or in infos.json, you will use
``` {{variableName}} ```
this variable in the keys of JSON's, in infos.json or in the header
look this example

```
	{
		"title" : "The title of post",
		"author" : "Author of post"
	}
	------HEADER-----

	#Hello World

```
if i wanna show the title of post.

```
...

<h1> {{title}} </h1>

...

```

and this will be outputed like this

```
...

<h1> The title of post </h1>

...

```

### Somethings that you need attention
some names are privates from the Mary,

this names are
- articles
- content

#### What does that mean ?
mean that if you use this names in header or in infos.json, your text could be rewrited from a system informario..

look this example

```
	//IN THE MARKDOWN FILE
	{
		"title" : "The title of post",
		"author" : "Author of post",
		"content" : "YEAH!"
	}
	------HEADER-----

	#Hello World

```

```
	//IN THE THEME
	
	...

	<p>
		{{content}}
	</p>
	...

```

```
	//IN THE OUTPUT
	
	...

	<p>
		<h1>Hello World</h1>
	</p>
	...

```