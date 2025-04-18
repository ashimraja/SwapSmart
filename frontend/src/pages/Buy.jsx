import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Buy = () => {
  const [phones, setPhones] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRAM, setSelectedRAM] = useState([]);
  const [selectedROM, setSelectedROM] = useState([]);

  // Define all available brands
  const allBrands = [
    "Apple", "Samsung", "Xiaomi", "OnePlus", "Realme", 
    "Vivo", "Oppo", "Motorola", "Nokia", "Google", "Other"
  ];

  // RAM options in GB (as integers)
  const ramOptions = [2, 3, 4, 6, 8, 12, 16];
  
  // ROM options in GB (as integers)
  const romOptions = [64, 128, 256, 512, 1024]; // 1024GB = 1TB

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/phones');
        setPhones(response.data.phones);
        setFilteredPhones(response.data.phones);
      } catch (error) {
        console.error('Failed to fetch phones:', error);
      }
    };

    fetchPhones();
  }, []);

  // Apply all filters whenever any filter changes
  useEffect(() => {
    let filtered = [...phones];
    
    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(phone => 
        selectedBrands.includes(phone.brand)
      );
    }
    
    // RAM filter (exact match)
    if (selectedRAM.length > 0) {
      filtered = filtered.filter(phone => 
        selectedRAM.includes(phone.ram)
      );
    }
    
    // ROM filter (exact match)
    if (selectedROM.length > 0) {
      filtered = filtered.filter(phone => 
        selectedROM.includes(phone.rom)
      );
    }
    
    setFilteredPhones(filtered);
  }, [selectedBrands, selectedRAM, selectedROM, phones]);

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handleRAMChange = (ram) => {
    setSelectedRAM(prev => {
      if (prev.includes(ram)) {
        return prev.filter(r => r !== ram);
      } else {
        return [...prev, ram];
      }
    });
  };

  const handleROMChange = (rom) => {
    setSelectedROM(prev => {
      if (prev.includes(rom)) {
        return prev.filter(r => r !== rom);
      } else {
        return [...prev, rom];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedRAM([]);
    setSelectedROM([]);
  };

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-5 border-t'>
      <div className='min-w-60'>
        <p 
          onClick={() => setShowFilter(!showFilter)} 
          className='my-1 pb-2 text-xl flex items-center cursor-pointer gap-2 font-medium'
        >
          FILTERS
          <img 
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} 
            src={assets.dropdown_icon} 
            alt="" 
          />
        </p>

        <div className={`${showFilter ? '' : 'hidden'} sm:block shadow-md`}>
          {/* Brand Filter */}
          <div className='border-b-2 pl-5 py-3 mt-6'>
            <p className='mb-3 text-sm font-medium'>Brand</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {allBrands.map((brand) => (
                <label className='flex gap-2' key={brand}>
                  <input 
                    className='w-3' 
                    type="checkbox" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* RAM Filter */}
          <div className='border-b-2 pl-5 pb-3 my-5'>
            <p className='mb-3 text-sm font-medium'>RAM (GB)</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {ramOptions.map((ram) => (
                <label className='flex gap-2' key={ram}>
                  <input 
                    className='w-3' 
                    type="checkbox" 
                    checked={selectedRAM.includes(ram)}
                    onChange={() => handleRAMChange(ram)}
                  />
                  {ram}GB
                </label>
              ))}
            </div>
          </div>

          {/* Storage Filter */}
          <div className='pl-5 pb-3 my-5'>
            <p className='mb-3 text-sm font-medium'>STORAGE (GB)</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {romOptions.map((rom) => (
                <label className='flex gap-2' key={rom}>
                  <input 
                    className='w-3' 
                    type="checkbox" 
                    checked={selectedROM.includes(rom)}
                    onChange={() => handleROMChange(rom)}
                  />
                  {rom >= 1024 ? `${rom/1024}TB` : `${rom}GB`}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phone List */}
      <div className='w-full flex flex-col gap-4'>
        <h1 className='text-xl font-medium mb-4'>Buy Refurbished Mobile Phone</h1>

        {/* Selected Filters */}
        {(selectedBrands.length > 0 || selectedRAM.length > 0 || selectedROM.length > 0) && (
          <div className="flex gap-2 mb-2 flex-wrap items-center">
            <span className="text-sm">Filters:</span>
            {selectedBrands.map(brand => (
              <span 
                key={brand}
                className="bg-gray-200 px-2 py-1 text-xs rounded-full flex items-center gap-1"
              >
                {brand}
                <button 
                  onClick={() => handleBrandChange(brand)}
                  className="text-gray-500 hover:text-black"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedRAM.map(ram => (
              <span 
                key={ram}
                className="bg-gray-200 px-2 py-1 text-xs rounded-full flex items-center gap-1"
              >
                {ram}GB RAM
                <button 
                  onClick={() => handleRAMChange(ram)}
                  className="text-gray-500 hover:text-black"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedROM.map(rom => (
              <span 
                key={rom}
                className="bg-gray-200 px-2 py-1 text-xs rounded-full flex items-center gap-1"
              >
                {rom >= 1024 ? `${rom/1024}TB` : `${rom}GB`} Storage
                <button 
                  onClick={() => handleROMChange(rom)}
                  className="text-gray-500 hover:text-black"
                >
                  ×
                </button>
              </span>
            ))}
            <button 
              onClick={clearAllFilters}
              className="text-blue-500 text-sm"
            >
              Clear all
            </button>
          </div>
        )}

        {filteredPhones.length === 0 ? (
          <p className='text-gray-500'>
            {selectedBrands.length > 0 || selectedRAM.length > 0 || selectedROM.length > 0
              ? 'No phones match your filters' 
              : 'No phones found.'}
          </p>
        ) : (
          filteredPhones.map((phone, index) => {
            
            const firstImage = phone.images && phone.images.length > 0 
              ? phone.images[0] 
              : 'https://via.placeholder.com/150';
            
            return (
              <ProductCard
                key={phone.id || index}
                id={phone.id}
                name={`${phone.brand} ${phone.phoneName} ${phone.model}`}
                price={phone.price}
                firstHandPrice={phone.firstHandPrice}
                image={firstImage}
                phone={phone}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Buy;