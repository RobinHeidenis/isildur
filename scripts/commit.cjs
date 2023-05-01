//@ts-check

/**
 * @param {{confirmed: boolean, summary: string, releases: {name: string, type: string}[]}} param0
 */
const getAddMessage = ({ confirmed, summary, releases }) => {
  if (!confirmed) return;

  return `changes: 🏹 [${releases.map((r) => r.name).join(", ")}] ${summary}
    
${releases.map((r) => ` - ${r.name}: ${r.type}`).join("\n")}
`;
};

/**
 * @param {{changesets: {releases: {name: string, type: string}[], summary: string, id: string}[], releases: {name: string, type: string, oldVersion: string, newVersion: string, changesets: string[]}[]}} param0
 * @returns {string}
 */
const getVersionMessage = ({ changesets, releases }) => {
  return `release: 🚀 [${releases.map((r) => r.name).join(", ")}]

${releases
  .map(
    (r) => ` - ${r.name}: [${r.type}] ${r.oldVersion} -> ${r.newVersion}
${r.changesets
  .map(
    (c) =>
      `   - ${
        changesets.find((rootChangeset) => rootChangeset.id === c)?.summary
      }`
  )
  .join("\n")}`
  )
  .join("\n")}
`;
};

module.exports = {
  getAddMessage,
  getVersionMessage,
};
