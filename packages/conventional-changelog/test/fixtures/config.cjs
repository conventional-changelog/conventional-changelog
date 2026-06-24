module.exports = {
  writer: {
    template: context => `${context.commitGroups?.[0]?.commits?.[0]?.type || ''}${context.testContext || ''}template`
  }
}
