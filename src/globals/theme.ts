const disabledGrey = "#A7A7A7";
const hoverBlue = "#9EDEDE";
const hoverGrey = "rgba(0,0,0,0.15)";

export const theme = {
  backgroundColor: "#FFF",
  button: {
    blue: {
      backgroundColor: "#AAEDED",
      hoverColor: hoverBlue
    },
    icon: {
      backgroundHoverColor: hoverBlue,
      diameter: 24,
      disabledColor: disabledGrey
    }
  },
  circularProgressSize: 60,
  errorColor: "rgb(201,40,45)",
  libertyDarkGray: "#343741",
  libertyDarkTeal: "#06748C",
  libertyLightYellow: "#FFE280",
  libertyMediumTeal: "#28A3AF",
  libertyYellow: "#FFD000",
  lineSeperatorColor: "#9E9E9E",
  navArrow: {
    disabledColor: disabledGrey,
    hoverColor: hoverGrey
  },
  resultsModal: {
    fadedError: "rgba(201,40,45,.10)",
    fadedSuccess: "rgba(108,149,60,.10)",
    fadedWarning: "rgba(236,172,0,.10)"
  },
  successColor: "rgb(108,149,60)",
  tableRow: {
    alternateRowColor: "rgba(0,0,0,0.04)",
    borderColor: "#F5F5F5",
    darkerBorderColor: "#E7E7E7",
    icon: {
      size: 16,
      hoverDiameter: 20
    },
    hoverColor: hoverGrey,
    hoverSelectedColor: hoverBlue,
    selectedColor: "#AAEDED"
  },
  textColor: "#1A1446",
  warningColor: "rgb(236,172,0)"
};