import { useCallback, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Tweet, { ITweet } from './components/Tweet'
import ApiTokenInput from './components/ApiTokenInput'

function App() {
  const [tweets, setTweets] = useState<ITweet[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [apiToken, setApiToken] = useState<string>('')

  const fetchUserData = useCallback(async () => {
    if (isPaused || !apiToken) return
    
    try {
      const response = await axios.get(
        '/api/twitter/tweet/advanced_search?query="list:1913324634944274707 within_time:10s',
        { headers: { "X-API-Key": apiToken } }
      )

      const tweets = response.data.tweets
      if (tweets.length === 0) setIsPaused(false)
      setTweets(tweets)
    } catch (err) {
      console.error('Error fetching tweets:', err)
    } 
  }, [isPaused, apiToken])

  useEffect(() => {
    const interval = setInterval(fetchUserData, 2000)
    return () => clearInterval(interval)
  }, [fetchUserData])

  return (
    <div className="app">
      <div className="app-header">
        <h1>X-Tracker</h1>
        <div
          className={`status-chip ${isPaused ? 'paused' : 'running'}`}
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? 'Paused' : 'Running'}
        </div>
      </div>
      
      {tweets.length > 0 && (
        <div className="tweets-container">
          <h2>Recent Tweets</h2>
          {tweets.map(tweet => (
            <Tweet key={tweet.id} tweet={tweet} setIsPaused={setIsPaused} />
          ))}
        </div>
      )}

      <ApiTokenInput onTokenUpdate={setApiToken} />
    </div>
  )
}

export default App
