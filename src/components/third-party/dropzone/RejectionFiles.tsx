// material-ui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// third-party
import { FileRejection } from 'react-dropzone';

// utils
import getDropzoneData from 'utils/getDropzoneData';

type Props = { fileRejections: FileRejection[] };

// ==============================|| DROPZONE - REJECTION FILES ||============================== //

export default function RejectionFiles({ fileRejections }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{ py: 1, px: 2, mt: 3, borderColor: 'error.light', bgcolor: (theme) => alpha(theme.palette.error.main, 0.08) }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = getDropzoneData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? size : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="li" sx={{ typography: 'caption' }}>
                {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}
