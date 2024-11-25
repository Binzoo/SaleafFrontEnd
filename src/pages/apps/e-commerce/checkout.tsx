// material ui
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';
import CircularLoader from 'components/CircularLoader';
import { useGetCart } from 'api/cart';

// ==============================|| ECOMMERCE - CHECKOUT ||============================== //

export default function Checkout() {
  const { cartLoading, cart } = useGetCart();

  const loader = (
    <MainCard>
      <Box sx={{ height: 'calc(100vh - 310px)' }}>
        <CircularLoader />
      </Box>
    </MainCard>
  );

  return cartLoading ? loader : null;
}
