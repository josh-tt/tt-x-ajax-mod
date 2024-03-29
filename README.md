# x-ajax-mod
Modifies the x-ajax plugin by ekwoka to support children
[https://github.com/ekwoka/alpine-plugins
](https://github.com/ekwoka/alpine-plugins/blob/main/xajax/src/index.js)
## text requests
`<div x-data="{url: 'https://edd-back-to-the-future-ii.local/products/'}">

		<!-- 1. Basic Case: Empty div -->
		<div x-ajax-mod.query.class.empty-div="url">...loading</div>

		<!-- 2. Basic Text Element: Fetch a div with plain text inside -->
		<div x-ajax-mod.query.class.text-element="url">...loading</div>

		<!-- 3. Nested Div: Fetch an element that has a child element -->
		<div x-ajax-mod.query.class.nested-div.children="url">...loading</div>

		<!-- 4. Nested Div: Fetch a nested div including the parent wrapper -->
		<div x-ajax-mod.query.class.nested-div="url">...loading</div>

		<!-- 5. Multiple Divs: Fetch multiple sibling divs without replacement -->
		<div x-ajax-mod.query.class.multiple-divs.children="url">...loading</div>

		<!-- 6. Multiple Divs: Fetch all divs inside .multiple-divs and replace existing content with all of them -->
		<div x-ajax-mod.query.class.multiple-divs.all.children="url">...loading</div>

		<!-- 7. Entire Content: Fetch the entire content without the body tag -->
		<div x-ajax-mod="url">...loading</div>

		<!-- 8. Edge Case: Combining 'all', 'replace' and 'children' (not a common use, but for testing). Should return nothing -->
		<div x-ajax-mod.query.class.multiple-divs.all.replace.children="url">...loading</div>

		<!-- 9. Edge Case with Children: Combining 'all', 'replace' and 'children' on an element with children. -->
		<div class="parent-div">
			<div x-ajax-mod.query.class.multiple-divs.all.replace.children="url">...loading</div>
		</div>

</div>`

