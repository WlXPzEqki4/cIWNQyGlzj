




// // Set your Mapbox access token
// const MAPBOX_TOKEN = 'pk.eyJ1IjoiamNkZW50b24yMDUxIiwiYSI6ImNtMzVkZXJudTA5ejkya3B5NDU4Z2MyeHQifQ.aUk4eH5k3JC45Foxcbe2qQ';

// // Function to fetch local building data
// async function getLocalBuildings(latitude, longitude, radius = 0.01) {
//   // Implement the same logic as the Python function to fetch building data
// }

// // Function to render the map visualization
// async function renderMapVisualization() {
//   try {
//     // Load the CSV data from a local file
//     const dataUrl = '../src/assets/df.csv';
//     const response = await fetch(dataUrl);
//     const csvData = await Papa.parse(await response.text(), { download: true, header: true });

//     // Extract the necessary data from the CSV
//     const mapData = csvData.data.filter(row => row.latitude && row.longitude).map(row => ({
//       id: row.id,
//       latitude: parseFloat(row.latitude),
//       longitude: parseFloat(row.longitude)
//     }));

//     // Create the base map
//     const map = new deck.DeckGL({
//       container: 'map-container',
//       mapStyle: 'mapbox://styles/mapbox/light-v10',
//       mapboxAccessToken: MAPBOX_TOKEN,
//       initialViewState: {
//         latitude: mapData.length > 0 ? mapData.reduce((sum, row) => sum + row.latitude, 0) / mapData.length : 0,
//         longitude: mapData.length > 0 ? mapData.reduce((sum, row) => sum + row.longitude, 0) / mapData.length : 0,
//         zoom: 16,
//         pitch: 45,
//         bearing: 0
//       },
//       layers: [
//         new deck.ScatterplotLayer({
//           id: 'scatterplot-layer',
//           data: mapData,
//           getPosition: d => [d.longitude, d.latitude],
//           getFillColor: [255, 0, 0, 140],
//           getRadius: 100
//         })
//       ]
//     });

//     // Add additional layers based on user selections
//     // Implement the same logic as in the Streamlit app

//   } catch (error) {
//     console.error('Error loading data or rendering map:', error);
//   }
// }

// renderMapVisualization();














// Set your Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamNkZW50b24yMDUxIiwiYSI6ImNtMzVkZXJudTA5ejkya3B5NDU4Z2MyeHQifQ.aUk4eH5k3JC45Foxcbe2qQ';

// Function to fetch local building data
async function getLocalBuildings(latitude, longitude, radius = 0.01) {
  const overpassUrl = 'http://overpass-api.de/api/interpreter';
  const overpassQuery = `
    [out:json];
    way["building"](around:${radius * 111000},${latitude},${longitude});
    (._;>;);
    out geom;
  `;

  const response = await fetch(overpassUrl, {
    method: 'POST',
    body: new URLSearchParams({ data: overpassQuery }),
  });
  const data = await response.json();

  const buildings = [];
  for (const element of data.elements) {
    if (element.type === 'way' && 'geometry' in element) {
      const coordinates = element.geometry.map(point => [point.lon, point.lat]);
      if (coordinates[0] !== coordinates[coordinates.length - 1]) {
        coordinates.push(coordinates[0]);
      }

      buildings.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
        properties: {
          height: element.tags?.height || '10',
          levels: element.tags?.['building:levels'] || '3',
        },
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features: buildings,
  };
}

// Function to render the map visualization
async function renderMapVisualization() {
  try {
    // Load the CSV data from a local file
    const dataUrl = '/assets/df.csv';  // Move df.csv to your public folder
    const response = await fetch(dataUrl);
    const csvData = await Papa.parse(await response.text(), { download: true, header: true });

    // Extract the necessary data from the CSV
    const mapData = csvData.data
      .filter(row => row.latitude && row.longitude)
      .map(row => ({
        id: row.id,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
      }));

    // Create the base map
    const map = new deck.DeckGL({
      container: 'map-container',
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      mapboxAccessToken: MAPBOX_TOKEN,
      initialViewState: {
        latitude:
          mapData.length > 0
            ? mapData.reduce((sum, row) => sum + row.latitude, 0) / mapData.length
            : 0,
        longitude:
          mapData.length > 0
            ? mapData.reduce((sum, row) => sum + row.longitude, 0) / mapData.length
            : 0,
        zoom: 16,
        pitch: 45,
        bearing: 0,
      },
      layers: [
        new deck.ScatterplotLayer({
          id: 'scatterplot-layer',
          data: mapData,
          getPosition: d => [d.longitude, d.latitude],
          getFillColor: [255, 0, 0, 140],
          getRadius: 100,
        }),
      ],
    });

    // Add additional layers based on user selections
    const selectedLayers = ['Heatmap', 'Hexagon', '3D Buildings'];
    const centerLat = map.props.initialViewState.latitude;
    const centerLon = map.props.initialViewState.longitude;

    if (selectedLayers.includes('Heatmap')) {
      map.setProps({
        layers: [
          ...map.props.layers,
          new deck.HeatmapLayer({
            id: 'heatmap-layer',
            data: mapData,
            getPosition: d => [d.longitude, d.latitude],
            aggregation: 'sum',
            getWeight: 1,
            radiusPixels: 40,
            opacity: 0.4,
          }),
        ],
      });
    }

    if (selectedLayers.includes('Hexagon')) {
      const hexRadius = 50;
      const hexElevationScale = 2;
      const hexElevationRangeMax = 500;

      map.setProps({
        layers: [
          ...map.props.layers,
          new deck.HexagonLayer({
            id: 'hexagon-layer',
            data: mapData,
            getPosition: d => [d.longitude, d.latitude],
            radius: hexRadius,
            elevationScale: hexElevationScale,
            elevationRange: [0, hexElevationRangeMax],
            extruded: true,
          }),
        ],
      });
    }

    if (selectedLayers.includes('3D Buildings')) {
      try {
        const buildingData = await getLocalBuildings(centerLat, centerLon);
        map.setProps({
          layers: [
            ...map.props.layers,
            new deck.GeoJsonLayer({
              id: 'buildings-layer',
              data: buildingData,
              opacity: 0.8,
              stroked: true,
              filled: true,
              extruded: true,
              wireframe: true,
              getElevation: f => f.properties.height * 3,
              getFillColor: [74, 80, 87, 200],
              getLineColor: [255, 255, 255],
              pickable: true,
              autoHighlight: true,
            }),
          ],
        });
      } catch (error) {
        console.error('Could not load building data:', error);
      }
    }
  } catch (error) {
    console.error('Error loading data or rendering map:', error);
  }
}

renderMapVisualization();

