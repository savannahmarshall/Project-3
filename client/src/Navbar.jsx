// client/src/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = ({ setImage, setText }) => {
  const handleImageChange = async (imageName, textFile) => {
    setImage(imageName);
    try {
      const response = await fetch(`/assets/${textFile}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      setText(text);
    } catch (error) {
      console.error('Failed to fetch text:', error);
      setText('Failed to load text content.');
    }
  };

  return (
    <nav className="navbar bg-dark">
      <div className="container">
        <Link className="navbar-brand text-white" to="/">Jandreah</Link>
        <div className="navbar-nav">
          <Link className="nav-item nav-link login-button" to="/login">Login</Link>
          {[...Array(9)].map((_, index) => (
            <button
              key={index}
              className="nav-item nav-link"
              onClick={() => handleImageChange(`room${index + 1}.png`, `room${index + 1}.md`)}
            >
              Room {index + 1}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;