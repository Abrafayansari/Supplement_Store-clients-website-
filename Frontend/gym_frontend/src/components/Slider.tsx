// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { MOCK_PRODUCTS } from '../mockData.ts';


// const Slider: React.FC = () => {
//   const [isHovered, setIsHovered] = useState(false);
//   const sliderProducts = MOCK_PRODUCTS.slice(0, 8);
//   const duplicatedProducts = [...sliderProducts, ...sliderProducts, ...sliderProducts];

//   const duration1 = isHovered ? 180 : 70;
//   const duration2 = isHovered ? 160 : 60;

//   return (
//     <motion.div 
//       className="relative w-full max-w-[480px] ml-auto h-[900px] overflow-hidden hidden lg:flex gap-6 pr-4 cursor-pointer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       animate={{ scale: isHovered ? 1.03 : 1 }}
//       transition={{ type: "spring", stiffness: 70, damping: 25 }}
//     >
//       {/* Edge Fades */}
//       <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#080808] via-[#080808]/95 to-transparent z-20 pointer-events-none"></div>
//       <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#080808] via-[#080808]/95 to-transparent z-20 pointer-events-none"></div>

//       {/* Column 1: Downward */}
//       <div className="flex-1">
//         <motion.div 
//           animate={{ y: ["-33.33%", "0%"] }}
//           transition={{ duration: duration1, ease: "linear", repeat: Infinity }}
//           className="flex flex-col gap-6"
//         >
//           {duplicatedProducts.map((product, idx) => (
//             <Link to={`/product/${product.id}`} key={`${idx}-col1`}>
//               <motion.div 
//                 whileHover={{ scale: 1.04, borderColor: "rgba(201, 162, 77, 0.4)", backgroundColor: "rgba(255,255,255,0.06)" }}
//                 className={`w-full ${idx % 3 === 0 ? 'aspect-square' : 'aspect-[4/5]'} bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 relative group/item overflow-hidden shadow-2xl`}
//               >
//                 {/* Product Name Label - Top Left */}
//                 <span className="absolute top-4 left-5 text-[9px] font-black text-brand-gold/40 uppercase tracking-[0.2em] z-30 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
//                   {product.name}
//                 </span>
                
//                 <img 
//                   src={product.image} 
//                   alt="" 
//                   className="w-full h-full object-contain transition-all duration-700 scale-[0.85] group-hover/item:scale-110" 
//                 />
//               </motion.div>
//             </Link>
//           ))}
//         </motion.div>
//       </div>

//       {/* Column 2: Upward */}
//       <div className="flex-1 pt-32">
//         <motion.div 
//           animate={{ y: ["0%", "-33.33%"] }}
//           transition={{ duration: duration2, ease: "linear", repeat: Infinity }}
//           className="flex flex-col gap-6"
//         >
//           {duplicatedProducts.map((product, idx) => (
//             <Link to={`/product/${product.id}`} key={`${idx}-col2`}>
//               <motion.div 
//                 whileHover={{ scale: 1.04, borderColor: "rgba(201, 162, 77, 0.4)", backgroundColor: "rgba(255,255,255,0.06)" }}
//                 className={`w-full ${idx % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'} bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-center transition-all duration-300 relative group/item overflow-hidden shadow-2xl`}
//               >
//                 {/* Product Name Label - Top Left */}
//                 <span className="absolute top-4 left-5 text-[9px] font-black text-brand-gold/40 uppercase tracking-[0.2em] z-30 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
//                   {product.name}
//                 </span>

//                 <img 
//                   src={product.image} 
//                   alt="" 
//                   className="w-full h-full object-contain transition-all duration-700 scale-[0.85] group-hover/item:scale-110" 
//                 />
//               </motion.div>
//             </Link>
//           ))}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Slider;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '../mockData.ts';

const Slider: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const sliderProducts = MOCK_PRODUCTS.slice(0, 8);
  const duplicatedProducts = [...sliderProducts, ...sliderProducts, ...sliderProducts];

  const duration1 = isHovered ? 180 : 70;
  const duration2 = isHovered ? 160 : 60;

  return (
    <motion.div 
      className="relative w-full max-w-[480px] ml-auto h-[800px] overflow-hidden hidden lg:flex gap-6 pr-4 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 25 }}
    >
      {/* Edge Fades - Changed from black to white */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none"></div>

      {/* Column 1: Downward */}
      <div className="flex-1">
        <motion.div 
          animate={{ y: ["-33.33%", "0%"] }}
          transition={{ duration: duration1, ease: "linear", repeat: Infinity }}
          className="flex flex-col gap-6"
        >
          {duplicatedProducts.map((product, idx) => (
            <Link to={`/product/${product.id}`} key={`${idx}-col1`}>
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(123, 15, 23, 0.2)", backgroundColor: "rgba(123, 15, 23, 0.02)" }}
                className={`w-full ${idx % 3 === 0 ? 'aspect-square' : 'aspect-[4/5]'} bg-brand-warm/50 border border-black/5 rounded-none p-6 flex items-center justify-center transition-all duration-300 relative group/item overflow-hidden shadow-sm`}
              >
                {/* Product Name Label - Light Theme */}
                <span className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-black text-brand-matte/20 uppercase tracking-[0.3em] z-30 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                  {product.name}
                </span>
                
                <img 
                  src={product.images[0]} 
                  alt="" 
                  className="w-full h-full object-contain transition-all duration-700 scale-[0.9] group-hover/item:scale-105 group-hover/item:grayscale-0 grayscale-[0.5]" 
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Column 2: Upward */}
      <div className="flex-1 pt-32">
        <motion.div 
          animate={{ y: ["0%", "-33.33%"] }}
          transition={{ duration: duration2, ease: "linear", repeat: Infinity }}
          className="flex flex-col gap-6"
        >
          {duplicatedProducts.map((product, idx) => (
            <Link to={`/product/${product.id}`} key={`${idx}-col2`}>
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(123, 15, 23, 0.2)", backgroundColor: "rgba(123, 15, 23, 0.02)" }}
                className={`w-full ${idx % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'} bg-brand-warm/50 border border-black/5 rounded-none p-6 flex items-center justify-center transition-all duration-300 relative group/item overflow-hidden shadow-sm`}
              >
                <span className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-black text-brand-matte/20 uppercase tracking-[0.3em] z-30 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                  {product.name}
                </span>

                <img 
                  src={product.images[0]} 
                  alt="" 
                  className="w-full h-full object-contain transition-all duration-700 scale-[0.9] group-hover/item:scale-105 group-hover/item:grayscale-0 grayscale-[0.5]" 
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Slider;
