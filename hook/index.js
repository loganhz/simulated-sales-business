async function preInit(inputObj) {}

async function postInit(inputObj) {
  const { artTemplate } = inputObj;
  artTemplate("code/workflow/flow-template.yml");
}

module.exports = {
  postInit,
  preInit,
};
