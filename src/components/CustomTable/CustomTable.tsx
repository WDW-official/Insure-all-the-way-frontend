"use client";

import ArrowDown from "@/assets/svgIcons/ArrowDown";
import { capitalize, structureWords } from "@/helpers/capitalize";
import { LinearProgress } from "@mui/material";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import classes from "./CustomTable.module.css";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import moment from "moment";
import Dropdown from "../Dropdown/Dropdown";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { formatCurrency } from "@/helpers/formatAmount";

export type TableOption = {
  text: string;
  action: (rowData: Record<string, any>) => void;
};

type CustomTableProps = {
  header: string;
  headers: string[];
  fields: string[];
  data: Record<string, any>[];
  isOptions?: boolean;
  options?: TableOption[];
  onRowClick?: (rowData: Record<string, any>) => void;
  setState?: Dispatch<SetStateAction<string | null>>;
  loading?: boolean;
  request?: () => void;
  setSearchKey?: Dispatch<SetStateAction<string>>;
  sliceValue?: number;
  route?: string;
  sortOptions?: { title: string; id: string }[];
  notifications?: boolean;
};

const CustomTable: React.FC<CustomTableProps> = ({
  header,
  headers,
  fields,
  data,
  isOptions = false,
  options = [],
  onRowClick,
  setState,
  loading,
  setSearchKey,
  sliceValue,
  route,
  sortOptions,
  notifications = false,
}) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [keyActive, setKeyActive] = useState(false);
  const [sortOption, setSortOption] = useState("");

  const toggleActiveRow = (index: number) => {
    setActiveRow(activeRow === index ? null : index);
  };

  //   refs
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const keyRef = useRef<HTMLDivElement | null>(null);

  // Utils
  headers = notifications ? ["Notifications", ...headers] : [...headers];

  // Hooks
  const { updateSearchParams } = useUpdateSearchParams();

  //   Effects
  useEffect(() => {
    if (typeof document !== "undefined") {
      const removeDropdownHandler = (e: any) => {
        if (optionsRef && !optionsRef?.current?.contains(e.target)) {
          setActiveRow(null);
        }

        if (keyRef && !keyRef?.current?.contains(e.target)) {
          setKeyActive(false);
        }
      };
      document.addEventListener("mousedown", removeDropdownHandler);

      return () => {
        document.removeEventListener("mousedown", removeDropdownHandler);
      };
    }
  });

  // Effects
  useEffect(() => {
    if (setSearchKey) {
      const timeout = setTimeout(() => {
        setSearchKey(search);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [search]);

  useEffect(() => {
    if (sortOption) {
      const activeOption = sortOptions?.find(
        (data) => data?.title === sortOption
      );

      if (sortOption.toLowerCase() !== "none") {
        updateSearchParams(
          "sortBy",
          encodeURIComponent(activeOption?.id as string),
          "set"
        );
      } else {
        updateSearchParams("sortBy", undefined, "delete");
      }
    }
  }, [sortOption]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <span>{header}</span>

        <div>
          {setSearchKey && (
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => inputChangeHandler(e, setSearch, true)}
              type="search"
            />
          )}

          {(sortOptions?.length as number) > 0 && (
            <Dropdown
              options={[
                "None",
                ...(sortOptions as any)?.map((data: any) => data?.title),
              ]}
              title="Sort By"
              selected={sortOption}
              setSelected={setSortOption}
            />
          )}
        </div>
      </div>

      <div className={classes.tableHeaderContainer}>
        {headers.map((colHeader, index) => (
          <span key={index} className={classes.tableHeader}>
            {colHeader.toUpperCase()}
          </span>
        ))}
        {isOptions && <span className={classes.tableHeader}>OPTIONS</span>}
      </div>

      {loading && (
        <LinearProgress
          color="inherit"
          style={{ color: "#edd014", height: "2px" }}
        />
      )}

      {data && data.length > 0 ? (
        sliceValue ? (
          data?.slice(0, sliceValue).map((row, rowIndex) => {
            const daysLeft = row?.daysLeft;

            return (
              <div
                key={rowIndex}
                className={`${classes.tableBodyContainer}`}
                onClick={() => {
                  onRowClick && onRowClick(row);
                  setState && setState(row?._id || row?.id);
                }}
              >
                {fields.map((field, colIndex) => {
                  if (field?.includes("Date")) {
                    return (
                      <span key={colIndex} className={classes.tableBody}>
                        <span
                          className={`${
                            daysLeft < 14
                              ? classes?.late
                              : daysLeft >= 14 && daysLeft < 60
                              ? classes.midLate
                              : classes.early
                          }`}
                        >
                          {moment(row[field])?.format("DD-MM-YY")}
                        </span>
                      </span>
                    );
                  }

                  return (
                    <span key={colIndex} className={classes.tableBody}>
                      {row[field] !== undefined || row[field] !== null
                        ? structureWords(String(row[field]))
                        : `No data`}
                    </span>
                  );
                })}

                {isOptions && (
                  <span className={classes.tableBody}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActiveRow(rowIndex);
                        setState && setState(row?._id || row?.id);
                      }}
                      className={classes.button}
                    >
                      <span>Options</span>
                      <ArrowDown dimensions="16px" />

                      {activeRow === rowIndex && options.length > 0 && (
                        <div className={classes.options} ref={optionsRef}>
                          {options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                option.action(row);
                              }}
                            >
                              {option.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </span>
                  </span>
                )}
              </div>
            );
          })
        ) : (
          data?.map((row, rowIndex) => {
            const daysLeft = row?.daysLeft;

            return (
              <div
                key={rowIndex}
                className={`${classes.tableBodyContainer}`}
                onClick={() => {
                  onRowClick && onRowClick(row);
                  setState && setState(row?._id || row?.id);
                }}
              >
                {fields.map((field, colIndex) => {
                  if (field?.includes("Date")) {
                    return (
                      <span key={colIndex} className={classes.tableBody}>
                        <span
                          className={`${
                            daysLeft < 14
                              ? classes?.late
                              : daysLeft >= 14 && daysLeft < 60
                              ? classes.midLate
                              : classes.early
                          }`}
                        >
                          {row[field] !== undefined && row[field] !== null
                            ? moment(row[field])?.format("DD-MM-YY")
                            : ""}
                        </span>
                      </span>
                    );
                  }

                  if (field?.includes("value")) {
                    return (
                      <span key={colIndex} className={classes.tableBody}>
                        <span>{formatCurrency(row[field])}</span>
                      </span>
                    );
                  }

                  return (
                    <span key={colIndex} className={classes.tableBody}>
                      {row[field] !== undefined && row[field] !== null
                        ? structureWords(String(row[field]))
                        : `No ${field}`}
                    </span>
                  );
                })}

                {isOptions && (
                  <span className={classes.tableBody}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActiveRow(rowIndex);
                        setState && setState(row?._id || row?.id);
                      }}
                      className={classes.button}
                    >
                      <span>Options</span>
                      <ArrowDown dimensions="16px" />

                      {activeRow === rowIndex && options.length > 0 && (
                        <div className={classes.options} ref={optionsRef}>
                          {options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                option.action(row);
                              }}
                            >
                              {option.text}
                            </span>
                          ))}
                        </div>
                      )}
                    </span>
                  </span>
                )}
              </div>
            );
          })
        )
      ) : (
        <p className={classes.paragraph}>No data available</p>
      )}

      {route && sliceValue && data?.length >= sliceValue && (
        <Link href={route} className={classes.more}>
          View more
        </Link>
      )}
    </div>
  );
};

export default CustomTable;
