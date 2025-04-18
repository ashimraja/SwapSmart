// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Configuration
// const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dekchfnsk/image/upload";
// const CLOUDINARY_UPLOAD_PRESET = "phone_upload_preset";
// const API_BASE_URL = "http://localhost:4000/api";
// const UPLOAD_TIMEOUT = 30000; // 30 seconds

// const Sell = () => {
//   const [formData, setFormData] = useState({
//     brand: "",
//     phoneName: "",
//     model: "",
//     price: "",
//     firstHandPrice: "",
//     description: "",
//     ram: "",
//     rom: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//     images: [],
//   });

//   const [fileInputs, setFileInputs] = useState([
//     { id: 1, file: null, preview: null, uploading: false, progress: 0 },
//     { id: 2, file: null, preview: null, uploading: false, progress: 0 },
//     { id: 3, file: null, preview: null, uploading: false, progress: 0 },
//     { id: 4, file: null, preview: null, uploading: false, progress: 0 },
//   ]);

//   const [loading, setLoading] = useState(false);

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const onFileChange = (id, e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type and size
//     if (!file.type.match("image.*")) {
//       toast.error("Please upload an image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     const updatedInputs = fileInputs.map(input => 
//       input.id === id 
//         ? { ...input, file, preview: URL.createObjectURL(file) }
//         : input
//     );

//     setFileInputs(updatedInputs);
//   };

//   const removeImage = (id) => {
//     const updatedInputs = fileInputs.map(input => 
//       input.id === id 
//         ? { ...input, file: null, preview: null, uploading: false, progress: 0 }
//         : input
//     );
//     setFileInputs(updatedInputs);
//   };

//   const uploadImage = async (file, id) => {
//     const formDataImage = new FormData();
//     formDataImage.append("file", file);
//     formDataImage.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     formDataImage.append("cloud_name", "dekchfnsk");

//     try {
//       const response = await axios.post(CLOUDINARY_UPLOAD_URL, formDataImage, {
//         timeout: UPLOAD_TIMEOUT,
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setFileInputs(prev => prev.map(input => 
//             input.id === id ? { ...input, progress } : input
//           ));
//         }
//       });

//       if (response.data.secure_url) {
//         return response.data.secure_url;
//       }
//       throw new Error("No secure URL returned from Cloudinary");
//     } catch (error) {
//       console.error(`Error uploading image ${id}:`, error);
//       throw error;
//     }
//   };

//   const uploadImages = async () => {
//     const filesToUpload = fileInputs.filter(input => input.file);
//     const uploadedUrls = [];

//     for (const input of filesToUpload) {
//       try {
//         setFileInputs(prev => prev.map(i => 
//           i.id === input.id ? { ...i, uploading: true } : i
//         ));

//         const url = await uploadImage(input.file, input.id);
//         uploadedUrls.push(url);

//         setFileInputs(prev => prev.map(i => 
//           i.id === input.id ? { ...i, uploading: false, progress: 100 } : i
//         ));
//       } catch (error) {
//         setFileInputs(prev => prev.map(i => 
//           i.id === input.id ? { ...i, uploading: false } : i
//         ));
//         throw error;
//       }
//     }

//     return uploadedUrls;
//   };

//   const resetForm = () => {
//     setFormData({
//       brand: "",
//       phoneName: "",
//       model: "",
//       price: "",
//       firstHandPrice: "",
//       description: "",
//       ram: "",
//       rom: "",
//       city: "",
//       state: "",
//       zipcode: "",
//       country: "",
//       phone: "",
//       images: [],
//     });
//     setFileInputs(fileInputs.map(input => ({ 
//       ...input, 
//       file: null, 
//       preview: null,
//       uploading: false,
//       progress: 0
//     })));
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
    
//     const hasImages = fileInputs.some(input => input.file);
//     if (!hasImages) {
//       toast.error("Please upload at least one image");
//       return;
//     }

//     setLoading(true);
//     toast.info("Starting image uploads...");

//     try {
//       const imageUrls = await uploadImages();
//       const userId = localStorage.getItem('userId');

//       if (!userId) {
//         throw new Error("User not authenticated");
//       }

//       const phoneData = {
//         ...formData,
//         images: imageUrls,
//         userId
//       };

//       const response = await axios.post(`${API_BASE_URL}/phones`, phoneData, {
//         timeout: 10000
//       });

//       if (response.data.success) {
//         toast.success("📱 Phone listed successfully!");
//         resetForm();
//       } else {
//         throw new Error(response.data.message || "Failed to list phone");
//       }
//     } catch (error) {
//       console.error("Error:", error);
      
//       if (error.code === "ECONNABORTED") {
//         toast.error("Request timed out. Please check your connection and try again.");
//       } else if (error.response) {
//         toast.error(`Server error: ${error.response.data.message}`);
//       } else {
//         toast.error(error.message || "An error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
//         <h2 className="text-2xl font-semibold text-center mb-4">Sell Your Phone</h2>
//         <hr className="mb-4" />

//         <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
//           {/* Brand Dropdown */}
//           <div className="space-y-4">
//             <select
//               name="brand"
//               required
//               className="border p-2 rounded w-full"
//               value={formData.brand}
//               onChange={onChangeHandler}
//             >
//               <option value="">Select Brand</option>
//               <option value="Apple">Apple</option>
//               <option value="Samsung">Samsung</option>
//               <option value="Xiaomi">Xiaomi</option>
//               <option value="OnePlus">OnePlus</option>
//               <option value="Realme">Realme</option>
//               <option value="Vivo">Vivo</option>
//               <option value="Oppo">Oppo</option>
//               <option value="Motorola">Motorola</option>
//               <option value="Nokia">Nokia</option>
//               <option value="Google">Google</option>
//               <option value="Other">Other</option>
//             </select>

//             {formData.brand === "Other" && (
//               <input
//                 type="text"
//                 name="brand"
//                 placeholder="Enter Brand"
//                 required
//                 className="border p-2 rounded w-full"
//                 onChange={onChangeHandler}
//               />
//             )}
//           </div>

//           {/* Phone Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="phoneName"
//               placeholder="Phone Name"
//               required
//               className="border p-2 rounded"
//               value={formData.phoneName}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="text"
//               name="model"
//               placeholder="Model"
//               required
//               className="border p-2 rounded"
//               value={formData.model}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="number"
//               name="price"
//               placeholder="Price"
//               required
//               className="border p-2 rounded"
//               value={formData.price}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="number"
//               name="firstHandPrice"
//               placeholder="First Hand Price"
//               className="border p-2 rounded"
//               value={formData.firstHandPrice}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="text"
//               name="ram"
//               placeholder="RAM Size"
//               className="border p-2 rounded"
//               value={formData.ram}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="text"
//               name="rom"
//               placeholder="ROM Size"
//               className="border p-2 rounded"
//               value={formData.rom}
//               onChange={onChangeHandler}
//             />
//           </div>

//           <textarea
//             name="description"
//             placeholder="Product Description"
//             rows="3"
//             className="border p-2 rounded"
//             value={formData.description}
//             onChange={onChangeHandler}
//           ></textarea>

//           {/* Location Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="city"
//               placeholder="City"
//               required
//               className="border p-2 rounded"
//               value={formData.city}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="text"
//               name="state"
//               placeholder="State"
//               required
//               className="border p-2 rounded"
//               value={formData.state}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="text"
//               name="zipcode"
//               placeholder="Zipcode"
//               required
//               className="border p-2 rounded"
//               value={formData.zipcode}
//               onChange={onChangeHandler}
//             />
//             <input
//               type="text"
//               name="country"
//               placeholder="Country"
//               required
//               className="border p-2 rounded"
//               value={formData.country}
//               onChange={onChangeHandler}
//             />
//           </div>

//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number"
//             required
//             className="border p-2 rounded"
//             value={formData.phone}
//             onChange={onChangeHandler}
//           />

//           {/* Image Upload Sections */}
//           <div className="space-y-4">
//             <h3 className="font-medium">Upload Images (Max 4)</h3>
//             {fileInputs.map((input) => (
//               <div key={input.id} className="space-y-2">
//                 <div className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="border p-2 rounded w-full"
//                       onChange={(e) => onFileChange(input.id, e)}
//                       disabled={loading || input.uploading}
//                     />
//                   </div>
//                   {input.preview && (
//                     <div className="relative">
//                       <img
//                         src={input.preview}
//                         alt={`Preview ${input.id}`}
//                         className="h-16 w-16 object-cover rounded border"
//                       />
//                       <button
//                         type="button"
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                         onClick={() => removeImage(input.id)}
//                         disabled={loading || input.uploading}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 {input.uploading && (
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full"
//                       style={{ width: `${input.progress}%` }}
//                     ></div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-black text-white px-6 py-3 rounded text-center disabled:opacity-50 mt-4"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {fileInputs.some(i => i.uploading) ? "Uploading..." : "Processing..."}
//               </span>
//             ) : "PROCEED TO SELL"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Sell;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Sell = () => {
  const [formData, setFormData] = useState({
    brand: "",
    phoneName: "",
    model: "",
    price: "",
    firstHandPrice: "",
    description: "",
    ram: "",
    rom: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    images: [],
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const userId = localStorage.getItem("userId");
      
      const phoneData = {
        ...formData,
        images: imageUrls,
        userId
      };

      const response = await axios.post("http://localhost:4000/api/phones", phoneData);

      if (response.data.success) {
        toast.success("📱 Phone listed successfully!");
        // Reset form
        setFormData({
          brand: "",
          phoneName: "",
          model: "",
          price: "",
          firstHandPrice: "",
          description: "",
          ram: "",
          rom: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
          phone: "",
          images: [],
        });
        setImages([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Sell Your Phone</h2>
        <hr className="mb-4" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Brand Dropdown */}
          <select
            name="brand"
            required
            className="border p-2 rounded"
            value={formData.brand}
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Realme">Realme</option>
            <option value="Vivo">Vivo</option>
            <option value="Oppo">Oppo</option>
            <option value="Motorola">Motorola</option>
            <option value="Nokia">Nokia</option>
            <option value="Google">Google</option>
            <option value="Other">Other</option>
          </select>

          {formData.brand === "Other" && (
            <input
              type="text"
              name="brand"
              placeholder="Enter Brand"
              required
              className="border p-2 rounded"
              onChange={handleChange}
            />
          )}

          {/* Phone Details */}
          <input
            type="text"
            name="phoneName"
            placeholder="Phone Name"
            required
            className="border p-2 rounded"
            value={formData.phoneName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            required
            className="border p-2 rounded"
            value={formData.model}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            className="border p-2 rounded"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="number"
            name="firstHandPrice"
            placeholder="First Hand Price"
            className="border p-2 rounded"
            value={formData.firstHandPrice}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Product Description"
            rows="3"
            className="border p-2 rounded"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <input
            type="number"
            name="ram"
            placeholder="RAM Size in GB"
            className="border p-2 rounded"
            value={formData.ram}
            onChange={handleChange}
          />
          <input
            type="number"
            name="rom"
            placeholder="ROM Size in GB"
            className="border p-2 rounded"
            value={formData.rom}
            onChange={handleChange}
          />

          {/* Location Details */}
          <input
            type="text"
            name="city"
            placeholder="City"
            required
            className="border p-2 rounded"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            required
            className="border p-2 rounded"
            value={formData.state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            required
            className="border p-2 rounded"
            value={formData.zipcode}
            onChange={handleChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            required
            className="border p-2 rounded"
            value={formData.country}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            className="border p-2 rounded"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1">Photos (Max 4)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border p-2 rounded w-full"
              disabled={images.length >= 4 || loading}
            />
            
            {/* Image Previews */}
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded text-center disabled:opacity-50"
          >
            {loading ? "Processing..." : "PROCEED TO SELL"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sell;