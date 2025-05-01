import { FC, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import styles from "@/components/Settings/index.module.css";

import storage, { STORAGE_KEYS } from "@/utils/storage";

import Zap from "@/icons/Zap";

import { ILaunchSettings } from "@/interfaces/index.interface";

interface LaunchSettingsProps {
  config: ILaunchSettings;
  setConfig: (config: ILaunchSettings) => void;
}

const validationSchema = Yup.object().shape({
  walletPublicKey: Yup.string().required("Wallet Public Key is required"),
  walletPrivateKey: Yup.string().required("Wallet Private Key is required"),
  defaultBuyAmount: Yup.string().required("Default Buy Amount is required"),
  tokenKey: Yup.string().required("Token Key is required"),
});

const LaunchSettings: FC<LaunchSettingsProps> = ({ config, setConfig }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (values: ILaunchSettings) => {
    storage.set(STORAGE_KEYS.LAUNCH_SETTINGS, values);
    setConfig(values);
    setIsExpanded(false);
  };

  if (!isExpanded)
    return (
      <div
        className={`${styles.settingsButtonContainer} ${styles.launchSettingsButtonContainer}`}
      >
        <div
          className={`${styles.settingsButton} ${styles.launchSettingsButton}`}
          onClick={() => setIsExpanded(true)}
          title="Settings"
        >
          <Zap className={styles.settingsIcon} />
        </div>
      </div>
    );

  return (
    <div
      className={`${styles.settingsContentContainer} ${styles.launchSettingsContainer}`}
    >
      <Formik
        initialValues={config}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.configSettingsInput}>
            <h1>Launch Settings</h1>
            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Wallet Public Key</label>
              <Field
                name="walletPublicKey"
                type="text"
                placeholder="Enter Wallet Public Key"
                className={styles.tokenInput}
              />
              {errors.walletPublicKey && touched.walletPublicKey && (
                <div className={styles.errorMessage}>
                  {errors.walletPublicKey}
                </div>
              )}
            </div>

            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Wallet Private Key</label>
              <Field
                name="walletPrivateKey"
                type="text"
                placeholder="Enter Wallet Private Key"
                className={styles.tokenInput}
              />
              {errors.walletPrivateKey && touched.walletPrivateKey && (
                <div className={styles.errorMessage}>
                  {errors.walletPrivateKey}
                </div>
              )}
            </div>

            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Default Buy Amount</label>
              <Field
                name="defaultBuyAmount"
                type="text"
                placeholder="Enter Default Buy Amount"
                className={styles.tokenInput}
              />
              {errors.defaultBuyAmount && touched.defaultBuyAmount && (
                <div className={styles.errorMessage}>
                  {errors.defaultBuyAmount}
                </div>
              )}
            </div>

            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Token Key</label>
              <Field
                name="tokenKey"
                type="text"
                placeholder="Enter Token Key"
                className={styles.tokenInput}
              />
              {errors.tokenKey && touched.tokenKey && (
                <div className={styles.errorMessage}>{errors.tokenKey}</div>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.updateButton}>
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LaunchSettings;
