import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface IDialogBox {
  open: boolean;
  handleClose: () => void;
  message: string;
  color: "success" | "error";
  btnText: string;
  agreeHandler: () => void;
}

const DialogBox = ({ open, handleClose, message, color, btnText, agreeHandler}: IDialogBox) => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <Box p="50px 30px">
          <DialogTitle id="alert-dialog-title">
            { message }
          </DialogTitle>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }} variant="outlined" size="large"> cancel </Button>
            <Button onClick={(e) => {
              e.stopPropagation();
              agreeHandler();
            }} variant="contained" color={color} size="large"> { btnText } </Button>
          </Box>
        </Box>
      </Dialog>
    )
}

export default DialogBox;