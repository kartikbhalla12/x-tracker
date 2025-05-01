import React, { useEffect } from "react";

import ConfigSettings from "@/components/Settings/ConfigSettings";
import LaunchSettings from "@/components/Settings/LaunchSettings";

import storage, { STORAGE_KEYS } from "@/utils/storage";

import { IApiSettings, ILaunchSettings } from "@/interfaces/index.interface";

interface SettingsProps {
  setApiSettingsConfig: (config: IApiSettings) => void;
  setLaunchSettingsConfig: (config: ILaunchSettings) => void;
  apiSettingsConfig: IApiSettings;
  launchSettingsConfig: ILaunchSettings;
}

const Settings: React.FC<SettingsProps> = ({
  setApiSettingsConfig,
  setLaunchSettingsConfig,
  apiSettingsConfig,
  launchSettingsConfig,
}) => {
  
  useEffect(() => {
    const apiSettingsConfig = storage.get<IApiSettings>(
      STORAGE_KEYS.API_SETTINGS
    );
    if (apiSettingsConfig) setApiSettingsConfig(apiSettingsConfig);
  }, [setApiSettingsConfig]);

  useEffect(() => {
    const launchSettingsConfig = storage.get<ILaunchSettings>(
      STORAGE_KEYS.LAUNCH_SETTINGS
    );
    if (launchSettingsConfig) setLaunchSettingsConfig(launchSettingsConfig);
  }, [setLaunchSettingsConfig]);

  return (
    <>
      <ConfigSettings
        config={apiSettingsConfig}
        setConfig={setApiSettingsConfig}
      />

      <LaunchSettings
        config={launchSettingsConfig}
        setConfig={setLaunchSettingsConfig}
      />
    </>
  );
};

export default Settings;
