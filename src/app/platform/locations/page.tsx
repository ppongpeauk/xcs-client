"use client";

import { useAuthContext } from "@/context/user";
import { Location, Organization } from "@/interfaces";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import { Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./locations.module.css";

interface LocationEditorProps {
  location: Location | null;
  locationLoading: boolean;
  saveLocationChanges: (e: React.FormEvent<HTMLFormElement>) => void;
  locationDownloadPackage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  alertMessage: [boolean, string] | null;
}

function LocationEditor({
  location,
  locationLoading,
  saveLocationChanges,
  locationDownloadPackage,
  alertMessage,
}: LocationEditorProps) {
  const [name, setName] = useState<string>("");
  const [placeId, setPlaceId] = useState<string>("");

  useEffect(() => {
    if (location) {
      setName(location.name);
      setPlaceId(location.roblox.placeId || "");
    }
  }, [location]);

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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                      value={placeId}
                      onChange={(e) => setPlaceId(e.target.value)}
                      readOnly={location.roblox.placeId !== null}
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

function Dropdown({ organization }: { organization: Organization }) {
  return (
    <>
      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>
          <Image
            className={styles.dropdownButtonIcon}
            src={organization?.avatarURI}
            width={36}
            height={36}
            alt={organization?.name}
          />
          <span className={styles.dropdownButtonText}>
            {organization?.name}
          </span>
          {organization?.type === "personal" ? (
            <span className={styles.pill}>Personal</span>
          ) : null}
          <span className={styles.dropdownArrowIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              id="arrow-drop-down"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M7 10l5 5 5-5H7z"></path>
            </svg>
          </span>
        </button>
        <div className={styles.dropdownContent}>
          <a href="#">personal</a>
        </div>
      </div>
    </>
  );
}

function LocationListSkeleton() {
  return (
    <>
      {[...Array(16)].map((_, i) => (
        <tr key={i} className={styles.tr}>
          <td className={styles.td}>
            <Skeleton width={"100%"} duration={1} />
          </td>
          <td className={styles.td}>
            <Skeleton width={"100%"} duration={1} />
          </td>
          <td className={styles.td}>
            <Skeleton width={"100%"} duration={1} />
          </td>
          <td className={styles.td}>
            <Skeleton width={"100%"} duration={1} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function Page() {
  const { user, auth } = useAuthContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [organization, setOrganization] = useState<Organization | null>();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [alertMessage, setAlertMessage] = useState<[boolean, string] | null>(
    null
  );

  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  function saveLocationChanges(e: React.FormEvent<HTMLFormElement>) {
    if (location === null) return;
    e.preventDefault();
    setLocationLoading(true);
    setAlertMessage(null);

    const form = new FormData(e.currentTarget);

    const data = {
      name: form.get("name"),
      roblox: {
        placeId: form.get("placeId") === "" ? null : form.get("placeId"),
      }
    };

    auth.currentUser.getIdToken().then((idToken: string) => {
      axios
        .put(
          "/api/v1/locations/update",
          {},
          {
            headers: { Authorization: `Bearer ${idToken}` },
            params: {
              location_id: location?.id,
              data: JSON.stringify(data),
            },
          }
        )
        .then((res) => {
          showLocation(location);
          if (res.data.success) {
            setAlertMessage([true, "Location updated!"]);
            return;
          } else {
            setAlertMessage([false, res.data.error]);
            return;
          }
        })
        .catch((res) => {
          setAlertMessage([false, res.data?.error || "An error occurred."]);
          setLocationLoading(false);
        })
        .finally(() => {
          setLocationLoading(false);
          syncLocations();
        });
    });
  }

  function locationDownloadPackage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLocationLoading(true);
  }

  function deleteLocation(entry: Location) {
    setLocationLoading(true);
    auth.currentUser.getIdToken().then((idToken: string) => {
      axios
        .delete("/api/v1/locations/delete", {
          headers: { Authorization: `Bearer ${idToken}` },
          params: { location_id: entry.id },
        })
        .then((res) => {
          setLocationLoading(false);
          syncLocations();
          if (location?.id === entry.id) {
            setLocation(null);
          }
        })
        .catch((err) => {
          setLocationLoading(false);
        })
        .finally(() => {
          setAlertMessage(null);
        });
    });
  }

  useEffect(() => {
    if (!user.data) return;
    try {
      auth.currentUser.getIdToken().then((idToken: string) => {
        axios
          .get("/api/v1/user/organizations", {
            params: { user_id: user.data.id },
            headers: { Authorization: `Bearer ${idToken}` },
          })
          .then((res) => {
            setOrganizations(res.data.organizations);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (err) {}
  }, [user, auth.currentUser]);

  function syncLocations() {
    if (!organization) return;

    setPageLoading(true);
    setLocations([]);
    auth.currentUser.getIdToken().then((idToken: string) => {
      axios
        .get("/api/v1/locations/list", {
          params: { organization_id: organization?.id },
          headers: { Authorization: `Bearer ${idToken}` },
        })
        .then((res) => {
          setLocations(res.data.locations);
        })
        .catch((err) => {})
        .finally(() => {
          setPageLoading(false);
        });
    });
  }

  function showLocation(entry?: Location) {
    setLocationLoading(true);
    if (!entry) return;
    auth.currentUser.getIdToken().then((idToken: string) => {
      axios
        .get("/api/v1/locations", {
          params: { location_id: entry.id },
          headers: { Authorization: `Bearer ${idToken}` },
        })
        .then((res) => {
          setLocation(res.data.location);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLocationLoading(false);
        });
    });
  }

  useEffect(() => {
    syncLocations();
    setLocation(null);
    setAlertMessage(null);
  }, [auth.currentUser, organization]);

  useEffect(() => {
    if (organizations.length > 0) {
      if (!organization) {
        setOrganization(organizations[0]);
      }
    }
  }, [locations, organization, organizations]);

  return (
    <>
      <div className={styles.main}>
        {/* temporary placeholder select element */}
        <label htmlFor="organization" className={styles.label}>
          Organization
        </label>
        <select
          id="organization"
          className={styles.dropdown}
          onChange={(e) => {
            setOrganization(
              organizations.find(
                (org: Organization) => org.id === e.target.value
              )
            );
          }}
        >
          <optgroup label="Organizations">
            {organizations.map((entry: Organization) => {
              return (
                <option value={entry?.id} key={entry?.id}>
                  {entry?.name}
                </option>
              );
            })}
          </optgroup>
        </select>
        <div className={styles.mainColumns}>
          <div className={styles.mainTable}>
            <table className={styles.table}>
              <col className={styles.col} style={{ width: "30%" }} />
              <col className={styles.col} style={{ width: "20%" }} />
              <col className={styles.col} style={{ width: "20%" }} />
              <col className={styles.col} style={{ width: "15%" }} />
              <tr className={styles.tr}>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Tags</th>
                <th className={styles.th}>Last Updated Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
              {!pageLoading && locations.length > 0 ? (
                locations.map((entry: Location) => {
                  return (
                    <tr key={entry.id}>
                      <td className={`${styles.td} ${styles.th__location_id}`}>
                        <Image
                          className={styles.locationImage}
                          src={entry?.avatarURI}
                          width={64}
                          height={64}
                          alt={entry?.name}
                        />
                        <span>{entry?.name}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.locationPillContainer}>
                          {entry.tags.map((tag: string) => {
                            return (
                              <span className={styles.pill} key={tag}>
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className={styles.td}>
                        {moment(entry?.lastUpdatedDate).fromNow()}
                      </td>
                      <td className={styles.td}>
                        <button
                          onClick={() => {
                            showLocation(entry);
                          }}
                        >
                          <EditOutlinedIcon className={styles.buttonIcon} />
                        </button>
                        <button
                          onClick={() => {
                            deleteLocation(entry);
                          }}
                        >
                          <DeleteForeverOutlinedIcon
                            className={styles.buttonIcon}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : pageLoading ? (
                <LocationListSkeleton />
              ) : (
                <tr key={1} className={styles.tr}>
                  <td className={styles.td}>No locations found.</td>
                </tr>
              )}
            </table>
          </div>
          <LocationEditor
            location={location}
            locationLoading={locationLoading}
            saveLocationChanges={saveLocationChanges}
            locationDownloadPackage={locationDownloadPackage}
            alertMessage={alertMessage}
          />
        </div>
      </div>
    </>
  );
}
