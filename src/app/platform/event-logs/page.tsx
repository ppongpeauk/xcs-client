"use client";

import { useEffect, useState } from "react";
import styles from "./logs.module.css";

import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import DoNotDisturbAltRoundedIcon from "@mui/icons-material/DoNotDisturbAltRounded";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";

import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

import { useAuthContext } from "@/context/user";

import placeholderPicture from "@/assets/no-user.png";

function SkeletonGroup() {
  const { user } = useAuthContext();

  return (
    <>
      <div className={styles.logDayGroup}>
        <div className={styles.logDayGroupTitle}>
          <h1>
            <Skeleton width={200} duration={1} />
          </h1>
        </div>
        <table className={styles.table}>
          <>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className={styles.tr}>
                <td className={styles.td}>
                  <Skeleton width={100} duration={1} />
                </td>
                <td className={styles.td}>
                  <Skeleton width={100} duration={1} />
                </td>
                <td className={styles.td}>
                  <Skeleton width={100} duration={1} />
                </td>
                <td className={styles.td}>
                  <Skeleton width={100} duration={1} />
                </td>
                <td className={styles.td}>
                  <Skeleton width={100} duration={1} />
                </td>
                <td className={`${styles.td} ${styles.actions}`}>
                  <div
                    className={`${styles.logInfoColumn} ${styles.logInfoSeekIcon}`}
                  >
                    <Skeleton width={24} height={24} duration={1} />
                  </div>
                </td>
              </tr>
            ))}
          </>
        </table>
      </div>
    </>
  );
}

interface Alias {
  name?: string;
  username?: string;
  location?: string;
  accessPoint?: string;
  profilePicture?: any;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, Math.floor(Math.random() * 2000));
  }, []);

  // const fetchLogs: { [key: string]: any } = {
  //   Today: [
  //     {
  //       id: "0eef70df-5989-447f-9a65-b858793efda2",
  //       status: 0,
  //       time: "8:42:15 PM",
  //       info: {
  //         name: "restrafes",
  //         username: null,
  //         profilePicture: null,
  //         location: "4040 Wilson",
  //         accessPoint: "Front Door",
  //       },
  //     },
  //     {
  //       id: "0eef70df-5989-447f-9a65-b858793efda2",
  //       status: 1,
  //       time: "7:26:48 PM",
  //       info: {
  //         name: "Pete Pongpeauk",
  //         username: "ppongpeauk",
  //         profilePicture: null,
  //         location: "4040 Wilson",
  //         accessPoint: "Front Door",
  //       },
  //     },
  //     {
  //       id: "0eef70df-5989-447f-9a65-b858793efda2",
  //       status: 1,
  //       time: "12:00:34 PM",
  //       info: {
  //         name: "Pete Pongpeauk",
  //         username: "ppongpeauk",
  //         profilePicture: null,
  //         location: "4040 Wilson",
  //         accessPoint: "Front Door",
  //       },
  //     },
  //     {
  //       id: "0eef70df-5989-447f-9a65-b858793efda2",
  //       status: 1,
  //       time: "11:59:47 AM",
  //       info: {
  //         name: "Pete Pongpeauk",
  //         username: "ppongpeauk",
  //         profilePicture: null,
  //         location: "4040 Wilson",
  //         accessPoint: "Front Door",
  //       },
  //     },
  //   ],
  // };
  
  const fetchLogs: { [key: string]: any } = {};

  function formattedAlias(alias: Alias): JSX.Element {
    let res = <></>;

    if (alias.name && !alias.username) {
      return (
        <>
          <Image
            src={alias.profilePicture || placeholderPicture}
            className={styles.logInfoUserPhoto}
            alt="Profile picture"
            height={24}
          />
          <span>{alias.name}</span>
        </>
      );
    } else if (!alias.name && alias.username) {
      return (
        <>
          <Image
            src={alias.profilePicture || placeholderPicture}
            className={styles.logInfoUserPhoto}
            alt="Profile picture"
            height={24}
          />
          <Link href={`/platform/user/${alias.username}`}>
            <strong className={styles.username}>@{alias.username}</strong>
          </Link>
        </>
      );
    } else if (alias.name && alias.username) {
      return (
        <>
          <Image
            src={alias.profilePicture || placeholderPicture}
            className={styles.logInfoUserPhoto}
            alt="Profile picture"
            height={24}
          />
          <Link href={`/platform/user/${alias.username}`}>
            <strong>{alias.name}</strong>{" "}
            <span className={styles.username}>(@{alias.username})</span>
          </Link>
        </>
      );
    } else {
      return <span>Unknown</span>;
    }
  }

  return (
    <div className={styles.main}>
      {/* <div className={styles.actionBar}></div> */}
      <div className={styles.logs}>
        {/* for each date, map through the logs and display them */}
        {isLoading ? (
          <SkeletonGroup />
        ) : (
          Object.keys(fetchLogs).map((date) => (
            <div key={date} className={styles.logDayGroup}>
              <div className={styles.logDayGroupTitle}>
                <h1>{date}</h1>
              </div>
              <table className={styles.table}>
                {Object.keys(fetchLogs).length > 0 ? (
                  <>
                    <tr className={styles.tr}>
                      <th className={styles.th}>Time</th>
                      <th className={styles.th}>Status</th>
                      <th className={styles.th}>Accessor</th>
                      <th className={styles.th}>Location</th>
                      <th className={styles.th}>Entry Point</th>
                      <th className={styles.th}>Actions</th>
                    </tr>
                    {fetchLogs[date] &&
                      fetchLogs[date].map((log: any) => (
                        <tr key={log.id} className={styles.tr}>
                          <td className={styles.td}>{log.time}</td>
                          <td className={styles.td}>
                            {log.status === 0 ? (
                              <DoneRoundedIcon
                                className={`${styles.logStatusIcon} ${styles.logStatusIcon__success}`}
                              />
                            ) : (
                              <DoNotDisturbAltRoundedIcon
                                className={`${styles.logStatusIcon} ${styles.logStatusIcon__error}`}
                              />
                            )}
                          </td>
                          <td className={styles.td}>
                            <div className={styles.tdName}>
                              {formattedAlias(log.info)}
                            </div>
                          </td>
                          <td className={styles.td}>{log.info.location}</td>
                          <td className={styles.td}>{log.info.accessPoint}</td>
                          <td className={`${styles.td} ${styles.actions}`}>
                            <div
                              className={`${styles.logInfoColumn} ${styles.logInfoButton}`}
                            >
                              <Link href={`/platform/access-points/${log.id}`}>
                                <PreviewRoundedIcon sx={{ fontSize: 20 }} />
                              </Link>
                            </div>
                            <div
                              className={`${styles.logInfoColumn} ${styles.logInfoButton}`}
                            >
                              <button>
                                <SentimentSatisfiedAltRoundedIcon
                                  sx={{ fontSize: 20 }}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </>
                ) : (
                  <tr key={1} className={styles.tr}>
                    <td className={styles.td}>
                      No recent attempts were found. Start scanning!
                    </td>
                  </tr>
                )}
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
