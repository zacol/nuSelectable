# nuSelectable
Lightweight alternative to jQueryUI Selectable. Inspired by Google Drive file select. 
Initially created by [Alex Suyun](https://github.com/avxto/nuSelectable) as a jQuery plugin, 
rewrited and developed by Jacek Spławski.

# Code example
``` typescript
    new NuSelectable('.container', {
        items: '.box',
        selectionClass: 'nu-selection-box',
        selectedClass: 'nu-selected',
        autoRefresh: true,
    });
```

# Differences from Alex Suyun version
* Convert a JavaScript to TypeScript (easy to use with Angular)
* No jQuery, jQueryUI or other dependencies
* Support touch devices

# Troubleshooting
* [Property 'entries' does not exist on type 'ObjectConstructor'](https://stackoverflow.com/questions/45422573/property-entries-does-not-exist-on-type-objectconstructor)

# License
The MIT License (MIT)

Copyright (c) 2017 Jacek Spławski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
