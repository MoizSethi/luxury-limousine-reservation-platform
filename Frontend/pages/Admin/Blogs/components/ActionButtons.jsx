import React from 'react';
import {
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

export const ActionButtons = ({
  isEditing,
  saving,
  onCancel,
  onSaveDraft,
  onPublish,
  canPublish
}) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={saving}
        startIcon={<ArrowBack />}
      >
        Cancel
      </Button>
      
      <Button
        variant="contained"
        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
        onClick={onSaveDraft}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Draft"}
      </Button>
      
      <Button
        variant="contained"
        color="success"
        onClick={onPublish}
        disabled={saving || !canPublish}
      >
        {saving ? <CircularProgress size={20} /> : "Publish Article"}
      </Button>
    </Stack>
  );
};