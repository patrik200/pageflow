export function isNextBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}
