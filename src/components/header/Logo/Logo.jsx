import React from "react";
import styled from "styled-components";
import appLogo from "icons/LogoLibertyBlue.png";

const AppImg = styled.img`
  max-height: 36px;
`;

const Logo = () => {
  return <AppImg src={appLogo} alt="Triton Admin Logo" />;
};

export default Logo;