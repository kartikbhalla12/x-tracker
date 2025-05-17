import { FC, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import styles from "@/components/Settings/index.module.css";

import storage from "@/utils/storage";

import { STORAGE_KEYS } from "@/constants/storage";
import { DEFAULT_API_SETTINGS } from "@/constants/defaults";

import { IApiSettings } from "@/interfaces/index.interface";

import SettingsIcon from "@/icons/Settings";

const validationSchema = Yup.object().shape({
  apiToken: Yup.string().required("API Token is required"),
  listId: Yup.string().required("List ID is required"),
  openAIKey: Yup.string().required("OpenAI API Key is required"),
});

const ConfigSettings: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const config =
    storage.get<IApiSettings>(STORAGE_KEYS.API_SETTINGS) ||
    DEFAULT_API_SETTINGS;

  const handleSubmit = (values: IApiSettings) => {
    const trimmedValues = {
      apiToken: values.apiToken.trim(),
      listId: values.listId.trim(),
      openAIKey: values.openAIKey.trim(),
    };
    storage.set(STORAGE_KEYS.API_SETTINGS, trimmedValues);
    window.location.reload();
  };

  if (!isExpanded)
    return (
      <div className={styles.settingsButtonContainer}>
        <div
          className={styles.settingsButton}
          onClick={() => setIsExpanded(true)}
          title="Settings"
        >
          <SettingsIcon className={styles.settingsIcon} />
        </div>
      </div>
    );

  return (
    <div className={styles.settingsContentContainer}>
      <Formik
        initialValues={config}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.configSettingsInput}>
            <h1>X Settings</h1>
            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>X API Token</label>
              <Field
                name="apiToken"
                type="text"
                placeholder="Enter API Token"
                className={styles.tokenInput}
              />
              {errors.apiToken && touched.apiToken && (
                <div className={styles.errorMessage}>{errors.apiToken}</div>
              )}
            </div>

            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>X List ID</label>
              <Field
                name="listId"
                type="text"
                placeholder="Enter List ID"
                className={styles.tokenInput}
              />
              {errors.listId && touched.listId && (
                <div className={styles.errorMessage}>{errors.listId}</div>
              )}
            </div>

            <div className={styles.tokenInputWrapper}>
              <label className={styles.inputLabel}>OpenAI API Key</label>
              <Field
                name="openAIKey"
                type="text"
                placeholder="Enter OpenAI API Key"
                className={styles.tokenInput}
              />
              {errors.openAIKey && touched.openAIKey && (
                <div className={styles.errorMessage}>{errors.openAIKey}</div>
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

export default ConfigSettings;
