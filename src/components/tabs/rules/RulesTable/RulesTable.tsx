import React, {
  ReactElement,
  useEffect,
  useState
} from "react";
import { LMDSTable } from "components/core/LMDSTable/LMDSTable";
import {
  rulesColumns,
  mappingColumns
} from "./columns";
import {
  useAdminDispatch, useAdminState
} from "context/appContext";
import {
  Pagination as LMDSPagination, Notification
} from "@lmig/lmds-react";
import { Pagination } from "globals/interfaces";
import { logger } from "utils/logger";
import "./RulesTable.scss";
import { listRules } from "services/rules";
import { Rule } from "./interfaces";

export const RulesTable = (): ReactElement => {
  const {
    rules,
    applications,
    ruleRelationships
  } = useAdminState().rulesContext;
  const dispatch = useAdminDispatch();

  const [displayRules, setDisplayRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10
  });

  useEffect(() => {
    const loadRules = async () => {
      try {
        await listRules(dispatch);
      } catch(error){
        setIsLoading(false);
        const message = `Error thrown loading rules state: ${error.message}`;
        logger.error(message, error);
        setError(message);
      }
    };
    loadRules();
  }, []);

  useEffect(() => {
    const getApplicationName = (id: string) => applications.find(app => app.azure_app_id === id)?.name;

    if(rules.length && ruleRelationships.length && applications.length) {
      const displayRules = rules.map(rule => ({
        ...rule,
        applications: ruleRelationships.filter(r => r.id === rule.id)
          .map(a => getApplicationName(a.pk.split("#")[1])),
        children: rule.mappings.length ? (
          <LMDSTable
            data={rule.mappings}
            columns={mappingColumns}
          />
        ): null
      }));
      setDisplayRules(displayRules);
      setIsLoading(false);
    }
  }, [rules, ruleRelationships, applications]);

  return (
    <div className="rules-page">
      {error && (
        <Notification
          alert={error}
          highlightType="negative"
        />
      )}
      <div className="table-container">
        <LMDSTable
          tableName="Rules"
          data={displayRules}
          columns={rulesColumns}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
        />
        <div className="pagination-container">
          <LMDSPagination
            itemCount={displayRules.length || 1}
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
