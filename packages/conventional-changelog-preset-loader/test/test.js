'use strict'

const chai = require(`chai`)
const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const presetLoader = require(`../`).presetLoader
const sinon = require(`sinon`)
const sinonChai = require(`sinon-chai`)

chai.use(sinonChai)
const expect = chai.expect

describe(`presetLoader`, () => {
  it(`loads unscoped package`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`angular`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`conventional-changelog-angular`)
  })

  it(`loads unscoped package containing path`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`angular/preset/path`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`conventional-changelog-angular/preset/path`)
  })

  it(`loads unscoped package with full package name`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`conventional-changelog-angular`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`conventional-changelog-angular`)
  })

  it(`loads unscoped package with full package name containing path`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`conventional-changelog-angular/preset/path`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`conventional-changelog-angular/preset/path`)
  })

  it(`loads scoped package`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`@scope/angular`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`@scope/conventional-changelog-angular`)
  })

  it(`loads scoped package containing path`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`@scope/angular/preset/path`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`@scope/conventional-changelog-angular/preset/path`)
  })

  it(`loads scoped package with full package name`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`@scope/conventional-changelog-angular`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`@scope/conventional-changelog-angular`)
  })

  it(`loads scoped package with full package name containing path`, () => {
    const requireMethod = sinon.spy()
    const load = presetLoader(requireMethod)

    load(`@scope/conventional-changelog-angular/preset/path`)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(`@scope/conventional-changelog-angular/preset/path`)
  })
})
