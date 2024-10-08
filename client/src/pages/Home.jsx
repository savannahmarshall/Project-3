import React, { useState, useEffect } from 'react';
import AuthService from '../utils/auth';
import Navbar from '../Navbar';
import Room1 from '../components/RoomLogic/room1';
import Room2 from '../components/RoomLogic/room2';
import Room3 from '../components/RoomLogic/room3';
import Room4 from '../components/RoomLogic/room4';
import Room5 from '../components/RoomLogic/room5';
import Room6 from '../components/RoomLogic/room6';
import Room7 from '../components/RoomLogic/room7';
import Room8 from '../components/RoomLogic/room8';
import Room9 from '../components/RoomLogic/room9';
import Inventory from '../components/Inventory';
import Homepage from '../components/RoomLogic/homepage';
import auth from '../utils/auth';

const roomComponents = {
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
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentRoom(1);
    }
  }, [isAuthenticated]);

  const handleDirection = (direction) => {
    let nextRoom = null;
    if (direction === 'backward') { 
      nextRoom = currentRoom > 1 ? currentRoom - 1 : null;
    } else if (direction === 'forward') {
      nextRoom = currentRoom < 9 ? currentRoom + 1 : null;
    }

    if (nextRoom) {
      setCurrentRoom(nextRoom);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`,
        },
        body: JSON.stringify({
          query: `
            mutation DeleteAllItems($userId: ID!) {
              deleteAllItems(userId: $userId) {
                _id
                username
                inventory {
                  _id
                  name
                }
              }
            }
          `,
          variables: {
            userId: auth.getProfile().userId,  
          },
        }),
      });

      const { data } = await response.json();

      if (data && data.deleteAllItems) {
        setInventory([]); 
        setCurrentRoom(1); 
      } else {
        console.error("Failed to reset the adventure.");
      }
    } catch (error) {
      console.error("Error during reset:", error);
    }
  };

  const handleRemove = (index) => {
    const newInventory = [...inventory];
    newInventory.splice(index, 1); 
    setInventory(newInventory);
  };

  const renderDirectionButtons = () => {
    const isFirstRoom = currentRoom === 1;
    const isLastRoom = currentRoom === 9;

    return (
      <>
        {!isFirstRoom && isAuthenticated && (
          <button className="footer-button" onClick={() => handleDirection('backward')}>
            Turn Back
          </button>
        )}
        {isAuthenticated && (
          <>
            <button className="footer-button" onClick={() => setIsModalOpen(true)}>
              Unlock the Treasure
            </button>
            <button 
              className="inventory-icon" 
              onClick={() => setInventoryModalOpen(true)} 
              aria-label="Open Inventory"
            />
            {isLastRoom && (
              <button className="footer-button reset-button" onClick={handleReset}>
                Reset Adventure
              </button>
            )}
          </>
        )}
        {!isLastRoom && isAuthenticated && (
          <button className="footer-button" onClick={() => handleDirection('forward')}>
            Keep Exploring
          </button>
        )}
      </>
    );
  };

  const CurrentRoomComponent = roomComponents[currentRoom];

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        {isAuthenticated ? (
          CurrentRoomComponent && (
            <CurrentRoomComponent
              show={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              inventory={inventory}
              setInventory={setInventory}
            />
          )
        ) : (
          <Homepage /> 
        )}
      </div>
      <footer className="footer">
        {isAuthenticated && renderDirectionButtons()}
      </footer>

      {isInventoryModalOpen && (
        <Inventory
          isOpen={isInventoryModalOpen}
          onClose={() => setInventoryModalOpen(false)}
          items={inventory} 
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default Home;