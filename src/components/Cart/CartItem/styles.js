import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  media: {
    height: 'auto',
  },
  cardContent: {
    display: 'grid',
    justifyContent: 'space-between',
    width: '70%'
  },
  cartActions: {
    justifyContent: 'space-between',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
  },
}));