import React from 'react';

const ServiceCard = ({ title, description, price, features, image }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-500">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 group-hover:from-black/60 group-hover:to-black/90 transition-all duration-500" />
      
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500"
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6 backdrop-blur-sm bg-glass border border-glass-border h-full flex flex-col justify-between transform group-hover:translate-y-0 transition-all duration-500">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/80 mb-4">{description}</p>
          
          {/* Price */}
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-primary-light">KSh {price}</span>
            <span className="text-white/60 ml-2">/wash</span>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {features?.map((feature, index) => (
              <li key={index} className="flex items-center text-white/90">
                <svg
                  className="w-5 h-5 text-primary-light mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <button className="mt-8 w-full py-3 px-6 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
          Choose Package
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;