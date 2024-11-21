

export const replaceWithDefaults = (input: string) => {

  let obj = input.replace(/null/g, '"-"');

  return obj;
};