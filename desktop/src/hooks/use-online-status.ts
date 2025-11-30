import { useState, useEffect } from "react";

/**
 * @param {number} interval 
 */
export function useOnlineStatus(interval = 5000) {
  const [isReachable, setIsReachable] = useState(true);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const checkConnection = async () => {
      try {
        const ok = await window.api.checkConnection();
        setIsReachable(ok);
      } catch {
        setIsReachable(false);
      }
    };

    checkConnection();
    // eslint-disable-next-line prefer-const
    timerId = setInterval(checkConnection, interval);

    return () => clearInterval(timerId);
  }, [interval]);

  return { isReachable };
}
