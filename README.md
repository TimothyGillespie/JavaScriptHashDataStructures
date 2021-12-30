# Typescript Library Template
Use the button on the top right (Use this template) to make your own package with this template. This template is licensed under Unlicense. The License is given in the README to avoid accidentally license the template users work.

| :warning: WARNING          |
|:----------------------------------------------------------------------|
| This template automatically runs test and publishes npm packages.     |

## Customize the package.json
Change the values in the package.json. Especially those with values enclose in <>, namely:

- name
- description
- keywords
- author
- license

For more info on the config values see https://docs.npmjs.com/cli/v6/configuring-npm/package-json

## Add a LICENSE file
Add a file called LICENSE to the project root (same folder as the package.json).
A license is optional, but they make it possible to share your library more easily under legal aspects.

Read more on the issues of not licensing your software here: https://choosealicense.com/no-permission/

The same site can give you an overview of different licenses as well: https://choosealicense.com/

To add your LICENSE file more easily click in Github in your repository "Add file". Set the file name as LICENSE you
should then see a button to the right saying "Choose a license template".

## Install dependencies
As usual with `npm install` in the project root.

## Create your library
Start hacking away at your library. A few template examples are presented to give an idea how you can do it. Feel free 
to deviate though.

You can run tests and get coverage with `npm test`. You can reformat your code with `npm run format`. For a better 
developer experience you may want to look into IDE support for prettier and jest.

Feel free to change any settings (i.e. test settings) to fit your needs and taste.

## Publish you library
Add a secret to your github repository called `NPM_PUBLISH_TOKEN`. It should contain your npmjs.com Access Token.
It should be of type `Automation`. When you create a tag with a version pattern it will trigger an automatic publish.

The current version is set to 0.0.0 on purpose, in order to get an appropriate version number with the `npm version` 
command right away. You can publish a major, minor and patch version as follows:

`npm version major` -> 1.0.0 on first run

`npm version minor` -> 0.1.0 on first run

`npm version patch` -> 0.0.1 on first run

The `npm version` command is configured to also push to Github and tag the push commit with the new version as a tag.
This will trigger the Github action and thus test, lint and publish your package.

On every push there will also be test triggered automatically.

## Change the README
This README will not fit your project. Describe your project here instead.

## Question and Improvements
If you have any improvements or question please leave them as an issue in this repository

## License
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>

