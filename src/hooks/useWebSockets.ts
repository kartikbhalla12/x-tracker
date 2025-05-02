import { useState, useEffect, useCallback, useRef } from "react";

import { IApiSettings, ITweet } from "@/interfaces/index.interface";

import environment from "@/constants/environment";
import { STORAGE_KEYS } from "@/constants/storage";
import { DEFAULT_API_SETTINGS } from "@/constants/defaults";

import storage from "@/utils/storage";

const useWebSockets = () => {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const currentTweetMapRef = useRef<Map<string, ITweet>>(new Map());

  useEffect(() => {
    const apiSettings =
      storage.get<IApiSettings>(STORAGE_KEYS.API_SETTINGS) ||
      DEFAULT_API_SETTINGS;

    if (!apiSettings.listId || !apiSettings.apiToken) return;

    const ws = new WebSocket(
      `${environment.websocketUrl}?twitter-list-id=${apiSettings.listId}&twitter-api-key=${apiSettings.apiToken}`
    );

    setSocket(ws);
    ws.onopen = () => console.log("Connected to WebSocket");
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
          setTweets([...newTweetMap.values()]);
        }
      } else if (message.type === "tweet-error") {
        alert("Error fetching tweets. Check your credits.");
      }
    };

    ws.onclose = () => console.log("Disconnected from WebSocket");
    ws.onerror = () => alert("Failed to connect to WebSocket");

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

  return { tweets, pause, resume };
};

export default useWebSockets;
