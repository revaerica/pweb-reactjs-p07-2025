import React, { useEffect, useState } from "react";
import { genreService } from "../services/genre";
import { Genre } from "../types";

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Ambil data genre
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await genreService.getGenres(search);
      setGenres(data);
    } catch (error) {
      console.error("Gagal ambil genre:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [search]);

  // Tambah atau update genre
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await genreService.updateGenre(editId, name);
        alert("Genre berhasil diupdate!");
      } else {
        await genreService.createGenre(name);
        alert("Genre berhasil ditambahkan!");
      }
      setName("");
      setEditId(null);
      fetchGenres();
    } catch (error) {
      console.error("Gagal simpan genre:", error);
    }
  };

  // Hapus genre
  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin mau hapus genre ini?")) return;
    try {
      await genreService.deleteGenre(id);
      alert("Genre berhasil dihapus!");
      fetchGenres();
    } catch (error) {
      console.error("Gagal hapus genre:", error);
    }
  };

  // Masukkan data ke form saat mau edit
  const handleEdit = (genre: Genre) => {
    setEditId(genre.id);
    setName(genre.name);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📚 Genre Management</h1>

      {/* 🔍 Pencarian */}
      <input
        type="text"
        placeholder="Cari genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full"
      />

      {/* 📝 Form Tambah/Edit */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nama genre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editId ? "Update" : "Tambah"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
            }}
            className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        )}
      </form>

      {/* 📄 Tabel Genre */}
      {loading ? (
        <p>Loading...</p>
      ) : genres.length === 0 ? (
        <p>Tidak ada genre ditemukan.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nama Genre</th>
              <th className="border p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((genre) => (
              <tr key={genre.id}>
                <td className="border p-2">{genre.name}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(genre.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GenreList;
