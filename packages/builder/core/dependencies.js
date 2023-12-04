module.exports.getDependenciesFromPackageLock = function (packageLock) {
  return Object.keys(packageLock.dependencies || {});
};
