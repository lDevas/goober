import { useCallback, useRef } from "react";

export const useStopwatch = (
  callback: (elapsedTime: number, stopTimer: () => void) => void,
  interval: number,
): [() => void, () => void] => {
  const jsInterval = useRef<NodeJS.Timeout | undefined>();

  const stop = useCallback(() => {
    clearInterval(jsInterval.current);
  }, []);

  const start = useCallback(() => {
    const startedAt = Date.now();
    jsInterval.current = setInterval(
      () => callback(Date.now() - startedAt, stop),
      interval,
    );
  }, [interval, callback, stop]);

  return [start, stop];
};
