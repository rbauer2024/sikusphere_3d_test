// Quelle: Three.js offizielle Beispiele (https://github.com/mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js)
import {
  MOUSE,
  Quaternion,
  Spherical,
  TOUCH,
  Vector2,
  Vector3
} from './three.module.js';

class OrbitControls {

  constructor(object, domElement) {
    this.object = object;
    this.domElement = domElement;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the object orbits around
    this.target = new Vector3();

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // Set to true to enable damping (inertia)
    this.enableDamping = true;
    this.dampingFactor = 0.05;

    // Set to true to automatically rotate around the target
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // The four "interaction modes"
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    this.enableRotate = true;
    this.rotateSpeed = 1.0;

    this.enablePan = false;

    this.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN
    };

    // Private internals
    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();

    this.scale = 1;
    this.panOffset = new Vector3();
    this.zoomChanged = false;

    this.rotateStart = new Vector2();
    this.rotateEnd = new Vector2();
    this.rotateDelta = new Vector2();

    this.zoomStart = new Vector2();
    this.zoomEnd = new Vector2();
    this.zoomDelta = new Vector2();

    this.update = () => {
      const offset = new Vector3();

      const quat = new Quaternion().setFromUnitVectors(
        this.object.up,
        new Vector3(0, 1, 0)
      );
      const quatInverse = quat.clone().invert();

      const lastPosition = new Vector3();
      const lastQuaternion = new Quaternion();

      return () => {
        const position = this.object.position;

        offset.copy(position).sub(this.target);

        offset.applyQuaternion(quat);

        this.spherical.setFromVector3(offset);

        if (this.autoRotate && this.enableRotate) {
          this.sphericalDelta.theta +=
            (2 * Math.PI) / 60 / 60 * this.autoRotateSpeed;
        }

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;

        this.spherical.theta = Math.max(
          -Infinity,
          Math.min(Infinity, this.spherical.theta)
        );
        this.spherical.phi = Math.max(
          this.minPolarAngle,
          Math.min(this.maxPolarAngle, this.spherical.phi)
        );

        this.spherical.makeSafe();

        this.spherical.radius *= this.scale;

        this.spherical.radius = Math.max(
          this.minDistance,
          Math.min(this.maxDistance, this.spherical.radius)
        );

        this.target.add(this.panOffset);

        offset.setFromSpherical(this.spherical);

        offset.applyQuaternion(quatInverse);
        position.copy(this.target).add(offset);

        this.object.lookAt(this.target);

        if (
          this.enableDamping === true
        ) {
          this.sphericalDelta.theta *= 1 - this.dampingFactor;
          this.sphericalDelta.phi *= 1 - this.dampingFactor;
        } else {
          this.sphericalDelta.set(0, 0, 0);
        }

        this.scale = 1;
        this.panOffset.set(0, 0, 0);

        if (
          lastPosition.distanceToSquared(this.object.position) > 1e-10 ||
          8 * (1 - lastQuaternion.dot(this.object.quaternion)) > 1e-10
        ) {
          lastPosition.copy(this.object.position);
          lastQuaternion.copy(this.object.quaternion);
        }
      };
    };

    this.domElement.addEventListener('wheel', event => {
      if (this.enabled === false || this.enableZoom === false) return;

      event.preventDefault();
      this.dollyIn(Math.pow(0.95, this.zoomSpeed));
      this.update();
    });

    this.domElement.addEventListener('mousedown', event => {
      if (this.enabled === false || this.enableRotate === false) return;

      this.rotateStart.set(event.clientX, event.clientY);
      const onMouseMove = event => {
        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta
          .subVectors(this.rotateEnd, this.rotateStart)
          .multiplyScalar(this.rotateSpeed);

        const element = this.domElement === document ? this.domElement.body : this.domElement;

        this.sphericalDelta.theta -=
          (2 * Math.PI * this.rotateDelta.x) / element.clientHeight;
        this.sphericalDelta.phi -=
          (2 * Math.PI * this.rotateDelta.y) / element.clientHeight;

        this.rotateStart.copy(this.rotateEnd);
        this.update();
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    });
  }

  dollyIn(dollyScale) {
    this.scale /= dollyScale;
  }

  dollyOut(dollyScale) {
    this.scale *= dollyScale;
  }
}

export { OrbitControls };
