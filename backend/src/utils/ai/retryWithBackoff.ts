export const retryWithBackoff = async (fn:any, retries = 3, delay = 1777): Promise<any> => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * (1 + 2 * Math.random()));
    } else {
      throw err;
    }
  }
};