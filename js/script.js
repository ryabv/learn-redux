const Types = {
	SET_SEARCH_STRING: 'SET_SEARCH_STRING'
};

const setSearchVal = string => ({
	type: Types.SET_SEARCH_STRING,
	payload: string
});


class View {
	constructor(el, store) {
		this._el = el;
		this._store = store;
		this._unsubscribe = store.subscribe(() => {
			this._prepareRender.bind(this);
		});
		this._prepareRender(store.state);
	}

	_prepareRender(state) {
		this._el.innerHTML = this.render(state);
	}

	render() {
		// реализация должна быть добавлена в подклассах
	}

	destroy() {
		this._el.innerHTML = '';
		this._unsubscribe();
	}
}

class Search extends View {
	constructor(el, store) {
		super(el, store);
		this._onInput = this._onInput.bind(this);
		this._el.addEventListener('change', this._onInput);
	}

	_onInput(event) {
		event.preventDefault();
		this._store.dispatch(setSearchVal(event.target.value.trim()));
	}

	destroy() {
		super.destroy();
		this._el.removeEventListener('change', this._onInput);
	}
}


class Table extends View {
	constructor(el, store) {
		super(el, store);
		this._unsubscribe = store.subscribe(() => {
			let r = this._prepareRender.bind(this);
			r(store.state);
		});
	}

	_prepareRender(state) {
		this._el.innerHTML = this.render(state);
	}

	render(state) {
		let files = state.files;
		let tableContent = ``;

		files.forEach(el => {
			let type = this._defineType(el.file.type);
			let elIncludesSearchString = el.file.name.toLowerCase().includes(state.search);

			if (elIncludesSearchString) {
				tableContent += 
				`<tr class="Table-Row">
					<td class="Table-Td"><a class="Link Link_weight_bold Link_color_black ${type} Link_mob_after-link" href="#">${el.file.name}</a></td>
					<td class="Table-Td"><a class="Link" href="#">${el.commit.name}</a></td>
					<td class="Table-Td">${el.commit.messagePrefix} <a class="Link" href="">${el.commit.messageLink}</a> ${el.commit.message}</td>
					<td class="Table-Td"><span class="Name">${el.commit.author}</span><span class="Table-Mobile">, ${el.updated}</span></td>
					<td class="Table-Td">${el.updated}</td>
				</tr>`;
			}
		});

		return tableContent;
	}

	_defineType(type) {
		switch (type) {
			case 'folder':
				return 'Link_before_folder';
			case 'code':
				return 'Link_before_code';
			case 'text':
				return 'Link_before_text';
			default:
				return '';
		}
	}	

	destroy() {
		super.destroy();
	}
}


function updateState(state, action) {
	switch (action.type) {
		case Types.SET_SEARCH_STRING:
			return {
				...state,
				search: action.payload
			}
		default:
			return state;
	}
}


class Store {
	constructor(reducer, state) {
		this._reducer = reducer;
		this._state = state;
		this._listeners = [];
	}

	get state() {
		return this._state;
	}

	_notifyListeners() {
		this._listeners.forEach(listener => {
			listener(this._state);
		});
	}

	dispatch(action) {
		this._state = this._reducer(this._state, action);
		this._notifyListeners();
	}

	subscribe(callback) {
		this._listeners.push(callback);
		return () => this._listeners = this._listeners.filter(cb => cb !== callback);
	}
}

const store = new Store(updateState, initialState); // initialState находится в файле data.js
const search = new Search(document.getElementById('searchField'), store);
const table = new Table(document.getElementById('filesList'), store);
