let filesList = document.getElementById('filesList');
let header = filesList.querySelector('.Table-Row_header');
let files = filesList.querySelectorAll('.Table-Row:not(.Table-Row_header)');
let searchForm = document.getElementById('searchForm');
let searchField = document.getElementById('searchField');
let newFiles = [];

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let searchVal = searchField.value.trim();
	let oldFiles = files;

	if (searchVal) {
		for (let i = 0; i < oldFiles.length; i++) {
			if (oldFiles[i].firstElementChild.innerText.includes(searchVal)) {
				newFiles.push(oldFiles[i]);
			}
		}

		filesList.innerHTML = '';
		filesList.appendChild(header);

		newFiles.forEach(file => {
			filesList.appendChild(file);
		});

		newFiles = [];
		oldFiles = filesList.querySelectorAll('.Table-Row:not(.Table-Row_header)');
	} else {
		filesList.innerHTML = '';
		filesList.appendChild(header);
		for (let i = 0; i < files.length; i++) {
			filesList.appendChild(files[i]);
		}
	}
});
