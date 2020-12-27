import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import Cmd from '../utils/Cmd';

const noop = () => {};

export default function Modal() {
  const [shown, setShown] = React.useState(false);
  const [modalProps, setModalProps] = React.useState<ModalPropsType>({
    title: '',
    description: '',
    cancelText: 'Cancel',
    okText: 'OK',
    onOk: noop,
  });

  const onClose = () => setShown(false);
  const onOk = () => {
    setShown(false);
    modalProps.onOk();
  };

  React.useEffect(() => {
    const modalOpenHandler = (props: ModalPropsType) => {
      setModalProps(props);
      setShown(true);
    };
    Cmd.on('modal:open', modalOpenHandler);
    return () => {
      Cmd.off('modal:open', modalOpenHandler);
    };
  }, []);

  return (
    <Dialog
      open={shown}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{modalProps.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {modalProps.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {modalProps.cancelText}
        </Button>
        <Button onClick={onOk} color="secondary">
          {modalProps.okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
