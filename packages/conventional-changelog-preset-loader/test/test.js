'use strict'

const chai = require('chai')
const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const { createPresetLoader } = require('../')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)
const expect = chai.expect
const mockModuleLoader = () => () => ({})
const mockUnprefixedModuleLoader = (moduleName) => {
  if (/(^|\/)conventional-changelog-/.test(moduleName)) {
    throw new Error('Module not found')
  }

  return () => ({})
}

describe('createPresetLoader', () => {
  it('should load unscoped package', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('angular')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('conventional-changelog-angular')
  })

  it('should load unscoped package containing path', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('angular/preset/path')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('conventional-changelog-angular/preset/path')
  })

  it('should load unscoped package with full package name', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('conventional-changelog-angular')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('conventional-changelog-angular')
  })

  it('should load unscoped package with full package name containing path', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('conventional-changelog-angular/preset/path')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('conventional-changelog-angular/preset/path')
  })

  it('should load scoped package', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('@scope/angular')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('@scope/conventional-changelog-angular')
  })

  it('should load scoped package containing path', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('@scope/angular/preset/path')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('@scope/conventional-changelog-angular/preset/path')
  })

  it('should load scoped package with full package name', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('@scope/conventional-changelog-angular')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('@scope/conventional-changelog-angular')
  })

  it('should load scoped package with full package name containing path', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('@scope/conventional-changelog-angular/preset/path')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('@scope/conventional-changelog-angular/preset/path')
  })

  it('should load package with an absolute file path', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)
    const filePath = require.resolve('conventional-changelog-angular')

    await load(filePath)

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(filePath)
  })

  it('should load package with an absolute file path name', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)
    const filePath = require.resolve('conventional-changelog-angular')

    await load({ name: filePath })

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith(filePath)
  })

  it('should load package in @conventional-changelog scope', async () => {
    const requireMethod = sinon.spy(mockModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('@conventional-changelog/preset-angular')

    expect(requireMethod).to.have.been.calledOnce
      .and.to.have.been.calledWith('@conventional-changelog/preset-angular')
  })

  it('should load package without adding prefix', async () => {
    const requireMethod = sinon.spy(mockUnprefixedModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('trigen-conventional-changelog-angular')

    expect(requireMethod.getCalls().map(call => call.args)).to.deep.equal([
      ['conventional-changelog-trigen-conventional-changelog-angular'],
      ['trigen-conventional-changelog-angular']
    ])
  })

  it('should load scoped package without adding prefix', async () => {
    const requireMethod = sinon.spy(mockUnprefixedModuleLoader)
    const load = createPresetLoader(requireMethod)

    await load('@trigen/cc-preset-angular')

    expect(requireMethod.getCalls().map(call => call.args)).to.deep.equal([
      ['@trigen/conventional-changelog-cc-preset-angular'],
      ['@trigen/cc-preset-angular']
    ])
  })
})
