function createEvents<F extends (args: A) => void, A>() {
  let handlers: F[] = [];

  return {
    push(fn: F) {
      handlers.push(fn);
      return () => {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    call(args: A) {
      handlers.forEach((fn) => fn(args));
    },
  };
}

export type Location = {
	pathname: string;
	search: string;
	hash: string;
};

type Listener = (location: Location) => void;

export function createHistory() {
  const listeners = createEvents<Listener, Location>();

	function getLocation() {
		return {
			pathname: location.pathname,
			search: location.search,
			hash: location.hash,
		}
	}

  function applyTransition() {
		const location = getLocation();
    listeners.call(location);
  }

  function go(i: number) {
    history.go(i);
  }

  function listen(fn: (location: Location) => void) {
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

