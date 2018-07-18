function mapIt() {

  // Init form fields

  POLY_METADATA.forEach(object => {
    const fieldset = document.getElementById("poly-data");
    const paragraph = document.createElement('p');

    switch (object.type) {
      case 'text':
        paragraph.innerHTML = `<strong>${object.label}</strong>: <input type="${object.type}" value="${object.value}" id="poly-${object.htmlId}" style="width:100%;">`;
        break;
      case 'textarea':
        paragraph.innerHTML = `<label for="${object.htmlId}">${object.label}</label>:<br/><textarea id="poly-${object.htmlId}" name="${object.htmlId}" rows="3" wrap="hard" style="width:100%;">Freitextfeld</textarea>`;
        break;
    }
    fieldset.appendChild(paragraph);
  }); //<textarea id="advanced" name="advanced" rows="3" cols="33" maxlength="200" wrap="hard">

  const fieldset = document.getElementById("poly-data-button");
  const paragraph = document.createElement('p');
  paragraph.innerHTML = `<button id="poly-add" style="font-size: 24px; height: 150px;" class="btn btn-lg btn-primary">Add Polygon</button>`;
  fieldset.appendChild(paragraph);
  //<button id="poly-add">Add Polygon</button>

  // Init map

  const map = L.map('mapid', {
    crs: L.CRS.Simple,
    minZoom: -3,
  });




  // STUFF

  const GEObutton = document.getElementById('poly-export')
    .addEventListener("click", (e) => {
      prepareDownload(KONST.polygonExport, 'polygonExport.json');

    });

  const prepareDownload = function(data, filename) {
    const text = JSON.stringify(data);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const KONST = {
    polygonArray: [
      [],
      []
    ],
    polygonString: "",
    polygonExport: []
  }

  const polygon = L.polygon([
      [0, 0]
    ])
    .addTo(map);

  var popup = L.popup();

  map.on('mouseover', e => {
    document.getElementById("mapid")
      .style.cursor = "crosshair";
  });

  const ADDbutton = document.getElementById('poly-add')
    .addEventListener("click", (e) => {
      const GEOJSON = polygon.toGeoJSON();

      POLY_METADATA.forEach(object => {
        const value = (object['separator']) ? document.getElementById(`poly-${object.htmlId}`)
          .value
          .split(object['separator']) : document.getElementById(`poly-${object.htmlId}`)
          .value;
        console.log(value);
        GEOJSON.properties[object.propertyId] = value;
      });

      console.log(GEOJSON.properties);
      // const NAME = document.getElementById('poly-name')
      //   .value;
      // const CATS = document.getElementById('poly-cats')
      //   .value.split(',');
      // const STROKES = document.getElementById('poly-strokes')
      //   .value;
      // GEOJSON['properties'] = {
      //   "name": NAME,
      //   "cats": CATS,
      //   "strokes": STROKES
      // }

      KONST.polygonExport.push(GEOJSON);
      console.log(KONST.polygonExport);
    });

  const CLEARbutton = document.getElementById('poly-clear')
    .addEventListener("click", (e) => {
      polygon.setLatLngs([
        [0, 0],
        [0, 0]
      ]);
      KONST.polygonArray = [
        [],
        []
      ];
    });

  let image = "";

  const AddImage = document.getElementById('poly-addimage')
    .addEventListener("click", (e) => {
      let bounds = [
        [0, 0],
        [100, 100]
      ];
      const URL = document.getElementById('poly-file')
        .files[0];
      //.value;
      var reader = new FileReader();

      reader.addEventListener("load", function() {
        image = L.imageOverlay(reader.result, bounds, {
          crossOrigin: true
        });
        image.addTo(map);
      }, false);

      if (URL) {
        reader.readAsDataURL(URL);
      }



      // Old image loader with path input:
      //console.log(URL);
      // image = L.imageOverlay(URL, bounds, {
      //   crossOrigin: true
      // });
      // image.addTo(map);

      map.fitBounds(bounds);
      map.setZoom(-2);
    });




  const Overlay = document.getElementById('poly-overlay')
    .addEventListener("click", (e) => {
      console.log(`${image._image.naturalHeight}  ${image._image.naturalWidth}`);
      bounds = [
        [0, 0],
        [image._image.naturalHeight, image._image.naturalWidth]
      ];

      image.setBounds(bounds);
      map.fitBounds(bounds);
    });

  map.on('click', e => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const coord = `${lat},${lng}`;
    const outline = [];
    const holes = [];
    console.log(e.originalEvent);




    if (e.originalEvent.shiftKey) {
      KONST.polygonArray[1].push(Array(lat, lng));
      //console.log(KONST.polygonArray);
      //console.log('_____');
      polygon.setLatLngs(KONST.polygonArray);
    } else {
      KONST.polygonArray[0].push(Array(lat, lng));
      //console.log(KONST.polygonArray);
      //console.log('_____');
      polygon.setLatLngs(KONST.polygonArray);
    }
  });

}

function setScript() {
  const script = document.createElement('script');
  script.onload = function() {
    //do stuff with the script
    mapIt();
    //
  };
  script.src = "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js";
  script.integrity = "sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==";
  script.setAttribute('crossorigin', '');


  document.head.appendChild(script); //or something of the likes
}


const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css');
link.setAttribute('integrity', 'sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==')
link.setAttribute('crossorigin', '');
document.head.appendChild(link); //or something of the likes
link.onload = function() {

  const style = document.createElement('style');
  style.innerText = "#mapid{ height: 700px; }"

  document.head.appendChild(style); //or something of the likes
  //do stuff with the script
  setScript();
  //
};