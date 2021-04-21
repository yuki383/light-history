function createEvents<F extends () => void>() {
  let handlers: F[] = [];

  return {
    push(fn: F) {
      handlers.push(fn);
      return () => {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    call() {
      handlers.forEach((fn) => fn());
    },
  };
}

export function createHistory() {
  const listeners = createEvents();

  function applyTransition() {
    listeners.call();
  }

  function go(i: number) {
    history.go(i);
  }

  function listen(fn: () => void) {
    return listeners.push(fn);
  }

  function push(to: string) {
    history.pushState({}, "", to);
    applyTransition();
  }

  function replace(to: string) {
    history.replaceState({}, "", to);
    applyTransition();
  }

  window.addEventListener("popstate", () => {
    applyTransition();
  });

  return {
    listen,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    push,
    replace,
  };
}

