class Runner {
  world = null
  context = null
  paused = false
  stepSize = 1 / 60
  lastTime = 0
  worldTime = 0
  targetWorldTime = 0

  start (world, context) {
    this.world = world
    this.context = context
    this.paused = false
    this.lastTime = performance.now()
    this.update(0)
  }

  pause () {
    this.paused = true
  }

  update (newTime) {
    if (this.paused) {
      return
    }
    const dt = Math.min(0.2, (newTime - this.lastTime) / 1000)
    this.lastTime = newTime
    this.targetWorldTime += dt
    while (this.worldTime + this.stepSize < this.targetWorldTime) {
      this.world.step(this.stepSize)
      this.worldTime += this.stepSize
    }
    this.render()
    window.requestAnimationFrame(t => this.update(t))
  }

  render () {
    this.setupCanvas()
    const context = this.context
    const fixtures = this.getFixtures()
    fixtures.forEach(fixture => {
      this.followCamera()
      context.fillStyle = 'blue'
      context.strokeStyle = 'blue'
      context.lineWidth = 0.1
      const body = fixture.getBody()
      const bodyPosition = body.getPosition()
      context.translate(bodyPosition.x, bodyPosition.y)
      context.rotate(body.getAngle())
      const shape = fixture.getShape()
      const shapeType = shape.getType()
      if (shapeType === 'edge') {
        this.drawEdge(shape)
      }
      if (shapeType === 'polygon') {
        this.drawPolygon(shape)
      }
      if (shapeType === 'circle') {
        this.drawCircle(shape)
      }
    })
  }

  drawPolygon (shape) {
    const context = this.context
    const vertices = shape.m_vertices
    context.beginPath()
    vertices.forEach((vertex, i) => {
      const x = vertex.x
      const y = vertex.y
      if (i === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    })
    context.closePath()
    context.fill()
  }

  drawCircle (shape) {
    const context = this.context
    const radius = shape.m_radius
    const center = shape.getCenter()
    context.beginPath()
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    context.fill()
  }

  drawEdge (shape) {
    const v1 = shape.m_vertex1
    const v2 = shape.m_vertex2
    this.context.beginPath()
    this.context.moveTo(v1.x, v1.y)
    this.context.lineTo(v2.x, v2.y)
    this.context.lineCap = 'round'
    this.context.stroke()
  }

  getFixtures () {
    const fixtures = []
    for (let body = this.world.getBodyList(); body; body = body.getNext()) {
      for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
        fixtures.push(fixture)
      }
    }
    return fixtures
  }

  setupCanvas () {
    const context = this.context
    const canvas = context.canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    this.followCamera()
  }

  followCamera () {
    const context = this.context
    const canvas = context.canvas
    context.resetTransform()
    context.translate(0.5 * canvas.width, 0.5 * canvas.height)
    const vmin = Math.min(canvas.width, canvas.height)
    context.scale(0.02 * vmin, -0.02 * vmin)
  }
}

export { Runner }
