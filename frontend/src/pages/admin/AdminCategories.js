import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Plus, Edit, Trash2, Save, X, ArrowLeft,
  LayoutDashboard, ShoppingCart, LogOut, Menu, Grid3x3, ArrowUpDown, Upload
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL || 'https://fresh-meat-hub-backend-2.onrender.com'}/api`;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    displayOrder: '',
    coverImage: '',
    description: '',
  });
  const navigate = useNavigate();

  // Check auth
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, coverImage: response.data.imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      displayOrder: (categories.length + 1).toString(),
      coverImage: '',
      description: '',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      displayOrder: category.displayOrder.toString(),
      coverImage: category.coverImage || '',
      description: category.description || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter category name');
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      displayOrder: parseInt(formData.displayOrder) || 0,
      coverImage: formData.coverImage || null,
      description: formData.description.trim() || '',
    };

    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, categoryData);
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${API}/categories`, categoryData);
        toast.success('Category added successfully');
      }
      
      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${API}/categories/${categoryId}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete category');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: Grid3x3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-categories-page">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <span className="font-heading font-bold text-lg">Categories</span>
        </div>
        <Button onClick={openAddDialog} size="sm" className="bg-primary">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-800">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white">Fresh Meat Hub</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/admin/categories';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl lg:text-3xl text-gray-900 mb-2">
                  Categories Management
                </h1>
                <p className="text-gray-600">{categories.length} categories in your store</p>
              </div>
              <Button
                onClick={openAddDialog}
                className="hidden lg:flex rounded-full bg-primary hover:bg-primary/90"
                data-testid="add-category-btn"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            </div>

            {/* Categories List */}
            {loading ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="skeleton h-5 w-32 rounded" />
                      <div className="skeleton h-8 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first category</p>
                <Button onClick={openAddDialog} className="rounded-full bg-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Category
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    data-testid={`category-item-${category.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-bold">{category.displayOrder}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize text-lg">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">Display Order: {category.displayOrder}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          data-testid={`edit-category-${category.id}`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          data-testid={`delete-category-${category.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Category Name */}
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Fish"
                className="mt-1"
                data-testid="input-category-name"
              />
              <p className="text-xs text-gray-500 mt-1">Enter the category name (will be converted to lowercase)</p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Fresh seafood & fish"
                className="mt-1"
                data-testid="input-category-description"
              />
              <p className="text-xs text-gray-500 mt-1">Brief description shown on category card</p>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label htmlFor="coverImage">Cover Image *</Label>
              <div className="mt-1 space-y-2">
                <Input
                  id="coverImageFile"
                  name="coverImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="cursor-pointer"
                  data-testid="input-cover-image"
                />
                <p className="text-xs text-gray-500">Upload an image (max 5MB) - jpg, png, webp</p>
                
                {uploadingImage && (
                  <p className="text-sm text-blue-600">Uploading image...</p>
                )}
                
                {formData.coverImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Display Order */}
            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                className="mt-1"
                data-testid="input-display-order"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploadingImage}
                className="flex-1 bg-primary hover:bg-primary/90"
                data-testid="save-category-btn"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingCategory ? 'Update' : 'Add Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
