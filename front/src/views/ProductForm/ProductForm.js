import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { FormProduct } from './components';
import api from '../../services/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const ProductForm = ({ history, match }) => {
  const classes = useStyles();
  const token = useSelector(state => state.user.token);
  const [product, setProduct] = useState(null);
  useEffect(() => {
    async function getProduct(id) {
      try {
        const response = await api.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data);
      } catch (e) {
        alert(e);
      }
    }
    match.params.id && getProduct(match.params.id);
  }, [match.params, token]);
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormProduct history={history} product={product} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductForm;
