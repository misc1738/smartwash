import React, { useState } from "react";

const baseServices = [
  { key: "essential", title: "Essential Care", price: 4999 },
  { key: "premium", title: "Premium Detail", price: 12999 },
  { key: "ultimate", title: "Ultimate Luxury", price: 24999 }
];

const addOns = [
  { key: "ceramic", label: "Ceramic Coating", price: 5000 },
  { key: "paint", label: "Paint Correction", price: 3000 },
  { key: "interior", label: "Deep Interior Cleaning", price: 2000 },
  { key: "glass", label: "Premium Glass Coating", price: 1500 }
];

const PricingCalculator = () => {
  const [selectedService, setSelectedService] = useState(baseServices[0].key);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  const handleAddOnChange = (key) => {
    setSelectedAddOns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const basePrice = baseServices.find((s) => s.key === selectedService)?.price || 0;
  const addOnPrice = selectedAddOns.reduce(
    (sum, key) => sum + (addOns.find((a) => a.key === key)?.price || 0),
    0
  );
  const total = basePrice + addOnPrice;

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 max-w-xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white">Pricing Calculator</h2>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-white">Select Service</label>
            <select
              className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white backdrop-blur-md"
              value={selectedService}
              onChange={handleServiceChange}
            >
              {baseServices.map((svc) => (
                <option key={svc.key} value={svc.key} className="bg-black">{svc.title} - KSh {svc.price.toLocaleString()}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-white">Add-ons</label>
            <div className="grid grid-cols-2 gap-4">
              {addOns.map((addon) => (
                <label key={addon.key} className="flex items-center text-white/80">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addon.key)}
                    onChange={() => handleAddOnChange(addon.key)}
                    className="mr-2 accent-primary"
                  />
                  {addon.label} (+KSh {addon.price.toLocaleString()})
                </label>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <span className="text-3xl font-bold text-primary">Total: KSh {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;