const xParser = new DOMParser();

export default function (Alpine) {
  Alpine.directive('ajax-mod', async (el, { expression, modifiers }, { effect, evaluateLater }) => {

    const target = evaluateLater(expression);
    let query;

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

          // If both 'all' and 'children' modifiers, append '>*' to the query to select all children of the selected element.
          const updatedQuery = modifiers.includes('all') ?
            doc.body.querySelectorAll(modifiers.includes('children') ? query+'>*' : query) :
            doc.body.querySelector(query);

          const selector = query ? updatedQuery : doc.body;
          if (!selector) throw new Error('Selected element not found');

          el.dispatchEvent(new Event('load', eventDefaults));
          if (modifiers.includes('replace')) return el.replaceWith(selector);
          if (modifiers.includes('all')) return el.replaceChildren(...selector);

          // Include a check for 'children' modifier
          if (selector.tagName == 'BODY' || modifiers.includes('children')) return el.replaceChildren(...selector.children);

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