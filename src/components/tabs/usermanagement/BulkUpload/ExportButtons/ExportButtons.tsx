import React from "react";
import {
  Row,
  ButtonWrapper
} from "../BulkUpload.Styles";
import ExportTemplateButton from "./ExportTemplateButton";
import ExportOptionsButton from "./ExportOptionsButton";

const BulkUpload = (props: any) => {
  const { consolidatedTemplates } = props;

  return (
    <Row>
      <ButtonWrapper>
        <ExportTemplateButton template={consolidatedTemplates} />
        <ExportOptionsButton template={consolidatedTemplates} />
      </ButtonWrapper>
    </Row>
  );
};

export default BulkUpload;