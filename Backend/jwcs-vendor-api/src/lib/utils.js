/** An empty function that always returns nothing. */
export function noHandler() {
  return;
}

/**
 * Sets a timeout asynchronously, with a Promise.
 * Returns any value returned by the optional handler.
 * @template TResult
 * @param {number} [timeout] The timeout time in milliseconds.
 * @param {(...args)=>TResult} [handler] Callback which may return a value.
 * @param {any[]} [args] Arguments to pass to the `handler`.
 * @returns {TResult} The value returned by the handler, if any.
 */
export function timeoutAsync(timeout = 350, handler = noHandler, ...args) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = handler(...args);
      resolve(result);
    }, timeout);
  });
}
