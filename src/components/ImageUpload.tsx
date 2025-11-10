import { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Pilih file dulu");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:8080/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedImage(`http://localhost:8080${res.data.data.image}`);
      alert("Image uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload gagal");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book title"
        />
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      {uploadedImage && <img src={uploadedImage} alt="Uploaded book" style={{ marginTop: "1rem", maxWidth: "200px" }} />}
    </div>
  );
};

export default ImageUpload;
