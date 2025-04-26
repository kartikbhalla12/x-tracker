import { useCallback, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Tweet, { ITweet } from './components/Tweet'
import ApiTokenInput from './components/ApiTokenInput'
import './services/openai'

export interface IPaused {
  global: boolean;
  local: boolean;
}

function App() {
  const [tweets, setTweets] = useState<ITweet[]>([])

  const [isPaused, setIsPaused] = useState<IPaused>({
    global: false,
    local: false,
  });
  const [apiToken, setApiToken] = useState<string>('')
  const [listId, setListId] = useState<string>('')
  const [openAIKey, setOpenAIKey] = useState<string>('')
  const paused = isPaused.global || isPaused.local

  const fetchUserData = useCallback(async () => {
    if (isPaused.global || isPaused.local || !apiToken || !listId) return
    
    try {
      const response = await axios.get(
        `/api/twitter/tweet/advanced_search?query="list:${listId} within_time:10s`,
        { headers: { "X-API-Key": apiToken } }
      )

      const tweets = response.data.tweets
      setTweets(tweets)
    } catch (err) {
      console.error('Error fetching tweets:', err)
    } 
  }, [isPaused, apiToken, listId])

  useEffect(() => {
    const interval = setInterval(fetchUserData, 2000)
    return () => clearInterval(interval)
  }, [fetchUserData])

  return (
    <div className="app">
      <div className="app-header">
        <h1>X-Tracker</h1>
        <div
          className={`status-chip ${paused ? 'paused' : 'running'}`}
          onClick={() => setIsPaused({ ...isPaused, global: !isPaused.global })}
        >
          {paused ? 'Paused' : 'Running'}
        </div>
      </div>
      
      {tweets.length > 0 && (
        <div className="tweets-container">
          <h2>Recent Tweets</h2>
          {tweets.map(tweet => (
            <Tweet 
              key={tweet.id} 
              tweet={tweet} 
              setIsPaused={setIsPaused} 
              isPaused={isPaused} 
              apiToken={apiToken}
              openAIKey={openAIKey}
            />
          ))}
        </div>
      )}

      <ApiTokenInput onTokenUpdate={setApiToken} onListIdUpdate={setListId} onOpenAIKeyUpdate={setOpenAIKey} />
    </div>
  )
}

export default App
