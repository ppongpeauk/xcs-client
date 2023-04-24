import { LocationEditorProps } from "@/interfaces";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import { Tooltip } from "@mui/material";
import styles from "./LocationEditor.module.css";

export default function LocationEditor({
  location,
  locationLoading,
  saveLocationChanges,
  locationDownloadPackage,
  alertMessage,
}: LocationEditorProps) {
  return (
    <>
      <div className={styles.mainEditor}>
        {location ? (
          <>
            <h1 className={styles.mainEditor__title}>
              <WidgetsRoundedIcon className={styles.mainEditor__titleIcon} />
              {location.name}
            </h1>
            {alertMessage ? (
              !alertMessage[0] ? (
                <div
                  className={`${styles.alertContainer} ${styles.alertContainerError}`}
                >
                  {alertMessage[1]}
                </div>
              ) : (
                <div className={styles.alertContainer}>{alertMessage[1]}</div>
              )
            ) : null}
            <form className={styles.form} onSubmit={saveLocationChanges}>
              <h2 className={styles.mainEditor__subtitle}>
                <InfoRoundedIcon className={styles.mainEditor__subtitleIcon} />
                Location Info
              </h2>
              <div className={styles.formInputRow}>
                <div className={styles.formInputGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={styles.formInput}
                    type="text"
                    placeholder="Location Name"
                    value={location.name}
                  />
                </div>
                <Tooltip
                  title="The place ID cannot be changed once set."
                  followCursor
                >
                  <div className={styles.formInputGroup}>
                    <label htmlFor="placeId" className={styles.label}>
                      Place ID
                    </label>
                    <input
                      id="placeId"
                      name="placeId"
                      className={styles.formInput}
                      type="text"
                      placeholder="Place ID"
                      defaultValue={location.roblox.placeId}
                      disabled={true}
                    />
                  </div>
                </Tooltip>
              </div>
              <h2 className={styles.mainEditor__subtitle}>
                <BadgeRoundedIcon className={styles.mainEditor__subtitleIcon} />
                Permissions
              </h2>

              <hr className={styles.mainEditor__hr}></hr>
              <div className={styles.formInputRow}>
                <div className={styles.formInputGroup}>
                  <button
                    type="submit"
                    className={styles.formButton}
                    disabled={locationLoading}
                  >
                    Save
                  </button>
                </div>
                <div className={styles.formInputGroup}>
                  <button
                    className={styles.formButton}
                    disabled={locationLoading}
                    onClick={locationDownloadPackage}
                  >
                    Download Starter Pack
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.mainEditor__empty}>
            <h1 className={styles.mainEditor__emptyTitle}>
              Select a location to edit...
            </h1>
          </div>
        )}
      </div>
    </>
  );
}