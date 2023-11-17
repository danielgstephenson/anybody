import './style.css'
// import Stage from 'stage-js'
import planck, { Box, Circle, Edge, Polygon, Testbed, Vec2, World } from 'planck/with-testbed'

console.log(planck)

const world = new World({
  gravity: new Vec2(0, -10)
})

const platform = world.createBody({
  type: 'static',
  position: new Vec2(0.0, 0.0),
  angle: Math.PI * 0
})
platform.createFixture({
  shape: new Edge(new Vec2(-50, 0), new Vec2(+50, 0))
})
platform.createFixture({
  shape: new Edge(new Vec2(-20, 0), new Vec2(-20, 50))
})
platform.createFixture({
  shape: new Edge(new Vec2(+20, 0), new Vec2(+20, 50))
})

const body = world.createBody({
  type: 'dynamic',
  position: new Vec2(0.0, 20.0)
})
body.createFixture({
  shape: new Box(1.0, 1.0, Vec2(0, 0), 0.23 * Math.PI),
  density: 0.9,
  friction: 1,
  restitution: 1
})
body.createFixture({
  shape: new Circle(Vec2(0, 4), 1.0),
  density: 0.9,
  friction: 0.1,
  restitution: 0.1
})
body.createFixture({
  shape: new Polygon([
    Vec2(+0, 6),
    Vec2(+3, 8),
    Vec2(-3, 8)
  ]),
  density: 0.9,
  friction: 0.1,
  restitution: 0.5
})

const testbed = Testbed.mount()
testbed.start(world)