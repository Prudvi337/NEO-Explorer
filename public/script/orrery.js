 const pageTitle = document.title;

// JavaScript for Page 1
if (pageTitle === "NEO Explorer" || pageTitle === "NEOs Data") {
  // Get all buttons with the class "start-exploring-btn"
  const startExploringBtns = document.querySelectorAll(".start-exploring-btn");
  const popup = document.getElementById("popup");
  const closePopupBtn = document.getElementById("close-popup");
  const exploreForm = document.getElementById("explore-form");
  const errorMessage = document.getElementById("error-message");

  // Add event listener to each "Start Exploring" button
  startExploringBtns.forEach(function(button) {
    button.addEventListener("click", function() {
      popup.style.display = "flex";
    });
  });

  // Close the popup when "X" is clicked
  closePopupBtn.addEventListener("click", function() {
    popup.style.display = "none";
  });

  // Form submission handling
  exploreForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    // Calculate the difference in days between the two dates
    const differenceInDays = Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24));

    // Check if the date range is more than 5 days
    if (differenceInDays > 5) {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";

      // Save startDate and endDate in sessionStorage
      sessionStorage.setItem("startDate", startDate);
      sessionStorage.setItem("endDate", endDate);

      // Redirect to the exploration page (orrey.html)
      if (pageTitle === "NEO Explorer"){
        window.location.href = 'src/orrey.html';

      }
      else{
      window.location.href = '../src/orrey.html';
      }
    }
  });
}

if (pageTitle === "Orrery Web App") {
  // Access the start and end dates from sessionStorage
  const startDate = sessionStorage.getItem("startDate");
  const endDate = sessionStorage.getItem("endDate");

  if (startDate && endDate) {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  } else {
    console.log("No date range found in sessionStorage");
  }

  // Set up the scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
  
  function resizeRenderer() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  
  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);

  // Add lighting to the scene
  const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);

  // Add orbit controls for interaction
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.z = 20;

  // Function to create a dynamic starfield
  function createStarfield(scene, numStars = 10000) {
    const vertices = [];
    const starMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      vertexColors: true
    });

    // Create a color array for stars
    const colors = [];
    const colorPalette = [
      new THREE.Color(0xFFFFFF), // White
      new THREE.Color(0xFFFF00), // Yellow
      new THREE.Color(0x00FFFF), // Cyan
      new THREE.Color(0xFF00FF)  // Magenta
    ];

    for (let i = 0; i < numStars; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);

      // Randomly select a color from the palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors.push(color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const starField = new THREE.Points(geometry, starMaterial);
    scene.add(starField);

    return starField;
  }

  // Function to animate the starfield
  function animateStarfield(starField, camera) {
    starField.rotation.x += 0.0001;
    starField.rotation.y += 0.0001;

    // Make stars twinkle
    const colors = starField.geometry.attributes.color.array;

    for (let i = 0; i < colors.length; i += 3) {
      // Randomly adjust star brightness
      const brightness = 0.8 + Math.random() * 0.2;
      colors[i] *= brightness;
      colors[i + 1] *= brightness;
      colors[i + 2] *= brightness;
    }

    starField.geometry.attributes.color.needsUpdate = true;
  }

  // Create the dynamic starfield
  const starField = createStarfield(scene);

  // Planets data
  const planetsData = {
    mercury: { texture: '../textures/mercury.jpg', distance: 3, size: 0.08, orbitColor: 0xffff00 },
    venus: { texture: '../textures/venus.jpg', distance: 4, size: 0.1, orbitColor: 0xff9900 },
    earth: { texture: '../textures/earth.jpg', distance: 5, size: 0.12, orbitColor: 0x00ff00 },
    moon: { texture: '../textures/moon.jpg', distance: 0.4, size: 0.03, orbitColor: 0xffffff, orbitParent: 'earth' },
    mars: { texture: '../textures/mars.jpg', distance: 6, size: 0.1, orbitColor: 0xff0000 },
    jupiter: { texture: '../textures/jupiter.jpg', distance: 8, size: 0.3, orbitColor: 0xffaa00 },
    saturn: { texture: '../textures/saturn.jpg', rings: '../textures/saturn_rings.png', distance: 10, size: 0.25, orbitColor: 0xffee00 },
    uranus: { texture: '../textures/uranus.jpg', distance: 12, size: 0.18, orbitColor: 0x00ccff },
    neptune: { texture: '../textures/neptune.jpg', distance: 14, size: 0.17, orbitColor: 0x0000ff }
  };

  // Load textures asynchronously
  const textureLoader = new THREE.TextureLoader();
  const texturePromises = [
    textureLoader.loadAsync('../textures/sun.jpg'),
    ...Object.values(planetsData).map(planet => textureLoader.loadAsync(planet.texture)),
    textureLoader.loadAsync('../textures/saturn_rings.png'),
    textureLoader.loadAsync('../textures/asteroid_texture.jpg')
  ];

  Promise.all(texturePromises).then(([sunTexture, ...planetTextures]) => {
    // Create the Sun
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, emissive: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Store planet meshes
    const planetMeshes = {};

    // Create planets and their orbits
    let textureIndex = 0;
    for (const [name, planetData] of Object.entries(planetsData)) {
      const { distance, size, orbitColor } = planetData;
      const planetTexture = planetTextures[textureIndex++];

      const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        map: planetTexture,
        bumpMap: planetTexture,
        bumpScale: 0.05
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);

      const angle = Math.random() * Math.PI * 2;
      planet.position.set(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);

      scene.add(planet);
      planetMeshes[name] = planet;

      // Create planet orbit
      const orbitGeometry = new THREE.RingGeometry(distance - 0.02, distance + 0.02, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: orbitColor, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    }

    // Add Saturn's rings
    const saturn = planetMeshes['saturn'];
    const ringGeometry = new THREE.RingGeometry(0.3, 0.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: planetTextures[planetTextures.length - 2], // Saturn rings texture
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    saturn.add(rings);

    // UI setup for popup
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
    popup.style.display = 'none';
    document.body.appendChild(popup);

    // Function to hide popup when clicking outside the NEO/planet
    window.addEventListener('click', (event) => {
      popup.style.display = 'none';
    });

    // Function to position popup next to NEO
    function showPopup(neoData, screenPosition) {
      popup.style.left = `${screenPosition.x}px`;
      popup.style.top = `${screenPosition.y}px`;
      popup.innerHTML = `
        <strong>NEO Name:</strong> ${neoData.name}<br>
        <strong>Approach Date:</strong> ${neoData.close_approach_date}<br>
        <strong>Velocity:</strong> ${neoData.velocity} km/h<br>
        <strong>Miss Distance:</strong> ${neoData.miss_distance} km
      `;
      popup.style.display = 'block';
    }

    const neoMeshes = {}; // Object to hold NEO mesh references

    // Load NEOs from JSON and position them around Earth
    async function loadNEOs(startDate, endDate) {
      try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`);
        const neosData = await response.json();
        let neos = [];

        // Parse NEO data
        if (neosData.near_earth_objects) {
          neos = Object.values(neosData.near_earth_objects).flat();
        }

        // Create NEO list dynamically
        const neoList = document.getElementById('neoList');
        const neoFragment = document.createDocumentFragment();

        neos.forEach(neo => {
          const neoItem = document.createElement('div');
          neoItem.innerText = neo.name || "Unknown NEO";
          neoItem.style.cursor = 'pointer';

          neoItem.addEventListener('click', () => {
            focusOnNEO(neo);
          });

          neoFragment.appendChild(neoItem);

          const neoDistance = 5 + (Math.random() * 0.5);
          const neoSize = neo.estimated_diameter?.kilometers.estimated_diameter_max 
                          ? neo.estimated_diameter.kilometers.estimated_diameter_max * 0.05 
                          : 0.05;

          if (!isNaN(neoDistance) && !isNaN(neoSize)) {
            const neoGeometry = new THREE.IcosahedronGeometry(neoSize, Math.floor(Math.random() * 2));
            const neoMaterial = new THREE.MeshPhongMaterial({
              map: planetTextures[planetTextures.length - 1], // Asteroid texture
              color: 0xA8A8A8,
              shininess: 10,
              bumpScale: 0.1
            });
            const neoMesh = new THREE.Mesh(neoGeometry, neoMaterial);

            const angle = Math.random() * Math.PI * 2;
            neoMesh.position.set(Math.cos(angle) * neoDistance, 0, Math.sin(angle) * neoDistance);

            neoMesh.userData = {
              name: neo.name,
              close_approach_date: neo.close_approach_data[0]?.close_approach_date,
              velocity: neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour,
              miss_distance: neo.close_approach_data[0]?.miss_distance.kilometers
            };
            scene.add(neoMesh);
            neoMeshes[neo.name] = neoMesh;
          }
        });

        neoList.appendChild(neoFragment);
      } catch (error) {
        console.error("Error loading NEOs:", error);
      }
    }

    // Function to focus on a clicked NEO
    function focusOnNEO(neoData) {
      const neoMesh = neoMeshes[neoData.name];
      if (neoMesh) {
        zoomTarget = neoMesh; 
        zooming = true;
      }
    }

    // Raycaster for detecting object clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // To smoothly zoom into a clicked object
    let zoomTarget = null;
    let zooming = false;
    let zoomDistance = 2;
    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        if (selectedObject.userData && selectedObject.userData.name) {
          showPopup(selectedObject.userData, { x: event.clientX, y: event.clientY });
        }

        zoomTarget = selectedObject;
        zooming = true;
      }
    });

    // Get references to the elements
    const backBtn = document.getElementById('backBtn');
    const toggleNEO = document.getElementById('toggleNEO');
    const neoList = document.getElementById('neoList');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');

    // Back button click event (redirect to homepage or previous page)
    backBtn.addEventListener('click', () => {
      window.history.back();
    });

    // Toggle NEO List visibility
    toggleNEO.addEventListener('click', () => {
      neoList.style.display = neoList.style.display === 'none' || neoList.style.display === '' ? 'block' : 'none';
    });

    // Zoom functionality
    let zoomLevel = 1;

    function zoom(scaleFactor) {
      zoomLevel *= scaleFactor;
      camera.position.z = 12 / zoomLevel;
      camera.updateProjectionMatrix();
    }

    zoomIn.addEventListener('click', () => zoom(1.2));
    zoomOut.addEventListener('click', () => zoom(0.8));

    // Optimize animation loop
    const clock = new THREE.Clock();
    let lastUpdateTime = 0;
    const updateInterval = 1 / 30; // Update at 30 FPS

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      lastUpdateTime += delta;

      if (lastUpdateTime >= updateInterval) {
        const time = Date.now() * 0.0001;
          for (const [name, planet] of Object.entries(planetMeshes)) {
            const planetData = planetsData[name];
            const distance = planetData.distance;
            const orbitSpeed = 0.03 / distance;
  
            planet.position.x = Math.cos(time * orbitSpeed) * distance;
            planet.position.z = Math.sin(time * orbitSpeed) * distance;
          }
  
          const earth = planetMeshes['earth'];
          const moon = planetMeshes['moon'];
          if (earth && moon) {
            const moonOrbitSpeed = 0.05;
            const moonOrbitRadius = planetsData.moon.distance;
            moon.position.x = earth.position.x + Math.cos(time * moonOrbitSpeed) * moonOrbitRadius;
            moon.position.z = earth.position.z + Math.sin(time * moonOrbitSpeed) * moonOrbitRadius;
          }
  
          if (zooming && zoomTarget) {
            const targetPosition = zoomTarget.position.clone();
            const direction = targetPosition.clone().sub(camera.position).normalize();
            const zoomStep = direction.multiplyScalar(0.1);
  
            if (camera.position.distanceTo(targetPosition) > zoomDistance) {
              camera.position.add(zoomStep);
            } else {
              zooming = false;
            }
  
            controls.target.copy(zoomTarget.position);
          }
  
          controls.update();
          renderer.render(scene, camera);
  
          lastUpdateTime = 0;
        }
      }
  
      // Start the animation loop and load NEOs
      animate();
      loadNEOs(startDate, endDate);
    }).catch(error => {
      console.error("Error loading textures:", error);
    });
    
  }
