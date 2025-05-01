import { useState, useEffect, useCallback, useRef } from "react";

import { ITweet } from "@/interfaces/index.interface";

import environment from "@/constants/environment";

interface IUseWebSocketsProps {
  listId: string;
  apiToken: string;
}

const useWebSockets = ({ listId, apiToken }: IUseWebSocketsProps) => {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const currentTweetMapRef = useRef<Map<string, ITweet>>(new Map());

  useEffect(() => {
    if (!listId || !apiToken) return;

    const ws = new WebSocket(
      `${environment.websocketUrl}?twitter-list-id=${listId}&twitter-api-key=${apiToken}`
    );

    setSocket(ws);

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "tweet") {
        const latestTweets: ITweet[] = message.data;

        const newTweetMap = new Map(latestTweets.map(t => [t.id, t]));
        const prevTweetMap = currentTweetMapRef.current;

        const changed = [];

        for (const [id, tweet] of newTweetMap) {
          if (!prevTweetMap.has(id) || prevTweetMap.get(id)?.text !== tweet.text) {
            changed.push(tweet);
          }
        }

        const removed = [...prevTweetMap.keys()].filter(id => !newTweetMap.has(id));

        if (changed.length > 0 || removed.length > 0) {
          currentTweetMapRef.current = newTweetMap;
          setTweets([...newTweetMap.values()]);
        }
      }
    };

    ws.onclose = () => console.log("Disconnected from WebSocket");

    return ws.close;
  }, [listId, apiToken]);

  const pause = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "pause" }));
  }, [socket]);

  const resume = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "resume" }));
  }, [socket]);

  return { tweets, pause, resume };
};

export default useWebSockets;
