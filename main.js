// Cesium ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNGU3MmU5ZS0zYWNhLTQ3OWUtOGY3OS0xNWJiODA0ODE0MGMiLCJpZCI6Mjc3NzA1LCJpYXQiOjE3NDAwNjQxNzR9.sNTxZaHE_9OY7KUYEzk_NV9pE-KxAdtAWylKSzstzlQ';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const lat = parseFloat(urlParams.get('lat')) || 43.638778;
const lng = parseFloat(urlParams.get('lng')) || -79.416750;

// Initialize the Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,         // Enable home button
    sceneModePicker: true,    // Enable scene mode picker
    navigationHelpButton: true, // Enable help button
    animation: true,  // Enable animation widget
    timeline: true,   // Enable timeline widget
    fullscreenButton: true,   // Enable fullscreen
    imageryProvider: new Cesium.OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/'
    })
});

// Configure the clock to start at the current time
const now = Cesium.JulianDate.fromDate(new Date());
const startTime = Cesium.JulianDate.addHours(now, -2, new Cesium.JulianDate());
const endTime = Cesium.JulianDate.addHours(now, 4, new Cesium.JulianDate());

viewer.clock.startTime = startTime;
viewer.clock.currentTime = now;
viewer.clock.stopTime = endTime;
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop when we hit the end time
viewer.clock.multiplier = 1800; // Speed up time by 30 minutes per second
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;

// Add some CSS to position the timeline at the bottom
viewer.timeline.container.style.bottom = '0px';
viewer.timeline.container.style.position = 'absolute';
viewer.animation.container.style.bottom = '30px';
viewer.animation.container.style.position = 'absolute';

// Set the initial camera view to look down at the location
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lng, lat, 120), // 120 meters height
    orientation: {
        heading: Cesium.Math.toRadians(0),    // Look north
        pitch: Cesium.Math.toRadians(-90),    // Look straight down
        roll: 0
    },
    duration: 0 // Instant camera movement
});

// Restrict camera tilt to maintain top-down perspective
viewer.scene.screenSpaceCameraController.enableTilt = false;

// Restrict zoom range
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;  // Min 50 meters
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 300; // Max 300 meters

// Enable lighting effects
viewer.scene.globe.enableLighting = true;

// Enable shadows
viewer.shadows = true;
viewer.terrainShadows = Cesium.ShadowMode.ENABLED;

// Add mouse position control
viewer.scene.screenSpaceCameraController.enableRotate = true;
viewer.scene.screenSpaceCameraController.enableTranslate = true;
viewer.scene.screenSpaceCameraController.enableZoom = true;
viewer.scene.screenSpaceCameraController.enableLook = true;

// Load Toronto buildings tilesets
const loadTilesets = async () => {
    try {
        // Load first tileset (3123235)
        const tileset1 = await Cesium.Cesium3DTileset.fromIonAssetId(3123235, {
            shadows: Cesium.ShadowMode.ENABLED,
            maximumScreenSpaceError: 16,
            maximumMemoryUsage: 512
        });
        viewer.scene.primitives.add(tileset1);

        // Load second tileset (2275207)
        const tileset2 = await Cesium.Cesium3DTileset.fromIonAssetId(2275207, {
            shadows: Cesium.ShadowMode.ENABLED,
            maximumScreenSpaceError: 16,
            maximumMemoryUsage: 512
        });
        viewer.scene.primitives.add(tileset2);

        // Zoom to the area of interest
        try {
            await viewer.zoomTo(tileset1);
        } catch (zoomError) {
            console.error('Error zooming to tileset:', zoomError);
        }
    } catch (error) {
        console.error('Error loading tilesets:', error);
    }
};

loadTilesets();
