import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer'
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  }
}));

const ProductCard = props => {
  const { className, product, history, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      onClick={() => history.push(`/products/${product._id}`)}>
      <CardContent>
        <Typography align="center" gutterBottom variant="h4">
          {product.name}
        </Typography>
        <Typography align="center" variant="body1">
          {product.description}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container justify="space-between">
          <Grid className={classes.statsItem} item>
            <AccessTimeIcon className={classes.statsIcon} />
            <Typography display="inline" variant="body2">
              {moment(product.createdAt).fromNow()}
            </Typography>
          </Grid>
          <Grid className={classes.statsItem} item>
            <Typography display="inline" variant="body2">
              $ {product.price}
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductCard;
