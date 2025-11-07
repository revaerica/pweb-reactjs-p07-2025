import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { booksService } from '../services/books';
import { Genre, BookFormData } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

const AddBook = () => {
  const navigate = useNavigate();

  // State
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    writer: '',
    publisher: '',
    price: 0,
    stock: 0,
    genre_id: '',              // string sesuai backend
    isbn: '',
    description: '',
    publication_year: undefined, // optional
    condition: 'new',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await booksService.getGenres();
        setGenres(data);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.writer) newErrors.writer = 'Writer is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.genre_id) newErrors.genre_id = 'Genre is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['price', 'stock', 'publication_year'].includes(name)
        ? Number(value)
        : value,
    });
  };

  // Handle image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof BookFormData];
        if (value !== undefined && value !== null) {
          submitData.append(key, String(value));
        }
      });

      if (imageFile) {
        submitData.append('image', imageFile); // ⚡ harus sama dengan backend multer
      }

      await booksService.createBookWithImage(submitData);

      alert('Book added successfully!');
      navigate('/books');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingGenres) {
    return <Loading message="Loading form..." />;
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <Link to="/books" className="back-link">← Back to Books</Link>
          <h1>Add New Book</h1>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <Input
            label="Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter book title"
          />

          <div className="input-group">
            <label className="input-label">Book Cover Image</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Book preview" className="image-preview" />
                  <button type="button" onClick={removeImage} className="btn btn-danger btn-small remove-image-btn">
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="book-image"
                    className="image-input"
                  />
                  <label htmlFor="book-image" className="image-upload-label">
                    <span className="upload-icon">📷</span>
                    <span>Click to upload book cover</span>
                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <Input label="Writer *" name="writer" value={formData.writer} onChange={handleChange} error={errors.writer} placeholder="Enter writer name" />
          <Input label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Enter publisher name" />

          <div className="form-row">
            <Input label="Price *" type="number" name="price" value={formData.price} onChange={handleChange} error={errors.price} placeholder="0" />
            <Input label="Stock *" type="number" name="stock" value={formData.stock} onChange={handleChange} error={errors.stock} placeholder="0" />
          </div>

          <div className="input-group">
            <label className="input-label">Genre *</label>
            <select name="genre_id" value={formData.genre_id} onChange={handleChange} className={`input ${errors.genre_id ? 'input-error' : ''}`}>
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            {errors.genre_id && <span className="error-message">{errors.genre_id}</span>}
          </div>

          <Input label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="Enter ISBN" />
          <Input label="Publication Year" type="number" name="publication_year" value={formData.publication_year || ''} onChange={handleChange} placeholder="YYYY" />

          <div className="input-group">
            <label className="input-label">Condition</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="input">
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="input textarea" rows={4} placeholder="Enter book description" />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/books')}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Add Book</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
