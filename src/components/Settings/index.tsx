import React, { useEffect } from "react";

import ConfigSettings from "@/components/Settings/ConfigSettings";
import LaunchSettings from "@/components/Settings/LaunchSettings";

import { STORAGE_KEYS } from "@/constants/storage";

import { IApiSettings, ILaunchSettings } from "@/interfaces/index.interface";

import storage from "@/utils/storage";

const hasMissingValues = <T,>(obj: T | null): boolean => {
  return obj ? Object.entries(obj).some(([_, value]) => !value) : true;
};

const Settings: React.FC = () => {
  useEffect(() => {
    const launchSettings = storage.get<ILaunchSettings>(
      STORAGE_KEYS.LAUNCH_SETTINGS
    );
    const configSettings = storage.get<IApiSettings>(STORAGE_KEYS.API_SETTINGS);

    const missingLaunchSettings =
      hasMissingValues<ILaunchSettings>(launchSettings);
    const missingConfigSettings =
      hasMissingValues<IApiSettings>(configSettings);

    if (missingLaunchSettings || missingConfigSettings) {
      alert("Please add all settings to continue");
    }
  }, []);

  return (
    <>
      <ConfigSettings />
      <LaunchSettings />
    </>
  );
};

export default Settings;
