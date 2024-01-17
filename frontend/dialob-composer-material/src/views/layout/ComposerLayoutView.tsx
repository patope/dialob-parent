import React from 'react';
import { Drawer, Box, Container } from '@mui/material';
import MenuBar from './MenuBar';
import NavigationPane from './NavigationPane';
import EditorArea from './EditorArea';
import ErrorPane from './ErrorPane';
import { useEditor } from '../../editor';
import ConfirmationDialog from '../../dialogs/ConfirmationDialog';
import { MENU_HEIGHT, SCROLL_SX } from '../../theme/siteTheme';

const ComposerLayoutView: React.FC = () => {
  const { editor } = useEditor();
  const hasErrors = editor.errors.length > 0;

  return (
    <>
      <ConfirmationDialog />
      <Box display='flex'>
        <MenuBar />
        <Drawer variant="permanent">
          <Box sx={{ mt: `${MENU_HEIGHT}px`, ...SCROLL_SX }}>
            <NavigationPane />
          </Box>
        </Drawer>
        <Container>
          <Box sx={{ mt: `${MENU_HEIGHT}px` }}>
            <EditorArea />
          </Box>
        </Container>
        {hasErrors && <Drawer variant="permanent" anchor="right">
          <Box sx={{ mt: `${MENU_HEIGHT}px` }}>
            <ErrorPane />
          </Box>
        </Drawer>}
      </Box>
    </>
  );
};

export default ComposerLayoutView;
