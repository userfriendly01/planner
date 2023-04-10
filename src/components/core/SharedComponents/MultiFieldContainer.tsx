import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";


export interface MultiContainerFormFieldsProps{
    label: string;
    name: string;
    value?: any;
    type: string;
}

interface MultiFieldContainerProps{
    label: string;
    name: string;
    value: Array<any>;
    error: boolean;
    required: boolean;
    formFields: Array<MultiContainerFormFieldsProps>;
}

const MultiFieldContainer = (
  {
    error, name, label, required, value, formFields
  }:MultiFieldContainerProps): JSX.Element =>{

  const [isModalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const handleClick =(event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setModalOpen(!isModalOpen);
  };
  const handleOnClose =() => {
    setAnchorEl(null);
    setModalOpen(false);
  };


  return (
    <>
      <FormControl sx={{ width: "calc(95%)" }} error={error} required={required}>
        <TextField
          variant="outlined"
          label={label}
          name={name}
          type="button"
          //   InputProps={{
          //     startAdornment: value.map(item=>(
          //       <Chip
          //         key={item}
          //         tabIndex={-1}
          //         label={item}
          //       />
          //     ))
          //   }}
          onClick={handleClick}
        />
      </FormControl>
      <MultiFieldContainerModalView formFields={formFields} isOpen={isModalOpen} anchorEl={anchorEl} formLabel={label} onClose={handleOnClose}/>
    </>
  );
};


const MultiFieldContainerModalView = ({
  formFields,isOpen,anchorEl, formLabel, onClose
}: {formFields:Array<MultiContainerFormFieldsProps>, isOpen: boolean, anchorEl: HTMLDivElement | null, formLabel: string, onClose: ()=>void}): JSX.Element =>{
  const handleOnSetModalData = () =>{
    return;
  };

  const handleOnMultiModalOnChange = (event: any) =>{
    const key = event.target.name;
    const value = event.target.value;
  };
  console.log("anchorEl, isOpen", anchorEl, isOpen);
  return (
    <Popper
      disablePortal={true}
      placement="right-start"
      open={isOpen}
      anchorEl={anchorEl}
      transition
      sx={{
        opacity: 1,
        backgroundColor: "#fff",
        zIndex: 1500
      }}
    >{
        ({ TransitionProps })=>(
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={{
              padding: 2,
              border: "1px solid"
            }}>
              <Grid container rowSpacing={1}>
                {formFields && formFields.map((item: MultiContainerFormFieldsProps)=>(
                  <Grid key={item.label} item xs={12}>
                    <TextField
                      variant="outlined"
                      name={item.name}
                      type={item.type}
                      value={item.value}
                      label={item.label}
                      onChange={handleOnMultiModalOnChange}
                    />
                  </Grid>))}
                <Grid key={`set-button-${formLabel}`} item xs={6}>
                  <Button
                    type="submit"
                    value="Save"
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: 1 }}
                    aria-label = "setModalDataButton"
                    onClick={()=>handleOnSetModalData()}
                  >
                Set
                  </Button>
                </Grid>
                <Grid key={`set-button-${formLabel}`} item xs={6}>
                  <Button
                    type="submit"
                    value="Cancel"
                    variant="contained"
                    color="error"
                    sx={{ marginLeft: 1 }}
                    aria-label = "cancelModal"
                    onClick={()=>onClose()}
                  >
                Cancel
                  </Button>
                </Grid>
              </Grid>

            </Box>
          </Fade>
        )}
    </Popper>
  );
};

export default MultiFieldContainer;