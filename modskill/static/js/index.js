window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

// Function to switch to the next OBJ file
function nextMesh() {
  currentMeshIndex = (currentMeshIndex + 1) % meshes.length;
  updateScene();
}

// Function to switch to the previous OBJ file
function prevMesh() {
  currentMeshIndex = (currentMeshIndex - 1 + meshes.length) % meshes.length;
  updateScene();
}

// Function to update the scene with the current mesh
function updateScene() {
  scene.remove.apply(scene, scene.children); // Remove existing objects from the scene
  scene.add(meshes[currentMeshIndex]); // Add the current mesh to the scene
}
// Set up animation
function animate() {
  requestAnimationFrame(animate);
  // Perform any additional animations or updates here
  renderer.render(scene, camera);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// PointerLockControls for camera movement
var controls = new THREE.PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());



// Load OBJ files and create a mesh for each
var objPaths = ['../models/frame020.obj', '../models/frame021.obj', '../models/frame022.obj'];
var meshes = [];
var currentMeshIndex = 0;

var loader = new THREE.OBJLoader();
objPaths.forEach(function (path) {
  loader.load(path, function (object) {
    meshes.push(object.children[0]);
    if (meshes.length === objPaths.length) {
      // All OBJ files loaded, start the animation
      animate();
    }
  });
});

// Handle user input for camera movement
var isDragging = false;
var previousX = 0;

document.addEventListener('mousedown', function (event) {
  isDragging = true;
  previousX = event.clientX;
});

document.addEventListener('mousemove', function (event) {
  if (isDragging) {
    var deltaX = event.clientX - previousX;
    controls.rotateLeft(deltaX * 0.005); // Adjust the rotation speed as needed
    previousX = event.clientX;
  }
});

document.addEventListener('mouseup', function () {
  isDragging = false;
});

// Handle user input to toggle between OBJ files
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') {
    nextMesh();
  } else if (event.key === 'ArrowLeft') {
    prevMesh();
  }
});

// Set initial scene
updateScene();
})





