const Button = ({ children, ...props }) => (
    <button
      className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
      {...props}
    >
      {children}
    </button>
  );
  
  export default Button;
  