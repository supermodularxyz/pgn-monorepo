export const parseEthersError = (err?: string) => {
  return err && (err?.match(/reason="([^"]*)"/)?.[1] || "Unknown error");
};
