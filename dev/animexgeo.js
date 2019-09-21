// TODO: Add feature to filter a/o highlight pins and polygons by specific metadata
// TODO: Add feature to upload config file for properties
// TODO: Add more info and links to helptexts

function mapIt() {

  if (typeof POLY_METADATA === 'undefined') POLY_METADATA = [];

  // Begin addFormField()
  const addFormField = function() {

    const fieldset = document.getElementById("poly-data");
    const paragraph = document.createElement('p');
    const label = document.getElementById('sub-label')
      .value;
    const labelID = label.trim()
      .replace(/[\(\[\]\)]/g, '')
      .replace(/ /g, '_');
    const x_button = `<button type="button" class="btn btn-danger btn-xs removeButton">X</button>`;



    const object = {
      "type": (document.getElementById('sub-type')
          .value) ? document.getElementById('sub-type')
        .value : 'text',
      "value": document.getElementById('sub-value')
        .value,
      "htmlId": `${labelID}`,
      "propertyId": `${labelID}`,
      "label": `${label.trim()}`,
      "separator": (document.getElementById('sub-separator')) ? document.getElementById('sub-separator')
        .value : false,
      "UID": `${labelID}--${Math.random().toString().slice(2)}`,
    };

    paragraph.setAttribute('data-ID', object.UID);

    switch (object.type) {
      // text input
      case 'text':
        paragraph.innerHTML = `<strong>${object.label}</strong> ${(object.separator) ? `(Sep is ${object.separator})` : `` }: ${x_button}<br /><input type="${object.type}" value="${object.value}" id="poly-${object.htmlId}" style="width:100%;">`;
        break;
        // Image url
      case 'image':
        paragraph.innerHTML = `<strong>${object.label}</strong>: ${x_button}<br /><input type="url" placeholder="https://example.com" id="poly-${object.htmlId}" style="width:100%;" pattern="http*://.*" required>`;
        break;
        // text area
      case 'textarea':
        paragraph.innerHTML = `<label for="${object.htmlId}">${object.label}</label>: ${x_button}<br/><textarea id="poly-${object.htmlId}" name="${object.htmlId}" rows="3" wrap="hard" style="width:100%;">Freitextfeld</textarea>`;
        break;
        // urls
        // case 'urls':
        // 	paragraph.innerHTML = `<label for="${object.htmlId}">${object.label}</label>: ${x_button}<br/><textarea id="poly-${object.htmlId}" name="${object.htmlId}" rows="3" wrap="hard" style="width:100%;">One url per line.</textarea>`;
        // 	break;
        // dropdown selection
      case 'dropdown':
        paragraph.innerHTML = `<strong>${object.label}</strong>: ${x_button}<br/><select id="poly-${object.htmlId}">
         <option value="">--Select an option--</option>
         ${object.value.split(',').map(item => { return `<option value="${item.trim()}">${item.trim()}</option>`}).join('\n')}
         </select>`;
        break;
        // checkbox selection
      case 'checkbox':
        paragraph.innerHTML = `
     <strong>${object.label}</strong>: ${x_button}
     ${object.value.split(',').map(item => { return `<div>
         <input type="checkbox" class="poly-${object.htmlId}" id="${item.trim()}" name="${object.htmlId}"
                value="${item.trim()}" />
         <label for="${item.trim()}">${item.trim()}</label>
     </div>`}).join('\n')}`;
        break;
        // date selection
      case 'date':
        const min = (object.min) ? `min="${object.min}"` : '';
        const max = (object.max) ? `max="${object.max}"` : '';
        const dateFrags = object.value.split('.');
        const date = `${(dateFrags[2])? dateFrags[2]:'2000'}-${(dateFrags[1])? dateFrags[1]:'01'}-${(dateFrags[0])? dateFrags[0]:'01'}`;

        paragraph.innerHTML = `
         <label for="${object.htmlId}">${object.label}</label> ${x_button}:
         <input type="date" id="poly-${object.htmlId}"
                value="${date}"
                ${min}
                ${max}
                />`;
        break;
    }
    POLY_METADATA.push(object);

    fieldset.appendChild(paragraph);

    Array.from(document.getElementsByClassName('removeButton'))
      .forEach((n) => {
        n.addEventListener("click", (e) => {
          const UID = e.currentTarget.parentNode.getAttribute('data-ID');
          // filter from list
          POLY_METADATA = POLY_METADATA.filter((item) => {
            return item.UID != UID;
          });
          // delete from DOM
          e.currentTarget.parentNode.remove();
        });
      })
  };
  // End addFormField()

  document.getElementById('poly-form-field-config')
    .addEventListener('click', (e) => {
      console.log(POLY_METADATA);
      prepareDownload(POLY_METADATA, `${document.getElementById("image-info").dataset.filename.replace(/\s/, '_')}.config.json`, 'raw');
    });

  let geometry = 'marker';

  const SwitchGeometry = document.getElementById('poly-data-geometry')
    .addEventListener("change", (e) => {
      console.log(e.target.value);
      geometry = e.target.value;
    });

  const SUBformFieldButton = document.getElementById('sub-formField')
    .addEventListener("click", (e) => {
      addFormField();
    });

  const SelectSubType = document.getElementById('sub-type')
    .addEventListener("change", (e) => {
      const subtype = document.getElementById('sub-type');
      if ((subtype.value == 'text')) {
        const span = document.createElement('span');
        span.setAttribute('id', 'span-sep');
        span.innerHTML = `<button class="btn btn-default btn-xs" id="sub-sep">Separator</button>`;
        e.currentTarget.parentNode.appendChild(span);

        const selectSeparator = document.getElementById('sub-sep');
        selectSeparator.addEventListener("click", (e) => {
          const subtype = document.getElementById('sub-type');
          if ((subtype.value == 'text')) {
            if (document.getElementById('sub-separator')) {
              document.getElementById('sub-separator-label')
                .remove();
            } else {
              document.getElementById('sub-type-separator')
                .innerHTML = `<span id="sub-separator-label"><strong>Separator</strong>: <input type="text" value="," id="sub-separator">
								<span id="separator-help" class="popup">&nbsp;[❔]
									<span class="popuptext" id="separator-help-popup">The string will be split on the given separator char.</span>
								</span>
								</span>`;
              document.getElementById('separator-help')
                .addEventListener("mouseover", (e) => {
                  console.log("X");
                  var popup = document.getElementById("separator-help-popup");
                  popup.classList.toggle("show");
                });
              document.getElementById('separator-help')
                .addEventListener("mouseout", (e) => {
                  console.log("X");
                  var popup = document.getElementById("separator-help-popup");
                  popup.classList.toggle("show");
                });
            }
          }
        });
      } else {
        if (document.getElementById('span-sep')) {
          document.getElementById('span-sep')
            .remove();
        }

        if (document.getElementById('sub-separator')) {
          document.getElementById('sub-separator-label')
            .remove();
        }
      }
    });

  // TODO: Prüfen
  function geometryToString(feature) {
    switch (feature.geometry.type) {
      case 'Polygon':
        const concat = feature.geometry.coordinates[0].map((tuple) => {
            return `(${tuple.join(', ')})`;
          })
          .join(', ');
        return concat;
        break;
      case 'Point':
        return `(${feature.geometry.coordinates.join(', ')})`;
        break;
    }
  }

  const formatPopup = function(feature) {

    const aggr = Object.keys(feature.properties)
      .map((key) => {
        const value = feature.properties[key];
        if (Array.isArray(value)) {
          return `<p style="margin: 10px 0px 0px 0px;"><strong>${key}</strong>:</p> <ul style="padding-left: 15px; margin-bottom: 0px;">${value.map((n) => {return `<li>${n}</li>`;}).join('')}</ul>`;
        } else if (value.includes('\n')) {
          return `<p style="margin: 10px 0px 0px 0px;"><strong>${key}</strong>:</p> ${value.split('\n').map((n) => {return `<p style="margin: 3px 0;">${n}</p>`;}).join('')}`;
        } else {
          return `<p style="margin: 10px 0px 0px 0px;"><strong>${key}</strong>: ${(value.startsWith('http')) ? `<img src="${value}" width="100%x">` : value}</p>`;
        }
      });
    popupText = `<div style="width="250px;">
			${aggr.join('')}
		</div>`;

    return popupText;
  }
  // TODO: rename feature to item
  const formatAnnotationListItem = function(feature) {

    const aggr = Object.keys(feature.properties)
      .map((key) => {
        const value = feature.properties[key];
        if (Array.isArray(value)) {
          return `<p style="margin: 10px 0px 0px 0px;"><strong>${key}</strong>:</p> <ul style="padding-left: 15px; margin-bottom: 0px;">${value.map((n) => {return `<li>${n}</li>`;}).join('')}</ul>`;
        } else if (value.includes('\n')) {
          return `<p style="margin: 10px 0px 0px 0px;"><strong>${key}</strong>:</p> ${value.split('\n').map((n) => {return `<p style="margin: 3px 0;">${n}</p>`;}).join('')}`;
        } else {
          return `<p style="margin: 10px 0px 0px 0px;"><strong>${key}</strong>: ${(value.startsWith('http')) ? `<img src="${value}" width="100%x">` : value}</p>`;
        }
      });
    annotationListItemHTML = `
    <p>Type <em>${feature.geometry.type}</em> at <em>Coordinates</em> ${ geometryToString(feature) }.</p>
			${aggr.join('')}
		<button type="button" data-uid="${feature.properties.uid}" class="btn btn-danger btn-xs removeAnnotationButton">X</button>`;

    return annotationListItemHTML;
  }

  // TODO: refactor
  const SwitchShowHide = document.getElementById('poly-show-hide')
    .addEventListener("change", (e) => {
      if (e.target.value == 'show') {
        // TODO: refactor out into function
        FEATURES = L.geoJSON(KONST.polygonExport, {
          onEachFeature: (feature, layer) => {
            layer.bindPopup(formatPopup(feature));
            layer.options.draggable = true;
            layer.on("mouseover", (e) => {
              const UID = feature.properties.uid;
              document.getElementById(UID)
                .classList.add('focus');
            });
            layer.on("mouseout", (e) => {
              const UID = feature.properties.uid;
              document.getElementById(UID)
                .classList.remove('focus');
            });
            layer.on("dragend", (e) => {
              const Latlng = e.target.getLatLng();
              const lat = Latlng.lat;
              const lng = Latlng.lng;
              KONST.polygonExport.forEach((o) => {
                if (o.properties.uid == feature.properties.uid) {
                  o.geometry.coordinates = Array(lng, lat);
                }
              })
            });
          }
        });
        FEATURES.addTo(map);
      } else {
        FEATURES.removeFrom(map);
      }
    });

  // Klappt Elemente ein und aus
  const subHideShowButtons = document.getElementsByClassName('sub-hide-show');
  Array.from(subHideShowButtons)
    .forEach((element) => {
      element.addEventListener("click", (e) => {
        // change fieldset to surrounding div
        const fieldset = e.target.parentElement.nextElementSibling;
        console.log(fieldset);
        if ((fieldset.getAttribute('class') != 'hide')) {
          fieldset.setAttribute('class', 'hide');
          e.currentTarget.setAttribute('class', 'btn btn-info btn-xs');
          e.currentTarget.innerHTML = '+';
        } else {
          fieldset.setAttribute('class', '');
          e.currentTarget.setAttribute('class', 'btn btn-success btn-xs');
          e.currentTarget.innerHTML = ' - ';
        }
      });
    });

  // Initializes the Leaflet.js map
  const map = L.map('mapid', {
    crs: L.CRS.Simple,
    minZoom: -5,
  });

  const GEObutton = document.getElementById('poly-export')
    .addEventListener("click", (e) => {
      //const data = KONST.polygonExport.forEach();
      prepareDownload(data, `${document.getElementById("image-info").dataset.filename.replace(/\s/, '_')}.geo.json`, 'geojson');
    });

  document.getElementById('poly-export-croppData')
    .addEventListener("click", (e) => {
      const height = document.getElementById("image-info")
        .dataset.height;
      const width = document.getElementById("image-info")
        .dataset.width;
      const filename = document.getElementById("image-info")
        .dataset.filename;
      croppDictionary = {
        image: {
          height: height,
          width: width,
          filename: filename
        },
        croppData: []
      };
      FEATURES.eachLayer((layer) => {
        if (layer.feature.geometry.type == 'Polygon') {
          const bounds = L.latLngBounds(layer.feature.geometry.coordinates[0]);
          const TopLeft = bounds.getSouthEast();
          const BottomLeft = bounds.getSouthWest();
          const TopRight = bounds.getNorthEast();
          const croppData = {
            boundaries: {
              x: TopLeft.lat,
              y: height - TopLeft.lng,
              x_width: TopLeft.lat + (TopRight.lat - TopLeft.lat),
              y_height: (height - TopLeft.lng) + (TopLeft.lng - BottomLeft.lng),
            },
            properties: layer.feature.properties,
          };
          croppDictionary.croppData.push(croppData);
        }
        console.log(croppDictionary);
      });
      prepareDownload(croppDictionary, `${filename.replace(/\s/, '_')}.cropping.json`, 'raw');

    });

  document.getElementById('poly-croppAll')
    .addEventListener('click', (e) => {
      //Cropping

      const height = document.getElementById("image-info")
        .dataset.height;
      const width = document.getElementById("image-info")
        .dataset.width;
      const filename = document.getElementById("image-info")
        .dataset.filename;

      FEATURES.eachLayer((layer) => {
        if (layer.feature.geometry.type == 'Polygon') {
          const bounds = L.latLngBounds(layer.feature.geometry.coordinates[0]);
          console.log(bounds);
          const TopLeft = bounds.getSouthEast();
          const BottomLeft = bounds.getSouthWest();
          const TopRight = bounds.getNorthEast();
          const croppData = {
            boundaries: {
              x: TopLeft.lat,
              y: height - TopLeft.lng,
              x_width: TopRight.lat - TopLeft.lat,
              y_height: TopLeft.lng - BottomLeft.lng,
            },
            properties: layer.feature.properties,
          };
          console.log(croppData);

          var image = map.getPane('overlayPane')
            .getElementsByTagName('img')[0];
          //console.log(image);
          var canvas = document.createElement('canvas');
          canvas.width = croppData.boundaries.x_width;
          canvas.height = croppData.boundaries.y_height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(image,
            croppData.boundaries.x, croppData.boundaries.y,
            croppData.boundaries.x_width, croppData.boundaries.y_height,
            0, 0,
            croppData.boundaries.x_width, croppData.boundaries.y_height);
          document.getElementById('cropp')
            .appendChild(canvas);
          //console.log(canvas.toDataURL("image/png"));

          const element = document.createElement('a');
          element.setAttribute('href', canvas.toDataURL("image/png"));
          element.setAttribute('download', `${croppData.properties.uid}_cropped_from_${filename}.png`);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          canvas.remove();
        }

      });

    });

  const prepareDownload = function(data, filename, type) {
    const imageInfo = document.getElementById("image-info");
    let content;
    if (type == 'geojson') {
      console.log(type);
      content = JSON.stringify({
          "type": "FeatureCollection",
          "description": {
            "filename": imageInfo.dataset.filename,
            "height": imageInfo.dataset.height,
            "width": imageInfo.dataset.width,
            "annotator": document.getElementById('annotator-name')
              .value,
            "date": imageInfo.dataset.date
          },
          "features": data
        })
        .replace(/\[null\]/g, '[[0,0]]');
    } else {
      content = JSON.stringify(data);
    }

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


  var popup = L.popup();

  /* tooltip
    L.polygon([
        [56.3776, 98.563463],
        [101.904443, 97.563453],
        [101.654296, 52.563013],
        [60.129812, 54.31303],
        [56.3776, 98.563463]
      ])
      .addTo(map)
      .bindTooltip('tooltip on the left', {
        sticky: true
      });
  */

  const guideLines = [];

  map.on('mousemove', (e) => {

    if (geometry == 'polygon') {

      if (guideLines.length != 0) {
        guideLines.forEach((line) => {
          //console.log(line);
          line.remove();
        })
      }

      guidelines = [];

      if (KONST.polygonArray[0].length >= 2) {
        const first = KONST.polygonArray[0][0];
        const last = KONST.polygonArray[0][KONST.polygonArray[0].length - 1];
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const line_1 = Array(
          Array(lat, lng), first
        );
        const line_2 = Array(last, Array(lat, lng));
        //console.log(line_1);
        //console.log(line_2);
        const firstLine = L.polyline(line_1, {
            "dashArray": "1 10",
            "weight": 5
          })
          .addTo(map);
        const lastLine = L.polyline(line_2, {
            "dashArray": "1 10",
            "weight": 5
          })
          .addTo(map);
        guideLines.push(firstLine);
        guideLines.push(lastLine);
      }
    }

  });

  map.on('mouseover', (e) => {
    //console.log(e);
    document.getElementById("mapid")
      .style.cursor = "crosshair";
  });

  map.on('dblclick', (e) => {
    document.getElementById('poly-add')
      .click()
  });

  map.on('keydown', (e) => {
    console.log(`Code: ${e.originalEvent.code}, Key: |${e.originalEvent.key}|`);
    switch (e.originalEvent.key) {
      case 'Enter':
        document.getElementById('poly-add')
          .click()
        break;
      case 'Backspace':
        document.getElementById('poly-clear')
          .click()
        break;
      case 'Delete':
        document.getElementById('poly-clear')
          .click()
        break;
      case 'm':
        document.getElementById('marker')
          .click()
        break;
      case 'p':
        document.getElementById('polygon')
          .click()
        break;
    }

  });

  let FEATURES;
  let GEOJSON;

  function clearCurrent() {
    switch (geometry) {
      case 'polygon':
        polygon.setLatLngs([
          [0, 0],
          [0, 0]
        ]);
        polygon.removeFrom(map);
        KONST.polygonArray = [
          [],
          []
        ];
        if (polygonEdgeMarkers.length != 0) {
          polygonEdgeMarkers.forEach((edgeMarker) => {
            edgeMarker.remove();
          })
        }
        break;
      case 'marker':
        marker.setLatLng([0, 0]);
        marker.removeFrom(map);
        break;
    }
  }

  const tempPolygonEdgeMarkers = [];

  function addArrayToMap() {
    if (FEATURES != undefined) {
      FEATURES.removeFrom(map);
    }

    FEATURES = L.geoJSON(KONST.polygonExport, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup(formatPopup(feature));
        layer.options.draggable = true;
        layer.on("mouseover", (e) => {
          const UID = feature.properties.uid;
          document.getElementById(UID)
            .classList.add('focus');
        });
        layer.on("mouseout", (e) => {
          const UID = feature.properties.uid;
          document.getElementById(UID)
            .classList.remove('focus');
        });
        layer.on("dragend", (e) => {
          const Latlng = e.target.getLatLng();
          const lat = Latlng.lat;
          const lng = Latlng.lng;
          KONST.polygonExport.forEach((o) => {
            if (o.properties.uid == feature.properties.uid) {
              o.geometry.coordinates = Array(lng, lat);
            }
          })
        });
        layer.on("contextmenu", (e) => {
          console.log();
          const UID = feature.properties.uid;
          KONST.polygonExport = KONST.polygonExport.filter((item) => {
            return item.properties.uid != UID;
          });
          tempPolygonEdgeMarkers.filter((item) => {
              return item.feature.properties.parentID == UID;
            })
            .forEach((marker) => {
              marker.remove();
            });
          console.log(UID);
          e.target.remove();
          document.getElementById(UID)
            .remove();
        });
        if (feature.geometry.type == 'Polygon') {
          //console.log('Poly');
          //console.log(feature.geometry.coordinates[0]);
          const UID = feature.properties.uid;
          feature.geometry.coordinates[0].forEach((coord, index) => {
            const edgeMarker = L.marker(Array(coord[1], coord[0]), {
              icon: myIcon,
              draggable: true,
            });
            edgeMarker.feature = {
              properties: {
                parentID: UID,
                index: index
              }
            };
            edgeMarker.on('move', (e) => {

              if (guideLines.length != 0) {
                guideLines.forEach((line) => {
                  //console.log(line);
                  line.remove();
                })
              }

              guidelines = [];
              const parentID = e.target.feature.properties.parentID;
              const index = e.target.feature.properties.index;
              console.log(parentID, index);
              const parentPolygon = KONST.polygonExport.filter((item) => {
                return item.properties.uid == parentID;
              })[0];

              if (parentPolygon.geometry.coordinates[0].length >= 2) {
                let before;
                let after;
                if ((index == 0) || (index == (parentPolygon.geometry.coordinates[0].length - 1))) {
                  before = parentPolygon.geometry.coordinates[0][1];
                  after = parentPolygon.geometry.coordinates[0][parentPolygon.geometry.coordinates[0].length - 2];
                } else {
                  before = parentPolygon.geometry.coordinates[0][index - 1];
                  after = parentPolygon.geometry.coordinates[0][index + 1];
                }
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;

                const line_1 = Array(
                  Array(before[1], before[0]), Array(lat, lng)
                );
                const line_2 = Array(
                  Array(after[1], after[0]), Array(lat, lng)
                );
                //console.log(line_1);
                //console.log(line_2);
                const firstLine = L.polyline(line_1, {
                    "dashArray": "1 10",
                    "weight": 5
                  })
                  .addTo(map);

                const lastLine = L.polyline(line_2, {
                    "dashArray": "1 10",
                    "weight": 5
                  })
                  .addTo(map);

                guideLines.push(firstLine);
                guideLines.push(lastLine);
              }


            });
            edgeMarker.on("dragend", (e) => {
              const Latlng = e.target.getLatLng();
              const lat = Latlng.lat;
              const lng = Latlng.lng;
              console.log('____');
              //console.log(`edgeMarker: ${lat}, ${lng}`);
              console.log(e.target.feature.properties);
              const parentID = e.target.feature.properties.parentID;
              const index = e.target.feature.properties.index;

              KONST.polygonExport.forEach((o) => {
                if (o.properties.uid == parentID) {
                  console.log('IN');
                  console.log(o.geometry.coordinates[0]);
                  if ((index == 0) || (index == (o.geometry.coordinates[0].length - 1))) {
                    console.log('in if');
                    console.log(o.geometry.coordinates[0].length - 1);
                    o.geometry.coordinates[0].splice(0, 1, Array(lng, lat));
                    o.geometry.coordinates[0].splice(o.geometry.coordinates[0].length - 1, 1, Array(lng, lat));
                  } else {
                    o.geometry.coordinates[0].splice(index, 1, Array(lng, lat));
                  }
                  console.log('OUT');
                  console.log(o.geometry.coordinates[0]);
                }
              });

              if (tempPolygonEdgeMarkers.length != 0) {
                tempPolygonEdgeMarkers.forEach((edgeMarker) => {
                  edgeMarker.remove();
                })
              }
              addArrayToMap();
              //console.log(x);
              if (guideLines.length != 0) {
                guideLines.forEach((line) => {
                  //console.log(line);
                  line.remove();
                })
              }
            });
            tempPolygonEdgeMarkers.push(edgeMarker);
            edgeMarker.addTo(map);
          });
        }
        //
      }
    });
    FEATURES.addTo(map);
    document.getElementById('show')
      .checked = true;

    clearCurrent();
  };

  const ADDbutton = document.getElementById('poly-add')
    .addEventListener("click", (e) => {
      // TODO: bundle in function
      if (geometry == 'polygon' && polygon._latlngs[1].length == 0) {
        KONST.polygonArray[1].push(Array(0, 0));
        polygon.setLatLngs(KONST.polygonArray);
      }

      switch (geometry) {
        case 'polygon':
          GEOJSON = polygon.toGeoJSON();
          break;
        case 'marker':
          GEOJSON = marker.toGeoJSON();
          break;
      }

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

      GEOJSON.properties['uid'] = `${Math.random().toString().slice(2)}`;
      console.log(GEOJSON.properties);
      KONST.polygonExport.push(GEOJSON);
      console.log(KONST.polygonExport);

      addArrayToMap();

      setDropdown('poly-highlight');

      // TODO: into function
      const ListOfAnnotations = document.getElementById('annotations');
      ListOfAnnotations.innerHTML = '';

      KONST.polygonExport.forEach((item) => {
        const node = document.createElement('LI');
        node.classList.add('annotation');
        node.id = item.properties.uid;
        node.dataset.uid = item.properties.uid;
        node.dataset.type = item.geometry.type;
        const li = ListOfAnnotations.appendChild(node);
        li.innerHTML = formatAnnotationListItem(item);

        Array.from(li.getElementsByClassName('removeAnnotationButton'))
          .forEach(
            (n) => {
              n.addEventListener('click', (e) => {
                FEATURES.removeFrom(map);

                const UID = e.currentTarget.getAttribute('data-uid');

                KONST.polygonExport = KONST.polygonExport.filter((item) => {
                  return item.properties.uid != UID;
                });
                // refactor out these build up function
                FEATURES = L.geoJSON(KONST.polygonExport, {
                  onEachFeature: (feature, layer) => {
                    layer.bindPopup(formatPopup(feature));
                    layer.options.draggable = true;
                    layer.on("mouseover", (e) => {
                      const UID = feature.properties.uid;
                      document.getElementById(UID)
                        .classList.add('focus');
                    });
                    layer.on("mouseout", (e) => {
                      const UID = feature.properties.uid;
                      document.getElementById(UID)
                        .classList.remove('focus');
                    });
                    layer.on("dragend", (e) => {
                      const Latlng = e.target.getLatLng();
                      const lat = Latlng.lat;
                      const lng = Latlng.lng;
                      KONST.polygonExport.forEach((o) => {
                        if (o.properties.uid == feature.properties.uid) {
                          o.geometry.coordinates = Array(lng, lat);
                        }
                      })
                    });
                  }
                });
                FEATURES.addTo(map);
                tempPolygonEdgeMarkers.filter((item) => {
                    return item.feature.properties.parentID == UID;
                  })
                  .forEach((marker) => {
                    marker.remove();
                  });
                e.currentTarget.parentNode.remove();
                setDropdown('poly-highlight');
              });
            }
          );
      });
    });

  const CLEARbutton = document.getElementById('poly-clear')
    .addEventListener("click", (e) => {
      clearCurrent();
    });

  function setDropdown(id) {

    function getKvPairs(featureArray) {

      const listOfKeys = featureArray.reduce((accumulator, currentFeature) => {
        return accumulator.concat(Object.keys(currentFeature.properties)
          .filter((key) => key != 'uid'));
      }, []);

      const keyValuePairs = {};

      // TODO: needs check-up
      listOfKeys.filter((key) => key != 'uid')
        .forEach((key) => {
          keyValuePairs[`${key}`] = Array.from(new Set(featureArray.reduce((accumulator, currentFeature) => {
              return accumulator.concat(currentFeature.properties[`${key}`]);
            }, [])
            .filter(item => item)));
        });

      return {
        "pairs": keyValuePairs,
        "keys": Object.keys(keyValuePairs)
      };
    }

    const keyValuePairs = getKvPairs(KONST.polygonExport);

    console.log(keyValuePairs);

    const html = keyValuePairs.keys
      .map((key) => {
        return `<li>
        <input type="checkbox" class="poly-highlight-checkbox" id="poly-highlight-${key}-checkbox" name="${key}" value="${key}" />
        <label for="${key}">${key}</label>
        <select id="poly-highlight-${key}-dropdown" data-key="${key}" class="poly-highlight-dropdown">
        <option value="">--Select an option--</option>
        ${keyValuePairs.pairs[`${key}`].map(item => { return `<option value="${item}">${item}</option>`}).join('\n')}
       </select>
      </li>`
      })
      .join('');

    const polyHightlightSelect = document.getElementById(id);
    polyHightlightSelect.innerHTML = html;

    let checkboxes = Array.from(document.getElementsByClassName('poly-highlight-checkbox'));
    let dropdowns = Array.from(document.getElementsByClassName('poly-highlight-dropdown'));

    checkboxes.forEach((item) => {
      item.addEventListener('change', (e) => {
        filterAndDisplay(e)
      });
    });
    dropdowns.forEach((item) => {
      item.addEventListener('change', (e) => {
        filterAndDisplay(e)
      });
    });

  }

  function resetHighlights() {
    FEATURES.eachLayer((layer) => {
      if (layer.feature.geometry.type == 'Polygon') {
        layer.setStyle({
          "color": "#3388ff",
          "fillColor": "#3388ff",
        });
      }
    });
  }

  function setHighlights(kvs) {
    FEATURES.eachLayer((layer) => {

      function checkIfAllTrue(truthvalue) {
        return truthvalue == true;
      }

      const truthvalues = kvs.map((kvpair) => {
        key = kvpair.key;
        value = kvpair.value;

        let values = (typeof layer.feature.properties[key] == 'string') ? Array(layer.feature.properties[key]) : layer.feature.properties[key];
        if (typeof values === 'undefined') {
          values = [];
        }
        console.log(`${values} ? ${value}`);
        return values.includes(value);
      })


      if (truthvalues.every(checkIfAllTrue)) {
        if (layer.feature.geometry.type == 'Polygon') {
          layer.setStyle({
            "color": "#ff8383",
            "fillColor": "#ff8383",
          });
        }
      }
    });
  }

  function filterAndDisplay(e) {
    console.log(e);
    switch (e.target.type) {
      case 'checkbox':
        console.log(`Checkbox ${e.target.checked}`);
        if (e.target.checked == false) {
          console.log('Now false…');
          resetHighlights();
          const x = document.getElementById(`poly-highlight-${e.target.value}-dropdown`);
          //console.log(x);
          x.selectedIndex = 0;

          let dropdowns = Array.from(document.getElementsByClassName('poly-highlight-dropdown'));
          let kvs = dropdowns.map((i) => {
              //console.log(`Key: ${i.dataset.key} Value: ${i.value}`);
              return {
                key: i.dataset.key,
                value: i.value
              };
            })
            .filter((i) => {
              return i.value != '';
            });
          console.log(kvs);

          setHighlights(kvs);
        }
        if (e.target.checked == true) {
          FEATURES.eachLayer((layer) => {
            if (Object.keys(layer.feature.properties)
              .includes(e.target.value)) {
              if (layer.feature.geometry.type == 'Polygon') {
                layer.setStyle({
                  "color": "#ff8383",
                  "fillColor": "#ff8383",
                });
              }
            }
          });
        }
        const x = document.getElementById(`poly-highlight-${e.target.value}-dropdown`);
        //console.log(x);
        x.selectedIndex = 0;
        break;
      case 'select-one':
        //console.log(`Dropdown ${e.target.value}`);
        //console.log(e.target.parentElement.firstElementChild);
        switch (e.target.parentElement.firstElementChild.checked.toString()) {
          case 'true':
            //console.log(`Parent checkbox already checked.`);
            break;
          case 'false':
            //console.log(`Parent checkbox now checked.`);
            e.target.parentElement.firstElementChild.checked = true;
            break;
        }
        resetHighlights();

        let dropdowns = Array.from(document.getElementsByClassName('poly-highlight-dropdown'));
        let kvs = dropdowns.map((i) => {
            //console.log(`Key: ${i.dataset.key} Value: ${i.value}`);
            return {
              key: i.dataset.key,
              value: i.value
            };
          })
          .filter((i) => {
            return i.value != '';
          });
        console.log(kvs);

        setHighlights(kvs);
        break;
    }

  }

  const geojsonFileUpload = document.getElementById('poly-file-geojson');
  geojsonFileUpload.addEventListener("change", (e) => {
    const URL = e.target.files[0];
    const reader = new FileReader();

    if (URL) {
      reader.readAsText(URL);
    }

    reader.addEventListener("load", (e) => {
      //console.log(reader.result);
      const geoJSON = JSON.parse(reader.result);
      console.log(geoJSON);
    }, false);
  });

  let image;

  const AddImage = document.getElementById('poly-file')
    .addEventListener("change", (e) => {
      let bounds = [
        [0, 0],
        [100, 100]
      ];
      const URL = document.getElementById('poly-file')
        .files[0];

      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        image = L.imageOverlay(reader.result, bounds, {
          crossOrigin: true
        });

        bounds = bounds;

        image.addEventListener("load", (e) => {
          console.log(URL);
          console.log(`The images natural bounds are:\n\tHeight:\t${image._image.naturalHeight} pixel\n\tWidth:\t${image._image.naturalWidth} pixel`);
          bounds = [
            [0, 0],
            [image._image.naturalHeight, image._image.naturalWidth]
          ];
          image.setBounds(bounds);
          map.fitBounds(bounds);
          const date = new Date();
          const imageInfo = document.getElementById("image-info");
          imageInfo.innerHTML = `<div style="border-left: 5px solid lightgrey; padding-left:2em;">
														<p><strong>Filename</strong>: ${URL.name}</p>
														<p><strong>Height</strong>: ${image._image.naturalHeight} pixels</p>
														<p><strong>Width</strong>: ${image._image.naturalWidth} pixels</p>
                            <p><strong>Annotator</strong>: <input type="text" name="annotator-name" id="annotator-name" value="${ ['John Doe', 'Jane Doe', 'Jo Doe'][~~(Math.random() * 3)] }"></p>
														<p><strong>Date</strong>: ${date.toLocaleDateString("de-DE")}</p>
													</div>`;
          imageInfo.dataset.filename = URL.name;
          imageInfo.dataset.height = image._image.naturalHeight;
          imageInfo.dataset.width = image._image.naturalWidth;
          imageInfo.dataset.annotator = document.getElementById('annotator-name')
            .value;
          imageInfo.dataset.date = date.toLocaleDateString("de-DE");
        })
        image.addTo(map);
      }, false);

      if (URL) {
        reader.readAsDataURL(URL);
      }
      map.fitBounds(bounds);
    });

  const polygon = L.polygon([
    [0, 0]
  ]);

  const marker = L.marker(
    [0, 0]
  );

  const polygonEdgeMarkers = [];
  var myIcon = L.icon({
    iconUrl: '../data/icons/polygon_edge_icon.png',
    iconSize: [10, 10],
  });

  map.on('click', e => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const coord = `${lat},${lng}`;
    const outline = [];
    const holes = [];
    //console.log(e.originalEvent);

    switch (geometry) {
      case 'polygon':
        polygon.addTo(map);
        if (e.originalEvent.shiftKey) {
          KONST.polygonArray[1].push(Array(lat, lng));
          polygon.setLatLngs(KONST.polygonArray);
        } else {
          KONST.polygonArray[0].push(Array(lat, lng));
          polygon.setLatLngs(KONST.polygonArray);
        }
        // TODO: add erasing of edgeMarker markers; add feature ids to polygonEdgeMarkers

        KONST.polygonArray[0].forEach((coord) => {
          const edgeMarker = L.marker(coord, {
            icon: myIcon,
            draggable: true,
          });
          edgeMarker.on("dragend", (e) => {
            const Latlng = e.target.getLatLng();
            const lat = Latlng.lat;
            const lng = Latlng.lng;
            console.log(`edgeMarker: ${lat}, ${lng}`);
          });
          polygonEdgeMarkers.push(edgeMarker);
          edgeMarker.addTo(map);
        });

        break;
      case 'marker':
        marker.addTo(map);
        marker.setLatLng(Array(lat, lng));
        break;
    }
  });
  // End Mapit()
}

// TODO: Needs refactoring
function setScript() {
  const script = document.createElement('script');
  script.onload = function() {
    mapIt();
    //
  };
  //1.3.1
  script.src = "https://unpkg.com/leaflet@1.5.0/dist/leaflet.js";
  //script.integrity = "sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==";
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

  // Set helptexts
  // <span style="background: black; color: white; border: 1px solid black; border-radius: 25px;">?</span>

  function setHelpTexts(array) {
    array.forEach(
      (object) => {
        const span = document.createElement("SPAN");
        span.innerHTML = `
				<span id="${object.name}-help" class="popup"> &nbsp;[❔]
					<span class="popuptext" id="${object.name}-help-popup">${object.helptext.split(/\r?\n/).join('<br>')}</span>
				</span>`;
        document.getElementById(`${object.name}`)
          .appendChild(span);
        document.getElementById(`${object.name}-help`)
          .addEventListener("mouseover", (e) => {
            //console.log(e);
            var popup = document.getElementById(`${object.name}-help-popup`);
            popup.classList.toggle("show");
          });
        document.getElementById(`${object.name}-help`)
          .addEventListener("mouseout", (e) => {
            //console.log(e);
            var popup = document.getElementById(`${object.name}-help-popup`);
            popup.classList.toggle("show");
          });
      }
    )
  }
  // import-formFieldConfig
  setHelpTexts([{
      "name": "import-image",
      "helptext": `You may upload a JPG- or PNG-file through a file dialogue.
								 The image will appear in the greay area on the left.`
    },
    {
      "name": "import-form-field-config",
      "helptext": `You may upload a JSON-file whose contents will be used to build form fields to annotate your geometries.`
    },
    {
      "name": "form-field-builder",
      "helptext": `This form field builder lets you build your own form fields used to annotate the geometries with metadata.`
    },
    {
      "name": "poly-data-legend",
      "helptext": `The annotation form fields you’ve built through the form field builder above show up here.`
    },
    {
      "name": "highlight-help",
      "helptext": `In this section you may filter your geometries based on your annotations.`
    },
    {
      "name": "clear-export-help",
      "helptext": `Using these two buttons you may either clear the active geometry you’re currently drawing or downlaod your current annotations as a GeoJSON-file.`
    },
    {
      "name": "import-geojson",
      "helptext": `You may upload a GeoJSON file whose geometries will subsequently be plotted onto your image. The JSON files must be of <code>"type": "FeatureCollection"</code> and contain <code>"features": []</code>. This array lists all your geometries and their respective metadata. E.g.: <pre><code>{
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "Location": "Oslo",
            "GeoNames": "3143244"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                674,
                235
            ]
        }
    }]
}</code></pre>`
    },
    {
      "name": "annotations-help",
      "helptext": `The metadata of your annotations will show up here. You may delete annotations by clicking on the [x]-Button. When you hover on one of the map’s geometries, the corresponding annotation in this list will be highlighted.`
    }
  ]);

};