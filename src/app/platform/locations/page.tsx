"use client";

import { useAuthContext } from "@/context/user";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./locations.module.css";

interface Organization {
  id: string;
  name: string;
  avatarURI: string;
  owner: string;
  type: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  tags: any;
  organizationId: string;
  lastUpdatedDate: string;
  avatarURI: string;
  roblox: {
    id: string;
  };
}

// function Dropdown() {
//   const [organization, setOrganization] = useState<Organization>({
//     id: "1",
//     name: "Pete Pongpeauk",
//     avatarURI:
//       "https://cdn.discordapp.com/attachments/813308393208414219/1088750737145729106/pete.png",
//     owner: "FF0gCiIJYUPfmA4CTfqXTyPcHQb2",
//     type: "personal",
//   });
//   return (
//     <>
//       <div className={styles.dropdown}>
//         <button className={styles.dropdownButton}>
//           <Image
//             className={styles.dropdownButtonIcon}
//             src={organization?.imageURI}
//             width={36}
//             height={36}
//             alt={organization?.name}
//           />
//           <span className={styles.dropdownButtonText}>
//             {organization?.name}
//           </span>
//           {organization?.type === "personal" ? (
//             <span className={styles.pill}>Personal</span>
//           ) : null}
//           <span className={styles.dropdownArrowIcon}>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               id="arrow-drop-down"
//             >
//               <path fill="none" d="M0 0h24v24H0V0z"></path>
//               <path d="M7 10l5 5 5-5H7z"></path>
//             </svg>
//           </span>
//         </button>
//         <div className={styles.dropdownContent}>
//           <a href="#">personal</a>
//         </div>
//       </div>
//     </>
//   );
// }

export default function Page() {
  const { user, auth } = useAuthContext();
  const [locations, setLocations] = useState([]);
  const [organization, setOrganization] = useState<Organization | null>();
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    if (!user) return;
    //setOrganizations(user.data?.organizations ? user.data.organizations : []);
    try {
      auth.currentUser.getIdToken().then((idToken: string) => {
        axios
          .post(
            "/api/v1/user/organizations",
            {},
            {
              params: { user_id: user.data?.id },
              headers: { Authorization: `Bearer ${idToken}` },
            }
          )
          .then((res) => {
            setOrganizations(res.data.organizations);
            console.log(`Organizations: ${res.data.organizations}`);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (err) {}
  }, [user]);

  useEffect(() => {
    auth.currentUser.getIdToken().then((idToken: string) => {
      axios
        .post(
          "/api/v1/locations/list",
          {},
          {
            params: { organization_id: organization?.id },
            headers: { Authorization: `Bearer ${idToken}` },
          }
        )
        .then((res) => {
          console.log(res.data.locations);
          setLocations(res.data.locations);
        })
        .catch((err) => {});
    });
  }, [auth.currentUser, organization]);

  useEffect(() => {
    if (organizations.length > 0) {
      if (!organization) {
        setOrganization(organizations[0]);
      }
    }
  }, [locations, organization, organizations]);

  // temporary elements

  return (
    <>
      <div className={styles.main}>
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
              <tr className={styles.tr}>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Tags</th>
                <th className={styles.th}>Last Updated Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
              {locations.length > 0 ? (
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
                        {entry?.tags?.map((tag: string) => {
                          <span className={styles.pill} key={tag}>
                            {tag}
                          </span>;
                        })}
                      </td>
                      <td className={styles.td}>{entry?.lastUpdatedDate}</td>
                      <td className={styles.td}>
                        <button className={styles.button}>Edit</button>
                        <button className={styles.button}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr key={1} className={styles.tr}>
                  <td className={styles.td}>No locations found.</td>
                </tr>
              )}
              {/* {locations.length > 0 ? null : (
              <tr key={1} className={styles.tr}>
                <td className={styles.td}>No locations found.</td>
              </tr>
            )} */}
            </table>
          </div>
          <div className={styles.mainEditor}></div>
        </div>
      </div>
    </>
  );
}
