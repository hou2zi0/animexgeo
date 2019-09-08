function mapIt() {

	if (typeof POLY_METADATA === 'undefined') POLY_METADATA = [];

	// Begin addFormField()
	const addFormField = function () {

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


	const formatPopup = function (feature) {

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

	const formatAnnotationListItem = function (feature) {

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
			${aggr.join('')}
		<button type="button" data-uid="${feature.properties.uid}" class="btn btn-danger btn-xs removeAnnotationButton">X</button>`;

		return annotationListItemHTML;
	}

	const SwitchShowHide = document.getElementById('poly-show-hide')
		.addEventListener("change", (e) => {
			if (e.target.value == 'show') {
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

	const hideShowButton = document.getElementById('sub-hide-show')
		.addEventListener("click", (e) => {
			const fieldset = document.getElementById('sub-fieldset');
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

	// Initializes the Leaflet.js map
	const map = L.map('mapid', {
		crs: L.CRS.Simple,
		minZoom: -5,
	});

	const GEObutton = document.getElementById('poly-export')
		.addEventListener("click", (e) => {
			prepareDownload(KONST.polygonExport, 'polygonExport.json');
		});

	const prepareDownload = function (data, filename) {
		const imageInfo = document.getElementById("image-info");
		const content = JSON.stringify({
				"type": "FeatureCollection",
				"description": {
					"filename": imageInfo.dataset.filename,
					"height": imageInfo.dataset.height,
					"width": imageInfo.dataset.width,
					"Date": imageInfo.dataset.date
				},
				"features": data
			})
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

	var popup = L.popup();

	map.on('mouseover', e => {
		document.getElementById("mapid")
			.style.cursor = "crosshair";
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
			break;
		case 'marker':
			marker.setLatLng([0, 0]);
			marker.removeFrom(map);
			break;
		}
	}

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
			}
		});
		FEATURES.addTo(map);
		document.getElementById('show')
			.checked = true;

		clearCurrent();
	};

	const ADDbutton = document.getElementById('poly-add')
		.addEventListener("click", (e) => {
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

								e.currentTarget.parentNode.remove();
							});
						}
					);
			});
		});

	const CLEARbutton = document.getElementById('poly-clear')
		.addEventListener("click", (e) => {
			clearCurrent();
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
														<p><strong>Date</strong>: ${date.toLocaleDateString("de-DE")}</p>
													</div>`;
					imageInfo.dataset.filename = URL.name;
					imageInfo.dataset.height = image._image.naturalHeight;
					imageInfo.dataset.width = image._image.naturalWidth;
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


	map.on('click', e => {
		const lat = e.latlng.lat;
		const lng = e.latlng.lng;
		const coord = `${lat},${lng}`;
		const outline = [];
		const holes = [];
		console.log(e.originalEvent);

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
			break;
		case 'marker':
			marker.addTo(map);
			marker.setLatLng(Array(lat, lng));
			break;
		}
	});
	// End Mapit()
}

// Needs refactoring
function setScript() {
	const script = document.createElement('script');
	script.onload = function () {
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
link.onload = function () {

	const style = document.createElement('style');
	style.innerText = "#mapid{ height: 800px; }"

	document.head.appendChild(style);
	setScript();
	//

	// Set helptexts

	function setHelpTexts(array) {
		array.forEach(
			(object) => {
				const span = document.createElement("SPAN");
				span.innerHTML = `
				<span id="${object.name}-help" class="popup">&nbsp;[❔]
					<span class="popuptext" id="${object.name}-help-popup">${object.helptext.split(/\r?\n/).join('<br>')}</span>
				</span>`;
				document.getElementById(`${object.name}`)
					.appendChild(span);
				document.getElementById(`${object.name}-help`)
					.addEventListener("mouseover", (e) => {
						console.log("X");
						var popup = document.getElementById(`${object.name}-help-popup`);
						popup.classList.toggle("show");
					});
				document.getElementById(`${object.name}-help`)
					.addEventListener("mouseout", (e) => {
						console.log("X");
						var popup = document.getElementById(`${object.name}-help-popup`);
						popup.classList.toggle("show");
					});
			}
		)
	}

	setHelpTexts([{
		"name": "import-image",
		"helptext": `You may upload a JPG- or PNG-file through a file dialogue.
								 The image will appear in the greay area on the left.`
	}]);

};