module.exports = Promise.resolve({
  writer: {
    template: context => `${context.commitGroups?.[0]?.commits?.[0]?.type || ''}${context.testContext || ''}template`
  }
})
