import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import axiosInstance from "../../../services/api";

interface Blog {
  id: number;
  title: string;
  description: string;
  body: string;
  category: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function BasicTableBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    category: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const fetchBlogs = async () => {
    const res = await axiosInstance.get<Blog[]>("/blogs");
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openNewModal = () => {
    setFormData({ title: "", description: "", body: "", category: "" });
    setSelectedFiles([]);
    setPreviewImages([]);
    setEditingBlog(null);
    setModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setFormData({
      title: blog.title,
      description: blog.description,
      body: blog.body,
      category: blog.category,
    });
    setPreviewImages(blog.images || []);
    setSelectedFiles([]);
    setEditingBlog(blog);
    setModalOpen(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("body", formData.body);
    data.append("category", formData.category);
    selectedFiles.forEach(file => data.append("images", file));

    try {
      if (editingBlog) {
        await axiosInstance.patch(`/blogs/${editingBlog.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/blogs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error("Error al guardar el blog", err);
    }
  };

  const deleteBlog = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este blog?")) {
      await axiosInstance.delete(`/blogs/${id}`);
      fetchBlogs();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Gestión de Blogs</h2>
        <Button onClick={openNewModal}>+ Nuevo Blog</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="border p-4 rounded-xl shadow-sm space-y-2">
            {blog.images && blog.images.length > 0 && (
              <img src={blog.images[0]} alt={blog.title} className="w-full h-40 object-cover rounded-md" />
            )}
            <h3 className="text-lg font-bold">{blog.title}</h3>
            <p className="text-sm text-gray-600">{blog.description}</p>
            <p className="text-xs text-gray-500">Categoría: {blog.category}</p>
            <div className="flex justify-between pt-2">
              <Button size="sm" onClick={() => openEditModal(blog)}>Editar</Button>
              <Button size="sm" variant="outline" onClick={() => deleteBlog(blog.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <h3 className="text-xl font-semibold">{editingBlog ? "Editar Blog" : "Nuevo Blog"}</h3>
          <div>
            <Label>Título</Label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label>Descripción</Label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-800" rows={2} />
          </div>
          <div>
            <Label>Contenido</Label>
            <textarea name="body" value={formData.body} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-800" rows={4} />
          </div>
          <div>
            <Label>Categoría</Label>
            <Input name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div>
            <Label>Imágenes</Label>
            <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
            {previewImages.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewImages.map((src, idx) => (
                  <img key={idx} src={src} className="w-20 h-20 object-cover rounded-md border" />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
