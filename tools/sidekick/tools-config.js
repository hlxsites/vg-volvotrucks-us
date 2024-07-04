async function getConstantValues() {
  const url = '/constants.json';
  const constants = await fetch(url).then((resp) => resp.json());
  return constants;
}

const formatValues = (values) => {
  const obj = {};
  /* eslint-disable-next-line */
  values.forEach(({ name, value }) => obj[name] = value);
  return obj;
};

const {
  tools,
} = await getConstantValues();

const TOOLS_VALUES = formatValues(tools.data);
export default TOOLS_VALUES;
