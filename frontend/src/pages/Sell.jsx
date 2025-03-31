import React, { useState } from "react";

const Sell = () => {
  const [formData, setFormData] = useState({
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
    image: null,
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert(`Form submitted:\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Sell Your Phone</h2>
        <hr className="mb-4" />

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          {/* Phone Details */}
          <input type="text" name="phoneName" placeholder="Phone Name" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="text" name="model" placeholder="Model" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="number" name="price" placeholder="Price" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="number" name="firstHandPrice" placeholder="First Hand Price" className="border p-2 rounded" onChange={onChangeHandler} />
          <textarea name="description" placeholder="Product Description" rows="3" className="border p-2 rounded" onChange={onChangeHandler}></textarea>
          <input type="text" name="ram" placeholder="RAM Size" className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="text" name="rom" placeholder="ROM Size" className="border p-2 rounded" onChange={onChangeHandler} />

          {/* Location Details */}
          <input type="text" name="city" placeholder="City" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="text" name="state" placeholder="State" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="text" name="zipcode" placeholder="Zipcode" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="text" name="country" placeholder="Country" required className="border p-2 rounded" onChange={onChangeHandler} />
          <input type="tel" name="phone" placeholder="Phone Number" required className="border p-2 rounded" onChange={onChangeHandler} />

          {/* Upload Image */}
          <input type="file" accept="image/*" required className="border p-2 rounded" onChange={onFileChange} />

          {/* Submit Button */}
          <button type="submit" className="bg-black text-white px-6 py-3 rounded text-center">
            PROCEED TO SELL
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sell;
