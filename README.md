# animexgeo


## Annotate Images and export GeoJSON
The script allows you
* to load images (jpg or png) into an Leaflet.js canvas area via file dialog
* to annotate areas with polygons (more options coming, see To Do below)
  * the polygon may contain one hole, which can be annotated by holding the shift key while clicking
* to provide a configuration file, which will render as a series of form fields, which give you the opportunity to input various forms of metadata associated with the currently active polygon
* export the polygons and their corresponding metadata as a geojson file (the metadata are saved as `geojson.properties`).

## Usage

On a local machine:
* Start a local server, e.g. via `python -m SimpleHTTPServer`, and load your HTML file.

Then:
* Load a file via the file dialog and click ‘Set overlay’ to adjust the image size to the canvas.
* Click on the loaded image to annotate the polygon.
* Fill in the form fields to provide metadata.
* Click ‘Add polygon’ to add the polygon and its metadata to the underlying array of GeoJSON objects.
* Click ‘Clear Active’ to erase the currently active polygon from the canvas.
* Repeat the above.
* Click ‘Export JSON’ to retrieve the array of GeoJSON objects.

A live example may be found [here](https://hou2zi0.github.io/animexgeo/HTML/animexgeo.html).

### Configuration file

The example configuration provided in the live example is based on the following list of JSON objects. The script currently works with the following types of input:
* text
  * may take a property `"separator"` whose value `','` gives the separator on which the text will be exploded into an array
* textarea
* dropdown
  * the property `value` expects a comma separated list providing the selectable items, e.g. `"value": "cat, dog, bunny"`
* checkbox
  * the property `value` expects a comma separated list providing the selectable items, e.g. `"value": "cat, dog, bunny"`
* date
  * you may provide the optional properties `min` and `max`

Example config:

```javascript
const POLY_METADATA = [{
    "type": "text",
    "value": "Name",
    "htmlId": "name",
    "propertyId": "namestring",
    "label": "Name oder ID"
  },
  {
    "type": "text",
    "value": "Katalognummern",
    "htmlId": "cats",
    "propertyId": "cataloguenumber",
    "label": "Katalognummern (kommasepariert)",
    "separator": ","
  },
  {
    "type": "textarea",
    "value": "Kommentar",
    "htmlId": "comment",
    "propertyId": "commentary",
    "label": "Kommentar"
  },
  {
    "type": "dropdown",
    "value": "Value 1, Value 2, Value 3",
    "htmlId": "select",
    "propertyId": "selection",
    "label": "Selektion"
  },
  {
    "type": "checkbox",
    "value": "Value 1, Value 2, Value 3",
    "htmlId": "check",
    "propertyId": "checked",
    "label": "Checkbox"
  },
  {
    "type": "date",
    "value": "1500-01-01",
    "htmlId": "date-begin",
    "propertyId": "post quem",
    "label": "Datierung (Anfang)",
    "min": "0500-01-01", // optional
    "max": "1675-12-31" // optional
  }
]
```

# To Do

* Provide point and multi polygon annotation.
* Allow adjustment of polygon edges via mouse click and drag.
* Bundle into Electron application.
* Bundle into Atom plugin.

# License

The software is published under the terms of the MIT license.

Copyright 2018 Max Grüntgens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
