import React from "react";
import { ButtonWrapper } from "../BulkUpload.Styles";
import ExportTemplateButton from "./ExportTemplateButton";
import ExportOptionsButton from "./ExportOptionsButton";

const ExportButtons = (props: any) => {
  const { template } = props;

  return (
    <ButtonWrapper>
      <ExportTemplateButton template={template} />
      <ExportOptionsButton template={template} />
    </ButtonWrapper>
  );
};

export default ExportButtons;