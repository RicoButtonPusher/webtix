import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    maxWidth: '40%',
    backgroundColor:'lightBlue'
  },
  media: {
    height: 0,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cardContent: {
    display: 'grid',
    justifyContent: 'space-between',
  },
}));