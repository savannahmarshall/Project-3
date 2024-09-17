import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import MatchupImage from './MatchupImage';
import MatchupText from './MatchupText';
import Room1 from '../components/RoomLogic/room1';
import Room2 from '../components/RoomLogic/room2';
import Room3 from '../components/RoomLogic/room3';
import Room4 from '../components/RoomLogic/room4';
import Room5 from '../components/RoomLogic/room5';
import Room6 from '../components/RoomLogic/room6';
import Room7 from '../components/RoomLogic/room7';
import Room8 from '../components/RoomLogic/room8';
import Room9 from '../components/RoomLogic/room9';

const roomModals = {
  1: Room1,
  2: Room2,
  3: Room3,
  4: Room4,
  5: Room5,
  6: Room6,
  7: Room7,
  8: Room8,
  9: Room9,
};

const Home = () => {
  const [currentImage, setCurrentImage] = useState('startup.png');
  const [currentText, setCurrentText] = useState('');
  const [isStartup, setIsStartup] = useState(true);
  const [activeRoom, setActiveRoom] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(1); // Default to room 1

  // Open the modal for the current room
  const handleOpenRoom = () => {
    console.log(`Challenge button clicked. Current Room: ${currentRoom}`);
    setActiveRoom(currentRoom);
  };

  // Close the modal
  const handleCloseRoom = () => {
    console.log('Closing modal');
    setActiveRoom(null);
  };

  useEffect(() => {
    const fetchStartupText = async () => {
      try {
        const response = await fetch('/assets/startup.md');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const text = await response.text();
        setCurrentText(text);
      } catch (error) {
        console.error('Failed to fetch startup text:', error);
        setCurrentText('Failed to load startup text content.');
      }
    };

    fetchStartupText();
  }, []);

  // Update the room number when the image changes
  const handleImageChange = (imageName, textFile, roomNumber) => {
    setCurrentImage(imageName);
    setIsStartup(false);
    setCurrentRoom(roomNumber); // Update to the correct room number
    console.log(`Image changed to ${imageName}. Current Room set to ${roomNumber}`);
  };

  // Get the modal component for the active room
  const CurrentModal = activeRoom ? roomModals[activeRoom] : null;

  return (
    <div className="container">
      <Navbar 
        setImage={(image, text, room) => {
          console.log(`Navbar is passing room number: ${room}`);
          handleImageChange(image, text, room);
        }} 
        setText={setCurrentText} 
      />
      <div className="content">
        <div className="matchup-container">
          <div className="matchup-image">
            <MatchupImage src={`/assets/${currentImage}`} alt="Matchup Image" />
          </div>
          <div className="matchup-text">
            <MatchupText text={currentText} isStartup={isStartup} />
          </div>
        </div>
      </div>
      <footer className="footer">
        <button className="footer-button">Go West</button>
        <button className="footer-button" onClick={handleOpenRoom}>
          Challenge
        </button>
        <button className="footer-button">Go East</button>
      </footer>
      {/* Render the modal for the active room */}
      {CurrentModal && (
        <CurrentModal
          show={Boolean(activeRoom)}
          onClose={handleCloseRoom}
          content={<p>Room {activeRoom} Content</p>}
        />
      )}
    </div>
  );
};

export default Home;
