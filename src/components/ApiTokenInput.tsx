import { useState, useEffect } from 'react';

interface ApiTokenInputProps {
  onTokenUpdate: (token: string) => void;
}

const ApiTokenInput = ({ onTokenUpdate }: ApiTokenInputProps) => {
  const [token, setToken] = useState('');
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('twitter_api_token');
    if (savedToken) {
      setToken(savedToken);
      onTokenUpdate(savedToken);
    }
  }, [onTokenUpdate]);

  const handleUpdate = () => {
    if (!token.trim()) return;
    localStorage.setItem('twitter_api_token', token);
    onTokenUpdate(token);
    // setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } 
  };

  return (
    <div className="api-token-container">
     
        <div className="api-token-input">
          <div className="token-input-wrapper">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter API Token"
              className="token-input"
              autoFocus
            />
           
          </div>
          <div className="button-group">
           
            <button 
              onClick={handleUpdate} 
              className="update-button"
              disabled={!token.trim()}
            >
              Update
            </button>
          </div>
        </div>
     
    </div>
  );
};

export default ApiTokenInput; 