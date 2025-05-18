import { FC, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import styles from "@/components/Settings/index.module.css";

import storage from "@/utils/storage";

import { STORAGE_KEYS } from "@/constants/storage";
import { DEFAULT_LAUNCH_SETTINGS } from "@/constants/defaults";

import Zap from "@/icons/Zap";

import { ILaunchSettings } from "@/interfaces/index.interface";

const validationSchema = Yup.object().shape({
  // walletPublicKey: Yup.string().required("Wallet Public Key is required"),
  // walletPrivateKey: Yup.string().required("Wallet Private Key is required"),
  walletApiKey: Yup.string().required("Wallet API Key is required"),
  defaultBuyAmount: Yup.string().required("Default Buy Amount is required"),
  express1BuyAmount: Yup.string().required("Express 1 Buy Amount is required"),
  express2BuyAmount: Yup.string().required("Express 2 Buy Amount is required"),
  tokenPrivateKey: Yup.string().required("Token Private Key is required"),
  tokenPublicKey: Yup.string().required("Token Key is required"),
});

const LaunchSettings: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const config =
    storage.get<ILaunchSettings>(STORAGE_KEYS.LAUNCH_SETTINGS) ||
    DEFAULT_LAUNCH_SETTINGS;

  const handleSubmit = (values: ILaunchSettings) => {
    const trimmedValues: ILaunchSettings = {
      // walletPublicKey: values.walletPublicKey.trim(),
      // walletPrivateKey: values.walletPrivateKey.trim(),
      walletApiKey: values.walletApiKey.trim(),
      defaultBuyAmount: values.defaultBuyAmount.trim(),
      express1BuyAmount: values.express1BuyAmount.trim(),
      express2BuyAmount: values.express2BuyAmount.trim(),
      tokenPrivateKey: values.tokenPrivateKey.trim(),
      tokenPublicKey: values.tokenPublicKey.trim(),
    };

    storage.set(STORAGE_KEYS.LAUNCH_SETTINGS, trimmedValues);
    window.location.reload();
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
              <label className={styles.inputLabel}>Wallet API Key</label>
              <Field
                name="walletApiKey"
                type="text"
                placeholder="Enter Wallet API Key"
                className={styles.tokenInput}
              />
              {errors.walletApiKey && touched.walletApiKey && (
                <div className={styles.errorMessage}>{errors.walletApiKey}</div>
              )}
            </div>

            {/* <div className={styles.tokenInputWrapper}>
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
            </div> */}

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
              <label className={styles.inputLabel}>Express 1 Buy Amount</label>
              <Field
                name="express1BuyAmount"
                type="text"
                placeholder="Enter Express 1 Buy Amount"
                className={styles.tokenInput}
              />
              {errors.express1BuyAmount && touched.express1BuyAmount && (
                <div className={styles.errorMessage}>
                  {errors.express1BuyAmount}
                </div>
              )}
            </div>
            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Express 2 Buy Amount</label>
              <Field
                name="express2BuyAmount"
                type="text"
                placeholder="Enter Express 2 Buy Amount"
                className={styles.tokenInput}
              />
              {errors.express2BuyAmount && touched.express2BuyAmount && (
                <div className={styles.errorMessage}>
                  {errors.express2BuyAmount}
                </div>
              )}
            </div>

            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Token Private Key</label>
              <Field
                name="tokenPrivateKey"
                type="text"
                placeholder="Enter Token Private Key"
                className={styles.tokenInput}
              />
              {errors.tokenPrivateKey && touched.tokenPrivateKey && (
                <div className={styles.errorMessage}>
                  {errors.tokenPrivateKey}
                </div>
              )}
            </div>
            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>Token Public Key</label>
              <Field
                name="tokenPublicKey"
                type="text"
                placeholder="Enter Token Public Key"
                className={styles.tokenInput}
              />
              {errors.tokenPublicKey && touched.tokenPublicKey && (
                <div className={styles.errorMessage}>
                  {errors.tokenPublicKey}
                </div>
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
