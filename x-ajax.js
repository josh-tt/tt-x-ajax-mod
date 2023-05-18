/**
 * WIP: Modification of x-ajax directive based on ewkoka/x-ajax that adds teleport and children modifiers
 * For example x-ajax.query.class.ajax.children.teleport gets the 'ajax' div's children fetched and teleports them to the ajax div
 * Add a custom query location to move it somewhere else.
 * For example, x-ajax.query.class.ajax.children.teleport
 */
const xParser = new DOMParser();

export default function (Alpine) {
	Alpine.directive('ajax', async (el, { expression, modifiers }, { effect, evaluateLater }) => {
		const target = evaluateLater(expression);
		let query;

		// New: Check if the 'transition' modifier is present, if it is we add a class to the element
		let applyTransition = false;
		if (modifiers.includes('transition')) {
			applyTransition = true;
		}

		if (modifiers.includes('query')) query = modifiers[modifiers.indexOf(modifiers.includes('class') ? 'class' : 'query') + 1];
		if (modifiers.includes('class')) query = '.' + query;

		effect(() => {
			target(async (target) => {
				if (!target) return el.dispatchEvent(new CustomEvent('halted', { detail: 'Target is not defined', ...eventDefaults }));
				try {
					const response = await fetch(target, { mode: 'no-cors' });
					if (!response.ok) throw new Error(response.statusText);
					const content = await response.text();
					const doc = xParser.parseFromString(content, 'text/html');

					// NEW: Changed to let so we can reassign it
					let selector = query ? (modifiers.includes('all') ? doc.body.querySelectorAll(query) : doc.body.querySelector(query)) : doc.body;
					if (!selector) throw new Error('Selected element not found');

					// NEW: Children modifier
					if (modifiers.includes('children')) {
						if (selector instanceof NodeList) {
							if (![...selector].some(node => node.children.length)) throw new Error('Selected elements have no children');
							selector = [...selector].flatMap(node => [...node.children]);
							console.log('Children modifier, selector: ' + selector);
						} else {
							if (!selector.children.length) throw new Error('Selected element has no children');
							console.log('Not node list handled, selector: ' + selector.children);
							selector = [...selector.children];
						}
					}

					el.dispatchEvent(new Event('load', eventDefaults));

					// NEW: Teleports to the queried location
					if (modifiers.includes('teleport')) {
						console.log('Teleporting to query location, query: ' + query);
						// Uses the default query (todo: Should add unique modifier to teleport to a custom location?)
						const teleportTarget = document.querySelector(query);
						if (!teleportTarget) throw new Error('Teleport target not found. Make sure you have a query modifier with a valid selector');
						if (Array.isArray(selector)) {
							selector.forEach(child => {

								// Check if the 'transition' modifier is present
								if (applyTransition) {
									child.setAttribute('x-fade-in', '300');
								}

								teleportTarget.appendChild(child.cloneNode(true));
							});

							// Wait a tick to remove the originals after we move them
							setTimeout(() => selector.forEach(child => child.remove()), 0);
						} else {
							// Check if the 'transition' modifier is present
							if (applyTransition) {
								selector.setAttribute('x-fade-in', '300');
							}
							// Move the element to the teleport target
							teleportTarget.appendChild(selector.cloneNode(true));
							// Remove the original after we move them
							setTimeout(() => selector.forEach(child => child.remove()), 0);
						}
					}

					if (modifiers.includes('replace')) return el.replaceWith(selector);
					if (modifiers.includes('all')) return el.replaceChildren(...selector);
					if (selector.tagName == 'BODY') return el.replaceChildren(...selector.children);
					return el.replaceChildren(selector);
				} catch (e) {
					console.error(e);
					el.dispatchEvent(new Event('error', { detail: e, ...eventDefaults }));
				}
			});
		});
	});
}

const eventDefaults = {
	bubbles: false
};
