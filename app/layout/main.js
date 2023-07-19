import { Input, Space, Button, Spin } from "antd";
import { html } from "htm/react";
import { useEffect, useRef, useState } from "react";
import initSqlJs from "sql.js";
import css from "./main.css" assert { type: "css" };

document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

const queries = {
  books: "SELECT * FROM books",
  chapters: `SELECT book_number, COUNT(DISTINCT chapter) as num_chapters FROM verses GROUP BY book_number`,
  verses: (book, chapter) => `select * from verses where book_number = ${book} and chapter = ${chapter}`,
};

const getDBData = ([{ columns, values }]) => {
  return values.map((v, i) => columns.reduce((r, k, i) => ({ ...r, [k]: v[i] }), {}));
};

export function Main() {
  const [db, setDB] = useState();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [verses, setVerses] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    initSqlJs({ locateFile: (file) => `https://sql.js.org/dist/${file}` }).then((SQL) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/assets/bibles/NVT.SQLite3", true);
      xhr.responseType = "arraybuffer";
      xhr.onload = () => setDB(new SQL.Database(new Uint8Array(xhr.response)));
      xhr.send();
    });
  }, []);

  useEffect(() => {
    if (!db) return;

    try {
      const books = getDBData(db.exec(queries.books));
      const chapters = getDBData(db.exec(queries.chapters));

      chapters.forEach((c) => {
        const idx = books.findIndex((b) => b.book_number === c.book_number);
        books[idx].num_chapters = c.num_chapters;
      });

      setBooks(books);
      setLoading(false);
      setSelected([books[0].book_number, 1]);
    } catch (err) {
      console.log(err);
    }
  }, [db]);

  useEffect(() => {
    if (selected.length) {
      try {
        const data = getDBData(db.exec(queries.verses(...selected)));
        setVerses(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  }, [db, selected]);

  if (loading) {
    return html`
      <div data-main class="loading">
        <${Spin} className="spin" />
      </div>
    `;
  }

  const handleSearch = () => {
    const query = inputRef.current.input.value.trim();

    if (query) {
      const [book, refs] = query.split(/\s+/);
      const [chapter, verses] = refs.split(/[.:]/);
      const bookNumber = books.find(b => {
        const bb = book.toLowerCase();
        return b.short_name.toLowerCase() === (bb === "ex" ? "êx" : bb);
      })?.book_number;

      console.log(`book: ${bookNumber}, chapter: ${chapter}, verses: ${verses}`);
    }
  };

  return html`
    <div data-main>
      <${Space} direction="vertical">
        <${Space}>
          <${Input} ref=${inputRef} placeholder="Digite a referência bíblica" />
          <${Button} onClick=${handleSearch}>Buscar<//>
        <//>
      <//>
    </div>
  `;
}
