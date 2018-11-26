![Chroma](https://raw.githubusercontent.com/conlanpatrek/chroma/master/gh/chroma.png)

Chroma is a JavaScript library for creating and manipulating color data.

## Installation
Install Chroma into your project with npm:

```
npm install @conlan/chroma
```

## Examples & Usage
Chroma's main export is the Color class.

```
import { Color } from '@conlan/chroma'

const red = new Color(0xff0000)

console.log(red.RGB()) // Writes { r: 255, g: 0, b: 0 }
```

There are currently seven color modes supported interchangeably.
* RGB `new Color({r: 255, g: 0, b: 0 })`
* CMYK `new Color({c: 0, m: 1, y: 1, k: 0})`
* HSL `new Color({h: 0, s: 1, l: 0.5})`
* HSV `new Color({h: 0, s: 1, v: 1})`
* Hex `new Color('#FF0000')`
* Numeric `new Color(0xFF0000)`
* Bits `new Color([true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])`

Each one of these modes includes a getter/setter.
```
const color = new Color(0xff0000)

// getters
color.rgb() // {r: 255, g: 0, b: 0 }
color.Numeric() // 16711680
color.Hex() // '#ff0000'
color.CMYK() // {c: 0, m: 1, y: 1, k: 0}

// setters
// Rather than mutating the color, these return a new instance.
const green = color.rgb({r: 0, g: 255, b: 0})
const cyan = color.cmyk({c: 1, m: 0, y: 0, k: 0})
const black = color.hsl({h: 1, s: 0.4, l: 0})
```
