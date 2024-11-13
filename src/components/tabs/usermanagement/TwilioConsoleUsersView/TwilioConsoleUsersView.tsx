import React, {
  ReactElement,
  useEffect,
  useState
} from "react";
import { TwilioConsoleUser } from "./interfaces";
import { LMDSTable } from "components/core/LMDSTable/LMDSTable";
import {
  twilioConsoleUsersColumns,
  twilioConsoleUsersRolesColumns
} from "./columns";
import { getTwilioConsoleUsers } from "services/twilioConsoleUsers";
import { useAdminState } from "context/appContext";
import { fetchUserByEmail } from "services/fetchUser";
import {
  Pagination as LMDSPagination, Notification
} from "@lmig/lmds-react";
import { Pagination } from "globals/interfaces";
import { logger } from "utils/logger";
import "./TwilioConsoleUsersView.scss";

export const TwilioConsoleUsersView = (): ReactElement => {
  const { userContext: { tokens }} = useAdminState();

  const [consoleUsers, setConsoleUsers] = useState<TwilioConsoleUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await getTwilioConsoleUsers(tokens.adminService);
        const updatedUsers = await Promise.all(
          users.map(async user => {
            const msGraphUser = await fetchUserByEmail(tokens.msGraph, user.email);

            return {
              ...user,
              hrActive: msGraphUser ? !msGraphUser.isTerminated : false,
              children: user.roles.length ? (
                <LMDSTable
                  data={user.roles}
                  columns={twilioConsoleUsersRolesColumns}
                />
              ) : null
            };
          })
        );

        setConsoleUsers(updatedUsers);
      } catch(error: unknown) {
        logger.error("Error fetching Twilio Console Users", { message: (error as Error).message });

        setError(`Error fetching Twilio Console Users: ${(error as Error).message}`);
      }

      setIsLoading(false);
    };

    getUsers();
  }, []);

  return (
    <div className="twilio-console-users-page">
      {error && (
        <Notification
          alert={error}
          highlightType="negative"
        />
      )}
      <div className="table-container">
        <LMDSTable
          tableName="Twilio Console Users"
          data={consoleUsers}
          columns={twilioConsoleUsersColumns}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
        />
        <div className="pagination-container">
          <LMDSPagination
            itemCount={consoleUsers.length || 1}
            withWords={false}
            onChange={e => {
              setPagination({
                pageIndex: e.page,
                pageSize: e.itemsPerPage
              });
            }}
            page={pagination.pageIndex}
            itemsPerPage={pagination.pageSize}
          />
        </div>
      </div>
    </div>
  );
};
