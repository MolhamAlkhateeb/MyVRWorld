//Require Three.js

class World {
    constructor(htmlContainer, noLights) {
        this.Scene = new THREE.Scene();
        this.Camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.Renderers = new Renderer(htmlContainer);
        this.OnAnimateHandlers = new Array();
        this.EnableOrbitControls = true;
        this.OrbitControls = new THREE.OrbitControls(this.Camera);
        this.HTMLContainer = htmlContainer;
        this.Lights = new Proxy(
            {
                AmbientLight: null,
                DirectionalLight: null
            }
            , {
                set: (obj, prop, val) => {
                    if (obj[prop]) { this.Scene.remove(this.Scene.getObjectById(obj[prop].id, true)); }
                    obj[prop] = val;
                    this.Scene.add(val);
                    return true;
                }
            }
        );

        this.LetThereBeLight = () => {
            this.Lights.AmbientLight = new THREE.AmbientLight(0x555555);
            this.Lights.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
            this.Lights.DirectionalLight.position.set(-.5, .5, -1.5).normalize();
        };

        this.Camera.position.set(0, 100, 3000);


        if (!noLights) { this.LetThereBeLight(); }
        let animate = () => {
            requestAnimationFrame(animate);

            this.OnAnimateHandlers.map(h => h());
            if (this.EnableOrbitControls) { this.OrbitControls.update(); }
            this.Renderers.WebGl.render(this.Scene, this.Camera);
        }
        animate();


    }
}

class Renderer {
    constructor(htmlContainer) {
        this.WebGl = new THREE.WebGLRenderer({ alpha: true });

        this.WebGl.setClearColor(0xECF8FF);
        this.WebGl.setPixelRatio(window.devicePixelRatio);
        this.WebGl.setSize(htmlContainer.innerWidth(), htmlContainer.innerHeight());
        //this.WebGl.domElement.style.position = 'absolute';
        //this.WebGl.domElement.style.top = 0;
        //this.WebGl.domElement.style.zIndex = 0;

        htmlContainer.append(this.WebGl.domElement);
    }
}

function ExtendableGroup() {

    return new THREE.Group();
}

class TV {
    constructor(world, width, height) {
        width = width | 1000;
        height = height | 1000;
        this._screenContainer = $('<div></div>').height(height).width(width);
        this._world = world;

        this.PlaneGeometry = new THREE.PlaneGeometry(width, height);
        this.PlaneMaterial = new THREE.MeshBasicMaterial({ color: 'black', opacity: 0, blending: THREE.NoBlending });
        var material = new THREE.MeshBasicMaterial();
        this.PlaneMesh = new THREE.Mesh(this.PlaneGeometry, this.PlaneMaterial);
        this.Scene = new THREE.Scene();
        this.Renderer = new THREE.CSS3DRenderer({ alpha: true });
        this.CssObject = new THREE.CSS3DObject(this._screenContainer.get(0));


        this.Init();
    }

    Init() {
        this.Renderer.setSize(this._world.HTMLContainer.innerWidth(), this._world.HTMLContainer.innerHeight());
        this.Renderer.setClearColor(0xffffff, 1);
        //this.Renderer.domElement.style.position = 'absolute';
        //this.Renderer.domElement.style.top = 0;
        //this.Renderer.domElement.style.zIndex = 1;
        this.Scene.add(this.CssObject);
        this._world.HTMLContainer.append(this.Renderer.domElement);
        this._world.Scene.add(this.PlaneMesh);

        let animate = () => {
            requestAnimationFrame(animate);
            this.Renderer.render(this.Scene, this._world.Camera);
        }
        animate();
    }


    Load(url) {
        $(this._screenContainer).load(url);
    }

}

