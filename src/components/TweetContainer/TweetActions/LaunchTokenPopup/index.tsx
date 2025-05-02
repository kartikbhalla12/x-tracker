import { useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import ImageView from "@/components/TweetContainer/ImageView";
import styles from '@/components/TweetContainer/TweetActions/LaunchTokenPopup/index.module.css';

import { getImageUrlForLaunch, parseTweetText } from "@/utils/tweet";

import useTweetImages from "@/hooks/useTweetImages";

import { ITweet, IAnalysis } from "@/interfaces/index.interface";

import Cross from "@/icons/Cross";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Token name is required'),
  ticker: Yup.string().required('Ticker symbol is required'),
  imageUrl: Yup.string().url('Must be a valid URL').required('Image URL is required'),
});

interface FormValues {
  name: string;
  ticker: string;
  imageUrl: string;
}

interface LaunchTokenPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToken: (tokenData: FormValues) => Promise<void>;
  tweet: ITweet;
  analysis?: IAnalysis | null;
  loading?: boolean;
} 
const LaunchTokenPopup = ({
  isOpen,
  onClose,
  onAddToken,
  tweet,
  analysis,
  loading,
}: LaunchTokenPopupProps) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      ticker: '',
      imageUrl: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await onAddToken(values);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    const setImageUrl = async () => {
      const imageUrlForLaunch = await getImageUrlForLaunch(tweet);
      if (imageUrlForLaunch) {
        formik.setValues({
          name: analysis?.tokenName || '',
          ticker: analysis?.ticker || '',
          imageUrl: imageUrlForLaunch,
        })
      }
    }
    setImageUrl();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweet, analysis]);

  const images = useTweetImages(tweet);
  const parsedTweetText = parseTweetText(tweet.text.slice(0, 500) + '...');

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        {
          loading ? (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : <></>
        }
        <div className={styles.popupLeft}>
          <div className={styles.popupHeader}>
            <h2>Launch Token</h2>
          </div>
          <div className={styles.tweetPreview}>
            <p>{parsedTweetText}</p>
            {images?.length ? (
              <div className={styles.tweetMedia}>
                <ImageView images={images} alt="Media" />
              </div>
            ) : <></>}
          </div>
        </div>
        <div className={styles.popupRight}>
          <form onSubmit={formik.handleSubmit} className={styles.tokenForm}>
            <div className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Token Name</label>
                <div className={styles.tokenNameInputWrapper}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter token name"
                    disabled={formik.isSubmitting}
                  />
                  {formik.values.name && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => formik.setFieldValue('name', '')}
                      disabled={formik.isSubmitting}
                    >
                      <Cross />
                    </button>
                  )}
                </div>
                {formik.touched.name && formik.errors.name && (
                  <div className={styles.errorMessage}>{formik.errors.name}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="ticker">Ticker Symbol</label>
                <div className={styles.tokenNameInputWrapper}>
                  <input
                    type="text"
                    id="ticker"
                    name="ticker"
                    value={formik.values.ticker}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter ticker symbol"
                    disabled={formik.isSubmitting}
                  />
                  {formik.values.ticker && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => formik.setFieldValue('ticker', '')}
                      disabled={formik.isSubmitting}
                    >
                     <Cross/>
                    </button>
                  )}
                </div>
                {formik.touched.ticker && formik.errors.ticker && (
                  <div className={styles.errorMessage}>{formik.errors.ticker}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formik.values.imageUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter image URL"
                  disabled={formik.isSubmitting}
                />
                {formik.touched.imageUrl && formik.errors.imageUrl && (
                  <div className={styles.errorMessage}>{formik.errors.imageUrl}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tweetLink">Tweet Link</label>
                <input
                  type="url"
                  id="tweetLink"
                  value={tweet?.url}
                  placeholder="Enter tweet URL"
                  disabled
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={() => {
                formik.resetForm()
                onClose();
              }}>
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Launching...' : 'Launch Token'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaunchTokenPopup;
