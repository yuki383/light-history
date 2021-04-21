function createEvents<F extends () => void>() {
  const handlers: F[] = [];

  return {
    push(fn: F) {
      handlers.push(fn);
    },
    call() {
      handlers.forEach((fn) => fn());
    },
  };
}

function craeteHistory() {
  const listeners = createEvents();

	function applyTransition() {
		listeners.call();
	}

  function go(i: number) {
    history.go(i);
  }

  function listen(fn: () => void) {
    listeners.push(fn);
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
  };
}

