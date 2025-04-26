import { useState, useEffect } from 'react';

interface ApiTokenInputProps {
  onTokenUpdate: (token: string) => void;
  onListIdUpdate: (listId: string) => void;
  onOpenAIKeyUpdate: (key: string) => void;
}

const ApiTokenInput = ({ onTokenUpdate, onListIdUpdate, onOpenAIKeyUpdate }: ApiTokenInputProps) => {
  const [token, setToken] = useState('');
  const [listId, setListId] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('twitter_api_token');
    const savedListId = localStorage.getItem('twitter_list_id');
    const savedOpenAIKey = localStorage.getItem('openai_api_key');
    if (savedToken) {
      setToken(savedToken);
      onTokenUpdate(savedToken);
    }
    if (savedListId) {
      setListId(savedListId);
      onListIdUpdate(savedListId);
    }
    if (savedOpenAIKey) {
      setOpenAIKey(savedOpenAIKey);
      onOpenAIKeyUpdate(savedOpenAIKey);
    }
  }, [onTokenUpdate, onListIdUpdate, onOpenAIKeyUpdate]);

  const handleUpdate = () => {
    if (!token.trim() || !listId.trim() || !openAIKey.trim()) return;
    localStorage.setItem('twitter_api_token', token);
    localStorage.setItem('twitter_list_id', listId);
    localStorage.setItem('openai_api_key', openAIKey);
    onTokenUpdate(token);
    onListIdUpdate(listId);
    onOpenAIKeyUpdate(openAIKey);

    setIsExpanded(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } 
  };

  return (
    <div className="api-token-container">
      {!isExpanded ? (
        <div 
          className="settings-button"
          onClick={() => setIsExpanded(true)}
          title="Settings"
        >
          <svg
            className="settings-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2563 9.77299 19.9815C9.58086 19.7067 9.31256 19.4919 9 19.36C8.69838 19.2269 8.36381 19.1872 8.03941 19.246C7.71502 19.3048 7.41568 19.4595 7.18 19.69L7.12 19.75C6.93425 19.936 6.71368 20.0835 6.47088 20.1841C6.22808 20.2848 5.96783 20.3366 5.705 20.3366C5.44217 20.3366 5.18192 20.2848 4.93912 20.1841C4.69632 20.0835 4.47575 19.936 4.29 19.75C4.10405 19.5643 3.95653 19.3437 3.85588 19.1009C3.75523 18.8581 3.70343 18.5978 3.70343 18.335C3.70343 18.0722 3.75523 17.8119 3.85588 17.5691C3.95653 17.3263 4.10405 17.1057 4.29 16.92L4.35 16.86C4.58054 16.6243 4.73519 16.325 4.79401 16.0006C4.85283 15.6762 4.81312 15.3416 4.68 15.04C4.55324 14.7442 4.34276 14.492 4.07447 14.3143C3.80618 14.1366 3.49179 14.0413 3.17 14.04H3C2.46957 14.04 1.96086 13.8293 1.58579 13.4542C1.21071 13.0791 1 12.5704 1 12.04C1 11.5096 1.21071 11.0009 1.58579 10.6258C1.96086 10.2507 2.46957 10.04 3 10.04H3.09C3.42099 10.0323 3.74372 9.92512 4.01853 9.73299C4.29334 9.54086 4.50809 9.27256 4.64 8.96C4.77312 8.65838 4.81283 8.32381 4.75401 7.99941C4.69519 7.67502 4.54054 7.37568 4.31 7.14L4.25 7.08C4.06405 6.89425 3.91653 6.67368 3.81588 6.43088C3.71523 6.18808 3.66343 5.92783 3.66343 5.665C3.66343 5.40217 3.71523 5.14192 3.81588 4.89912C3.91653 4.65632 4.06405 4.43575 4.25 4.25C4.43575 4.06405 4.65632 3.91653 4.89912 3.81588C5.14192 3.71523 5.40217 3.66343 5.665 3.66343C5.92783 3.66343 6.18808 3.71523 6.43088 3.81588C6.67368 3.91653 6.89425 4.06405 7.08 4.25L7.14 4.31C7.37568 4.54054 7.67502 4.69519 8.00041 4.75401C8.32581 4.81283 8.66038 4.77312 8.962 4.64H9C9.29577 4.51324 9.54802 4.30276 9.72569 4.03447C9.90337 3.76618 9.99872 3.45179 10 3.13V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77283 15.9606 4.71401C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02425 17.2863 3.87672 17.5291 3.77607C17.7719 3.67542 18.0322 3.62362 18.295 3.62362C18.5578 3.62362 18.8181 3.67542 19.0609 3.77607C19.3037 3.87672 19.5243 4.02425 19.71 4.21C19.8957 4.39575 20.0432 4.61632 20.1439 4.85912C20.2445 5.10192 20.2963 5.36217 20.2963 5.625C20.2963 5.88783 20.2445 6.14808 20.1439 6.39088C20.0432 6.63368 19.8957 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.96041C19.1472 8.28581 19.1869 8.62038 19.32 8.922V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div className="api-token-input">
          <div className="token-input-wrapper">
            <label className="input-label">Twitter API Token</label>
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
          <div className="token-input-wrapper">
            <label className="input-label">List ID</label>
            <input
              type="text"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter List ID"
              className="token-input"
            />
          </div>
          <div className="token-input-wrapper">
            <label className="input-label">OpenAI API Key</label>
            <input
              type="text"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter OpenAI API Key"
              className="token-input"
            />
          </div>
          <div className="button-group">
            <button 
              onClick={handleUpdate} 
              className="update-button"
              disabled={!token.trim() || !listId.trim() || !openAIKey.trim()}
            >
              Update
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTokenInput; 