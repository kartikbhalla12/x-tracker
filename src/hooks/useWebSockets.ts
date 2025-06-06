import { useState, useEffect, useCallback, useRef } from "react";

import {
  IApiSettings,
  ISocketStatus,
  ITweet,
} from "@/interfaces/index.interface";

import environment from "@/constants/environment";
import { STORAGE_KEYS } from "@/constants/storage";
import { DEFAULT_API_SETTINGS } from "@/constants/defaults";

import storage from "@/utils/storage";

const useWebSockets = () => {
  const [tweetIds, setTweetIds] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [socketStatus, setSocketStatus] = useState<ISocketStatus>(
    ISocketStatus.DISCONNECTED
  );

  const currentTweetMapRef = useRef<Map<string, ITweet>>(new Map());

  // Getter function to retrieve tweet by ID
  const getTweetById = useCallback((id: string) => {
    return currentTweetMapRef.current.get(id);
  }, []);

  useEffect(() => {
    const apiSettings =
      storage.get<IApiSettings>(STORAGE_KEYS.API_SETTINGS) ||
      DEFAULT_API_SETTINGS;

    if (!apiSettings.listId || !apiSettings.apiToken) return;

    const ws = new WebSocket(
      `${environment.websocketUrl}?twitter-list-id=${apiSettings.listId}&twitter-api-key=${apiSettings.apiToken}`
    );

    setSocket(ws);
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setSocketStatus(ISocketStatus.CONNECTED);
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "tweet") {
        const latestTweets: ITweet[] = message.data;

        const newTweetMap = new Map(latestTweets.map((t) => [t.id, t]));
        const prevTweetMap = currentTweetMapRef.current;

        const changed = [];

        for (const [id, tweet] of newTweetMap) {
          if (
            !prevTweetMap.has(id) ||
            prevTweetMap.get(id)?.text !== tweet.text
          ) {
            changed.push(tweet);
          }
        }

        const removed = [...prevTweetMap.keys()].filter(
          (id) => !newTweetMap.has(id)
        );

        if (changed.length > 0 || removed.length > 0) {
          currentTweetMapRef.current = newTweetMap;
          // Only update the array of IDs - stable references to actual tweets
          setTweetIds([...newTweetMap.keys()]);
        }
      } else if (message.type === "tweet-error") {
        alert("Error fetching tweets. Check your credits.");
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setSocketStatus(ISocketStatus.DISCONNECTED);
    };
    ws.onerror = () => {
      console.log("Failed to connect to WebSocket");
      setSocketStatus(ISocketStatus.DISCONNECTED);
    };

    return () => {
      ws.close();
    };
  }, []);

  const pause = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "pause" }));
  }, [socket]);

  const resume = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "resume" }));
  }, [socket]);

  return { tweetIds, getTweetById, pause, resume, socketStatus };
};

export default useWebSockets;
