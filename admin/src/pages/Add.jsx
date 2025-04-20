import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const AdminAddPhone = ({ token }) => {
  const [formData, setFormData] = useState({
    brand: '',
    phoneName: '',
    model: '',
    price: '',
    firstHandPrice: '',
    description: '',
    ram: '',
    rom: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
    isAvailable: true,
    userId:''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages].slice(0, 4));
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadToCloudinary = async () => {
    const uploadedUrls = [];
    
    for (const img of images) {
      const formData = new FormData();
      formData.append("file", img.file);
      formData.append("upload_preset", "phone_upload_preset");
      
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dekchfnsk/image/upload",
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    
    try {
      const imageUrls = await uploadToCloudinary();
      
      const phoneData = {
        ...formData,
        images: imageUrls,
        isAvailable: formData.isAvailable,
      };

      const response = await axios.post("http://localhost:4000/api/phones", phoneData);

      if (response.data.success) {
        toast.success("Phone added successfully!");
        // Reset form
        setFormData({
          brand: '',
          phoneName: '',
          model: '',
          price: '',
          firstHandPrice: '',
          description: '',
          ram: '',
          rom: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
          phone: '',
          isAvailable: true
        });
        setImages([]);
      } else {
        throw new Error(response.data.message || "Failed to add phone");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Add phone error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Phone (Admin)</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Selection */}
        <div>
          <label className="block mb-2 font-medium">Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Brand</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Google">Google</option>
            <option value="Other">Other</option>
          </select>
          {formData.brand === "Other" && (
            <input
              type="text"
              name="brand"
              placeholder="Specify Brand"
              className="w-full p-2 border rounded mt-2"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          )}
        </div>

        {/* Phone Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Phone Name</label>
            <input
              type="text"
              name="phoneName"
              value={formData.phoneName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. iPhone 15 Pro"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. A2849"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Price (Rs)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 999"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Original Price (Rs)</label>
            <input
              type="number"
              name="firstHandPrice"
              value={formData.firstHandPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 1099"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">RAM (GB)</label>
            <input
              type="number"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 8"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Storage (GB)</label>
            <input
              type="number"
              name="rom"
              value={formData.rom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 256"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Detailed description of the phone..."
          ></textarea>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. New York"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. NY"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Zipcode</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 10001"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. USA"
            />
          </div>
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block mb-2 font-medium">Contact Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. +1234567890"
          />
        </div>

        {/* Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="isAvailable" className="block mb-2 font-medium">
              Available for sale
            </label>
          </div>

          <div>
            <label className="block mb-2 font-medium">Sold By</label>
            <input
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. 8"
            />
          </div>
          
        </div>
        

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium">Images (Max 4)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
            disabled={images.length >= 4 || loading}
          />
          
          {/* Image Previews */}
          <div className="flex flex-wrap gap-4 mt-4">
            {images.length > 0 ? (
              images.map((img, index) => (
                <div key={index} className="relative">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${index}`}
                    className="h-24 w-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-24 w-24 border-2 border-dashed rounded flex items-center justify-center">
                    <img src={assets.upload_area} alt="Upload area" className="w-12 opacity-50" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Adding Phone...' : 'Add Phone'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddPhone;