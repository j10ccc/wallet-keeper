export const useGuid = () => {
  const s4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  const guid = `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;

  return {
    guid
  };
};
