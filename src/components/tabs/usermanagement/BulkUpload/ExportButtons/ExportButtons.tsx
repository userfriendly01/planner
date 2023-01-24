import React from "react";
import {
  Row,
  ButtonWrapper
} from "../BulkUpload.Styles";
import ExportTemplateButton from "./ExportTemplateButton";
import ExportOptionsButton from "./ExportOptionsButton";

const ExportButtons = (props: any) => {
  const { template } = props;

  return (
    <Row>
      <ButtonWrapper>
        <ExportTemplateButton template={template} />
        <ExportOptionsButton template={template} />
      </ButtonWrapper>
    </Row>
  );
};

export default ExportButtons;