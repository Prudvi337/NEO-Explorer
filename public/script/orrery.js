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

  // Set up the scene, camera, and renderer with optimized settings
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('canvas'),
    antialias: false, // Disable for better performance
    powerPreference: "high-performance"
  });
  
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

  // Optimized starfield function - reduced stars and removed twinkling
  function createStarfield(scene, numStars = 2000) {
    const vertices = [];
    const starMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < numStars; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const starField = new THREE.Points(geometry, starMaterial);
    scene.add(starField);

    return starField;
  }

  // Simplified starfield animation
  function animateStarfield(starField) {
    starField.rotation.x += 0.0001;
    starField.rotation.y += 0.0001;
  }

  // Create the optimized starfield
  const starField = createStarfield(scene);

  // Optimized asteroid belt - reduced density and simpler geometry
  function createAsteroidBelt(scene, density = 100) {
    const asteroids = new THREE.Group();
    const asteroidGeometry = new THREE.SphereGeometry(0.02, 6, 6); // Reduced detail
    const asteroidMaterial = new THREE.MeshLambertMaterial({ // Cheaper material
      color: 0x808080,
    });
    
    for (let i = 0; i < density; i++) {
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      const distance = 7 + Math.random() * 1;
      const angle = Math.random() * Math.PI * 2;
      const x = distance * Math.cos(angle);
      const z = distance * Math.sin(angle);
      asteroid.position.set(
        x + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.3,
        z + (Math.random() - 0.5) * 0.5
      );
      asteroid.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      asteroids.add(asteroid);
    }
    scene.add(asteroids);
  }

  createAsteroidBelt(scene, 100);

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

  // Create loading manager for better loading feedback
  const loadingManager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(loadingManager);

  // Show loading progress
  loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log(`Loading progress: ${itemsLoaded}/${itemsTotal} files loaded`);
  };

  // Load textures with error handling and fallbacks
  async function loadTexturesOptimized() {
    const texturePromises = [];
    
    // Load sun texture
    texturePromises.push(
      textureLoader.loadAsync('../textures/sun.jpg').catch(() => {
        console.warn('Sun texture failed to load, using fallback');
        return null;
      })
    );
    
    // Load planet textures
    for (const planet of Object.values(planetsData)) {
      texturePromises.push(
        textureLoader.loadAsync(planet.texture).catch(() => {
          console.warn(`Planet texture ${planet.texture} failed to load, using fallback`);
          return null;
        })
      );
    }
    
    // Load additional textures
    texturePromises.push(
      textureLoader.loadAsync('../textures/saturn_rings.png').catch(() => null)
    );
    texturePromises.push(
      textureLoader.loadAsync('../textures/asteroid_texture.jpg').catch(() => null)
    );

    return Promise.all(texturePromises);
  }

  // Initialize scene immediately, load textures in background
  initializeScene();

  async function initializeScene() {
    // Create basic sun without texture first
    const sunGeometry = new THREE.SphereGeometry(1.5, 16, 16); // Reduced detail
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, emissive: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Store planet meshes
    const planetMeshes = {};

    // Create planets with basic materials first
    for (const [name, planetData] of Object.entries(planetsData)) {
      const { distance, size, orbitColor } = planetData;

      const planetGeometry = new THREE.SphereGeometry(size, 16, 16); // Reduced detail
      const planetMaterial = new THREE.MeshLambertMaterial({ color: orbitColor }); // Basic material first
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);

      const angle = Math.random() * Math.PI * 2;
      planet.position.set(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);

      scene.add(planet);
      planetMeshes[name] = planet;

      // Create planet orbit
      const orbitGeometry = new THREE.RingGeometry(distance - 0.02, distance + 0.02, 32); // Reduced segments
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: orbitColor, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.3 
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    }

    // Add Saturn's rings
    const saturn = planetMeshes['saturn'];
    const ringGeometry = new THREE.RingGeometry(0.3, 0.5, 32); // Reduced segments
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffee00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    saturn.add(rings);

    // Start animation immediately
    startAnimation(planetMeshes);

    // Load NEOs immediately
    loadNEOs(startDate, endDate);

    // Load textures in background and update materials when ready
    loadTexturesOptimized().then((textures) => {
      const [sunTexture, ...planetTextures] = textures;
      
      // Update sun material if texture loaded
      if (sunTexture) {
        sun.material.map = sunTexture;
        sun.material.needsUpdate = true;
      }

      // Update planet materials
      let textureIndex = 0;
      for (const [name, planetData] of Object.entries(planetsData)) {
        const planetTexture = planetTextures[textureIndex++];
        const planet = planetMeshes[name];
        
        if (planetTexture && planet) {
          planet.material = new THREE.MeshPhongMaterial({
            map: planetTexture,
            bumpMap: planetTexture,
            bumpScale: 0.02 // Reduced for performance
          });
        }
      }

      // Update Saturn rings if texture loaded
      const saturnRingsTexture = planetTextures[planetTextures.length - 2];
      if (saturnRingsTexture && saturn) {
        rings.material.map = saturnRingsTexture;
        rings.material.needsUpdate = true;
      }
    }).catch(console.error);

    // UI setup for popup
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
    popup.style.display = 'none';
    popup.style.pointerEvents = 'none'; // Prevent popup from blocking clicks
    document.body.appendChild(popup);

    // Function to hide popup when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target !== popup) {
        popup.style.display = 'none';
      }
    });

    // Function to position popup next to NEO
    function showPopup(neoData, screenPosition) {
      popup.style.left = `${screenPosition.x + 10}px`;
      popup.style.top = `${screenPosition.y + 10}px`;
      popup.innerHTML = `
        <strong>NEO Name:</strong> ${neoData.name}<br>
        <strong>Approach Date:</strong> ${neoData.close_approach_date}<br>
        <strong>Velocity:</strong> ${neoData.velocity} km/h<br>
        <strong>Miss Distance:</strong> ${neoData.miss_distance} km
      `;
      popup.style.display = 'block';
    }

    const neoMeshes = {}; // Object to hold NEO mesh references

    // Optimized NEO loading with better error handling
    async function loadNEOs(startDate, endDate) {
      if (!startDate || !endDate) {
        console.warn("No date range provided for NEO loading");
        return;
      }

      try {
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`);
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const neosData = await response.json();
        let neos = [];

        // Parse NEO data
        if (neosData.near_earth_objects) {
          neos = Object.values(neosData.near_earth_objects).flat();
        }

        // Create NEO list dynamically
        const neoList = document.getElementById('neoList');
        if (!neoList) {
          console.warn("NEO list container not found - creating one");
          // Create NEO list container if it doesn't exist
          const neoListContainer = document.createElement('div');
          neoListContainer.id = 'neoList';
          neoListContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 250px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            padding: 15px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            border: 1px solid #333;
          `;
          document.body.appendChild(neoListContainer);
          
          // Add title to the list
          const title = document.createElement('h3');
          title.textContent = 'Near Earth Objects';
          title.style.cssText = 'margin: 0 0 10px 0; color: #fff; font-size: 16px;';
          neoListContainer.appendChild(title);
        }

        const neoListElement = document.getElementById('neoList');
        
        // Clear existing NEO items (but keep title if it exists)
        const existingItems = neoListElement.querySelectorAll('.neo-item');
        existingItems.forEach(item => item.remove());
        
        // Use DocumentFragment for better performance
        const neoFragment = document.createDocumentFragment();

        // Create shared geometry and material for NEOs
        const neoGeometry = new THREE.IcosahedronGeometry(0.05, 1);
        const neoMaterial = new THREE.MeshLambertMaterial({
          color: 0xA8A8A8,
        });

        neos.slice(0, 50).forEach((neo, index) => { // Limit to 50 NEOs for performance
          const neoItem = document.createElement('div');
          neoItem.className = 'neo-item';
          neoItem.innerText = `${index + 1}. ${neo.name || "Unknown NEO"}`;
          neoItem.style.cssText = `
            cursor: pointer;
            padding: 8px;
            margin: 2px 0;
            border-radius: 4px;
            border-bottom: 1px solid #444;
            transition: background-color 0.2s;
            font-size: 12px;
          `;
          
          // Add hover effect
          neoItem.addEventListener('mouseenter', () => {
            neoItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          });
          
          neoItem.addEventListener('mouseleave', () => {
            neoItem.style.backgroundColor = 'transparent';
          });

          neoItem.addEventListener('click', (e) => {
            e.stopPropagation();
            focusOnNEO(neo);
            // Highlight selected NEO
            document.querySelectorAll('.neo-item').forEach(item => {
              item.style.backgroundColor = 'transparent';
            });
            neoItem.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
          });

          neoFragment.appendChild(neoItem);

          // Create NEO mesh
          const neoDistance = 5 + (Math.random() * 0.5);
          const neoSize = Math.min(
            neo.estimated_diameter?.kilometers.estimated_diameter_max * 0.05 || 0.05,
            0.1
          ); // Cap size for performance

          const neoMesh = new THREE.Mesh(neoGeometry.clone(), neoMaterial.clone());
          neoMesh.scale.setScalar(neoSize / 0.05);

          const angle = Math.random() * Math.PI * 2;
          neoMesh.position.set(
            Math.cos(angle) * neoDistance, 
            (Math.random() - 0.5) * 0.5, 
            Math.sin(angle) * neoDistance
          );

          neoMesh.userData = {
            name: neo.name,
            close_approach_date: neo.close_approach_data[0]?.close_approach_date || 'Unknown',
            velocity: Math.round(parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour) || 0),
            miss_distance: Math.round(parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers) || 0)
          };
          
          scene.add(neoMesh);
          neoMeshes[neo.name] = neoMesh;
        });

        neoListElement.appendChild(neoFragment);
        console.log(`Loaded ${Object.keys(neoMeshes).length} NEOs to the list`);
        
        // Update toggle button text to show count
        const toggleButton = document.getElementById('toggleNEO');
        if (toggleButton) {
          toggleButton.textContent = `☰ (${Object.keys(neoMeshes).length})`;
        }
        
      } catch (error) {
        console.error("Error loading NEOs:", error);
        const neoListElement = document.getElementById('neoList');
        if (neoListElement) {
          const errorDiv = document.createElement('div');
          errorDiv.style.color = 'red';
          errorDiv.style.padding = '10px';
          errorDiv.textContent = 'Failed to load NEO data. Please check your internet connection.';
          neoListElement.appendChild(errorDiv);
        }
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

    // Zoom functionality
    let zoomTarget = null;
    let zooming = false;
    let zoomDistance = 2;

    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        if (selectedObject.userData && selectedObject.userData.name) {
          event.stopPropagation();
          showPopup(selectedObject.userData, { x: event.clientX, y: event.clientY });
        }

        zoomTarget = selectedObject;
        zooming = true;
      }
    });

    // UI Controls
    const backBtn = document.getElementById('backBtn');
    const toggleNEO = document.getElementById('toggleNEO');
    const neoList = document.getElementById('neoList');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }

    // Enhanced NEO list toggle functionality
    if (toggleNEO) {
      toggleNEO.addEventListener('click', () => {
        const neoListElement = document.getElementById('neoList');
        if (neoListElement) {
          // Toggle visibility
          if (neoListElement.style.display === 'none' || neoListElement.style.display === '') {
            neoListElement.style.display = 'block';
            toggleNEO.textContent = ' ☰';
            console.log('NEO list shown');
          } else {
            neoListElement.style.display = 'none';
            toggleNEO.textContent = '☰';
            console.log('NEO list hidden');
          }
        } else {
          console.error('NEO list element not found');
        }
      });
      
      // Set initial button text
      toggleNEO.textContent = ' ☰';
    } else {
      console.error('Toggle NEO button not found');
    }

    // Zoom functionality
    let zoomLevel = 1;

    function zoom(scaleFactor) {
      zoomLevel *= scaleFactor;
      camera.position.z = Math.max(2, Math.min(50, 20 / zoomLevel));
      camera.updateProjectionMatrix();
    }

    if (zoomIn) {
      zoomIn.addEventListener('click', () => zoom(1.2));
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => zoom(0.8));
    }

    // Optimized animation function
    function startAnimation(planetMeshes) {
      let lastTime = 0;
      const targetFPS = 60;
      const frameInterval = 1000 / targetFPS;

      function animate(currentTime) {
        requestAnimationFrame(animate);

        if (currentTime - lastTime < frameInterval) {
          return;
        }

        const time = currentTime * 0.0001;

        // Animate planets
        for (const [name, planet] of Object.entries(planetMeshes)) {
          const planetData = planetsData[name];
          if (planetData && planetData.distance) {
            const distance = planetData.distance;
            const orbitSpeed = 0.03 / distance;

            planet.position.x = Math.cos(time * orbitSpeed) * distance;
            planet.position.z = Math.sin(time * orbitSpeed) * distance;
          }
        }

        // Animate moon around Earth
        const earth = planetMeshes['earth'];
        const moon = planetMeshes['moon'];
        if (earth && moon) {
          const moonOrbitSpeed = 0.05;
          const moonOrbitRadius = planetsData.moon.distance;
          moon.position.x = earth.position.x + Math.cos(time * moonOrbitSpeed) * moonOrbitRadius;
          moon.position.z = earth.position.z + Math.sin(time * moonOrbitSpeed) * moonOrbitRadius;
        }

        // Handle zooming
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

        // Animate starfield
        animateStarfield(starField);

        controls.update();
        renderer.render(scene, camera);

        lastTime = currentTime;
      }

      animate(0);
    }
  }
}