// import React from 'react';

// const Loader: React.FC = () => {
//   return (
//     <div className="flex justify-center items-center h-16">
//       <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );
// };

// export default Loader;
import React from 'react';

const Loader: React.FC<{ small?: boolean }> = ({ small }) => (
  <div className={`flex justify-center items-center ${small ? 'h-6' : 'h-[300px]'}`}>
    <div className={`animate-spin rounded-full border-4 border-black border-t-transparent ${small ? 'h-6 w-6' : 'h-12 w-12'}`} />
  </div>
);

export default Loader;