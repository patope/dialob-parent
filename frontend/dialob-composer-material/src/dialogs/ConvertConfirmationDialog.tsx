import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { DialogActionButtons } from './DialogComponents';

const ConvertConfirmationDialog: React.FC<{
  type: 'local' | 'global' | undefined,
  onClick: () => void, onClose: () => void
}> = ({ type, onClick, onClose }) => {

  const handleClick = () => {
    onClick();
    onClose();
  }

  return (
    <Dialog open={type !== undefined} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id='dialogs.confirmation.convert.title' />
      </DialogTitle>
      <DialogContent>
        <FormattedMessage id={`dialogs.confirmation.convert.${type}.text`} />
      </DialogContent>
      <DialogActionButtons handleClose={onClose} handleClick={handleClick} />
    </Dialog>
  );
};

export default ConvertConfirmationDialog;
