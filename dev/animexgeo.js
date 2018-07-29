function mapIt() {

  // Init form fields
  POLY_METADATA.forEach(object => {
    const fieldset = document.getElementById("poly-data");
    const paragraph = document.createElement('p');

    switch (object.type) {
      // text input
      case 'text':
        paragraph.innerHTML = `<strong>${object.label}</strong>: <input type="${object.type}" value="${object.value}" id="poly-${object.htmlId}" style="width:100%;">`;
        break;
        // text area
      case 'textarea':
        paragraph.innerHTML = `<label for="${object.htmlId}">${object.label}</label>:<br/><textarea id="poly-${object.htmlId}" name="${object.htmlId}" rows="3" wrap="hard" style="width:100%;">Freitextfeld</textarea>`;
        break;
        // dropdown selection
      case 'dropdown':
        paragraph.innerHTML = `<strong>${object.label}</strong>: <br/><select id="poly-${object.htmlId}">
        <option value="">--Select an option--</option>
        ${object.value.split(',').map(item => { return `<option value="${item.trim()}">${item.trim()}</option>`}).join('\n')}
        </select>`;
        break;
        // checkbox selection
      case 'checkbox':
        paragraph.innerHTML = `<fieldset>
    <legend>${object.label}</legend>
    ${object.value.split(',').map(item => { return `<div>
        <input type="checkbox" class="poly-${object.htmlId}" id="${item.trim()}" name="${object.htmlId}"
               value="${item.trim()}" />
        <label for="${item.trim()}">${item.trim()}</label>
    </div>`}).join('\n')}
</fieldset>`;
        break;
        // date selection
      case 'date':
        const min = (object.min) ? `min="${object.min}"` : '';
        const max = (object.max) ? `max="${object.max}"` : '';
        paragraph.innerHTML = ` <div>
        <label for="${object.htmlId}">${object.label}</label>
        <input type="date" id="poly-${object.htmlId}"
               value="${object.value}"
               ${min}
               ${max}
               />
    </div>`;
        break;
    }
    fieldset.appendChild(paragraph);
  });

  // Initializes the Leaflet.js map
  const map = L.map('mapid', {
    crs: L.CRS.Simple,
    minZoom: -3,
  });

  const GEObutton = document.getElementById('poly-export')
    .addEventListener("click", (e) => {
      prepareDownload(KONST.polygonExport, 'polygonExport.json');
    });

  const prepareDownload = function(data, filename) {
    const content = JSON.stringify(data)
      .replace(/\[null\]/g, '[[0,0]]');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
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
    polygonExport: []
  };

  const polygon = L.polygon([
      [0, 0]
    ])
    .addTo(map);

  var popup = L.popup();

  map.on('mouseover', e => {
    document.getElementById("mapid")
      .style.cursor = "crosshair";
  });

  let FEATURES;

  const ADDbutton = document.getElementById('poly-add')
    .addEventListener("click", (e) => {
      if (polygon._latlngs[1].length == 0) {
        KONST.polygonArray[1].push(Array(0, 0));
        polygon.setLatLngs(KONST.polygonArray);
      }

      const GEOJSON = polygon.toGeoJSON();

      POLY_METADATA.forEach(object => {
        let value;
        if (object.type == 'checkbox') {
          const valueArray = Array.from(document.getElementsByClassName(`poly-${object.htmlId}`))
            .filter(
              n => {
                return (n.checked);
              }
            )
            .map(n => {
              return n.getAttribute('value');
            });
          value = valueArray;
        } else {
          value = (object['separator']) ? document.getElementById(`poly-${object.htmlId}`)
            .value
            .split(object['separator']) : document.getElementById(`poly-${object.htmlId}`)
            .value;
        }
        console.log(value);
        GEOJSON.properties[object.propertyId] = value;
      });
      console.log(GEOJSON.properties);
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

  const AddImage = document.getElementById('poly-file')
    .addEventListener("change", (e) => {
      let bounds = [
        [0, 0],
        [100, 100]
      ];
      const URL = document.getElementById('poly-file')
        .files[0];
      const reader = new FileReader();

      reader.addEventListener("load", function() {
        image = L.imageOverlay(reader.result, bounds, {
          crossOrigin: true
        });
        image.addTo(map);
      }, false);

      if (URL) {
        reader.readAsDataURL(URL);
      }
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
      polygon.setLatLngs(KONST.polygonArray);
    } else {
      KONST.polygonArray[0].push(Array(lat, lng));
      polygon.setLatLngs(KONST.polygonArray);
    }
  });





  document.getElementById('poly-show')
    .addEventListener("click", (e) => {
      FEATURES = L.geoJSON(KONST.polygonExport, {
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`<div style="width="250px;"><p>Content of GEOJSON Properties: </p><pre><code>${JSON.stringify(feature.properties)}</code></pre></div>`);
        }
      });
      FEATURES.addTo(map);
    });

  document.getElementById('poly-hide')
    .addEventListener("click", (e) => {
      FEATURES.removeFrom(map);
    });
}

function setScript() {
  const script = document.createElement('script');
  script.onload = function() {
    mapIt();
    //
  };
  script.src = "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js";
  script.integrity = "sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==";
  script.setAttribute('crossorigin', '');


  document.head.appendChild(script);
}


const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css');
link.setAttribute('integrity', 'sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==')
link.setAttribute('crossorigin', '');
document.head.appendChild(link);
link.onload = function() {

  const style = document.createElement('style');
  style.innerText = "#mapid{ height: 800px; }"

  document.head.appendChild(style);
  setScript();
  //
};