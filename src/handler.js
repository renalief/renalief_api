const {
	nanoid
} = require('nanoid');
let books = require('./books');

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading
	} = request.payload;

	const id = nanoid(16);
	const createdAt = new Date().toISOString();
	const updatedAt = createdAt;
	let finished = 0;

	if (pageCount === readPage) {
		finished = 1
	} else {
		finished = 0;
	}

	if (name != "" && name != null && readPage <= pageCount) {
		const newBook = {
			id,
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			finished,
			reading,
			createdAt,
			updatedAt
		};
		books.push(newBook);
	}
	const isSuccess = books.filter((book) => book.id === id).length > 0;


	if (name == "" || name == null) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		response.header('Access-Control-Allow-Origin', '*');
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		response.header('Access-Control-Allow-Origin', '*');
		return response;
	} else if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});
		response.code(201);
		response.header('Access-Control-Allow-Origin', '*');
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Buku gagal ditambahkan',
		});
		response.code(500);
		response.header('Access-Control-Allow-Origin', '*');
		return response;
	}
};

const getAllBooksHandler = (request, h) => {
	const {
		name,
		reading,
		finished
	} = request.query;


	const books1 = books;

	if (reading !== undefined) {
		books = books.filter((n) => n.reading == reading);
	} else if (finished !== undefined) {
		books = books.filter((n) => n.finished == finished);
	} else if (name !== undefined) {
		books = books.filter((n) => n.name == name);
	}

	books = books.map(item => {
		const container = {};
		container["id"] = item.id;
		container["name"] = item.name;
		container["publisher"] = item.publisher;
		return container;
	})

	const response = h.response({
		status: 'success',
		data: {
			books,
		},
	});

	books = books1;
	response.code(200);
	return response;
};

const getBookByIdHandler = (request, h) => {
	const {
		bookId
	} = request.params;

	const book = books.filter((n) => n.id === bookId)[0];

	if (book !== undefined && book !== null) {
		const response = h.response({
			status: 'success',
			data: {
				books
			},
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

const editBookByIdHandler = (request, h) => {
	const {
		bookId
	} = request.params;

	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading
	} = request.payload;

	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === bookId);

	if (name == null || name == "") {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	} else if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
		response.code(200);
		return response;
	} else if (bookId === undefined || bookId === "xxxxx") {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

const deleteBookByIdHandler = (request, h) => {
	const {
		bookId
	} = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler
};
