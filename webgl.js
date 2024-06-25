let scene, camera, renderer, material, plane;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
const lerpFactor = 0.1;
let isLightMode = false;
let transitionFactor = 0;
let currentColor1 = new THREE.Vector3(0.0, 0.15, 0.4);
let currentColor2 = new THREE.Vector3(0.2, 0.4, 0.8);
let targetColor1 = new THREE.Vector3(0.0, 0.15, 0.4);
let targetColor2 = new THREE.Vector3(0.2, 0.4, 0.8);

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float transitionFactor;
        uniform vec3 color1;
        uniform vec3 color2;

        #define FLOW_INTENSITY 0.05

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec2 p = (uv * 2.0 - 1.0);
            vec2 m = (mouse / resolution.xy) * 2.0 - 1.0;
            
            vec2 flowVector = m - p;
            float dist = length(flowVector);
            
            vec2 offset = flowVector * FLOW_INTENSITY / (dist + 0.5);
            p += offset;

            for(int i = 1; i < 7; i++) {
                float fi = float(i);
                p.x += 0.1 / fi * sin(fi * 2.0 * p.y + time * 0.25 + 0.2 * fi);
                p.y += 0.1 / fi * cos(fi * 2.0 * p.x + time * 0.25 + 0.2 * fi);
            }
            
            float intensity = 0.5 * sin(3.0 * p.x + 2.0 * p.y) + 0.5;
            vec3 darkColor = mix(vec3(0.0), color1, intensity);
            vec3 lightColor = mix(color1, color2, intensity);
            vec3 color = mix(darkColor, lightColor, transitionFactor);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() },
            mouse: { value: new THREE.Vector2() },
            transitionFactor: { value: 0.0 },
            color1: { value: currentColor1 },
            color2: { value: currentColor2 }
        },
        fragmentShader: fragmentShader
    });

    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('scroll', onScroll, false);
    document.addEventListener('click', changeColors, false);

    const modeToggle = document.getElementById('mode-toggle');
    const modeTitle = document.getElementById('mode-title');
    modeToggle.addEventListener('click', function() {
        isLightMode = !isLightMode;
        modeTitle.style.opacity = 0;
        setTimeout(() => {
            modeTitle.textContent = isLightMode ? '🌑' : '☀️';
            modeTitle.style.opacity = 1;
        }, 150);
    });

    onWindowResize();
    setInterval(changeColors, 5000);
}

function changeColors() {
    targetColor1 = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    targetColor2 = new THREE.Vector3(Math.random(), Math.random(), Math.random());
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    material.uniforms.resolution.value.x = width;
    material.uniforms.resolution.value.y = height;
}

function onMouseMove(event) {
    targetMouseX = event.clientX;
    targetMouseY = event.clientY;
}

function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const logo = document.getElementById('logo');
    const featureCarousel = document.getElementById('feature-carousel-container');
    
    const scrollThreshold = 10;
    
    if (scrollY > scrollThreshold) {
        logo.classList.add('top-left');
        featureCarousel.style.opacity = '1';
    } else {
        logo.classList.remove('top-left');
        featureCarousel.style.opacity = '0';
    }
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function lerpVector(start, end, t) {
    return new THREE.Vector3(
        lerp(start.x, end.x, t),
        lerp(start.y, end.y, t),
        lerp(start.z, end.z, t)
    );
}

function animate() {
    requestAnimationFrame(animate);

    mouseX = lerp(mouseX, targetMouseX, lerpFactor);
    mouseY = lerp(mouseY, targetMouseY, lerpFactor);

    const targetTransitionFactor = isLightMode ? 1.0 : 0.0;
    transitionFactor = lerp(transitionFactor, targetTransitionFactor, 0.05);

    currentColor1 = lerpVector(currentColor1, targetColor1, 0.05);
    currentColor2 = lerpVector(currentColor2, targetColor2, 0.05);

    material.uniforms.time.value += 0.025;
    material.uniforms.mouse.value.x = mouseX;
    material.uniforms.mouse.value.y = window.innerHeight - mouseY;
    material.uniforms.transitionFactor.value = transitionFactor;
    material.uniforms.color1.value = currentColor1;
    material.uniforms.color2.value = currentColor2;

    renderer.render(scene, camera);
}

init();
animate();